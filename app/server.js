import $ from "jquery/dist/jquery.min.js";
import * as Velocity from "velocity-animate";
import { sendMessage } from "./message.js";
import { KahootClient, KahootHelper, KahootServer } from "./kahoot.js";
import * as UI from "./serverUI.js";

const api = {
    sendMessage,
    KahootClient,
    KahootHelper,
    KahootServer,
    UI: UI,
    updatePin: (pin) => { $("#pin-display").html(pin) },
}

class ServerController {
    static init() {
        $("#start-server").click(() => {
            let fileUrl;

            if ($("#gamemode-selector").val() === "custom") {
                fileUrl = $("#custom-url").val();
            } else {
                fileUrl = "./gamemodes/" + $("#gamemode-selector").val().toLowerCase() + ".js";
            }

            $.ajax({
                url: fileUrl,
                type: "GET",
                success: (data) => {
                    if (typeof data === "string" && data.includes("this.")) {
                        const gamemode = new new Function(data)();
                        gamemode.api = api;

                        if (gamemode.usesUI) {
                            $("#select-gamemode-wrapper").slideUp();
                            Velocity($("#server-ui-wrapper"), { opacity: 1 });
                        }

                        if (gamemode.init) {
                            sendMessage("kahoot-color-1", "Info", `Initializing gamemode: ${gamemode.name}!`, 4000);
                            gamemode.init();
                        } else {
                            sendMessage("kahoot-color-0", "Error", "No init function found!", 4000);
                        }
                    } else {
                        sendMessage("kahoot-color-0", "Error", "Received non gamemode file!", 4000);
                    }
                },
                error: (error) => {
                    if (error.status === 0) {
                        sendMessage("kahoot-color-0", "Error", "No CORS headers!", 4000);
                    } else {
                        sendMessage("kahoot-color-0", "Error", error.status + " - " + error.statusText, 4000);
                    }
                }
            });
        });
    }
}

export {
    ServerController
}