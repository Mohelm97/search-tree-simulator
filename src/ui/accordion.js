import "../styles/accordion.css";
export default class Accordion {
    constructor(parent, title, contentHtml) {
        this.accordion = document.createElement("div");
        this.accordion.classList.add("accordion");

        this.accordion.innerHTML = `
            <span class="title">
                <span class="arrow">▼</span>
                ${title}
            </span>
             <div class="content">
                ${contentHtml}
            </div>
        `;
        parent.appendChild(this.accordion);

        this.accordion.querySelector(".title").addEventListener("click", () => {
            this.toggle();
        });

        this.expand();
    }

    expand() {
        const content = this.accordion.querySelector(".content");
        content.style.maxHeight = `${content.scrollHeight}px`;
        this.accordion.classList.add("expanded");
    }

    collapse() {
        const content = this.accordion.querySelector(".content");
        content.style.maxHeight = "0";
        this.accordion.classList.remove("expanded");
    }

    toggle() {
        const content = this.accordion.querySelector(".content");
        if (content.style.maxHeight && content.style.maxHeight !== "0px") {
            this.collapse();
        } else {
            this.expand();
        }
    }
}
