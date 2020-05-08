function pty() {
  this.commands = {};
  this.terminal = {
    writeln: function(e) {
      if (Array.isArray(e)) {
        e.forEach((line) => {
          this.writeln(line);
        });
      } else {
        this.buffer.push(e);
      }
    },
    buffer: [],
  };
}

export default pty;
