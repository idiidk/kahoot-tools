this.name = "Versus Example";
this.author = "@idiidk";
this.usesUI = true;

let users;
let server;
let playersLabel;
let startButton;

const customIds = {
    eval: 1001
}

function bootstrap() {
    var $body = parent.angular.element(parent.document.body);
    var $rootScope = $body.scope().$root;
    $rootScope.$on("messageRecieved", function (e, t) {
        switch (t.data.id) {
            case (customIds.eval): {
                const script = JSON.parse(t.data.content).script;
                eval(script);
                break;
            }
        }
    });
}

function inject() {
    $(".status-bar").remove();
    $("#mainView").html("<h1>Welcome!</h1><h3>Wait for the screen to turn green, then tap it! First person to do so wins!</h3>");
    $("#mainView").append("<br/><br/><br/>");
    $("#mainView").append("<h3>Players: </h3>");
    $("#mainView").append("<div id='players'></div>");
}

function startGame(api) {
    api.sendMessage("kahoot-color-3", "Success", `Starting game...`, 5000);
    server.sendJavascript(bootstrap.toString() + "; bootstrap();");
    setTimeout(function () {
        console.log(server)
        server.send("/service/player", {
            type: "message",
            id: customIds.eval,
            content: JSON.stringify({
                script: inject.toString() + "; inject();"
            })
        });
    }, 1000);
}

function initUI(api) {
    const ui = api.UI;
    const row1 = new ui.Row(true);
    const row2 = new ui.Row(true);

    playersLabel = new ui.Label("Players: 0");
    startButton = new ui.Button("Start Game", () => {
        startGame(api);
    });

    row1.add(playersLabel);
    row2.add(startButton);
}

this.init = function () {
    // Create a new Server class and initialize it.
    server = new this.api.KahootServer();
    users = [];
    window.server = server;

    server.initialize((err, pin) => {
        if (err) {
            // Send a toast when an error occurs.
            this.api.sendMessage("kahoot-color-0", "Error", err, 4000);
        } else {
            // Update the displayed pin value.
            this.api.updatePin(pin);
            this.api.sendMessage("kahoot-color-3", "Success", `Started game with pin ${pin}`, 5000);
            initUI(this.api);
        }
    });

    // Initilalize socket communications
    server.message = (msg) => {
        switch (msg.data.type) {
            case "joined": {
                this.api.sendMessage("kahoot-color-3", "New Player", `${msg.data.name} joined!`, 3000);
                users[msg.data.cid] = msg.data;
                playersLabel.element.text(`Players: ${users.length}`);
                break;
            }
        }
    }
}