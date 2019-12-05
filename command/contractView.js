let transactionClass = require('../transaction/transactionClass.js');

let deploy = new transactionClass(["TO","SOLFILE","CONTRACT","CONTRACTVIEW"]);
deploy.to = "0xFbb95e7Eb7d19D41587A54F12A7aabc97E2FAA9d";
deploy.file = "/home/cranelv/nodejs/matrix_wallet_command/sol/MBCToken.sol";
//deploy.name = "MANToken";
deploy.run();