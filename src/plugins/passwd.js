const passwd = {
  description: "Tells you whether you're auth'd for privileged commands.",
  help: ["Usage", "", "passwd"],
  async function() {
    let passwd = this.terminal.passwd;
    if (passwd) {
      this.terminal.writeln("Currently authorized.");
    } else {
      this.terminal.writeln("Currently not authorized.");
    }
  }
};

export default passwd;
