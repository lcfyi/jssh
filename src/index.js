import waTerminal from './term.js';
import termProps from './termprops.js';

/**
 * Give strings a hashcode. For obfuscation but it's not 
 * particularly necessary, I suppose.
 */
String.prototype.hashCode = function() {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr   = this.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash;
};

/**
 * On window load, we create a new terminal instance with
 * the properties we pass in, print the current time, and 
 * log into our terminal.
 */
window.onload = () => {
    let term = new waTerminal(termProps);
    term.init(document.getElementById('terminal'));
    try {    
        let ip = new XMLHttpRequest();
        ip.open("GET", "https://json.geoiplookup.io/", false);
        ip.send();
        var payload = JSON.parse(ip.responseText);
        term.writeln("Current date and time: " + new Date().toString());
        term.writeln("Connected from " + payload.ip);
        term.writeln("----");
    } catch (e) {
        // Internet issues, can't resolve hostname 
        term.writeln("Current date and time: " + new Date().toString());
        term.writeln("Not connected to the internet.");
        term.writeln("----");
    }
    term.login();
}