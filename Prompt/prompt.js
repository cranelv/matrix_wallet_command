const prompt = require('prompt');
let config = require('../config');
var colors = require("colors/safe");
var optimist = require('optimist')
    .string(['password', 'repeatPass','address', 'toaddress' ,'waddress','OTAaddress', 'tokenAddress','transHash','contractAddress',
        'OTAAddress','stampOTA']);

const logDebug = require('log4js');
let log4jsOptions = {
    appenders: {
        ruleConsole: {type: 'console'},
        ruleFile: {
            type: 'dateFile',
            filename: 'logs/server-',
            pattern: 'yyyy-MM-dd.log',
            maxLogSize: 10 * 1000 * 1000,
            numBackups: 3,
            alwaysIncludePattern: true
        }
    },
    categories: {
        default: {appenders: ['ruleConsole', 'ruleFile'], level: (config.loglevel || 'info')}
    }
};
if(config.logfile)
{
    log4jsOptions.appenders.ruleFile = {
        type: 'dateFile',
        filename: config.logfile,
        maxLogSize: 10 * 1000 * 1000,
        alwaysIncludePattern: true
    };
    log4jsOptions.categories.default.appenders.push('ruleFile');
}
logDebug.configure(log4jsOptions);
prompt.override = optimist.argv;
prompt.start();
prompt.message = colors.blue("matrix");
prompt.delimiter = colors.green(">>");
module.exports = prompt;