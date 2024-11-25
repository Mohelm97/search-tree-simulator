import "../styles/popup.css";

export default function textPrompt({ title, placeholder, value, type }, callback) {
    const element = document.createElement("div");
    type = type || "text";
    value = value || "";
    element.innerHTML = `
<div class="popup-header">${title}</div>
<div class="popup-body">
    <input type="${type}" value="${value}" class="text-input" placeholder="${placeholder}" />
    <div class="popup-actions">
        <button class="submit-button">Submit</button>
        <button class="cancel-button">Cancel</button>
    </div>
</div>`;
    element.classList.add("popup");
    element.classList.add("shown");
    document.body.append(element);
    const width = element.getBoundingClientRect().width;
    const height = element.getBoundingClientRect().height;
    element.style.left = `calc(50% - ${width / 2}px)`;
    element.style.top = `calc(50% - ${height / 2}px)`;

    // Make the popup draggable from the header
    const header = element.querySelector(".popup-header");
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const onMouseDown = (e) => {
        isDragging = true;
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e) => {
        if (!isDragging) return;
        element.style.left = `${e.clientX - offsetX}px`;
        element.style.top = `${e.clientY - offsetY}px`;
        element.style.transform = "none";
    };

    const onMouseUp = () => {
        isDragging = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    };

    header.addEventListener("mousedown", onMouseDown);
    const input = element.querySelector(".text-input");
    input.focus();
    input.select();

    // Handle "Enter" key on the input
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const name = input.value;
            callback(name);
            hide();
        }
    });
    // Hide and cleanup functionality
    const hide = () => {
        element.style.display = "none";
        element.classList.remove("shown");

        setTimeout(() => element.remove(), 300);
    };
    element.querySelector(".cancel-button").addEventListener("click", hide);
    element.querySelector(".submit-button").addEventListener("click", () => {
        const name = input.value;
        callback(name);
        hide();
    });
    return element;
}
