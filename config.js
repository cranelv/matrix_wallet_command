const config = {};

config.version = '1.0.0';
//config.chainId = 5;
config.gas = 1000000;
config.gasPrice = 20e9;
// web3 parameter
let dataDir = process.env.HOME + "/work/src/github.com/ethereum/go-ethereum/Release/data";
config.databasePath = dataDir + "/matrix_db/";
config.IpcPath = dataDir + "/geth.ipc";
config.FromKeystoreDir = true;
//config.Rpc = "http://192.168.4.66:8546";
//config.Rpc = "https://mainnet.infura.io/v3/473f108e531843db9529fd549e61ad6e";
//config.keyStorePath = process.env.HOME + "/nodejs/matrix_wallet_command/keystore";
config.keyStorePath = dataDir+"/keystore"


//config.loglevel = 'debug';
// console color
config.consoleColor = {
	'COLOR_FgRed': '\x1b[31m',
	'COLOR_FgYellow': '\x1b[33m',
	'COLOR_FgGreen': "\x1b[32m"
};

// config.stampType = {
// 	TypeOne:0,
// 	TypeTwo:1,
// 	TypeFour:2,
// 	TypeEight:3,
// 	TypeSixteen:4
// };

module.exports = config;
