import $ from "jquery/dist/jquery.min.js";
import { sendMessage } from "./message.js";
import { KahootClient, KahootHelper, KahootServer } from "./kahoot.js";

const api = {
    sendMessage,
    KahootClient, 
    KahootHelper,
    KahootServer,
    updatePin: (pin) => { $("#pin").text(pin) },
}

class ServerController {
    static init() {
        if ($("#gamemode-selector").val() !== "custom") {
            $("#custom-url-wrapper").animate({ width: "toggle", opacity: "toggle" }, 0);
        }

        $("#gamemode-selector").on("change", () => {
            if ($("#gamemode-selector").val() === "custom") {
                if (!$("#custom-url-wrapper").is(":visible")) {
                    $("#custom-url-wrapper").animate({ width: "toggle", opacity: "toggle" }, 350);
                }
            } else {
                if ($("#custom-url-wrapper").is(":visible")) {
                    $("#custom-url-wrapper").animate({ width: "toggle", opacity: "toggle" }, 350);
                }
            }
        });

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