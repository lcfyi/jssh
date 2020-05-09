const clear = {
  description: "clears the screen (maintains log of current session)",
  help: ["Usage", "", "clear", "clear history"],
  function(e) {
    let command = e.split(" ").filter((e) => e);
    if (command[1] === "history") {
      this.terminal.history.resetHistory();
    } else {
      // Remove lastChild Node from "terminal" DOM until top 5 remain (maintain session metadata)
      let childrenToRemove = this.terminal.container.childElementCount - 5;
      while (childrenToRemove != 0) {
        this.terminal.container.removeChild(this.terminal.container.lastChild);
        childrenToRemove--;
      }
    }
  },
};

export default clear;
