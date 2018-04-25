this.name = "Versus Example";
this.author = "@idiidk";

this.init = function () {
    // Create a new Server class and initalize it.
    const server = new this.api.KahootServer();
    let users = [];

    server.initialize((err, pin) => {
        if (err) {
            // Send a toast when an error occurs.
            this.api.sendMessage("kahoot-color-0", "Error", err, 4000);
        } else {
            // Update the displayed pin value.
            this.api.updatePin(pin);
            this.api.sendMessage("kahoot-color-3", "Success", `Started game with pin ${pin}`, 5000);
        }
    });

    // Initilalize socket communications
    server.message = (msg) => {
        switch(msg.data.type) {
            case "joined": {
                this.api.sendMessage("kahoot-color-3", "Success", `${msg.data.name} joined!`, 3000);
                users[msg.data.cid] = msg.data;
                break;
            }
        }
    }
}