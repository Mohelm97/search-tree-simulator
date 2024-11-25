import { javascript } from "@codemirror/lang-javascript";
import { indentUnit } from "@codemirror/language";
import { basicSetup, EditorView } from "codemirror";
import { dracula } from "thememirror";
import { EditorState } from "@codemirror/state";
import { highlightActiveLine, keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";

import "../styles/popup.css";

export default class CodeWindow {
    constructor() {
        const element = document.createElement("div");
        this.element = element;
        element.innerHTML = `
    <div class="popup-header">Code Editor</div>
    <div class="popup-body">
        <div id="codearea"></div>
        <div class="popup-actions">
            <button class="submit-button">Save</button>
            <button class="cancel-button">Cancel</button>
        </div>
    </div>`;
        element.style.width = "700px";
        element.classList.add("popup");
        document.body.append(element);

        // Make the popup draggable from the header
        const header = element.querySelector(".popup-header");
        this.isDragging = false;
        this.offsetX = 0;
        this.offsetY = 0;

        header.addEventListener("mousedown", this.onMouseDown.bind(this));
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        element.querySelector(".cancel-button").addEventListener("click", () => {
            this.hide();
            setTimeout(() => this.setCode(this.previousCode), 300);
        });
        element.querySelector(".submit-button").addEventListener("click", () => {
            this.hide();
            this.previousCode = this.editor.state.doc.toString();
        });
        const customStyle = EditorView.theme({
            "&": {
                scrollbarWidth: "thin",
                scrollbarColor: "#44475a #282a36",
            },
            "&::-webkit-scrollbar": {
                width: "10px",
                height: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#44475a",
                borderRadius: "10px",
                border: "2px solid #282a36",
            },
            "&::-webkit-scrollbar-track": {
                backgroundColor: "#282a36",
            },
            ".cm-activeLine": {
                backgroundColor: "transparent", // Remove background highlight
            },
        });
        this.editor = new EditorView({
            extensions: [basicSetup, javascript(), customStyle, dracula, indentUnit.of("    "), EditorState.tabSize.of(4), keymap.of([indentWithTab])],
            parent: element.querySelector("#codearea"),
        });
        // Fuck you grammarly you've just wasted an hour of my time <3!
        this.editor.contentDOM.setAttribute("data-enable-grammarly", false);
    }
    hide() {
        this.element.classList.remove("shown");
    }
    show() {
        this.previousCode = this.editor.state.doc.toString();
        this.element.classList.add("shown");

        this.width = this.element.getBoundingClientRect().width;
        this.height = this.element.getBoundingClientRect().height;
        this.element.style.left = `calc(50% - ${this.width / 2}px)`;
        this.element.style.top = `calc(50% - ${this.height / 2}px)`;
    }
    setCode(code) {
        this.editor.dispatch({
            changes: {
                from: 0,
                to: this.editor.state.doc.length,
                insert: code,
            },
        });
    }
    getCode() {
        return this.editor.state.doc.toString();
    }
    onMouseDown(e) {
        this.isDragging = true;
        this.offsetX = e.clientX - this.element.getBoundingClientRect().left;
        this.offsetY = e.clientY - this.element.getBoundingClientRect().top;
        document.addEventListener("mousemove", this.onMouseMove);
        document.addEventListener("mouseup", this.onMouseUp);
    }
    onMouseMove(e) {
        if (!this.isDragging) return;
        this.element.style.left = `${e.clientX - this.offsetX}px`;
        this.element.style.top = `${e.clientY - this.offsetY}px`;
    }
    onMouseUp(e) {
        this.isDragging = false;
        document.removeEventListener("mousemove", this.onMouseMove);
        document.removeEventListener("mouseup", this.onMouseUp);
    }
}
