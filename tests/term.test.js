import Terminal from "./../src/term.js";

describe("init()", () => {
  test("Has a dom element, with props", () => {
    let props = { terminal: null };
    let term = new Terminal(props);
    let dom = document.createElement("test");
    term.init(dom);
    expect(term.container).toBe(dom);
    dom.remove();
  });

  test("Has a dom element, no props", () => {
    let term = new Terminal();
    let dom = document.createElement("test");
    term.init(dom);
    expect(term.container).toBe(dom);
    dom.remove();
  });
});

describe("login()", () => {
  test("Has props with a login", () => {
    let props = { terminal: null, login: "test", prompt: ">" };
    let dom = document.createElement("test");
    let term = new Terminal(props);
    term.container = dom; // Bypass the init() function to set the container
    term.login();
    expect(dom.childElementCount).toBe(2);
    dom.remove();
  });

  test("Has props with no login or prompt", () => {
    let props = { terminal: null };
    let dom = document.createElement("test");
    let term = new Terminal(props);
    term.container = dom; // Bypass the init() function to set the container
    term.login();
    expect(dom.childElementCount).toBe(1);
    dom.remove();
  });

  test("Does not have props", () => {
    let dom = document.createElement("test");
    let term = new Terminal();
    term.container = dom; // Bypass the init() function to set the container
    term.login();
    expect(dom.childElementCount).toBe(1);
    dom.remove();
  });
});

describe("writeln()", () => {
  test("Regular string", () => {
    let words = "test string";
    let dom = document.createElement("test");
    let term = new Terminal();
    term.init(dom); // Use the init function to see if it works
    term.writeln(words);
    expect(dom.childElementCount).toBe(1);
    expect(dom.childNodes[0].textContent).toBe("test string");
    dom.remove();
  });

  test("Regular string with styling", () => {
    let words = { text: "test string", color: "red" };
    let dom = document.createElement("test");
    let term = new Terminal();
    term.init(dom); // Same as above
    term.writeln(words);
    expect(dom.childElementCount).toBe(1);
    expect(dom.childNodes[0].textContent).toBe("test string");
    expect(dom.childNodes[0].style.color).toBe("red");
    dom.remove();
  });

  test("Array of strings", () => {
    let words = ["test", "string"];
    let dom = document.createElement("test");
    let term = new Terminal();
    term.init(dom); // Same as above
    term.writeln(words);
    expect(dom.childElementCount).toBe(2);
    expect(dom.childNodes[0].textContent).toBe("test");
    expect(dom.childNodes[1].textContent).toBe("string");
    dom.remove();
  });

  test("Array of strings with styling", () => {
    let words = [
      { text: "test", color: "red" },
      { text: "string", color: "blue" }
    ];
    let dom = document.createElement("test");
    let term = new Terminal();
    term.init(dom); // Same as above
    term.writeln(words);
    expect(dom.childElementCount).toBe(2);
    expect(dom.childNodes[0].textContent).toBe("test");
    expect(dom.childNodes[0].style.color).toBe("red");
    expect(dom.childNodes[1].textContent).toBe("string");
    expect(dom.childNodes[1].style.color).toBe("blue");
    dom.remove();
  });

  test ("Null write", () => {
    let words = null;
    let dom = document.createElement("test");
    let term = new Terminal();
    term.init(dom); // Use the init function to see if it works
    term.writeln(words);
    expect(dom.childElementCount).toBe(1);
    dom.remove();
  });
});

describe("input()", () => {
  test("Simple input, no props", () => {
    let dom = document.createElement("test");
    let term = new Terminal();
    term.init(dom);
    // Shouldn't have anything at this point
    expect(dom.childElementCount).toBe(0);
    expect(term.inputProps.isWaiting).toBe(false);
    expect(term.inputProps.resolution).toBe(null);
    let val = term.input();
    term.inputProps.resolution("test");
    val.then(e => expect(e).toBe("test"));
  });

  test("Simple input 2, no props", () => {
    let dom = document.createElement("test");
    let term = new Terminal();
    term.init(dom);
    let val = term.input();
    term.inputProps.resolution("");
    val.then(e => expect(e).toBe(""));
  });
});

// TODO input events
// describe("Input events", () => {
//     test("Keyhandler event listener", () => {
//         // Test Enter, should finialize the prompt
//         // Test ArrowUp, go up a command
//         // Test ArrowDown, go down a command
//         // Test Tab, should do nothing
//     });

//     test("Click event listener", () => {
//         // Check the focus, should focus on the text object
//         let dom = document.createElement("test");
//         let term = new Terminal();
//         term.init(dom); // Potentially bad since we might want to seperate setup of click
//         term.login(); // Should have focus at this point
//         expect(term.workingPrompt.input === document.activeElement).toBe(true);
//         term.workingPrompt.input.blur();
//         expect(term.workingPrompt.input !== document.activeElement).toBe(true);
//         getEventListeners(document.getElementById("test")).click[0].listener.apply(term);
//         expect(term.workingPrompt.input === document.activeElement).toBe(true);
//         dom.remove();
//     });
// });

// TODO async function input
