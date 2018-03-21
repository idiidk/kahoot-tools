/**
 * @idiidk
 * This is a demo script that can be injected by a custom server.
 * It sets up custom communication and bypasses some xss checks!
 */

(() => {
    const events = {
        eval: 0
    }

    /**
     * Setting up root scope for interacting with kahoot.
     */
    if (!window.$rootScope) {
        let $body = angular.element(document.body);
        window.$rootScope = $body.scope().$root;
        init();
    } else {
        /**
         * If root scope is already declared, we are already bootstrapped
         * so we do nothing.
         */
    }


    function init() {
        /**
         * MOTD Message
         */
        $rootScope.$broadcast("wait", {
            message: "Kahoot Tools v0.3 <br> Server Loading..."
        });
        console.log("Kahoot Tools v0.3 booting...")

        /**
         * Adding a new messageReceived handler for custom communications. This receives messages with 
         * type message from the socket.
         */
        $rootScope.$on("messageRecieved", function (e, t) {
            if (t.data.content && t.data.content.indexOf("kahootTools") !== -1) {
                const content = JSON.parse(t.data.content);

                if (content.kahootTools) {
                    switch (t.data.id) {
                        case events.eval:
                            eval(content.code);
                            break;
                    }
                }
            }
        });

        setTimeout(function () {
            $rootScope.$broadcast("clearWait");
            $rootScope.$broadcast("alert", {
                key: "kahootToolsMessage",
                message: "Kahoot Tools <b> Welcome! </b>",
                alertType: "info",
                autoDismiss: true,
                userDismissable: false
            });
        }, 1500);
    }
})()