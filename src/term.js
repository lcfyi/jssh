import History from "./history.js";
import utils from "./utils.js";

const INPUT_INLINE_STYLES = "z-index: 100;";
const GHOST_INLINE_STYLES = "color: gray; pointer-events: none;";

export default class Terminal {
  /**
   * Constructor for the terminal, takes one argument which is an object
   * with a terminal, prompt, login, commands members and an init method.
   * @param {object} props the props object
   */
  constructor(props) {
    // If there is a props argument, keep track of it
    if (props) {
      this.props = props;
      this.props.terminal = this;
    }
    // The container to append new elements
    this.container = null;
    // Log of previous commands
    this.history = new History();
    // Props for our input element
    this.workingPrompt = {
      element: null,
      ghost: null,
      input: null,
    };
    // Props for our user input element
    this.inputProps = {
      isWaiting: false,
      resolution: null,
      rejection: null,
    };
  }

  /**
   * This function initializes the terminal and establishes the DOM
   * object that it will attach to. It doesn't print anything yet.
   * @param {DOMElement} dom the DOM element to attach to
   */
  init(dom) {
    this.container = dom;
    // Set up the key handler
    this.container.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "c":
          if (e.ctrlKey && e.target.selectionStart === e.target.selectionEnd) {
            if (this.inputProps.isWaiting) {
              // Within this context, we can just reject since
              // the handler will call prompt(terminal) for us
              finalizePrompt(this);
              this.inputProps.rejection("exited.");
              // Reset the values
              this.inputProps.isWaiting = false;
              this.inputProps.resolution = null;
              this.inputProps.rejection = null;
            } else {
              // Behave like a real terminal; ctrl+c to go next
              finalizePrompt(this);
              prompt(this);
            }
          }
          break;
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
            this.inputProps.resolution = null;
            this.inputProps.rejection = null;
          }
          // Reset to the bottom of the stack
          this.history.resetIndex();
          break;
        case "ArrowUp":
          if (!this.inputProps.isWaiting) {
            this.workingPrompt.input.value = this.history.arrowUp();
          }
          e.preventDefault();
          break;
        case "ArrowDown":
          if (!this.inputProps.isWaiting) {
            this.workingPrompt.input.value = this.history.arrowDown();
          }
          e.preventDefault();
          break;
        case "ArrowRight":
          if (this.workingPrompt.input) {
            let value = this.workingPrompt.input.value;
            let start = this.workingPrompt.input.selectionStart;
            let end = this.workingPrompt.input.selectionEnd;

            if (start === end && end == value.length) {
              // Emulate zsh-autosuggestion behaviour where we'll fill in the ghost
              this.workingPrompt.input.value = this.workingPrompt.ghost.value;
            }
          }
          break;
        case "Tab":
          if (this.workingPrompt.input) {
            let value = this.workingPrompt.input.value;
            let start = this.workingPrompt.input.selectionStart;
            let end = this.workingPrompt.input.selectionEnd;

            this.workingPrompt.input.value =
              value.slice(0, start) + "  " + value.slice(end);
            this.workingPrompt.input.selectionStart = start + 2;
            this.workingPrompt.input.selectionEnd = start + 2;
          }
          e.preventDefault();
          break;
        default:
        // Nothing
      }
    });
    // // For events that need to be committed
    this.container.addEventListener("keyup", (e) => {
      if (this.workingPrompt.input && this.workingPrompt.ghost) {
        if (this.workingPrompt.input.value) {
          let found = false;
          // TODO make this more efficient with a trie so we don't have to scan
          // the entire history every time
          for (let i = this.history.history.length - 1; i >= 0; i--) {
            if (
              this.history.history[i].startsWith(this.workingPrompt.input.value)
            ) {
              this.workingPrompt.ghost.value = this.history.history[i];
              found = true;
              break;
            }
          }
          if (!found) {
            this.workingPrompt.ghost.value = "";
          }
        } else {
          // Empty text, no suggestions
          this.workingPrompt.ghost.value = "";
        }
      }
    });
    // Set up the click handler
    this.container.addEventListener("click", (e) => {
      if (
        window.getSelection().toString() === "" &&
        this.workingPrompt.input &&
        !e.target.href
      ) {
        this.workingPrompt.input.focus();
      }
    });
    // Set up a handler to resize the text input
    window.addEventListener("resize", () => {
      setInputStyling(
        this.workingPrompt.element,
        this.workingPrompt.input,
        INPUT_INLINE_STYLES
      );
      setInputStyling(
        this.workingPrompt.element,
        this.workingPrompt.ghost,
        GHOST_INLINE_STYLES
      );
    });
  }

  /**
   * Writes the login message (if it's available) and also begins
   * the user prompt. Does not take an arguments.
   */
  login() {
    if (this.props && this.props.login) {
      this.writeln(this.props.login);
    }
    prompt(this);
  }

  /**
   * Writes a line to the terminal. Takes a myriad of different types of
   * arguments: either a string, an array of strings, or an object that has
   * a text and color attribute
   * @param {string, array, object} line text to write as a line
   * @param {Boolean} safe whether string needs sanitization
   */
  writeln(line, safe) {
    if (Array.isArray(line)) {
      line.forEach((subline) => {
        this.writeln(subline, safe);
      });
    } else {
      writeHelper(this, line, safe);
    }
  }

  /**
   * Allows functions to handle and recieve input from the user while within
   * a function. Should be awaited as it returns a Promise. Argument dictates
   * what the prompt prefix looks like.
   * @param {string} pre the prompt prefix
   */
  input(pre) {
    this.inputProps.isWaiting = true;
    // Set up the prompt
    if (!pre) {
      prompt(this, wrap("> "));
    } else {
      prompt(this, wrap(pre));
    }
    return new Promise((resolve, reject) => {
      this.inputProps.resolution = resolve;
      this.inputProps.rejection = reject;
    });
  }
}

// --------------------- "private" members ---------------------

/**
 * This helper processes commands within the context of the provided
 * term instance.
 * @param {Terminal} term the terminal instance
 * @param {string} command the command to process
 */
async function process(term, command) {
  // Parse the command and split it up
  let parse = command.split(" ");
  // Do things only if we have commands to process
  if (term.props) {
    if (parse[0] in term.props.commands) {
      // Wait for the function to finish. Only useful if the command
      // was an async command
      try {
        await term.props.commands[parse[0]].function(command);
      } catch (e) {
        term.writeln(`${command.split(" ")[0]}: ${e.message ? e.message : e}`);
      }
    } else if (parse[0]) {
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
 * @param {Terminal} term the terminal instance
 * @param {string} custom the custom command prompt
 */
function prompt(term, custom) {
  if (!term.workingPrompt.element) {
    term.workingPrompt.element = document.createElement("pre");
    // Using innerHTML to support styling easier
    if (custom) {
      term.workingPrompt.element.innerHTML += custom;
    } else if (term.props) {
      term.workingPrompt.element.innerHTML += term.props.prompt;
    } else {
      term.workingPrompt.element.innerHTML += wrap("> ");
    }
  }
  term.workingPrompt.input = document.createElement("input");
  term.workingPrompt.input.setAttribute("type", "text");
  term.workingPrompt.input.setAttribute("autocorrect", "off");
  term.workingPrompt.input.setAttribute("autocomplete", "off");
  term.workingPrompt.input.setAttribute("autocapitalize", "off");
  term.workingPrompt.input.setAttribute("spellcheck", "false");
  term.workingPrompt.input.setAttribute("name", Math.random().toString(36));
  term.container.appendChild(term.workingPrompt.element);
  setInputStyling(
    term.workingPrompt.element,
    term.workingPrompt.input,
    INPUT_INLINE_STYLES
  );
  term.workingPrompt.ghost = document.createElement("input");
  setInputStyling(
    term.workingPrompt.element,
    term.workingPrompt.ghost,
    GHOST_INLINE_STYLES
  );
  term.workingPrompt.element.appendChild(term.workingPrompt.input);
  term.workingPrompt.element.appendChild(term.workingPrompt.ghost);
  term.workingPrompt.input.focus();
}

/**
 * Helper method to disallow input and finalize the text. Will also return
 * the contents of the input box.
 * @param {Terminal} term the terminal instance
 */
function finalizePrompt(term) {
  let input = "";
  if (term.workingPrompt.element) {
    input = term.workingPrompt.input.value;
    // Add to our log of previous commands
    if (input && !term.inputProps.isWaiting) {
      term.history.pushItem(input);
    }
    term.workingPrompt.input.remove();
    term.workingPrompt.element.innerHTML += utils.sanitize(input);
    // Reset our values
    term.workingPrompt.element = null;
    term.workingPrompt.input = null;
  }
  return input;
}

/**
 * Helper method to handle the different types of inputs the terminal
 * supports, to make life easier.
 * @param {Terminal} term the terminal instance
 * @param {*} line the object to write
 * @param {Boolean} safe whether this should be sanitized
 */
function writeHelper(term, line, safe) {
  try {
    // If the string is empty, add a space so it gets printed
    let e = line ? line : " ";
    let pre = document.createElement("pre");
    if (e.text && e.color) {
      pre.setAttribute("style", "color:" + e.color);
      pre.innerHTML = safe ? e.text : utils.sanitize(e.text);
    } else {
      pre.setAttribute("style", "color:white");
      pre.innerHTML = safe ? e : utils.sanitize(e);
    }
    term.container.insertBefore(pre, term.workingPrompt.element);
    // Scroll the element into view
    pre.scrollIntoView();
    if (term.workingPrompt.input) {
      term.workingPrompt.input.blur();
      term.workingPrompt.input.focus();
    }
  } catch (e) {
    console.error("[TERM] Write line failed.");
  }
}

function computeChildWidth(parent) {
  let width = 10;
  for (let i = 0; i < parent.children.length; i++) {
    if (parent.children[i].nodeName === "INPUT") {
      continue;
    }
    width += parent.children[i].offsetWidth;
  }
  return width;
}

function setInputStyling(preamble, input, styling = "") {
  if (input && preamble) {
    let promptWidth = computeChildWidth(input);
    input.setAttribute(
      "style",
      `width: ${preamble.offsetWidth * 0.9 -
        promptWidth}px; position: absolute; ${styling}`
    );
  }
}

function wrap(raw) {
  return "<span>" + raw + "</span>";
}
