let transactionClass = require('../transaction/transactionClass.js');

let send = new transactionClass(["FROM","TO","AMOUNT","GAS","PASSWORD","NORMALRAW","TRANSDATABASE","INSERTTRANS"]);
send.run();