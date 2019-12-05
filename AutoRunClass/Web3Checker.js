const Web3 = require("web3");
let net = require('net');
let web3Request = require("./Web3Request.js");
module.exports = class web3Checker{
    constructor(config,schemaAry) {
        if (config.IpcPath) {
            this.web3 = new Web3(new Web3.providers.IpcProvider(config.IpcPath, net));
        } else if (config.Rpc) {
            this.web3 = new Web3(new Web3.providers.HttpProvider(config.Rpc));
        }
        this.requests = []
    }
    getBlockNumber(Args){
        let request = new web3Request(this.web3,["eth","getBlockNumber"])
        this.requests.push(request);
    }
    getBlock(Args){
        let request = new web3Request(this.web3,["eth","getBlock"])
        this.requests.push(request);
    }
}