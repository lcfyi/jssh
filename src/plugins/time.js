var time = {
    description: "prints the current time",
    help: [
        "No options",
    ],
    function() {
        console.log(this);
        this.writeln(new Date().toString());
    }
    // function() {
    //     this.parent.terminal.writeln(new Date().toString());
    // }
};

export default time;