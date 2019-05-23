import bin from './../src/plugins/bin.js';
import convert from './../src/plugins/convert.js';
import dec from './../src/plugins/dec.js';
import help from './../src/plugins/help.js';
import hex from './../src/plugins/hex.js';
import ipinfo from './../src/plugins/ipinfo.js';
import math from './../src/plugins/math.js';
import source from './../src/plugins/source.js';
import special from './../src/plugins/special.js';
import time from './../src/plugins/time.js';
import pty from './pty.js';

describe("bin", () => {
    test("bin", () => {
        bin.parent = new pty;
        bin.function("bin");
        expect(bin.parent.buffer[0]).toBe("hex: Not a valid number!");
    });
    
    test("bin 3", () => {
        bin.parent = new pty;
        bin.function("bin 3");
        expect(bin.parent.buffer[0]).toBe("0b11");
        expect(bin.parent.buffer[1]).toBe("Digit count: 2");
    });
});

describe("convert", () => {
    test("convert", () => {
        convert.parent = new pty;
        convert.function("convert");
        expect(convert.parent.buffer[0]).toBe("math.js: not a conversion!");
    });
    
    test("convert 12degF to degC", () => {
        convert.parent = new pty;
        convert.function("convert 42degF to degC");
        expect(convert.parent.buffer[0]).toBe("5.5555555555556 degC");
    });
    
    test("convert eval('#')", () => {
        convert.parent = new pty;
        convert.function("convert eval('#')");
        expect(convert.parent.buffer[0]).toBe("math.js: not a conversion!");
    });
});

describe("dec", () => {
    test("dec", () => {
        dec.parent = new pty;
        dec.function("dec");
        expect(dec.parent.buffer[0]).toBe("dec: Not a valid base!");
    });
    
    test("dec 0x10", () => {
        dec.parent = new pty;
        dec.function("dec 0x10");
        expect(dec.parent.buffer[0]).toBe("16");
    });
});

describe("help", () => {
    test("help", () => {
        help.parent = new pty;
        help.function("help");
        expect(help.parent.buffer[0].includes("wa-bash")).toBe(true);
    });
    
    test("help (with arbitrary command)", () => {
        help.parent = new pty;
        help.parent.commands.test = {
            description: "test",
            help: [
                "test",
            ],
            function(e) {}
        };
        help.function("help");
        let check = help.parent.buffer.filter(e => e.includes("test"));
        expect(check.length).toBe(1);
    });
    
    test("help test", () => {
        help.parent = new pty;
        help.parent.commands.test = {
            description: "test",
            help: [
                "test",
            ],
            function(e) {}
        };
        help.function("help test");
        expect(help.parent.buffer[0]).toBe("test");
    });
});

describe("hex", () => {
    test("hex", () => {
        hex.parent = new pty;
        hex.function("hex");
        expect(hex.parent.buffer[0]).toBe("hex: Not a valid number!");
    });
    
    test("hex 10 0", () => {
        hex.parent = new pty;
        hex.function("hex 10 0");
        expect(hex.parent.buffer[0]).toBe("hex: Actual digit count exceeds desired!");
    });
    
    test("hex 10", () => {
        hex.parent = new pty;
        hex.function("hex 10");
        expect(hex.parent.buffer[0]).toBe("0xA");
    });
});

// x prefix skips the test
describe("ipinfo", () => {
    test("ipinfo", () => {
        ipinfo.parent = new pty;
        ipinfo.function("ipinfo");
        expect(ipinfo.parent.buffer[0]).toBe("You must specify a hostname!");
    });
    
    xtest("ipinfo 127.0.0.1", () => {
        ipinfo.parent = new pty;
        ipinfo.function("ipinfo 127.0.0.1");
        let check = ipinfo.parent.buffer.filter(e => e.includes("localhost"));
        expect(check.length).toBe(1);
    });
});

describe("math", () => {
    test("math ", () => {
        math.parent = new pty;
        math.function("math ");
        expect(math.parent.buffer[0]).toBe("math.js: not math!");
    });
    
    test("math (12 + 23) * 20 / 5", () => {
        math.parent = new pty;
        math.function("math (12 + 23) * 20 / 5");
        expect(math.parent.buffer[0]).toBe("140");
    });
    
    test("math eval('#')", () => {
        math.parent = new pty;
        math.function("math eval('#')");
        expect(math.parent.buffer[0]).toBe("math.js: not math!");
    });
});

describe("source", () => {
    test("source", () => {
        source.parent = new pty;
        source.function("source");
        expect(source.parent.buffer[0].includes("github.com")).toBe(true);
    });
});

describe("time", () => {
    test("time", () => {
        time.parent = new pty;
        time.function("time");
        expect(time.parent.buffer[0].includes("Time")).toBe(true);
    });
});
