(function() {
    class InputBase {

        #onChange;

        constructor() {
            this.#onChange = null;
        }

        attach(target) {

        }

        detach() {

        }

        isActionActive(action) {
            
        }

        setOnChange(callback) {
            this.#onChange = callback;
        }

        _notifyChange() {
            if (this.#onChange) {
                this.#onChange();
            }
        }

        clear() {
            
        }

    }

    window.InputBase = InputBase;
})();
