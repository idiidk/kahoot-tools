let kahoot = null;
let runningTimers = [];

$(() => {
    if (typeof (Storage) !== "undefined" && doesWebStorageWork()) {
        kahoot = new KahootClient(null, null);
        if (!localStorage.token && !localStorage.tokenExpiration) {
            $("#kahoot-web-login").show();
        } else {
            if (localStorage.tokenExpiration < new Date().getTime()) {
                $("#kahoot-web-login").show();
                localStorage.removeItem("token");
                localStorage.removeItem("tokenExpiration");
            } else {
                kahoot.bearerToken = localStorage.token;
                $("#kahoot-username").remove();
                $("#kahoot-password").remove();
                $("#kahoot-web-login-text").text(`Kahoot logged in: ${localStorage.token}`);
            }
        }
    } else {
        alert("This website will not work on this browser. If you are in private mode please leave!");
    }
});

$("#custom-server-btn").click(() => {
    showPanel("server");
});

function showPanel(panel) {
    $("#login-panel").velocity({ opacity: 0 }, 500, () => {
        $("#login-panel").hide();
        $("#" + panel + "-panel").fadeIn(500);
    });
}

function doesWebStorageWork() {
    try {
        let id = makeId();
        localStorage.setItem(`check-${id}`, "1");
        localStorage.removeItem(`check-${id}`);
        return true;
    } catch (e) {
        return false;
    }
}

function updateSessionText() {
    $("#pin-display").text(`Pin: ${kahoot.pin} - Name: ${kahoot.name}`);
}

function makeId() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function closeAllModals() {
    $(".overlay").fadeOut(() => {
        $(".overlay").remove()
    });
}

function openModal(html, closable = true, callback) {
    let id = makeId();
    let closeCode = closable ? `onclick="$("#${id}").fadeOut(function(){$("#${id}").remove()})` : "";
    $("body").prepend(`<div class="overlay" style="display: none;" ${closeCode} id="${id}"></div>`);
    $(`#${id}`).fadeIn();
    $.get(html, data => {
        $(`#${id}`).append(data);
        if (typeof callback === "function") {
            callback();
        }
    })
}

function sendMessage(color = "indigo darken-1", title, content, closeTime = 2500) {
    let id = makeId();
    const msg = `<div id="${id}" class="card ${color}"><div class="card-content white-text"><span class="card-title">${title}</span><p>${content}</p></div></div>`;
    $("#message-container").prepend(msg);
    $(`#message-container #${id}`).slideUp(0).slideDown().click(() => {
        $(`#message-container #${id}`).slideUp(() => {
            $(`#message-container #${id}`).remove();
        });
    })

    setTimeout(() => {
        $(`#message-container #${id}`).slideUp(() => {
            $(`#message-container #${id}`).remove();
        });
    }, closeTime);
    return $(`#message-container #${id}`);
}