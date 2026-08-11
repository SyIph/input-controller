(function() {
    class KeyboardPlugin extends InputPlugin {

        #upDownInput;

        constructor() {
            super("keyboard");
            this.#upDownInput = new UpDownInput(this.PLUGIN_NAME, "keys", "keydown", "keyup", "keyCode");
        }

        // isKeyPressed(keyCode) {
        //     return this.#upDownInput.isInputPressed(keyCode);
        // }

        clearPressed() {
            this.#upDownInput.clearPressed();
        }

    }

    window.KeyboardPlugin = KeyboardPlugin;
})();
