/**
 * kahoot-tools
 * Created by @idiidk
 */

// JS imports
import $ from "jquery/dist/jquery.min.js";
import * as Velocity from "velocity-animate";
import * as M from "materialize-css";

import {
    sendMessage
} from "./message.js";
import {
    KahootClient,
    KahootHelper
} from "./kahoot.js";
import {
    GameController
} from "./controllers/game.js";
import {
    OptionsController
} from "./controllers/options.js";

// Style imports
import "styles/index.scss";

let kahootSession;

$("#start-login").click(doLogin);

$(() => {
    if (!window.localStorage) {
        alert(
            "localStorage is not defined. Please exit private mode or update your browser!"
        );
        document.write(
            "localStorage is not defined. Please exit private mode or update your browser!"
        );
    }

    OptionsController.init();

    M.FormSelect.init($("select"));

    $(".container").fadeOut(0);
    showPanel(window.location.hash.replace("#", ""));

    const token = localStorage.getItem("bearerToken");

    if (token) {
        $("#login-wrapper").html(
            `<h5 class="center-align">Bearer Token: ${token}</h5>`
        );
    }

    if (window.location.hash === "#game" || window.location.hash === "#login") {
        showPanel("login");
    } else if (window.location.hash) {
        showPanel(window.location.hash.replace("#", ""));
    } else {
        showPanel("login");
    }

    $("#game-navigator").click(() => {
        showPanel(kahootSession ? "game" : "login");
        $("#game-navigator").addClass("active");
        $("#options-navigator").removeClass("active");
    });

    $("#options-navigator").click(() => {
        showPanel("options");
        $("#options-navigator").addClass("active");
        $("#game-navigator").removeClass("active");
    });

    let activePage = window.location.hash.replace("#", "");

    activePage =
        activePage === "game" || activePage === "login" ? "game" : activePage;

    $(".box").removeClass("active");
    $("#" + activePage + "-navigator").addClass("active");
});

function showPanel(panel) {
    Velocity($(".container"), {
        opacity: 0
    }, () => {
        $(".container").hide();
        $("#" + panel + "-panel").show();
        Velocity($("#" + panel + "-panel"), {
            opacity: 1
        });
    });

    document.location.hash = panel;
}

function doComLogin(username, password, callback) {
    KahootHelper.getBearerToken(username, password, (error, tokens) => {
        if (error) {
            sendMessage("kahoot-color-0", "Error", error, 4000);
        } else {
            localStorage.setItem("bearerToken", tokens.bearerToken);
            $("#login-wrapper").html(
                `<h5 class="center-align bearer-token">Bearer Token: ${
                    tokens.bearerToken
                }</h5>`
            );
            sendMessage(
                "kahoot-color-3",
                "Success",
                "Logged in with username and password!",
                4000
            );
        }

        callback();
    });
}

function doGameLogin(pin, name) {
    kahootSession = new KahootClient(pin, name);
    kahootSession.initialize(err => {
        if (err) {
            sendMessage("kahoot-color-0", "Error", err, 4000);
            $("#start-login").removeClass("disabled");
            kahootSession = null;
        } else {
            window.kahootSession = kahootSession;
            if (kahootSession.twoFactor) {
                sendMessage(
                    "kahoot-color-1",
                    "Info",
                    "Found 2FA. Bypassing...",
                    4000
                );
                setTimeout(() => {
                    kahootSession.bruteForceTwoFactor();
                    showPanel("game");
                    GameController.init(kahootSession);
                }, 500);
            } else {
                showPanel("game");
                GameController.init(kahootSession);
            }
            $("#game-state").text(`Pin: ${pin} | Player Count: 0`);
        }
    });
}

function doLogin() {
    $("#start-login").addClass("disabled");

    let waitForMe = false;

    const pin = $("#pin").val();
    const name = $("#name").val();
    const username = $("#username").val();
    const password = $("#password").val();

    if (username || password) {
        if (username && password) {
            waitForMe = true;
            doComLogin(username, password, () => {
                doGameLogin(pin);
            });
        } else {
            sendMessage(
                "kahoot-color-0",
                "Error",
                "Please specify a username and password!",
                4000
            );
            $("#start-login").removeClass("disabled");
        }
    }

    if (!waitForMe) {
        if (pin) {
            doGameLogin(pin, name);
        } else {
            sendMessage(
                "kahoot-color-0",
                "Error",
                "Please specify a pin and username to connect with!",
                4000
            );
            $("#start-login").removeClass("disabled");
        }
    }
}
