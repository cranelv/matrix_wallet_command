//normal transaction
let NormalSend = require("./transaction.js").NormalSend;
let Contract = require("../contract/Contract.js");
let ContractFunc = require("../contract/ContractFunc.js");
class Deposit extends NormalSend
{
    constructor(trans)
    {
        super(trans);
        this.trans.to = "0x00000A";
        this.Abi =[{"constant": true,"inputs": [],"name": "getDepositList","outputs": [{"name": "","type": "address[]"}],"payable": false,"stateMutability": "view","type": "function"},
            {"constant": true,"inputs": [{"name": "addr","type": "address"}],"name": "getDepositInfo","outputs": [{"name": "","type": "uint256"},{"name": "","type": "address"},{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},
            {"constant": false,"inputs": [{"name": "address","type": "address"}],"name": "valiDeposit","outputs": [],"payable": true,"stateMutability": "payable","type": "function"},
            {"constant": false,"inputs": [{"name": "address","type": "address"}],"name": "minerDeposit","outputs": [],"payable": true,"stateMutability": "payable","type": "function"},
            {"constant": false,"inputs": [],"name": "withdraw","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},
            {"constant": false,"inputs": [],"name": "refund","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},
            {"constant": false,"inputs": [{"name": "addr","type": "address"}],"name": "interestAdd","outputs": [],"payable": true,"stateMutability": "payable","type": "function"},
            {"constant": false,"inputs": [{"name": "addr","type": "address"}],"name": "getinterest","outputs": [],"payable": false,"stateMutability": "payable","type": "function"}];
        this.contract = new Contract(this.Abi,this.trans.to);
    }
};
class DepositTrans extends Deposit{
    constructor(web3,trans,func) {
        super(trans);
        this.contractFunc = new ContractFunc(this.contract,func);
        this.trans.data = this.contractFunc.getData(web3,...trans.contractArgs) + trans.ExtraData;
    }
}
class DepositView extends Deposit{
    constructor(trans,func) {
        super(trans);
        this.contractFunc = new ContractFunc(this.contract,func);
    }
}
exports.DepositTrans = DepositTrans;
exports.DepositView = DepositView;
