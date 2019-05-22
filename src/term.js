export default class waTerminal {
    constructor(props) {
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
        }
        this.inputProps = {
            isWaiting: false,
            resolution: undefined
        }
    }


    init(dom) {
        this.container = dom;
        // Set up the key handler
        this.container.addEventListener("keydown", (e) => {
            switch(e.key) {
                case "Enter":
                    if (!this.inputProps.isWaiting) {
                        process(this, finalizePrompt(this));
                    } else {
                        let value = finalizePrompt(this);
                        this.inputProps.resolution(value);
                        // Reset the values
                        this.inputProps.isWaiting = false;
                        this.inputProps.resolution = undefined;
                    }
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
        });
        // Set up the click handler
        this.container.addEventListener("click", (e) => {
            if(window.getSelection().toString() === "" 
                && this.workingPrompt.input !== undefined) {
                this.workingPrompt.input.focus();
            }
        });
        // Set up a handler to resize the text input
        window.addEventListener("resize", () => {
            if (this.workingPrompt.input !== undefined) {
                this.workingPrompt.input.setAttribute("style", "width: " + (window.innerWidth * 0.90 - 117) + "px");
            }
        });
    }

    login() {
        if (this.props !== undefined && this.props.login !== undefined) {
            this.writeln(this.props.login);
        }
        prompt(this);
    }
    
    writeln(line) {
        if (Array.isArray(line)) {
            for (let i = 0; i < line.length; i++) {
                writeHelper(this, line[i]);
            }
        } else {
            writeHelper(this, line);
        }
    }

    input(pre) {
        this.inputProps.isWaiting = true;
        // Set up the prompt
        prompt(this, pre);
        return new Promise((resolve) => {
            this.inputProps.resolution = resolve;
        })
    }
}

// Private members, not visible to anything external to this file
async function process(term, command) {
    let cmd = command;
    let parse = cmd.split(" ");
    if (term.props !== undefined) {
        if (parse[0] in term.props.commands) {
            await term.props.commands[parse[0]].function(cmd);
        } else {
            term.writeln(cmd + ": command not found");
        }
    } else {
        term.writeln("This terminal does not have a soul.");
    }
    prompt(term);
}

function prompt(term, custom) {
    if (term.workingPrompt.element === undefined) {
        term.workingPrompt.element = document.createElement("pre");
        // Using innerHTML to support styling easier
        // This isn't public so it should be safe enough
        if (custom === undefined && term.props !== undefined) {
            term.workingPrompt.element.innerHTML += term.props.prompt;
        } else {
            term.workingPrompt.element.innerHTML += custom;
        }
        term.workingPrompt.input = document.createElement("input");
        term.workingPrompt.input.setAttribute("autocorrect", "off");
        term.workingPrompt.input.setAttribute("autocomplete", "off");
        term.workingPrompt.input.setAttribute("autocapitalize", "off");
        term.workingPrompt.input.setAttribute("spellcheck", "false");
        term.workingPrompt.element.appendChild(term.workingPrompt.input);
    }

    if (term.workingPrompt.appended === false) {
        term.container.appendChild(term.workingPrompt.element);
        term.workingPrompt.input.focus();
        term.workingPrompt.appended = true;
    }
}

function finalizePrompt(term) {
    let input = "";
    if (term.workingPrompt.element !== undefined) {
        input = term.workingPrompt.input.value;
        if (input !== "") {
            term.log.push(input);
            term.logIdx = term.log.length;
        }
        term.workingPrompt.input.remove();
        term.workingPrompt.element.innerHTML += input;
        term.workingPrompt.element = undefined;
        term.workingPrompt.input = undefined;
        term.workingPrompt.appended = false;
    }
    return input;
}

function writeHelper(term, line) {
    if (term.workingPrompt.element !== undefined) {
        finalizePrompt(term);
    }
    // If the string is empty, add a space so it gets printed
    var e = (line === "") ? " " : line;
    let pre = document.createElement("pre");
    if (e.text !== undefined && e.color !== undefined) {
        pre.setAttribute("style", "color:" + e.color);
        pre.innerHTML = e.text;
    } else {
        pre.setAttribute("style", "color:white");
        pre.innerHTML = e;
    }
    term.container.appendChild(pre);
}