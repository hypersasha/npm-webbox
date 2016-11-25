var colors = require('colors/safe');

/**
activated (String): can accept:
    - "all" : print all messages;
    - "done": print only messages with type = "done";
    - "off" : no prints
 */
function Noty(activated) {
    this.active = activated;
    this.prefix = colors.magenta.bold("[WebBox]");
}

/**
text (String): message to print in th user console,
type (String): color for your message like:
    - done (green color)
    - err (red color)
    - info (blue color)
    - out (standard color)
 */

Noty.prototype.log = function (text, type) {
    if (this.active == "off") return;
    switch (type){
        case "done":
            if (this.active == "all" || this.active == "done")
                console.log(this.prefix + " " + colors.green(text));
            break;
        case "warn":
            if (this.active == "all")
                console.log(this.prefix + " " + colors.gray(text));
            break;
        case "err":
            if (this.active == "all" || this.active == "err")
                console.log(this.prefix + " " + colors.red(text));
            break;
        case "info":
            if (this.active == "all")
                console.log(this.prefix + " " + colors.cyan(text));
            break;
        default:
            if (this.active == "all")
                console.log(this.prefix + " " + text);
    }
};

exports.Noty = Noty;