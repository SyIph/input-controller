(function() {
    class UpDownInput extends InputBase {
        #target;
        #pressedInputElement;
        #handleInputDownBinded;
        #handleInputUpBinded;
        #onChange;

        #getActionParams;
        #getActionInputTriggers;

        #addDownEventListener;
        #removeDownEventListener;
        #addUpEventListener;
        #removeUpEventListener;
        #getEventInputCode;

        constructor(pluginName, actionInputs, downEventName, upEventName, eventInputCodeName) {

            super();

            this.#target = null;
            this.#pressedInputElement = new Set();
            this.#handleInputDownBinded = this.#handleInputDown.bind(this);
            this.#handleInputUpBinded = this.#handleInputUp.bind(this);
            this.#onChange = null;

            this.#getActionParams = function(action) {
                return action[pluginName];
            }

            this.#getActionInputTriggers = function(action) {
                var params = this.#getActionParams(action);
                if (!params) {
                    return;
                }
                return params[actionInputs];
            }

            this.#addDownEventListener = function(callback) {
                this.#target.addEventListener(downEventName, callback);
                this.addListener();
            }

            this.#removeDownEventListener = function(callback) {
                this.#target.removeEventListener(downEventName, callback);
            }

            this.#addUpEventListener = function(callback) {
                this.#target.addEventListener(upEventName, callback);
            }

            this.#removeUpEventListener = function(callback) {
                this.#target.removeEventListener(upEventName, callback);
            }

            this.#getEventInputCode = function(event) {
                return event[eventInputCodeName];
            }
        }

        attach(target) {
            this.#addDownEventListener(this.#handleInputDownBinded);
            this.#addUpEventListener(this.#handleInputUpBinded);
        }

        detach() {
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

        isInputPressed(inputCode) {
            return this.#pressedInputElement.has(inputCode);
        }

        #handleInputDown(event) {
            var inputCode = this.#getEventInputCode(event);

            if (this.#pressedInputElement.has(inputCode)) {
                return;
            }

            this.#pressedInputElement.add(inputCode);

            if (this.#onChange) {
                this.#onChange();
            }
        }


        #handleInputUp(event) {
            var inputCode = this.#getEventInputCode(event);

            if (!this.#pressedInputElement.has(inputCode)) {
                return;
            }

            this.#pressedInputElement.delete(inputCode);

            if (this.#onChange) {
                this.#onChange();
            }
        }

        clearPressed() {
            this.#pressedInputElement.clear();
        }

        setOnChange(callback) {
            this.#onChange = callback;
        }

    }

    window.UpDownInput = UpDownInput;
})();
