const source = {
  description: "the source",
  help: ["Prints the source of this site."],
  function() {
    let link = "https://github.com/lcfyi/jssh";
    this.terminal.writeln(
      "<a href='" + link + "' target='_blank'>github</a>", true
    );
  }
};

export default source;
