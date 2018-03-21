import $ from "jquery/dist/jquery.min.js";

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

function makeId() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

export { sendMessage };