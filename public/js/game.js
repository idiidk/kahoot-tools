$("#activate-pin-btn").click(() => {
    let originalText = $("#activate-pin").text();
    let username = $("#kahoot-username").val();
    let password = $("#kahoot-password").val();
    kahoot.pin = $("#pin").val();
    kahoot.name = $("#name").val();
    if (username || password) {
        $("#activate-pin").text("Testing connection...").prop("disabled", (i, v) => !v);
        KahootHelper.getBearerToken(username, password, bearer => {
            if (!bearer.error) {
                localStorage.setItem("token", bearer.bearerToken);
                localStorage.setItem("tokenExpiration", bearer.expiration);
                if (!localStorage.token && !localStorage.tokenExpiration) {
                    $("#kahoot-web-login").show();
                } else {
                    if (parseInt(localStorage.tokenExpiration) < new Date().getTime()) {
                        $("#kahoot-web-login").show();
                        localStorage.removeItem("token");
                        localStorage.removeItem("tokenExpiration");
                    } else {
                        kahoot.bearerToken = localStorage.token;
                        $("#kahoot-web-login").fadeOut();
                        $("#kahoot-web-login-text").text(`Kahoot logged in: ${localStorage.token}`);
                        $("#activate-pin").prop("disabled", (i, v) => !v);
                    }
                }
                $("#activate-pin").text(originalText).prop("disabled", (i, v) => !v);

                $("#kahoot-username").val("");
                $("#kahoot-password").val("");

                if (kahoot.pin && kahoot.name) {
                    connect();
                }
            } else {
                sendMessage("kahoot-color-0", "Error", bearer.error);
                $("#activate-pin").text(originalText).prop("disabled", (i, v) => !v);
            }
        });
    } else {
        if (kahoot.pin && kahoot.name) {
            connect();
        } else {
            $("#activate-pin").text(originalText).prop("disabled", (i, v) => !v);
            sendMessage("kahoot-color-0", "Error", "No pin or name supplied!");
        }
    }
});

$("#crash-btn").click(() => {
    if (runningTimers.length >= 1) {
        for (var i = 0; i < runningTimers.length; i++) {
            clearInterval(runningTimers[i])
        }
        runningTimers = [];
    } else {
        for (var i = 0; i < 10; i++) {
            runningTimers.push(setInterval(() => {
                kahoot.sendGameAnswer(1)
            }, 0.00001));
        }
    }
});

$("#answer-0").click(() => {
    kahoot.sendGameAnswer(0, data => {

    });
});

$("#answer-1").click(() => {
    kahoot.sendGameAnswer(1, data => {

    });
});

$("#answer-2").click(() => {
    kahoot.sendGameAnswer(2, data => {

    });
});

$("#answer-3").click(() => {
    kahoot.sendGameAnswer(3, data => {

    });
});

$("#send-correct-answer-btn").click(() => {
    if (!kahoot.quizName) {
        sendMessage("kahoot-color-2", "Warning", "Dont have a quiz name... Did you join after the quiz started?");
    } else {
        if (kahoot.questionNum === null) {
            sendMessage("kahoot-color-2", "Warning", "Dont have a question num yet... Did the quiz start?");
        } else {
            if (!kahoot.answers) {
                kahoot.getGameAnswers(kahoot.quizName, data => {
                    if (!data.error) {
                        kahoot.sendGameAnswer(data.answers[kahoot.questionNum].answerNum);
                    } else {
                        sendMessage("kahoot-color-1", "Error", data.error);
                    }
                });
            } else {
                kahoot.sendGameAnswer(kahoot.answers[kahoot.questionNum].answerNum);
            }
        }
    }
});

$("#flood-btn").click(() => {
    let bots = $("#bot-amount").val();
    let name = $("#bot-name-prefix").val();
    if (bots) {
        for (let i = 0; i <= bots; i++) {
            let bot = new KahootClient(kahoot.pin, name + i)
            let timeout = 400 * (i + 1)
            bot.connect(() => {
                if (kahoot.twoFactor) {
                    setTimeout(() => {
                        bot.bruteForceTwoFactor();
                    }, timeout);
                }
            });
        }
        sendMessage("kahoot-color-3", "Success", `Successfully sent ${bots} bots!`);
    } else {
        sendMessage("kahoot-color-2", "Error", "No bot amount specified")
    }
});

function connect() {
    kahoot.connect(response => {
        if (response.success) {
            kahoot.onRawMessagePlayer = m => {
                if (m.data.id === 9) {
                    let tempJson = JSON.parse(m.data.content);
                    sendMessage("kahoot-color-3", "Got quiz name", tempJson.quizName);
                }
            }

            let waitTillActive = setInterval(() => {
                if (kahoot.state === 1) {
                    clearInterval(waitTillActive);
                    setTimeout(() => {
                        kahoot.bruteForceTwoFactor();
                        closeAllModals();
                        showPanel("control");
                        updateSessionText();
                    }, 350);
                } else if (kahoot.state === 3 && kahoot.error) {
                    clearInterval(waitTillActive);
                    sendMessage("kahoot-color-0", "Error", kahoot.error);
                }
            }, 100)
        } else {
            sendMessage("kahoot-color-0", "Error", "Pin incorrect");
        }
    });
}