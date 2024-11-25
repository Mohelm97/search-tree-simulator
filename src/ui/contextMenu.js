import "../styles/context-menu.css";
export default function contextMenu(options) {
    const contextMenu = document.getElementById("context-menu");
    const contextMenuUl = contextMenu.querySelector("ul");

    const updateMenu = () => {
        contextMenuUl.innerHTML = "";
        for (const option of options) {
            if (!option.isVisible()) continue;
            const ele = document.createElement("li");
            ele.innerText = option.text;
            ele.addEventListener("click", option.onClick);
            contextMenuUl.append(ele);
        }
    };
    document.getElementById("container").addEventListener("contextmenu", (e) => {
        e.preventDefault();
        updateMenu();
        contextMenu.style.top = `${e.clientY}px`;
        contextMenu.style.left = `${e.clientX}px`;
        contextMenu.style.display = "block";
    });

    document.addEventListener("click", () => {
        contextMenu.style.display = "none";
    });
    return contextMenu;
}
