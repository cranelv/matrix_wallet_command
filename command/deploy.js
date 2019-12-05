let transactionClass = require('../transaction/transactionClass.js');
//0xb57021a27666455c4bcd40f613975a4e5c41a2f0
let deploy = new transactionClass(["FROM","SOLFILE","CONTRACT","DEPLOYDATA","GAS","SUBMIT","PASSWORD","NORMALRAW","TRANSDATABASE","INSERTTRANS"]);
//deploy.file = "../sol/sc_AILiteCoin_1.sol";
//deploy.from = "0xc8c182df4983b6605efad76e1408abeefbfa5148";
deploy.file = "../sol/depositTest.sol";
deploy.contractArgs = []
deploy.run();