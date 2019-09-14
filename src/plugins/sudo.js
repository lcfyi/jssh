import colors from '../dracula.js';

var sudo = {
    description: "authentication",
    help: [
        "Usage",
        "",
        "sudo"
    ],
    async function(e) {
        let promise = this.parent.terminal.input("");
        this.parent.terminal.workingPrompt.input.type = "password";
        let element = this.parent.terminal.workingPrompt.element;
        let val = await promise;
        element.innerHTML = "";
        try {
            let a = new XMLHttpRequest();
            a.open("POST", ".netlify/functions/auth", false);
            a.send(val);
            // Wait for the response
            var status = a.status;
            var payload = a.responseText;
        } catch (e) {
            this.parent.terminal.writeln("Cannot connect to auth server.");
            return;
        }
        // On success, store the passphrase ephemerally
        if (status === 200) {
            this.parent.terminal.passwd = payload;
            this.parent.prompt = "<a style='color:" + colors.green + "'>~</a><a style='color:" + colors.purple + "'>#</a> ";
        } else if (status === 401) {
            this.parent.terminal.writeln(payload);
        }
    }
};

export default sudo;