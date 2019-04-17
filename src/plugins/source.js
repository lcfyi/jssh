var source = {
    description: "the source",
    help: [
        "Prints the source of this site."
    ],
    function() {
        let link = "https://github.com/lcheng1/decabyt.es";
        this.parent.terminal.writeln("<a href='" + link + "' target='_blank'>github</a>");
    }
}

export default source;