(function() {
    class MousePlugin extends InputPlugin {

        constructor() {
            super("mouse", [
                new UpDownInput("mouse", "buttons", "mousedown", "mouseup", "button")
            ]);
        }

    }

    window.MousePlugin = MousePlugin;
})();
