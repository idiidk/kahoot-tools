const serverEvents = {
    eval: 0
}

let server = null;
let clients = [];

$(() => {
    $(".server-components input").prop("disabled", true);
    $("#start-server-btn").click(startServer);

    $("#send-javscript-btn").click(() => {
        if (!server) {
            sendMessage("kahoot-color-0", "Error", "Please start a server first!");
            return;
        }

        if (!$("#javascript-code").val()) {
            sendMessage("kahoot-color-0", "Error", "Please type some code!");
            return;
        }

        sendKahootToolsMessage(serverEvents.eval, { 
            code: $("#javascript-code").val() 
        });
    });
});

function startServer() {
    sendMessage("kahoot-color-1", "Info", "Starting server...");

    server = new KahootServer();
    eventify(server);

    server.initialize((pin) => {
        sendMessage("kahoot-color-3", "Success", "Successfully started server!");
        updateStatus("Started!", pin);
        $(".server-components input").prop("disabled", false);
    });

    server.on("message", (m) => {
        if (m.channel === ("/controller/" + server.pin)) {
            if (m.data.type === "joined") {
                sendMessage("kahoot-color-1", "Connected", makeSafe(m.data.name) + " has connected!");
                clients.push(m.data);
                updateClientAmount(clients.length);
                bootstrapClients();
            } else if (m.data.type === "left") {
                sendMessage("kahoot-color-1", "Disconnected", makeSafe(getClientByCid(m.data.cid).name) + " has disconnected!");
                removeClientByCid(m.data.cid)
                updateClientAmount(clients.length);
            }
        }
    });
}

function sendKahootToolsMessage(event, content = {}) {
    content.kahootTools = true;

    server.send("/service/player", {
        type: "message",
        id: event,
        content: JSON.stringify(content)
    })
}

function bootstrapClients() {
    server.sendJavascript(`parent.$('#kahoot-tools-script').remove(); parent.$('body').append('<script id="kahoot-tools-script" src="${window.location.origin}/server/example/bootstrap.js"></script>');`)
}

function updateStatus(status, pin) {
    $("#server-status").text(`Status: ${status} | Pin: ${pin}`);
}

function updateClientAmount(amount) {
    $("#connected-clients").text(amount);

    const $list = $("#connected-clients-wrapper #list");
    let finalHtml = "<br>";

    for (let i = 0; i < clients.length; i++) {
        finalHtml += `<h6>${makeSafe(clients[i].name)}</h6>`;
    }

    $list.html(finalHtml);
}

function getClientByCid(cid) {
    for (let i = 0; i < clients.length; i++) {
        if (clients[i].cid === cid) {
            return clients[i];
        }
    }
}

function removeClientByCid(cid) {
    for(let i = 0; i < clients.length; i++) {
        if(clients[i].cid === cid) {
            clients.splice(i, 1);
        }
    }
}

let entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "\"": "&#39;",
    "/": "&#x2F;",
    "`": "&#x60;",
    "=": "&#x3D;"
};

function makeSafe(string) {
    return String(string).replace(/[&<>""`=\/]/g, function (s) {
        return entityMap[s];
    });
}