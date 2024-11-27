import Simulation from "../simulator";
import "../styles/simulation-controls.css";
export default class SimulationControl {
    constructor() {
        this.element = document.createElement("div");
        this.element.classList.add("simulation-controls");
        this.element.classList.add("hidden");
        this.element.innerHTML = `
        <button id="play"><i class="icon-play"></i></button>
        <button id="pause" class="hidden"><i class="icon-pause"></i></button>
        <button id="stop"><i class="icon-stop"></i></button>
        <button id="step-forward" style="margin-right: 10px"><i class="icon-next"></i></button>
        <button id="decrease-speed"><i class="icon-first"></i></button>
        <div class="speed-control">
            <label for="speed-slider">Speed: <span id="speed-value">500ms</span></label>
            <input id="speed-slider" type="range" class="speed-slider" min="100" max="2000" step="100" value="500">
        </div>
        <button id="increase-speed"><i class="icon-last"></i></button>
        <button id="stop-simulation"><i class="icon-cross"></i></button>
        `;
        document.querySelector("#ui-overlay").append(this.element);
        const speedSlider = this.element.querySelector("#speed-slider");
        const speedValueDisplay = this.element.querySelector("#speed-value");

        let simulationSpeed = parseInt(speedSlider.value);

        speedSlider.addEventListener("input", (event) => {
            simulationSpeed = parseInt(event.target.value);
            speedValueDisplay.textContent = simulationSpeed + "ms";
        });

        this.element.querySelector("#increase-speed").addEventListener("click", () => {
            if (simulationSpeed < 2000) {
                simulationSpeed += 100;
                speedSlider.value = simulationSpeed;
                speedValueDisplay.textContent = simulationSpeed + "ms";
            }
        });

        this.element.querySelector("#decrease-speed").addEventListener("click", () => {
            if (simulationSpeed > 100) {
                simulationSpeed -= 100;
                speedSlider.value = simulationSpeed;
                speedValueDisplay.textContent = simulationSpeed + "ms";
            }
        });
        this.element.querySelector("#step-forward").addEventListener("click", () => {
            this.simulator.step();
        });
        this.element.querySelector("#stop").addEventListener("click", () => {
            this.simulator.reset();
        });
        this.element.querySelector("#play").addEventListener("click", () => {
            this.element.querySelector("#pause").classList.remove("hidden");
            this.element.querySelector("#play").classList.add("hidden");
            this.isPlaying = true;
            const playFunction = () => {
                this.simulator.step();
                if (this.isPlaying) this.playTimeout = setTimeout(playFunction, parseInt(speedSlider.value));
            };
            this.playTimeout = setTimeout(playFunction, parseInt(speedSlider.value));
        });
        this.element.querySelector("#pause").addEventListener("click", () => {
            this.element.querySelector("#play").classList.remove("hidden");
            this.element.querySelector("#pause").classList.add("hidden");
            if (this.playTimeout) clearTimeout(this.playTimeout);
            this.isPlaying = false;
        });
        this.element.querySelector("#stop-simulation").addEventListener("click", () => {
            this.simulator.end();
            this.hide();
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
        this.setIsFinished(false);
    }
    setIsFinished(isFinished) {
        this.isFinished = isFinished;
        if (isFinished) {
            this.element.querySelector("#step-forward").setAttribute("disabled", true);
            this.element.querySelector("#play").setAttribute("disabled", true);
        } else {
            this.element.querySelector("#step-forward").removeAttribute("disabled");
            this.element.querySelector("#play").removeAttribute("disabled");
        }
        if (this.playTimeout) clearTimeout(this.playTimeout);
        this.isPlaying = false;
        this.element.querySelector("#play").classList.remove("hidden");
        this.element.querySelector("#pause").classList.add("hidden");
    }
    show() {
        this.element.classList.remove("hidden");
    }
    hide() {
        this.element.classList.add("hidden");
    }
}
