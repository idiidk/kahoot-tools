import $ from "jquery/dist/jquery.min.js";

import { KahootClient, KahootHelper } from "./kahoot.js";
import { sendMessage } from "./message.js";

let bots = [];
let crashTimer = false;
let answers = false;

class GameController {
    static init(kahootSession) {
        kahootSession.onRawMessagePlayer = m => {
            if (m.data.id === 9 && localStorage.getItem("bearerToken")) {
                let json = JSON.parse(m.data.content);
                sendMessage("kahoot-color-1", "Info", `Got quiz name: ${json.quizName}. Searching for answers...`, 5000);
                KahootHelper.getGameAnswers(json.quizName, localStorage.getItem("bearerToken"), (err, answerList) => {
                    if (err) {
                        sendMessage("kahoot-color-0", "Error", "No answers were found. This can happen if the kahoot is private.", 6000);
                    } else {
                        sendMessage("kahoot-color-3", "Success", `Got ${answerList.length} answers. The hack should work now!`, 5000);
                        $("#answer-current-correct").removeClass("disabled");
                        answers = answerList;
                    }
                });
            }
        }

        $("#answer-current-correct").addClass("disabled");

        $("#▲").click(() => {
            kahootSession.sendGameAnswer(0);
            for (let i = 0; i < bots.length; i++) {
                bots[i].sendGameAnswer(0);
            }
        });

        $("#◆").click(() => {
            kahootSession.sendGameAnswer(1);
            for (let i = 0; i < bots.length; i++) {
                bots[i].sendGameAnswer(1);
            }
        });

        $("#●").click(() => {
            kahootSession.sendGameAnswer(2);
            for (let i = 0; i < bots.length; i++) {
                bots[i].sendGameAnswer(2);
            }
        });

        $("#■").click(() => {
            kahootSession.sendGameAnswer(3);
            for (let i = 0; i < bots.length; i++) {
                bots[i].sendGameAnswer(3);
            }
        });

        $("#bot-send").click(() => {
            const botCount = $("#bot-count").val();
            const botPrefix = $("#bot-prefix").val();

            if (botCount && botPrefix) {
                sendMessage("kahoot-color-1", "Info", `Sending ${botCount} bots...`, 4000);

                for (let i = 0; i < parseInt(botCount); i++) {
                    const currentBot = new KahootClient(kahootSession.pin, botPrefix + i);
                    currentBot.connect((err) => {
                        if (err) {
                            sendMessage("kahoot-color-0", "Error", err, 4000);
                        } else {
                            if (currentBot.twoFactor) {
                                setTimeout(() => {
                                    currentBot.bruteForceTwoFactor();
                                    bots.push(currentBot);
                                }, 500 * i);
                            } else {
                                bots.push(currentBot);
                            }
                        }
                    });
                }

                sendMessage("kahoot-color-3", "Success", "Queued up your bots. They should connect soon...", 5000);
            } else {
                sendMessage("kahoot-color-0", "Error", "Please supply a prefix and amount!", 4000);
            }
        });

        $("#member-send").click(() => {
            const memberCount = $("#member-count").val();
            const memberPrefix = $("#member-prefix").val();

            if (memberCount && memberPrefix) {
                sendMessage("kahoot-color-1", "Info", `Sending ${memberCount} members...`, 4000);

                let totalMembers = [];

                for (let i = 0; i < parseInt(memberCount); i++) {
                    totalMembers.push(memberPrefix + i);
                }

                kahootSession.sendTeam(totalMembers);

                sendMessage("kahoot-color-3", "Success", "Queued up your members. They should connect soon...", 5000);
            } else {
                sendMessage("kahoot-color-0", "Error", "Please supply a prefix and amount!", 4000);
            }
        });

        $("#crash-game").click(() => {
            if (crashTimer) {
                sendMessage("kahoot-color-1", "Info", "Stopping timers...", 4000);
                clearInterval(crashTimer);
                crashTimer = false;
            } else {
                sendMessage("kahoot-color-1", "Info", `Doing it with ${bots.length + 1} players...`, 4000);

                crashTimer = setInterval(() => {
                    for (let i = 0; i < bots.length - 1; i++) {
                        bots[i].sendGameAnswer(0);
                    }

                    kahootSession.sendGameAnswer(1);
                }, 0.001);
            }

            $("#crash-game")[crashTimer ? "addClass" : "removeClass"]("button-active");
        });

        $("#answer-current-correct").click(() => {
            if (kahootSession.questionNum !== null) {
                kahootSession.sendGameAnswer(answers[kahootSession.questionNum].answerNum);
                for (let i = 0; i < bots.length; i++) {
                    bots[i].sendGameAnswer(answers[kahootSession.questionNum].answerNum);
                }
                sendMessage("kahoot-color-3", "Success", `Sent answer ${answers[kahootSession.questionNum].answerNum + 1} for question ${kahootSession.questionNum + 1}`, 4000);
            } else {
                sendMessage("kahoot-color-0", "Error", "Did the quiz start? We dont have a question num!", 4000);
            }
        });
    }
}

export {
    GameController
}