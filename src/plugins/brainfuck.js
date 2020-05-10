const MAX_BYTE_SIZE = 255;
const WHILE_GUARD = 1000000;

const brainfuck = {
  description: "Brainfuck Interpreter",
  help: [
    "Usage",
    "",
    "brainfuck [code]",
    "Simple brainfuck interpreter. It uses byte-sized memory addresses,",
    "has infinite memory, and will not wrap around.",
    "",
    "Note that if your program takes too long, the interpreter will exit.",
    "",
    "Examples",
    "",
    "Hello World",
    "+[-[<<[+[--->]-[<<<]]]>>>-]>-.---.>..>.<<<<-.<+.>>>>>.>.<<.<-.",
    "",
    "Fibonacci",
    "+++++++++++",
    ">+>>>>++++++++++++++++++++++++++++++++++++++++++++",
    ">++++++++++++++++++++++++++++++++<<<<<<[>[>>>>>>+>",
    "+<<<<<<<-]>>>>>>>[<<<<<<<+>>>>>>>-]<[>++++++++++[-",
    "<-[>>+>+<<<-]>>>[<<<+>>>-]+<[>[-]<[-]]>[<<[>>>+<<<",
    "-]>>[-]]<<]>>>[>>+>+<<<-]>>>[<<<+>>>-]+<[>[-]<[-]]",
    ">[<<+>>[-]]<<<<<<<]>>>>>[+++++++++++++++++++++++++",
    "+++++++++++++++++++++++.[-]]++++++++++<[->-<]>++++",
    "++++++++++++++++++++++++++++++++++++++++++++.[-]<<",
    "<<<<<<<<<<[>>>+>+<<<<-]>>>>[<<<<+>>>>-]<-[>>.>.<<<",
    "[-]]<<[>>+>+<<<-]>>>[<<<+>>>-]<<[<+>-]>[<+>-]<<<-]",
  ],
  async function(e) {
    // We use a proxy to return 0 on undefined elements of the array
    let data = new Proxy([], {
      get: (target, property) => (target[property] ? target[property] : 0),
    });
    let instructions = e.slice("brainfuck".length);

    let ip = 0;
    let dp = 0;
    let printBuffer = [];

    let guardCheck = ((max) => {
      let guard = 0;
      return {
        increment: () => guard++,
        check: () => {
          if (guard > max) throw new Error("Interpreter timed out.");
        },
      };
    })(WHILE_GUARD);

    while (ip < instructions.length) {
      guardCheck.check();
      switch (instructions[ip]) {
        case ">":
          dp++;
          break;
        case "<":
          dp > 0 ? dp-- : undefined;
          break;
        case "+":
          data[dp] = data[dp] === MAX_BYTE_SIZE ? 0 : data[dp] + 1;
          break;
        case "-":
          data[dp] = data[dp] === 0 ? MAX_BYTE_SIZE : data[dp] - 1;
          break;
        case ".":
          printBuffer.push(String.fromCharCode(data[dp]));
          break;
        case ",":
          if (printBuffer.length) {
            this.terminal.writeln(printBuffer.join(""));
            printBuffer = [];
          }
          data[dp] = (await this.terminal.input(`mem:${dp}> `)).charCodeAt(0);
          break;
        case "[":
          if (data[dp] === 0) {
            let brackets = [0];
            while (brackets.length) {
              guardCheck.increment();
              ip++;
              if (instructions[ip] === "[") {
                brackets.push(0);
              } else if (instructions[ip] === "]") {
                brackets.pop();
              } else if (ip > instructions.length) {
                throw new Error("Misbalanced brackets!");
              }
              guardCheck.check();
            }
          }
          break;
        case "]":
          if (data[dp] !== 0) {
            let brackets = [0];
            while (brackets.length) {
              guardCheck.increment();
              ip--;
              if (instructions[ip] === "]") {
                brackets.push(0);
              } else if (instructions[ip] === "[") {
                brackets.pop();
              } else if (ip < 0) {
                throw new Error("Misbalanced brackets!");
              }
              guardCheck.check();
            }
          }
          break;
      }
      guardCheck.increment();
      ip++;
    }
    if (printBuffer.length) {
      this.terminal.writeln(printBuffer.join(""));
    }
  },
};

export default brainfuck;
