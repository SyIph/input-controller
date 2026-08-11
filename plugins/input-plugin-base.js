(function() {
    class InputPlugin {
        #target;

        #inputs;

        constructor(pluginName, inputs) {
            this.#target = null;
            this.PLUGIN_NAME = pluginName;
            this.#inputs = new Set(inputs);
        }

        attach(target) {
            if (!target) {
                return;
            }

            if (this.#target) {
                this.detach();
            }

            this.#target = target;

            for (var input of this.#inputs) {
                input.attach(target);
            }
        }

        detach() {
            if (!this.#target) {
                return;
            }

            for (var input of this.#inputs) {
                input.detach(this.#target);
            }

            this.#target = null;
        }

        isActionActive(action) {
            for (var input of this.#inputs) {
                if (input.isActionActive(action)) {
                    return true;
                }
            }
            return false;
        }

        setOnChange(callback) {
            for (var input of this.#inputs) {
                input.setOnChange(callback);
            }
        }

        clear() {
            for (var input of this.#inputs) {
                input.clear();
            }
        }

    }

    window.InputPlugin = InputPlugin;
})();