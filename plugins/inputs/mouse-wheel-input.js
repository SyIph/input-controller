(function() {
    class MouseWheelInput extends InputBase {

        #direction;
        #handleWheelBinded;

        #getActionInputTriggers;

        #addWheelEventListener;
        #removeWheelEventListener;

        #setFunctionsWithTarget;

        #resetTimeout;

        constructor(pluginName, actionInputs) {
            super();
            
            this.#direction = null;
            this.#handleWheelBinded = this.#handleWheel.bind(this);

            this.#resetTimeout = null;

            this.#getActionInputTriggers = function(action) {
                var params = action[pluginName];
                if (!params) {
                    return;
                }
                return params[actionInputs];
            }

            this.#setFunctionsWithTarget = function(target) {
                this.#addWheelEventListener = function(callback) {
                    target.addEventListener("wheel", callback);
                }

                this.#removeWheelEventListener = function(callback) {
                    target.removeEventListener("wheel", callback);
                }
            }        
        }

        attach(target) {
            this.#setFunctionsWithTarget(target);
            this.#addWheelEventListener(this.#handleWheelBinded);
        }

        detach() {
            if (!this.#removeWheelEventListener) {
                return;
            }
            this.#removeWheelEventListener(this.#handleWheelBinded);
            this.#direction = null;
        }

        isActionActive(action) {
            var inputTriggers = this.#getActionInputTriggers(action);
            if (!inputTriggers || !this.#direction) {
                return false;
            }
            for (var value of inputTriggers) {
                if (this.#direction === value) {
                    return true;
                }
            }
            return false;
        }

        #handleWheel(event) {
            if (event.deltaY < 0) {
                this.#direction = 1; // up
            } else if (event.deltaY > 0) {
                this.#direction = -1; // down
            } else {
                this.#direction = null;
            }

            this._notifyChange();

            clearTimeout(this.#resetTimeout);

            this.#resetTimeout = setTimeout(() => {
                this.#direction = null;
                this._notifyChange();

                this.#resetTimeout = null;
            }, 15);
        }

        clear() {
            this.#direction = null;
        }

    }

    window.MouseWheelInput = MouseWheelInput;
})();
