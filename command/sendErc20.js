let transactionClass = require('../transaction/transactionClass.js');

let deploy = new transactionClass(["FROM","TO","ERC20","CONTRACT","EXTRA", "GAS","PASSWORD","NORMALRAW","TRANSDATABASE","INSERTTRANS"]);
deploy.from = "0x0d88376b308cf4282451a14e44e6203b1e96b27f";
//deploy.to = "0x1A381349Ee5f245C0735D113761Af722eE538AEa";
deploy.to = "0x95913fca18ce60190eb7571f3f9d0c791918894b";
deploy.contractArgs = ["0x73103a36a8fcaf1be18e53fda6e4175caa853f57",21000000];
deploy.gas = 100000;
deploy.gasPrice = 18e9;
deploy.ExtraData = "MAN.2Uoz8g8jauMa2mtnwxrschj2qPJrE"
deploy.password = "1111111111";
deploy.run();