import bin from "./../src/plugins/bin.js";
import convert from "./../src/plugins/convert.js";
import dec from "./../src/plugins/dec.js";
import help from "./../src/plugins/help.js";
import hex from "./../src/plugins/hex.js";
import math from "./../src/plugins/math.js";
import source from "./../src/plugins/source.js";
import time from "./../src/plugins/time.js";
import Pty from "./pty.js";

describe("plugin tests", () => {
  let pty = new Pty();

  beforeEach(() => {
    pty.terminal.buffer = [];
    pty.commands = {};
  });

  describe("bin", () => {
    bin.function = bin.function.bind(pty);

    test("bin", () => {
      bin.function("bin");
      expect(pty.terminal.buffer[0]).toBe("bin: Not a valid number!");
    });

    test("bin 3", () => {
      bin.function("bin 3");
      expect(pty.terminal.buffer[0]).toBe("0b11");
      expect(pty.terminal.buffer[1]).toBe("Digit count: 2");
    });
  });

  describe("convert", () => {
    convert.function = convert.function.bind(pty);

    test("convert", () => {
      convert.function("convert");
      expect(pty.terminal.buffer[0]).toBe("math.js: not a conversion!");
    });

    test("convert 12degF to degC", () => {
      convert.function("convert 42degF to degC");
      expect(pty.terminal.buffer[0]).toBe("5.5555555555556 degC");
    });

    test("convert eval('#')", () => {
      convert.function("convert eval('#')");
      expect(pty.terminal.buffer[0]).toBe("math.js: not a conversion!");
    });
  });

  describe("dec", () => {
    dec.function = dec.function.bind(pty);

    test("dec", () => {
      dec.function("dec");
      expect(pty.terminal.buffer[0]).toBe("dec: Not a valid base!");
    });

    test("dec 0x10", () => {
      dec.function("dec 0x10");
      expect(pty.terminal.buffer[0]).toBe("16");
    });
  });

  describe("help", () => {
    help.function = help.function.bind(pty);

    test("help", () => {
      help.function("help");
      expect(pty.terminal.buffer[0].includes("jssh")).toBe(true);
    });

    test("help (with arbitrary command)", () => {
      pty.commands.test = {
        description: "test",
        help: ["test"],
        function() {},
      };
      help.function("help");
      let check = pty.terminal.buffer.filter((e) => e.includes("test"));
      expect(check.length).toBe(1);
    });

    test("help test", () => {
      pty.commands.test = {
        description: "test",
        help: ["test"],
        function() {},
      };
      help.function("help test");
      expect(pty.terminal.buffer[0]).toBe("test");
    });
  });

  describe("hex", () => {
    hex.function = hex.function.bind(pty);

    test("hex", () => {
      hex.function("hex");
      expect(pty.terminal.buffer[0]).toBe("hex: Not a valid number!");
    });

    test("hex 10 0", () => {
      hex.function("hex 10 0");
      expect(pty.terminal.buffer[0]).toBe(
        "hex: Actual digit count exceeds desired!"
      );
    });

    test("hex 10", () => {
      hex.function("hex 10");
      expect(pty.terminal.buffer[0]).toBe("0xA");
    });
  });

  describe("math", () => {
    math.function = math.function.bind(pty);

    test("math ", () => {
      math.function("math ");
      expect(pty.terminal.buffer[0]).toBe("math.js: not math!");
    });

    test("math (12 + 23) * 20 / 5", () => {
      math.function("math (12 + 23) * 20 / 5");
      expect(pty.terminal.buffer[0]).toBe("140");
    });
  });

  describe("source", () => {
    source.function = source.function.bind(pty);

    test("source", () => {
      source.function("source");
      expect(pty.terminal.buffer[0].includes("github.com")).toBe(true);
    });
  });

  describe("time", () => {
    time.function = time.function.bind(pty);

    test("time", () => {
      time.function("time");
      expect(pty.terminal.buffer[0].includes("Time")).toBe(true);
    });
  });
});
