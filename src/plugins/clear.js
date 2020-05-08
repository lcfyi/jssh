const clear = {
  description: "clears the screen (maintains log of current session)",
  help: [
    "Usage",
    "",
    "clear",
  ],
  function() {
    // Remove lastChild Node from "terminal" DOM until top 5 remain (maintain session metadata)
    let childrenToRemove = this.terminal.container.childElementCount - 5;
    while (childrenToRemove != 0) {
      this.terminal.container.removeChild(this.terminal.container.lastChild);
      childrenToRemove--;
    }
  }
};

export default clear;
