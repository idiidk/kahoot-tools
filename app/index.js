/**
 * kahoot-tools
 * Created by ya boi @idiidk
 */

// JS imports
import $ from "jquery/dist/jquery.min.js";
import * as Velocity from "velocity-animate";

import { sendMessage } from "./message.js";
import { KahootClient, KahootHelper } from "./kahoot.js";
import { GameController } from "./game.js";

// Style imports
import "normalize.css/normalize.css"
import "styles/index.scss";

let kahootSession;

$("#start-login").click(doLogin);

$(() => {
    $(".container").fadeOut(0);
    showPanel("login");

    const token = localStorage.getItem("bearerToken");

    if (token) {
        $("#login-wrapper").html(`<h2 class="bearer-token">Bearer Token: ${token}</h2>`);
    }
});

function showPanel(panel) {
    Velocity($(".container"), { opacity: 0 }, () => {
        $(".container").hide();
        $("#" + panel + "-panel").show();
        Velocity($("#" + panel + "-panel"), { opacity: 1 });
    });
}

function doComLogin(username, password, callback) {
    KahootHelper.getBearerToken(username, password, (error, tokens) => {
        if (error) {
            sendMessage("kahoot-color-0", "Error", error, 4000);
        } else {
            localStorage.setItem("bearerToken", tokens.bearerToken);
            $("#login-wrapper").html(`<h5 class="center-align bearer-token">Bearer Token: ${tokens.bearerToken}</h5>`);
            sendMessage("kahoot-color-3", "Success", "Logged in with username and password!", 4000);
        }

        callback();
    });
}

function doGameLogin(pin, name) {
    kahootSession = new KahootClient(pin, name);
    kahootSession.connect((err) => {
        if (err) {
            sendMessage("kahoot-color-0", "Error", err, 4000);
            $("#start-login").removeClass("disabled");
        } else {
            if (kahootSession.twoFactor) {
                sendMessage("kahoot-color-1", "Info", "Found 2fa, Bypassing...", 4000);
                setTimeout(() => {
                    kahootSession.bruteForceTwoFactor();
                    showPanel("game");
                    GameController.init(kahootSession);
                }, 500);
            } else {
                showPanel("game");
                GameController.init(kahootSession);
            }
            $("#game-state").text(`Pin: ${pin} | Name: ${name}`);
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
                doGameLogin(pin, name);
            });
        } else {
            sendMessage("kahoot-color-0", "Error", "Please specify a username and password!", 4000);
            $("#start-login").removeClass("disabled");
        }
    }

    if (!waitForMe) {
        if (pin && name) {
            doGameLogin(pin, name);
        } else {
            sendMessage("kahoot-color-0", "Error", "Please specify a pin and name to connect with!", 4000);
            $("#start-login").removeClass("disabled");
        }
    }
}