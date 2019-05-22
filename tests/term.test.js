import Terminal from './../src/term.js';

describe("init()", () => {
    test("Has a dom element, with props", () => {
        let props = {terminal: undefined};
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
        let props = {terminal: undefined, login: "test", prompt: ">"};
        let dom = document.createElement("test");
        let term = new Terminal(props);
        term.container = dom; // Bypass the init() function to set the container
        term.login();
        expect(dom.childElementCount).toBe(2);
        dom.remove();
    });

    test("Has props with no login or prompt", () => {
        let props = {terminal: undefined};
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
        
    });

    test("Regular string with styling", () => {

    });

    test("Array of strings", () => {

    });

    test("Array of strings with styling", () => {

    });
});

describe("Input events", () => {
    test("Keyhandler event listener", () => {
        // Test Enter, should finialize the prompt
        // Test ArrowUp, go up a command
        // Test ArrowDown, go down a command
        // Test Tab, should do nothing
    });

    test("Click event listener", () => {
        // Check the focus, should 
    });
});