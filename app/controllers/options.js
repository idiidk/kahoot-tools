import $ from "jquery/dist/jquery.min.js";

class OptionsController {
    static init() {
        const self = this;
        let config = localStorage.getItem("config") ? JSON.parse(localStorage.getItem("config")) : {};

        $("#theme-selector").change(() => {
            config.theme = $("#theme-selector").val();
            self.loadConfig(config);
        });

        $("#clear-storage").click(() => {
            sessionStorage.clear();
            location.hash = "";
            location.reload();
        });

        if (config !== {}) {
            self.loadConfig(config);
        }
    }

    static loadConfig(config) {
        if (config.theme) {
            $("html").attr("class", "theme-" + config.theme);
            $(`#theme-selector option[value="${config.theme}"]`).attr("selected", "selected");
        }

        localStorage.setItem("config", JSON.stringify(config));
    }
}

export {
    OptionsController
}
