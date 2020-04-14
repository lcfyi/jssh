const base64 = {
  description: "encodes or decodes a string to/from base64",
  help: [
    "Usage",
    "",
    "base64 [encode/decode] [string]",
    "Will return the encoded/decoded value of your string.",
    "You can also use e for encode and d for decode."
  ],
  function(e) {
    let re = /(base64)[\s]+(encode|decode|e|d)[\s]+([\d\D]+)/;
    let matches = re.exec(e);
    if (matches) {
      switch (matches[2]) {
        case "e":
        case "encode":
          this.terminal.writeln(btoa(matches[3]));
          return;
        case "d":
        case "decode":
          this.terminal.writeln(atob(matches[3]));
          return;
      }
    } else {
      this.terminal.writeln("base64: invalid input. Try 'help base64'.");
    }
  }
};

export default base64;
