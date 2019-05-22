// var pty = {
//     terminal: {
//         writeln(e) {
//             this.buffer.push(e);
//         },
//         buffer: [],
//     },
// }

function pty() {
    this.buffer = [];
    this.commands = {};
    this.terminal = {
        writeln: (e) => {
            if (Array.isArray(e)) {
                for (let i = 0; i < e.length; i++) {
                    if (Array.isArray(e[i])) {
                        this.buffer.push(e[i][0]);
                    } else {
                        this.buffer.push(e[i]);
                    }
                }
            } else {
                if (Array.isArray(e)) {
                    this.buffer.push(e[0]);
                } else {
                    this.buffer.push(e);
                }
            }
        }
    }
}

export default pty;