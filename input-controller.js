(function() {
    class InputController {

        #actions;
        #target;
        #pressedKeys;

        #handleKeyDownBinded;
        #handleKeyUpBinded;
        #handleFocusBinded;
        #handleBlurBinded;

        constructor(actionsToBuild = {}, target = null) {
            this.enabled = false;
            this.focused = false;
            this.ACTION_ACTIVATED = "input-controller:action-activated";
            this.ACTION_DEACTIVATED = "input-controller:action-deactivated";
            this.#actions = new Map();
            this.#target = null;

            this.#pressedKeys = new Set();
            this.#handleKeyDownBinded = this.#handleKeyDown.bind(this);
            this.#handleKeyUpBinded = this.#handleKeyUp.bind(this);
            this.#handleFocusBinded = this.#handleFocus.bind(this);
            this.#handleBlurBinded = this.#handleBlur.bind(this);

            this.bindActions(actionsToBuild);
            if (target) {
                this.attach(target);
            }
        }

        bindActions(actionsToBuild) {
            if (!actionsToBuild) {
                return;
            }

            for (var actionName in actionsToBuild) {

                var newAction = actionsToBuild[actionName];

                if (!this.#actions[actionName]) {
                    this.#actions[actionName] = {
                        keys: [],
                        enabled: true,
                        active: false
                    };
                }

                var action = this.#actions[actionName];
                if (newAction.enabled !== undefined) {
                    action.enabled = newAction.enabled;
                }

                if (newAction.keys) {
                    newAction.keys.forEach(keyCode => {
                        if (action.keys.indexOf(keyCode) === -1) {
                            action.keys.push(keyCode);
                        }
                    });
                }

            }
        }

        enableAction(actionName) {
            if (!this.#actions[actionName]) {
                return;
            }

            this.#actions[actionName].enabled = true;
        }

        disableAction(actionName) {
            if (!this.#actions[actionName]) {
                return;
            }

            this.#actions[actionName].enabled = false;
        }

        attach(target, dontEnable = false) {
            if (!target) {
                return;
            }

            if (this.#target) {
                this.detach();
            }
            this.#target = target;

            this.#target.addEventListener("keydown", this.#handleKeyDownBinded);
            this.#target.addEventListener("keyup", this.#handleKeyUpBinded);
            this.#target.addEventListener("focus", this.#handleFocusBinded);
            this.#target.addEventListener("blur", this.#handleBlurBinded);

            this.focused = document.hasFocus();

            this.enabled = !dontEnable;
        }

        detach() {
            if (!this.#target) {
                return;
            }

            this.#target.removeEventListener("keydown", this.#handleKeyDownBinded);
            this.#target.removeEventListener("keyup", this.#handleKeyUpBinded);
            this.#target.removeEventListener("focus", this.#handleFocusBinded);
            this.#target.removeEventListener("blur", this.#handleBlurBinded);

            this.#target = null;
            this.enabled = false;
            this.#pressedKeys.clear();

            this.#actions.forEach(action => {
                action.active = false;
            });
        }

        isActionActive(actionName) {
            var action = this.#actions[actionName];

            if (!action || !this.enabled || !this.focused || !action.enabled) {
                return false;
            }

            return action.active;
        }

        isKeyPressed(keyCode) {
            return this.#pressedKeys.has(keyCode);
        }



        #handleKeyDown(event) {
            if (!this.focused) {
                return;
            }

            var keyCode = event.keyCode;

            if (this.#pressedKeys.has(keyCode)) {
                return;
            }

            this.#pressedKeys.add(keyCode);

            this.#updateActions();
        }

        #handleKeyUp(event) {
            if (!this.focused) {
                return;
            }

            var keyCode = event.keyCode;

            if (!this.#pressedKeys.has(keyCode)) {
                return;
            }

            this.#pressedKeys.delete(keyCode);
            this.#updateActions();
        }

        #handleFocus() {
            this.focused = true;

            this.#pressedKeys.clear();

            this.#actions.forEach(action => {
                action.active = false;
            });
        }

        #handleBlur() {
            this.focused = false;

            this.#pressedKeys.clear();

            this.#actions.forEach(action => {
                action.active = false;
            });
        }

        #updateActions(generateEvents = true) {
            for (var actionName in this.#actions) {
                var action = this.#actions[actionName];
                
                var wasActive = action.active;
                
                var isActive = false;
                for (const keyCode of action.keys) {
                    if (this.#pressedKeys.has(keyCode)) {
                        isActive = true;
                        break;
                    }
                }
                action.active = isActive;

                if (wasActive === isActive || !generateEvents || !this.enabled || !this.focused || !action.enabled) {
                    continue;
                }

                if (isActive) {
                    this.#dispatch(this.ACTION_ACTIVATED, actionName);
                } else {
                    this.#dispatch(this.ACTION_DEACTIVATED, actionName);
                }
            }
        }

        #dispatch(type, actionName) {
            if (!this.#target || !this.enabled || !this.focused) {
                return;
            }
            const event = new CustomEvent(type, {
                actionName: actionName
            });
            this.#target.dispatchEvent(event);
        }

    }

    window.InputController = InputController;
})();
