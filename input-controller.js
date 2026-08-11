(function() {
    class InputController {

        #plugins;

        #actions;
        #target;
        //#pressedKeys;

        #updateActionsBinded;
        //#handleKeyDownBinded;
        //#handleKeyUpBinded;
        #handleFocusBinded;
        #handleBlurBinded;

        constructor(actionsToBuild = {}, target = null) {
            this.#plugins = [];

            this.enabled = false;
            this.focused = false;
            this.ACTION_ACTIVATED = "input-controller:action-activated";
            this.ACTION_DEACTIVATED = "input-controller:action-deactivated";
            this.#actions = new Map();
            this.#target = null;

            //this.#pressedKeys = new Set();
            this.#updateActionsBinded = this.#updateActions.bind(this);
            //this.#handleKeyDownBinded = this.#handleKeyDown.bind(this);
            //this.#handleKeyUpBinded = this.#handleKeyUp.bind(this);
            this.#handleFocusBinded = this.#handleFocus.bind(this);
            this.#handleBlurBinded = this.#handleBlur.bind(this);

            this.bindActions(actionsToBuild);
            if (target) {
                this.attach(target);
            }
        }

        addPlugin(plugin) {
            if (!(plugin instanceof InputPlugin)) {
                throw new Error("Plugin must extend InputPlugin class!");
            }

            if (this.#plugins.includes(plugin)) {
                return;
            }

            plugin.setOnChange(this.#updateActionsBinded);

            this.#plugins.push(plugin);

            if (this.#target) {
                plugin.attach(this.#target);
            }
        }

        bindActions(actionsToBuild) {
            if (!actionsToBuild) {
                return;
            }

            for (var actionName in actionsToBuild) {

                var newAction = actionsToBuild[actionName];

                if (!this.#actions.has(actionName)) {
                    this.#actions.set(actionName, {
                        //keys: [],
                        enabled: true,
                        active: false
                    });
                }

                var action = this.#actions.get(actionName);

                for (var settingName in newAction) {
                    action[settingName] = newAction[settingName];
                }

                this.#updateActions();

                // if (newAction.keys) {
                //     newAction.keys.forEach(keyCode => {
                //         if (action.keys.indexOf(keyCode) === -1) {
                //             action.keys.push(keyCode);
                //         }
                //     });
                // }

            }
        }

        enableAction(actionName) {
            if (!this.#actions.has(actionName)) {
                return;
            }

            this.#actions.get(actionName).enabled = true;
        }

        disableAction(actionName) {
            if (!this.#actions.has(actionName)) {
                return;
            }

            this.#actions.get(actionName).enabled = false;
        }

        attach(target, dontEnable = false) {
            if (!target) {
                return;
            }

            if (this.#target) {
                this.detach();
            }
            this.#target = target;

            for (var plugin of this.#plugins) {
                plugin.attach(this.#target);
            }
            //this.#target.addEventListener("keydown", this.#handleKeyDownBinded);
            //this.#target.addEventListener("keyup", this.#handleKeyUpBinded);
            this.#target.addEventListener("focus", this.#handleFocusBinded);
            this.#target.addEventListener("blur", this.#handleBlurBinded);

            this.focused = document.hasFocus();

            this.enabled = !dontEnable;
        }

        detach() {
            if (!this.#target) {
                return;
            }

            for (var plugin of this.#plugins) {
                plugin.detach(this.#target);
            }
            //this.#target.removeEventListener("keydown", this.#handleKeyDownBinded);
            //this.#target.removeEventListener("keyup", this.#handleKeyUpBinded);
            this.#target.removeEventListener("focus", this.#handleFocusBinded);
            this.#target.removeEventListener("blur", this.#handleBlurBinded);

            this.#target = null;
            this.enabled = false;
            //this.#pressedKeys.clear();

            this.#actions.forEach(action => {
                action.active = false;
            });
        }

        isActionActive(actionName) {
            var action = this.#actions.get(actionName);

            if (!action || !this.enabled || !this.focused || !action.enabled) {
                return false;
            }

            return action.active;
        }

        //isKeyPressed(keyCode) {
            //return this.#pressedKeys.has(keyCode);
        //}



        // #handleKeyDown(event) {
        //     if (!this.focused) {
        //         return;
        //     }

        //     var keyCode = event.keyCode;

        //     if (this.#pressedKeys.has(keyCode)) {
        //         return;
        //     }

        //     this.#pressedKeys.add(keyCode);

        //     this.#updateActions();
        // }

        // #handleKeyUp(event) {
        //     if (!this.focused) {
        //         return;
        //     }

        //     var keyCode = event.keyCode;

        //     if (!this.#pressedKeys.has(keyCode)) {
        //         return;
        //     }

        //     this.#pressedKeys.delete(keyCode);
        //     this.#updateActions();
        // }

        #handleFocus() {
            this.focused = true;

            for (var plugin of this.#plugins) {
                plugin.clearPressed();
            }
            //this.#pressedKeys.clear();

            this.#actions.forEach(action => {
                action.active = false;
            });
        }

        #handleBlur() {
            this.focused = false;

            for (var plugin of this.#plugins) {
                plugin.clearPressed();
            }
            //this.#pressedKeys.clear();

            this.#actions.forEach(action => {
                action.active = false;
            });
        }

        #updateActions(generateEvents = true) {
            for (var [actionName, action] of this.#actions) {
                var wasActive = action.active;
                
                var isActive = false;
                var activePlugin = null;
                for (var plugin of this.#plugins) {
                    if (plugin.isActionActive(action)) {
                        isActive = true;
                        activePlugin = plugin.PLUGIN_NAME;
                        break;
                    }
                }
                //for (const keyCode of action.keys) {
                    //if (this.#pressedKeys.has(keyCode)) {
                    //    isActive = true;
                    //    break;
                    //}
                //}
                action.active = isActive;

                if (wasActive === isActive || !generateEvents || !this.enabled || !this.focused || !action.enabled) {
                    continue;
                }

                if (isActive) {
                    this.#dispatch(this.ACTION_ACTIVATED, actionName, activePlugin);
                } else {
                    this.#dispatch(this.ACTION_DEACTIVATED, actionName, activePlugin);
                }
            }
        }

        #dispatch(type, actionName, pluginName) {
            if (!this.#target || !this.enabled || !this.focused) {
                return;
            }
            const event = new CustomEvent(type, {
                detail: (pluginName ? (pluginName) + "-" : "") + actionName
            });
            this.#target.dispatchEvent(event);
        }

    }

    window.InputController = InputController;
})();
