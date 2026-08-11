(function() {
    class MousePlugin extends InputPlugin {
        #target;
        #pressedButtons;
        #handleButtonDownBinded;
        #handleButtonUpBinded;
        #onChange;

        #upDownInput;

        constructor() {
            super("mouse");
            this.#upDownInput = new UpDownInput(this.PLUGIN_NAME, "buttons", "mousedown", "mouseup", "button");
        }

        // isKeyPressed(keyCode) {
        //     return this.#upDownInput.isInputPressed(keyCode);
        // }

        clearPressed() {
            this.#upDownInput.clearPressed();
        }

    }

    window.MousePlugin = MousePlugin;
})();
