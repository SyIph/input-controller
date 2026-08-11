(function() {
    class MousePlugin extends InputPlugin {
        #target;
        #pressedButtons;
        #handleButtonDownBinded;
        #handleButtonUpBinded;
        #onChange;

        constructor() {
            super();

            this.#target = null;
            this.#pressedButtons = new Set();
            this.#handleButtonDownBinded = this.#handleButtonDown.bind(this);
            this.#handleButtonUpBinded = this.#handleButtonUp.bind(this);
            this.#onChange = null;

            this.PLUGIN_NAME = "mouse";
        }

        attach(target) {
            if (!target) {
                return;
            }

            if (this.#target) {
                this.detach();
            }

            this.#target = target;

            this.#target.addEventListener("mousedown", this.#handleButtonDownBinded);
            this.#target.addEventListener("mouseup", this.#handleButtonUpBinded);
        }

        detach() {
            if (!this.#target) {
                return;
            }

            this.#target.removeEventListener("mousedown", this.#handleButtonDownBinded);
            this.#target.removeEventListener("mouseup", this.#handleButtonUpBinded);

            this.#pressedButtons.clear();
            this.#target = null;
        }

        isActionActive(action) {
            if (!action[this.PLUGIN_NAME] || !action[this.PLUGIN_NAME].buttons) {
                return false;
            }
            for (var buttonCode of action[this.PLUGIN_NAME].buttons) {
                if (this.#pressedButtons.has(buttonCode)) {
                    return true;
                }
            }
            return false;
        }

        isKeyPressed(buttonCode) {
            return this.#pressedButtons.has(buttonCode);
        }

        #handleButtonDown(event) {
            var buttonCode = event.button;

            if (this.#pressedButtons.has(buttonCode)) {
                return;
            }

            this.#pressedButtons.add(buttonCode);

            if (this.#onChange) {
                this.#onChange();
            }
        }


        #handleButtonUp(event) {
            var buttonCode = event.button;

            if (!this.#pressedButtons.has(buttonCode)) {
                return;
            }

            this.#pressedButtons.delete(buttonCode);

            if (this.#onChange) {
                this.#onChange();
            }
        }

        clearPressed() {
            this.#pressedButtons.clear();
        }

        setOnChange(callback) {
            this.#onChange = callback;
        }

    }

    window.MousePlugin = MousePlugin;
})();
