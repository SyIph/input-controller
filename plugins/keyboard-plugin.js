(function() {
    class KeyboardPlugin extends InputPlugin {
        #target;
        #pressedKeys;
        #handleKeyDownBinded;
        #handleKeyUpBinded;
        #onChange;

        constructor() {
            super();

            this.#target = null;
            this.#pressedKeys = new Set();
            this.#handleKeyDownBinded = this.#handleKeyDown.bind(this);
            this.#handleKeyUpBinded = this.#handleKeyUp.bind(this);
            this.#onChange = null;

            this.PLUGIN_NAME = "keyboard";
        }

        attach(target) {
            if (!target) {
                return;
            }

            if (this.#target) {
                this.detach();
            }

            this.#target = target;

            this.#target.addEventListener("keydown", this.#handleKeyDownBinded);
            this.#target.addEventListener("keyup", this.#handleKeyUpBinded);
        }

        detach() {
            if (!this.#target) {
                return;
            }

            this.#target.removeEventListener("keydown", this.#handleKeyDownBinded);
            this.#target.removeEventListener("keyup", this.#handleKeyUpBinded);

            this.#pressedKeys.clear();
            this.#target = null;
        }

        isActionActive(action) {
            if (!action[this.PLUGIN_NAME] || !action[this.PLUGIN_NAME].keys) {
                return false;
            }
            for (var keyCode of action[this.PLUGIN_NAME].keys) {
                if (this.#pressedKeys.has(keyCode)) {
                    return true;
                }
            }
            return false;
        }

        isKeyPressed(keyCode) {
            return this.#pressedKeys.has(keyCode);
        }

        #handleKeyDown(event) {
            var keyCode = event.keyCode;

            if (this.#pressedKeys.has(keyCode)) {
                return;
            }

            this.#pressedKeys.add(keyCode);

            if (this.#onChange) {
                this.#onChange();
            }
        }


        #handleKeyUp(event) {
            var keyCode = event.keyCode;

            if (!this.#pressedKeys.has(keyCode)) {
                return;
            }

            this.#pressedKeys.delete(keyCode);

            if (this.#onChange) {
                this.#onChange();
            }
        }

        clearPressed() {
            this.#pressedKeys.clear();
        }

        setOnChange(callback) {
            this.#onChange = callback;
        }

    }

    window.KeyboardPlugin = KeyboardPlugin;
})();
