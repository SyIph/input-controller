(function() {
    class UpDownInput extends InputBase {
        #pressedInputElement;
        #handleInputDownBinded;
        #handleInputUpBinded;

        #getActionInputTriggers;

        #addDownEventListener;
        #removeDownEventListener;
        #addUpEventListener;
        #removeUpEventListener;
        #getEventInputCode;

        #setFunctionsWithTarget;

        constructor(pluginName, actionInputs, downEventName, upEventName, eventInputCodeName) {

            super();


            this.#pressedInputElement = new Set();
            this.#handleInputDownBinded = this.#handleInputDown.bind(this);
            this.#handleInputUpBinded = this.#handleInputUp.bind(this);

            this.#getActionInputTriggers = function(action) {
                var params = action[pluginName];
                if (!params) {
                    return;
                }
                return params[actionInputs];
            }

            this.#setFunctionsWithTarget = function(target) {
                this.#addDownEventListener = function(callback) {
                    target.addEventListener(downEventName, callback);
                }

                this.#removeDownEventListener = function(callback) {
                    target.removeEventListener(downEventName, callback);
                }

                this.#addUpEventListener = function(callback) {
                    target.addEventListener(upEventName, callback);
                }

                this.#removeUpEventListener = function(callback) {
                    target.removeEventListener(upEventName, callback);
                }

            }

            this.#getEventInputCode = function(event) {
                return event[eventInputCodeName];
            }            
        }

        attach(target) {
            this.#setFunctionsWithTarget(target);
            this.#addDownEventListener(this.#handleInputDownBinded);
            this.#addUpEventListener(this.#handleInputUpBinded);
        }

        detach() {
            if (!this.#removeDownEventListener || !this.#removeUpEventListener) {
                return;
            }
            this.#removeDownEventListener(this.#handleInputDownBinded);
            this.#removeUpEventListener(this.#handleInputUpBinded);
            this.#pressedInputElement.clear();
        }

        isActionActive(action) {
            var inputTriggers = this.#getActionInputTriggers(action);
            if (!inputTriggers) {
                return false;
            }
            for (var value of inputTriggers) {
                if (this.#pressedInputElement.has(value)) {
                    return true;
                }
            }
            return false;
        }

        #handleInputDown(event) {
            var inputCode = this.#getEventInputCode(event);

            if (this.#pressedInputElement.has(inputCode)) {
                return;
            }

            this.#pressedInputElement.add(inputCode);

            this._notifyChange();
        }


        #handleInputUp(event) {
            var inputCode = this.#getEventInputCode(event);

            if (!this.#pressedInputElement.has(inputCode)) {
                return;
            }

            this.#pressedInputElement.delete(inputCode);

            this._notifyChange();
        }

        clear() {
            this.#pressedInputElement.clear();
        }

    }

    window.UpDownInput = UpDownInput;
})();
