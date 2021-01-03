const clear = {
  description: "clears the screen (maintains log of current session)",
  help: ["Usage", "", "clear", "clear history"],
  function(e) {
    let command = e.split(" ").filter((e) => e);
    if (command[1] === "history") {
      this.terminal.history.resetHistory();
    } else {
      while (this.terminal.container.childElementCount) {
        this.terminal.container.removeChild(this.terminal.container.lastChild);
      }
    }
  },
};

export default clear;
