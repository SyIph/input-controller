(function() {
    class MousePlugin extends InputPlugin {

        constructor() {
            super("mouse", [
                new UpDownInput("mouse", "buttons", "mousedown", "mouseup", "button"),
                new MouseWheelInput("mouse", "wheel")
            ]);
        }

    }

    window.MousePlugin = MousePlugin;
})();
