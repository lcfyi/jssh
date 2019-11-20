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
    this.log = [];
    this.logIdx = 0;
    // Props for our input element
    this.workingPrompt = {
      element: null,
      input: null
    };
    // Props for our user input element
    this.inputProps = {
      isWaiting: false,
      resolution: null
    };
  }

  /**
   * This function initializes the terminal and establishes the DOM
   * object that it will attach to. It doesn't print anythnig yet.
   * @param {DOMElement} dom the DOM element to attach to
   */
  init(dom) {
    this.container = dom;
    // Set up the key handler
    this.container.addEventListener("keydown", e => {
      switch (e.key) {
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
          }
          // Reset to the bottom of the stack
          this.logIdx = this.log.length;
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
    this.container.addEventListener("click", () => {
      if (window.getSelection().toString() === "" && this.workingPrompt.input) {
        this.workingPrompt.input.focus();
      }
    });
    // Set up a handler to resize the text input
    window.addEventListener("resize", () => {
      if (this.workingPrompt.input) {
        let promptWidth = computeChildWidth(this.workingPrompt.element);
        this.workingPrompt.input.setAttribute(
          "style",
          "width: " +
            (this.workingPrompt.element.offsetWidth * 0.9 - promptWidth) +
            "px"
        );
      }
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
   */
  writeln(line) {
    if (line) {
      if (Array.isArray(line)) {
        for (let i = 0; i < line.length; i++) {
          writeHelper(this, line[i]);
        }
      } else {
        writeHelper(this, line);
      }
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
    if (!pre) {
      prompt(this, wrapA("> "));
    } else {
      prompt(this, wrapA(pre));
    }
    return new Promise(resolve => {
      this.inputProps.resolution = resolve;
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
      await term.props.commands[parse[0]].function(command);
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
      term.workingPrompt.element.innerHTML += wrapA("> ");
    }
  }
  term.workingPrompt.input = document.createElement("input");
  term.workingPrompt.input.setAttribute("autocorrect", "off");
  term.workingPrompt.input.setAttribute("autocomplete", "off");
  term.workingPrompt.input.setAttribute("autocapitalize", "off");
  term.workingPrompt.input.setAttribute("spellcheck", "false");
  term.container.appendChild(term.workingPrompt.element);
  let promptWidth = computeChildWidth(term.workingPrompt.element);
  term.workingPrompt.input.setAttribute(
    "style",
    "width: " +
      (term.workingPrompt.element.offsetWidth * 0.9 - promptWidth) +
      "px"
  );
  term.workingPrompt.element.appendChild(term.workingPrompt.input);
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
      term.log.push(input);
      term.logIdx = term.log.length;
    }
    term.workingPrompt.input.remove();
    term.workingPrompt.element.innerHTML += sanitize(input);
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
 */
function writeHelper(term, line) {
  // If the string is empty, add a space so it gets printed
  let e = line === "" ? " " : line;
  let pre = document.createElement("pre");
  if (e.text && e.color) {
    pre.setAttribute("style", "color:" + e.color);
    pre.innerHTML = sanitize(e.text);
  } else {
    pre.setAttribute("style", "color:white");
    pre.innerHTML = sanitize(e);
  }
  term.container.insertBefore(pre, term.workingPrompt.element);
  if (term.workingPrompt.input) {
    term.workingPrompt.input.blur();
    term.workingPrompt.input.focus();
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

function wrapA(raw) {
  return "<a>" + raw + "</a>";
}

function sanitize(input) {
  if (!input || !input.includes("<")) {
    return input;
  }
  let whitelist = ["span>", "a>", "span ", "a ", "/span>", "/a>"];
  let fragments = input.split("<");
  let output = "";
  fragments.forEach(fragment => {
    if (fragment) {
      let keep = false;
      for (let i = 0; i < whitelist.length; i++) {
        if (fragment.startsWith(whitelist[i])) {
          keep = true;
          break;
        }
      }
      if (keep) {
        output += "<" + fragment;
      } else {
        output += "&lt;" + fragment;
      }
    }
  });
  return output;
}
