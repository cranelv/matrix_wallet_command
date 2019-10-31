let transactionClass = require('../transaction/transactionClass.js');

let send = new transactionClass(["FROM","TO","AMOUNT","GAS","SUBMIT","PASSWORD","NORMAL"]);
send.run();