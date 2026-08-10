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

    var controller = new InputController({
        left: {
            keys: [65, 37]
        },
        right: {
            keys: [68, 39]
        },
        up: {
            keys: [87, 38]
        },
        down: {
            keys: [83, 40]
        }
    });

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
                keys: [32]
            }
        });
        lastEvent.textContent = "Jump action added";
    });

    document.addEventListener(controller.ACTION_ACTIVATED, function (event) {
        var actionName = event.actionName;
        lastEvent.textContent = "Activated: " + actionName;
    });

    document.addEventListener(controller.ACTION_DEACTIVATED, function (event) {
        var actionName = event.actionName;
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