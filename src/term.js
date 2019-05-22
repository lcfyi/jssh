/**
 * Our terminal prototype. It supports init, login, and writeln.
 */
export default function waTerminal(props) {
    if (props !== undefined) {
        this.props = props;
        this.props.terminal = this;
    }
    this.container = undefined;
    this.log = [];
    this.logIdx = 0;
    this.workingPrompt = {
        element: undefined,
        input: undefined,
        appended: false
    };

    /**
     * Helper functions.
     */
    this.helpers = {
        /**
         * Open up this terminal, it takes the element to append
         * all prints to, and sets up the key and click listeners.
         */
        open: (e) => {
            this.container = e;
            this.container.addEventListener("keydown", this.helpers.keyHandler);
            this.container.addEventListener("click", (e) => {
                if (this.workingPrompt.input !== undefined) {
                    this.workingPrompt.input.focus();
                }
            });
        },
        /**
         * Process a particular command, based on the props passed in.
         */
        process: (e) => {
            let cmd = e;
            let parse = cmd.split(" ");
            if (this.props !== undefined) {
                if (parse[0] in this.props.commands) {
                    this.props.commands[parse[0]].function(cmd);
                } else {
                    this.props.terminal.writeln(cmd + ": command not found");
                }
            } else {
                this.helpers.writeln("This terminal does not have a soul.");
            }
            
        },
        /**
         * Prompts the user, either with a custom command or the one
         * specified in props.prompt.
         */
        prompt: (e) => {
            if (this.workingPrompt.element === undefined) {
                this.workingPrompt.element = document.createElement("pre");
                // Using innerHTML here just so we can support styling.
                // This shouldn't ever be called by the user so it should be safe.
                if (e === undefined && this.props !== undefined) {
                    this.workingPrompt.element.innerHTML += this.props.prompt;
                } else {
                    this.workingPrompt.element.innerHTML += "> ";
                }
                this.workingPrompt.input = document.createElement("input");
                this.workingPrompt.input.setAttribute("autocorrect", "off");
                this.workingPrompt.input.setAttribute("autocomplete", "off");
                this.workingPrompt.input.setAttribute("autocapitalize", "off");
                this.workingPrompt.input.setAttribute("spellcheck", "false");
                this.workingPrompt.input.setAttribute("style", "width: " + (window.innerWidth * 0.90 - 117) + "px");
                this.workingPrompt.element.appendChild(this.workingPrompt.input);
            }
            if (this.workingPrompt.appended === false) {
                this.container.appendChild(this.workingPrompt.element);
                this.workingPrompt.input.focus();
                this.workingPrompt.appended = true;
            }
        },
        /**
         * Finalizes the prompt by removing the input and resetting
         * the working prompt.
         */
        finalizePrompt: (e) => {
            let input = "";
            if (this.workingPrompt.element !== undefined) {
                input = this.workingPrompt.input.value;
                if (input !== "") {
                    this.log.push(input);
                    this.logIdx = this.log.length;
                }
                this.workingPrompt.input.remove();
                this.workingPrompt.element.innerHTML += input;
                this.workingPrompt.element = undefined;
                this.workingPrompt.input = undefined;
                this.workingPrompt.appended = false;
            }
            return input;
        },
        /**
         * Handle keypresses.
         */
        keyHandler: (e) => {
            switch(e.key) {
                case "Enter":
                    this.helpers.process(this.helpers.finalizePrompt());
                    this.helpers.prompt();
                    break;
                case "ArrowUp":
                    if (this.logIdx > 0) {
                        this.logIdx--;
                        this.workingPrompt.input.value = this.log[this.logIdx];
                    }
                    e.preventDefault();
                    break;
                case "ArrowDown":
                    if (this.logIdx < this.log.length - 1) {
                        this.logIdx++;
                        this.workingPrompt.input.value = this.log[this.logIdx];
                    } else {
                        this.workingPrompt.input.value = "";
                    }
                    e.preventDefault();
                    break;
                case "Tab":
                    // We prevent the tab key from doing anything
                    e.preventDefault();
                    break;
                default:
                    // Nothing
            }
        },
        /**
         * Helper for our writeln function that sets style if it's
         * an array (second arg is color), otherwise just prints it.
         */
        writeln: (e) => {
            if (this.workingPrompt.element !== undefined) {
                this.helpers.finalizePrompt();
            }
            // If the string is empty, add a space just so we print a line
            if (e === "") {
                var e = " ";
            }
            let pre = document.createElement("pre");
            if (Array.isArray(e)) {
                pre.setAttribute("style", "color: " + e[1]);
                pre.innerHTML = e[0];
            } else {
                pre.setAttribute("style", "color: white");
                pre.innerHTML = e;
            }
            this.container.appendChild(pre);
        }
    }

    /**
     * Initialize this terminal by giving it an element to attach to.
     */
    this.init = (e) => {
        this.helpers.open(e);
        window.addEventListener("resize", () => {
            if (this.workingPrompt.input !== undefined) {
                this.workingPrompt.input.setAttribute("style", "width: " + (window.innerWidth * 0.90 - 117) + "px");
            }
        })
    }

    /**
     * Writes the login prompt as described by props.login, and starts
     * the prompt for the user.
     */
    this.login = () => {
        if (this.props !== undefined && this.props.login !== undefined) {
            this.writeln(this.props.login);
        }
        this.helpers.prompt();
    }

    /**
     * User-facing function to write the argument to the terminal.
     * If it's an array, we'll print each element in turn. Otherwise 
     * we print the object.
     */
    this.writeln = (e) => {
        if (Array.isArray(e)) {
            for (let i = 0; i < e.length; i++) {
                this.helpers.writeln(e[i]);
            }
        } else {
            this.helpers.writeln(e);
        }
    }
}
