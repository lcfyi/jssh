const spongebob = {
  description: "spongbob your text",
  help: [
    "Usage",
    "",
    "spongebob [string]",
    "",
    "The string upper/lower permutation is random."
  ],
  function(e) {
    let parsed = e.split(" ");

    parsed.shift();

    let joined = parsed.reduce((prev, curr) => {
      if (prev !== "") {
        return prev + " " + curr;
      } else {
        return prev + curr;
      }
    }, "");

    let ret = "";

    for (let c of joined) {
      ret += Math.round(Math.random()) ? c.toUpperCase() : c.toLowerCase();
    }

    this.terminal.writeln(ret);
  }
};

export default spongebob;
