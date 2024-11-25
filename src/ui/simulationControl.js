import Simulation from "../simulator";

export default class SimulationControl {
    constructor() {
        this.element = document.createElement("div");
        this.element.classList.add("simulation-controls");
        this.element.classList.add("hidden");
        this.element.innerHTML = `
        <button class="control-button play"><i class="icon-play"></i></button>
        <button class="control-button pause"><i class="icon-pause"></i></button>
        <button class="control-button stop"><i class="icon-stop"></i></button>
        <button class="control-button step-forward" style="margin-right: 10px"><i class="icon-next"></i></button>
        <button class="control-button decrease-speed"><i class="icon-first"></i></button>
        <div class="speed-control">
            <label for="speed-slider">Speed: <span id="speed-value">500ms</span></label>
            <input id="speed-slider" type="range" class="speed-slider" min="100" max="2000" step="100" value="500">
        </div>
        <button class="control-button increase-speed"><i class="icon-last"></i></button>
        `;
        document.querySelector("#ui-overlay").append(this.element);
        const speedSlider = this.element.querySelector("#speed-slider");
        const speedValueDisplay = this.element.querySelector("#speed-value");

        let simulationSpeed = parseInt(speedSlider.value);

        speedSlider.addEventListener("input", (event) => {
            simulationSpeed = parseInt(event.target.value);
            speedValueDisplay.textContent = simulationSpeed + "ms";
        });

        this.element.querySelector(".increase-speed").addEventListener("click", () => {
            if (simulationSpeed < 2000) {
                simulationSpeed += 100;
                speedSlider.value = simulationSpeed;
                speedValueDisplay.textContent = simulationSpeed + "ms";
            }
        });

        this.element.querySelector(".decrease-speed").addEventListener("click", () => {
            if (simulationSpeed > 100) {
                simulationSpeed -= 100;
                speedSlider.value = simulationSpeed;
                speedValueDisplay.textContent = simulationSpeed + "ms";
            }
        });
        this.element.querySelector(".step-forward").addEventListener("click", () => {
            this.simulator.step();
        });
        this.element.querySelector(".stop").addEventListener("click", () => {
            this.simulator.reset();
        });
        this.element.querySelector(".play").addEventListener("click", () => {
            this.isPlaying = true;
            const playFunction = () => {
                this.simulator.step();
                if (this.isPlaying) this.playTimeout = setTimeout(playFunction, parseInt(speedSlider.value));
            };
            this.playTimeout = setTimeout(playFunction, parseInt(speedSlider.value));
        });
        this.element.querySelector(".pause").addEventListener("click", () => {
            this.isPlaying = false;
        });
        this.playTimeout = undefined;
    }
    /**
     *
     * @param {Simulation} simulator
     */
    setSimulator(simulator) {
        this.simulator = simulator;
        simulator.on("finish", (node) => {
            this.setIsFinished(true);
        });
        simulator.on("reset", () => {
            this.setIsFinished(false);
        });
    }
    setIsFinished(isFinished) {
        this.isFinished = isFinished;
        if (isFinished) {
            this.element.querySelector(".step-forward").setAttribute("disabled", true);
            this.element.querySelector(".play").setAttribute("disabled", true);
        } else {
            this.element.querySelector(".step-forward").removeAttribute("disabled");
            this.element.querySelector(".play").removeAttribute("disabled");
        }
        if (this.playTimeout) clearTimeout(this.playTimeout);
        this.isPlaying = false;
    }
    show() {
        this.element.classList.remove("hidden");
    }
    hide() {
        this.element.classList.add("hidden");
    }
}
