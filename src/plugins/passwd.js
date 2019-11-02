const passwd = {
  description: "Tells you whether you're auth'd for privileged commands.",
  help: ["Usage", "", "passwd"],
  async function() {
    let passwd = this.parent.terminal.passwd;
    if (passwd) {
      this.parent.terminal.writeln("Currently authorized.");
    } else {
      this.parent.terminal.writeln("Currently not authorized.");
    }
  }
};

export default passwd;
