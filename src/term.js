export default class waTerminal {
    /**
     * Constructor for the terminal, takes one argument which is an object
     * with a terminal, prompt, login, commands members and an init method.
     * @param {object} props the props object
     */
    constructor(props) {
        // If there is a props argument, keep track of it
        if (props !== undefined) {
            this.props = props;
            this.props.terminal = this;
        }
        // The container to append new elements
        this.container = undefined;
        // Log of previous commands
        this.log = [];
        this.logIdx = 0;
        // Props for our input element
        this.workingPrompt = {
            element: undefined,
            input: undefined,
            appended: false
        }
        // Props for our user input element
        this.inputProps = {
            isWaiting: false,
            resolution: undefined
        }
    }

    /**
     * This function initializes the terminal and establishes the DOM
     * object that it will attach to. It doesn't print anythnig yet.
     * @param {DOMElement} dom the DOM element to attach to
     */
    init(dom) {
        this.container = dom;
        // Set up the key handler
        this.container.addEventListener("keydown", (e) => {
            switch(e.key) {
                case "Enter":
                    // Normal command context
                    if (!this.inputProps.isWaiting) {
                        process(this, finalizePrompt(this));
                    // Within command input context
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

    /**
     * Writes the login message (if it's available) and also begins
     * the user prompt. Does not take an arguments.
     */
    login() {
        if (this.props !== undefined && this.props.login !== undefined) {
            this.writeln(this.props.login);
        }
        prompt(this);
    }
    
    /**
     * Writes a line to the terminal. Takes a myriad of different types of
     * arguments: either a string, an array of strings, or an object that has
     * a text and color attribute. 
     */
    /**
     * Writes a line to the terminal. Takes a myriad of different types of 
     * arguments: either a string, an array of strings, or an object that has
     * a text and color attribute
     * @param {string, array, object} line text to write as a line
     */
    writeln(line) {
        if (Array.isArray(line)) {
            for (let i = 0; i < line.length; i++) {
                writeHelper(this, line[i]);
            }
        } else {
            writeHelper(this, line);
        }
    }

    /**
     * Allows functiosn to handle and recieve input from the user while within
     * a function. Should be awaited as it returns a Promise. Argument dictates
     * what the prompt prefix looks like.
     * @param {string} pre the prompt prefix
     */
    input(pre) {
        this.inputProps.isWaiting = true;
        // Set up the prompt
        prompt(this, pre);
        return new Promise((resolve) => {
            this.inputProps.resolution = resolve;
        })
    }
}

// --------------------- "private" members ---------------------

/**
 * This helper processes commands within the context of the provided
 * term instance.
 * @param {waTerminal} term the terminal instance
 * @param {string} command the command to process
 */
async function process(term, command) {
    // Parse the command and split it up 
    let parse = command.split(" ");
    // Do things only if we have commands to process
    if (term.props !== undefined) {
        if (parse[0] in term.props.commands) {
            // Wait for the function to finish. Only useful if the command
            // was an async command
            await term.props.commands[parse[0]].function(command);
        } else {
            term.writeln(command + ": command not found");
        }
    } else {
        term.writeln("This terminal does not have a soul.");
    }
    // After we're done, prompt the user again
    prompt(term);
}

/**
 * Helper method to prompt the user for input. Takes an optional
 * parameter for a special prompt.
 * @param {waTerminal} term the terminal instance
 * @param {string} custom the custom command prompt
 */
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

    // If the prompt hasn't been appended, do that
    if (term.workingPrompt.appended === false) {
        term.container.appendChild(term.workingPrompt.element);
        term.workingPrompt.input.focus();
        term.workingPrompt.appended = true;
    }
}

/**
 * Helper method to disallow input and finalize the text. Will also return
 * the contents of the input box.
 * @param {waTerminal} term the terminal instance
 */
function finalizePrompt(term) {
    let input = "";
    if (term.workingPrompt.element !== undefined) {
        input = term.workingPrompt.input.value;
        // Add to our log of previous commands
        if (input !== "" && !term.inputProps.isWaiting) {
            term.log.push(input);
            term.logIdx = term.log.length;
        }
        term.workingPrompt.input.remove();
        term.workingPrompt.element.innerHTML += input;
        // Reset our values
        term.workingPrompt.element = undefined;
        term.workingPrompt.input = undefined;
        term.workingPrompt.appended = false;
    }
    return input;
}

/**
 * Helper method to handle the different types of inputs the terminal 
 * supports, to make life easier.
 * @param {waTerminal} term the terminal instance
 * @param {*} line the object to write
 */
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
