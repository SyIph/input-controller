(function () {
    var playground = document.getElementById("playground");
    var player = document.getElementById("player");
    var attachButton = document.getElementById("attach");
    var detachButton = document.getElementById("detach");
    var enableButton = document.getElementById("enable");
    var disableButton = document.getElementById("disable");
    var enableLeftButton = document.getElementById("enable-left");
    var disableLeftButton = document.getElementById("disable-left");
    var bindJumpButton = document.getElementById("bind-jump");
    var enabledState = document.getElementById("enabled-state");
    var focusedState = document.getElementById("focused-state");
    var lastEvent = document.getElementById("last-event");

    var controller = new InputController(
        {
            left: {
                keyboard: {
                    keys: [65, 37]
                },
                mouse: {
                    buttons: [0]
                }
            },
            right: {
                keyboard: {
                    keys: [68, 39]
                },
                mouse: {
                    buttons: [2]
                }
            },
            up: {
                keyboard: {
                    keys: [87, 38]
                }
            },
            down: {
                keyboard: {
                    keys: [83, 40]
                }
            }
        },
        document
    );

    var keyboardPlugin = new KeyboardPlugin();
    controller.addPlugin(keyboardPlugin);

    var mousePlugin = new MousePlugin();
    controller.addPlugin(mousePlugin);

    var x = 0;
    var y = 0;
    var speed = 3;

    attachButton.addEventListener("click", function() {
        controller.attach(document);
        updateInfo();
    });

    detachButton.addEventListener("click", function() {
        controller.detach();
        updateInfo();
    });

    enableButton.addEventListener("click", function() {
        controller.enabled = true;
        updateInfo();
    });

    disableButton.addEventListener("click", function() {
        controller.enabled = false;
        updateInfo();
    });

    enableLeftButton.addEventListener("click", function() {
        controller.enableAction("left");
    });

    disableLeftButton.addEventListener("click", function() {
        controller.disableAction("left");
    });

    bindJumpButton.addEventListener("click", function() {
        controller.bindActions({
            jump: {
                keyboard: {
                    keys: [32]
                },
                mouse: {
                    buttons: [1]
                }
            }
        });
        lastEvent.textContent = "Jump action added";
    });

    document.addEventListener(controller.ACTION_ACTIVATED, function (event) {
        var actionName = event.detail;
        lastEvent.textContent = "Activated: " + actionName;
    });

    document.addEventListener(controller.ACTION_DEACTIVATED, function (event) {
        var actionName = event.detail;
        lastEvent.textContent = "Deactivated: " + actionName;
    });

    function update() {
        
        if (controller.isActionActive("left")) {
            x = x - speed;
        }

        if (controller.isActionActive("right")) {
            x = x + speed;
        }

        if (controller.isActionActive("up")) {
            y = y - speed;
        }

        if (controller.isActionActive("down")) {
            y = y + speed;
        }

        if (controller.isActionActive("jump")) {
            player.classList.add("jump");
        } else {
            player.classList.remove("jump");
        }

        if (x < 0) {
            x = 0;
        }

        if (y < 0) {
            y = 0;
        } 

        if (x > playground.clientWidth - player.clientWidth) {
            x = playground.clientWidth - player.clientWidth;
        } 

        if (y > playground.clientHeight - player.clientHeight) {
            y = playground.clientHeight - player.clientHeight;
        } 

        player.style.left = x + "px";
        player.style.top = y + "px";

        updateInfo();

        requestAnimationFrame(update);
    }

    function updateInfo() {
        enabledState.textContent = controller.enabled;
        focusedState.textContent = controller.focused;
    }

    update();
})();