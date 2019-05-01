import help from './plugins/help.js';
import source from './plugins/source.js';
import math from './plugins/math.js';
import convert from './plugins/convert.js';
import special from './plugins/special.js';
import iploc from './plugins/iploc.js';
import time from './plugins/time.js';
import hex from './plugins/hex.js';
import bin from './plugins/bin.js';
import dec from './plugins/dec.js';

var termProps = {
    terminal: undefined,
    prompt: "<a style='color:#50fa7b'>you</a>@<a style='color:#bd93f9'>daB.</a> ~$ ",
    login: [
        "It's rew- forward time.",
        "                                                  ",      
        ["        %             %                   ", "#ff5555"], 
        ["        %%%           %%%                 ", "#ff5555"], 
        ["        %%%%%         %%%%%               ", "#ff5555"], 
        ["        %%%%%%%       %%%%%%%             ", "#ff5555"], 
        ["        %%%%%%%%%     %%%%%%%%%           ", "#ff5555"], 
        ["        %%%%%%%%%%%   %%%%%%%%%%%         ", "#ff5555"], 
        ["        %%%%%%%%%%%%% %%%%%%%%%%%%%       ", "#ff5555"], 
        ["        %%%%%%%%%%%%  %%%%%%%%%%%%        ", "#ff5555"], 
        ["        %%%%%%%%%%    %%%%%%%%%%          ", "#ff5555"], 
        ["        %%%%%%%%      %%%%%%%%            ", "#ff5555"], 
        ["        %%%%%%        %%%%%%              ", "#ff5555"], 
        ["        %%%%          %%%%                ", "#ff5555"], 
        ["        %%            %%                  ", "#ff5555"], 
        ["        %             %                   ", "#ff5555"], 
        "----",
        "Type 'help' for more information."
    ],
    commands: {
        help: help,
        source: source,
        math: math,
        convert: convert,
        special: special,
        iploc: iploc,
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