(function() {
    class KeyboardPlugin extends InputPlugin {

        #upDownInput;

        constructor() {
            super("keyboard", [
                new UpDownInput("keyboard", "keys", "keydown", "keyup", "keyCode")
            ]);
        }

    }

    window.KeyboardPlugin = KeyboardPlugin;
})();
