(function() {
    class InputController {

        #plugins;

        #actions;
        #target;

        #updateActionsBinded;
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

            this.#updateActionsBinded = this.#updateActions.bind(this);
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
                        //active: false, 
                        // Меняю на activePlugins, чтобы можно было не только знать состояние активности, 
                        // но и получать имена плагинов
                        activePlugins: new Set()
                    });
                }

                var action = this.#actions.get(actionName);

                for (var settingName in newAction) {
                    action[settingName] = newAction[settingName];
                }

                this.#updateActions();

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
            this.#target.removeEventListener("focus", this.#handleFocusBinded);
            this.#target.removeEventListener("blur", this.#handleBlurBinded);

            this.#target = null;
            this.enabled = false;

            this.#actions.forEach(action => {
                action.activePlugins.clear();
                //action.active = false;
            });
        }

        isActionActive(actionName) {
            var action = this.#actions.get(actionName);

            if (!action || !this.enabled || !this.focused || !action.enabled) {
                return false;
            }

            

            return action.activePlugins.size > 0;
        }

        #handleFocus() {
            this.focused = true;

            for (var plugin of this.#plugins) {
                plugin.clear();
            }

            this.#actions.forEach(action => {
                action.activePlugins.clear();
            });
        }

        #handleBlur() {
            this.focused = false;

            for (var plugin of this.#plugins) {
                plugin.clear();
            }

            this.#actions.forEach(action => {
                action.activePlugins.clear();
            });
        }

        #updateActions(generateEvents = true) {
            for (var [actionName, action] of this.#actions) {
                var oldActivePlugins = new Set(action.activePlugins);
                action.activePlugins.clear();

                var noPluginsChanges = true;
                for (var plugin of this.#plugins) {
                    if (plugin.isActionActive(action)) {
                        action.activePlugins.add(plugin.PLUGIN_NAME);

                        if (!oldActivePlugins.has(plugin.PLUGIN_NAME)) {
                            // Первая часть проверки noPluginsChanges: все активные сейчас плагины уже были активны
                            noPluginsChanges = false;
                        }
                    }
                }

                if (noPluginsChanges && oldActivePlugins.size != action.activePlugins.size) {
                    // Вторая часть проверки noPluginsChanges: раньше активных плагинов было не больше чем сейчас
                    noPluginsChanges = false;
                }

                if (noPluginsChanges || !generateEvents || !this.enabled || !this.focused || !action.enabled) {
                    continue;
                }

                if (action.activePlugins.size > 0) {
                    this.#dispatch(this.ACTION_ACTIVATED, actionName, action.activePlugins);
                } else {
                    this.#dispatch(this.ACTION_DEACTIVATED, actionName, oldActivePlugins);
                }
            }
        }

        #dispatch(type, actionName, activePlugins) {
            if (!this.#target || !this.enabled || !this.focused) {
                return;
            }

            var detailPrefix = "";
            for (var activePluginName of activePlugins) {
                detailPrefix += activePluginName + ", ";
            }
            detailPrefix = detailPrefix.slice(0, -2);

            const event = new CustomEvent(type, {
                detail: (detailPrefix ? "(" + (detailPrefix) + ") " : "") + actionName
            });
            this.#target.dispatchEvent(event);
        }

    }

    window.InputController = InputController;
})();
