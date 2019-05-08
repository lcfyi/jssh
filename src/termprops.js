import help from './plugins/help.js';
import source from './plugins/source.js';
import math from './plugins/math.js';
import convert from './plugins/convert.js';
import special from './plugins/special.js';
import ipinfo from './plugins/ipinfo.js';
import time from './plugins/time.js';
import hex from './plugins/hex.js';
import bin from './plugins/bin.js';
import dec from './plugins/dec.js';
import colors from './dracula.js';

var termProps = {
    terminal: undefined,
    prompt: "<a style='color:" + colors.green + "'>you</a>@<a style='color:#bd93f9'>daB.</a> ~$ ",
    login: [
        " ",
        [" _          _   _       ",  colors.pink],
        ["| |        | | | |      ",  colors.pink],
        ["| |     _  | | | |  __  ",  colors.pink],
        ["|/ \\   |/  |/  |/  /  \\_",colors.pink],
        ["|   |_/|__/|__/|__/\\__/o", colors.pink],
        " ",
        "Type 'help' for more information."
    ],
    commands: {
        help: help,
        source: source,
        math: math,
        convert: convert,
        special: special,
        ipinfo: ipinfo,
        time: time,
        hex: hex,
        bin: bin,
        dec: dec
    },
    init: function() {
        for (let x in this.commands) {
            this.commands[x].parent = this;
        }
        delete this.init;
        return this;
    }
}.init();

export default termProps;