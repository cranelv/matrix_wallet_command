let transactionClass = require('../transaction/transactionClass.js');

let send = new transactionClass(["FROM","TRANSDATABASE","TXLIST","TXRECEIPT"]);
send.run();