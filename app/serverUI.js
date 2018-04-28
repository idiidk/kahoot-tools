import $ from "jquery/dist/jquery.min.js";
const $serverUI = $("#server-ui-wrapper");

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
}

class Button {
    constructor(text, clickHandler) {
        this.id = guid();
        this.template = `<a id="${this.id}" class="waves-effect waves-light btn">${text}</a>`;
        this.text = text;
        this.clickHandler = clickHandler || function(){};
    }

    init() {
        $("#" + this.id).click(this.clickHandler);
    }
}

class TextInput {
    constructor(label, width = "s12") {
        this.id = guid();
        this.removeId = guid();
        this.template = `<div id="${this.removeId}" class="input-field col ${width}">
          <input id="${this.id}" type="text" class="validate">
          <label for="${this.id}">${label}</label>
        </div>`;
        this.width = width;
        this.element;
    }

    init() {
        this.element = $("#" + this.id);
    }
}

class Label {
    constructor(text, size = "p") {
        this.id = guid();
        this.template = `<${size} id="${this.id}">${text}</${size}>`;
        this.text = text;
    }
}

class Row {
    constructor(centered = false) {
        this.id = guid();
        this.template = `<div class="row ${centered ? "centerer" : ""}" id="${this.id}"></div>`;
        this.element;
        this.children = [];
        this._initialize();
    }

    _initialize() {
        $serverUI.append(this.template);
        this.element = $("#" + this.id);
    }

    add(child) {
        this.element.append(child.template);
        if(child.init) child.init();
        this.children.push(child);
    }

    remove(child) {
        const id = child.removeId ? child.removeId : child.id;
        $("#" + id).remove();
    }

    clear() {
        for(let i = 0; i < this.children.length; i++) {
            $("#" + children[i].id).remove();
        }
        this.children = [];
    }

    destroy() {
        this.clear();
        this.element.remove();
    }
}

export {
    Button,
    TextInput,
    Label,
    Row
}