import $ from "jquery/dist/jquery.min.js";

import {
    KahootHelper
} from "../kahoot.js";
import {
    sendMessage
} from "../message.js";

let cards = [];
let crashTimer = false;
let answers = false;

class GameController {
    static init(kahootSession) {
        sendMessage(
            "kahoot-color-3",
            "Success",
            "Created socket, ready for action!",
            5000
        );

        kahootSession.onRawMessagePlayer = m => {
            if (m.data.id === 9 && localStorage.getItem("bearerToken")) {
                let json = JSON.parse(m.data.content);
                sendMessage(
                    "kahoot-color-1",
                    "Info",
                    `Got quiz name: ${json.quizName}. Searching for answers...`,
                    5000
                );
                KahootHelper.getGameAnswers(
                    json.quizName,
                    localStorage.getItem("bearerToken"),
                    (err, answerList) => {
                        if (err) {
                            sendMessage(
                                "kahoot-color-0",
                                "Error",
                                err,
                                6000
                            );
                        } else {
                            sendMessage(
                                "kahoot-color-3",
                                "Success",
                                `Got ${
                                    answerList.length
                                } answers. The hack should work now!`,
                                5000
                            );
                            $("#answer-current-correct").removeClass(
                                "disabled"
                            );
                            answers = answerList;
                        }
                    }
                );
            }
        };

        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return (
                s4() +
                s4() +
                "-" +
                s4() +
                "-" +
                s4() +
                "-" +
                s4() +
                "-" +
                s4() +
                s4() +
                s4()
            );
        }

        function getCardByGuid(guid) {
            for (let i = 0; i < cards.length; i++) {
                if (cards[i].guid === guid) {
                    return i;
                }
            }
            return null;
        }

        $("#answer-current-correct").addClass("disabled");

        $("#toggle-select-players").click(() => {
            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];
                if (card.selected) {
                    cards[i].selected = false;
                    $(`#${cards[i].guid}`).removeClass(
                        "indigo lighten-2 white-text"
                    );
                } else {
                    cards[i].selected = true;
                    $(`#${cards[i].guid}`).addClass(
                        "indigo lighten-2 white-text"
                    );
                }
            }
            $("#game-state").text(
                `Pin: ${kahootSession.pin} | Player Count: ${cards.length}`
            );
        });

        $("#remove-selected-players").click(() => {
            const toRemove = [];
            const cardsLength = cards.length;
            for (let i = 0; i < cardsLength; i++) {
                const card = cards[i];
                if (card.selected) {
                    for (let p = 0; p < card.users.length; p++) {
                        card.users[p].removeFromGame();
                    }
                    toRemove.push({
                        guid: card.guid,
                        index: i
                    });
                }
            }

            for (let i = 0; i < toRemove.length; i++) {
                cards.splice(toRemove[i].index, 1);
                $(`#${toRemove[i].guid}`).remove();
            }
        });

        $("#add-player").click(() => {
            const playerAmount = parseInt($("#player-amount").val()) || 1;
            const playerName = $("#player-name").val();
            const playerIsGhost = $("#player-is-ghost").val() === "1";
            const uniqueCid = $("#unique-cid").val() === "1";

            let users = [];

            if (playerName && playerIsGhost !== undefined) {
                let cid = guid();
                for (let i = 0; i < playerAmount; i++) {
                    if (uniqueCid) {
                        cid = guid();
                    }

                    const user = kahootSession.addPlayer(
                        playerName + i,
                        playerIsGhost,
                        cid
                    );
                    users.push(user);
                }
                const cardId = guid();
                const template = `<div id="${cardId}" class="chip z-depth-2 noselect">
                                ${playerName} x ${users.length}
                                <i class="close material-icons">close</i>
                              </div>`;

                $("#players-wrapper").append(template);

                $(`#${cardId}`).click(() => {
                    const card = cards[getCardByGuid(cardId)];
                    if (card) {
                        if (card.selected) {
                            cards[getCardByGuid(cardId)].selected = false;
                            $(`#${cardId}`).removeClass(
                                "indigo lighten-2 white-text"
                            );
                        } else {
                            cards[getCardByGuid(cardId)].selected = true;
                            $(`#${cardId}`).addClass(
                                "indigo lighten-2 white-text"
                            );
                        }
                    }
                });

                $(`#${cardId} .close`).click(() => {
                    const card = cards[getCardByGuid(cardId)];
                    for (let p = 0; p < card.users.length; p++) {
                        card.users[p].removeFromGame();
                    }
                    cards.splice(getCardByGuid(cardId), 1);
                    $("#game-state").text(
                        `Pin: ${kahootSession.pin} | Player Count: ${
                            cards.length
                        }`
                    );
                });

                cards.push({
                    users: users,
                    guid: cardId,
                    selected: false
                });
                $("#game-state").text(
                    `Pin: ${kahootSession.pin} | Player Count: ${cards.length}`
                );
            } else {
                sendMessage(
                    "kahoot-color-0",
                    "Error",
                    "Please fill in all required fields!",
                    6000
                );
            }
        });

        $("#▲").click(() => {
            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];
                if (card.selected) {
                    for (let p = 0; p < card.users.length; p++) {
                        const user = card.users[p];
                        user.sendGameAnswer(0);
                    }
                }
            }
        });

        $("#◆").click(() => {
            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];
                if (card.selected) {
                    for (let p = 0; p < card.users.length; p++) {
                        const user = card.users[p];
                        user.sendGameAnswer(1);
                    }
                }
            }
        });

        $("#●").click(() => {
            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];
                if (card.selected) {
                    for (let p = 0; p < card.users.length; p++) {
                        const user = card.users[p];
                        user.sendGameAnswer(2);
                    }
                }
            }
        });

        $("#■").click(() => {
            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];
                if (card.selected) {
                    for (let p = 0; p < card.users.length; p++) {
                        const user = card.users[p];
                        user.sendGameAnswer(3);
                    }
                }
            }
        });
		$("#random").click(() => {
            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];
                if (card.selected) {
                    for (let p = 0; p < card.users.length; p++) {
                        const user = card.users[p];
                        user.sendGameAnswer(Math.floor(Math.random() * 3.99999));
                    }
                }
            }
        });
		

        $("#member-send").click(() => {
            const memberCount = $("#member-count").val();
            const memberPrefix = $("#member-prefix").val();

            if (memberCount && memberPrefix) {
                sendMessage(
                    "kahoot-color-1",
                    "Info",
                    `Sending ${memberCount} members...`,
                    4000
                );

                let totalMembers = [];

                for (let i = 0; i < parseInt(memberCount); i++) {
                    totalMembers.push(memberPrefix + i);
                }

                for (let i = 0; i < cards.length; i++) {
                    const card = cards[i];
                    if (card.selected) {
                        for (let p = 0; p < card.users.length; p++) {
                            const user = card.users[p];
                            user.sendTeam(totalMembers);
                        }
                    }
                }

                sendMessage(
                    "kahoot-color-3",
                    "Success",
                    "Queued up your members. They should connect soon...",
                    5000
                );
            } else {
                sendMessage(
                    "kahoot-color-0",
                    "Error",
                    "Please supply a prefix and amount!",
                    4000
                );
            }
        });

        $("#crash-game").click(() => {
            if (crashTimer) {
                sendMessage(
                    "kahoot-color-1",
                    "Info",
                    "Stopping timers...",
                    4000
                );
                clearInterval(crashTimer);
                crashTimer = false;
            } else {
                sendMessage("kahoot-color-1", "Info", `Doing it...`, 4000);

                crashTimer = setInterval(() => {
                    for (let i = 0; i < cards.length; i++) {
                        const card = cards[i];
                        if (card.selected) {
                            for (let p = 0; p < card.users.length; p++) {
                                const user = card.users[p];
                                user.sendGameAnswer(1);
                            }
                        }
                    }
                }, 0.001);
            }

            $("#crash-game")[crashTimer ? "addClass" : "removeClass"](
                "button-active"
            );
        });

        $("#answer-current-correct").click(() => {
            if (kahootSession.questionNum !== null) {
                for (let i = 0; i < cards.length; i++) {
                    const card = cards[i];
                    if (card.selected) {
                        for (let p = 0; p < card.users.length; p++) {
                            const user = card.users[p];
                            user.sendGameAnswer(
                                answers[kahootSession.questionNum].answerNum
                            );
                        }
                    }
                }
                sendMessage(
                    "kahoot-color-3",
                    "Success",
                    `Sent answer ${answers[kahootSession.questionNum]
                        .answerNum +
                        1} for question ${kahootSession.questionNum + 1}`,
                    4000
                );
            } else {
                sendMessage(
                    "kahoot-color-0",
                    "Error",
                    "Did the quiz start? We dont have a question num!",
                    4000
                );
            }
        });
    }
}

export {
    GameController
};
