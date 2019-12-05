let transactionClass = require('../transaction/transactionClass.js');
//0xb57021a27666455c4bcd40f613975a4e5c41a2f0
//0xa07438b739fef92dd0dfaa5eda2d6433b5f716ab
//0x1A381349Ee5f245C0735D113761Af722eE538AEa
let deploy = new transactionClass(["FROM","TO","SOLFILE","CONTRACT","CONTRACTFUNC","GAS","SUBMIT","PASSWORD","NORMALRAW","TRANSDATABASE","INSERTTRANS"]);
deploy.file = "../sol/depositTest.sol";
//deploy.to = "0xb57021a27666455c4bcd40f613975a4e5c41a2f0";
deploy.to = "0x1A381349Ee5f245C0735D113761Af722eE538AEa";
deploy.run();