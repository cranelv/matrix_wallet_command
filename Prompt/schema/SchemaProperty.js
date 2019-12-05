'use strict'

var colors = require("colors/safe");
function Qmsg(desc) {
    return colors.magenta(desc+'[Q\\q to exit]:');
};
let pattern = require('./pattern.js');
module.exports = class SchemaProperty
{
    constructor(name,description,message,pattern) {
        this.name = name;
        this.description = Qmsg(description);
        this.message = message;
        this.pattern = pattern;
        this.required = true;
    }
    conform(value){
        return pattern.ExitConform(value);
    }
}
