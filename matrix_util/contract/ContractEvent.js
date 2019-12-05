"use strict";

let ContractFunc = require("./ContractFunc.js");
module.exports = class ContractEvent extends ContractFunc {
    constructor(contract,contractEvent) {
        super(contract,contractEvent)
    }
    initParse(web3)
    {
        if(this.contract.Abi)
        {
            if(this.contractFunc){
                this.input = this.contract.getInput(this.contract.Abi,this.contractFunc);
                this.cmdCode = this.contract.getEventCode(this.contractFunc,web3);
            }
        }
    }
}