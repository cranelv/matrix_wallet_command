let promptClass = require('../Prompt/promptClass.js');
let config = require('../config');
let mandb = require('../matrix_util/matrix_db/newDb.js');
let collectionDefine = require('../database/collectionDefine.js');
let NormalSend = require('../matrix_util/matrix_trans/transaction.js').NormalSend;
let ContractFunc = require('../matrix_util/contract/ContractFunc.js');
let Contract = require('../matrix_util/contract/Contract.js');
let funcDefine = require("../functionDefine.js");
let addressProperty = require('../Prompt/schema/NormalSchemaProperty.js').addressProperty;
let FloatProperty = require('../Prompt/schema/NormalSchemaProperty.js').FloatProperty;
let UintProperty= require('../Prompt/schema/NormalSchemaProperty.js').UintProperty;
let InputSchemaProperty = require('../Prompt/schema/NormalSchemaProperty.js').InputSchemaProperty;
let Descript= require('../Prompt/schema/DescAndMsg.js');
let Erc20Abi = require("./Erc20Abi.js")
module.exports = class transactionClass extends promptClass{
    constructor(schemaAry){
        super(schemaAry);
    }
    TRANSDATABASE(){
        let self = this;
        this[funcDefine.dataBase+"001"] = function () {
            if(!this.transDb){
                this.transDb = new mandb(config.databasePath,"transactions");
                this.transDb.init().then(function () {
                    self.stepNext();
                }).catch((err)=>{
                    console.log(err);
                    process.exit();
                });
            }else{
                self.stepNext();
            }
        }
        this[funcDefine.end+"001"] = function(){
            this.transDb.close().then(function () {
                self.stepNext();
            }).catch((err)=>{
                console.log(err);
                self.stepNext();
            });
        }
    }
    INSERTTRANS(){
        this[funcDefine.insertDb+"001S"] = function(){
            this.transCollection = collectionDefine.transaction(this.transDb);
            this.transCollection.intertItem(this);
        }
    }

    TXRECEIPT(){
        let self = this;
        this[funcDefine.txReceipt+"001"] = function(){
            this.web3.eth.getTransactionReceipt(this.hash,function (err, result) {
                if(!err){
                    console.log(result);
                }else
                {
                    console.log(err.message);
                }
                self.stepNext();
            });
        }
    }
    transLog(){
        let self = this;
        this.chainId = config.chainId;
        if (!this.chainId){
            this[funcDefine.log+"0001"] = function () {
                this.web3.eth.net.getId(function(err, result) {
                    if (!err) {
                        self.chainId = result;
                        self.stepNext();
                    } else {
                        console.log(err.message);
                        self.quit();
                    }
                });
            }
        }
        this[funcDefine.log+"001S"] = function () {
            let trans = this.createTrans();
            if (trans.value) {
                trans.value = this.web3.utils.fromWei(trans.value);
            }
            console.log(trans);
        }
    }
    NORMAL(){
        this.transLog();
        let self = this;
        this[funcDefine.trans+"001"] = function () {
            let trans = this.createTrans();
            let normalSend = new NormalSend(trans);
            normalSend.send(this.web3,this.password,function (err,result) {
                if(!err){
                    console.log(result);
                    self.hash = result;
                    self.stepNext();
                }else{
                    console.log(err.message);
                    self.quit();
                }
            })
        }

    }
    NORMALRAW(){
        this.transLog();
        let self = this;
        this[funcDefine.trans+"001"] = function () {
            this.web3.eth.getTransactionCount(this.from,function (err, result) {
                if (!err) {
                    self.nonce = result;
                    self.stepNext();
                } else {
                    console.log(err.message);
                    self.quit();
                }
            })
        }
        this[funcDefine.trans+"002"] = function () {
            let trans = this.createTrans();
            let normalSend = new NormalSend(trans);
            normalSend.sign(this.web3,this.fromAccount.getPrivateKey(this.password),function (err,result) {
                if(!err){
                    console.log(result.rawTransaction);
                    normalSend.sendRaw(self.web3,result.rawTransaction,function (err,result) {
                        if(!err){
                            console.log(result);
                            self.hash = result;
                            self.stepNext();
                        }else{
                            console.log(err.message);
                            self.quit();
                        }
                    })
                }else{
                    console.log(err.message);
                    self.quit();
                }
            });
        }
    }
    ERC20(){
        let self = this;
        this.Abi = Erc20Abi;
        this.contractFunc = "transfer";
        if (!self.contractArgs){
            self.contractArgs = [];
            this[funcDefine.contract+"0020"] = function (){
                let Schema = new addressProperty("Erc20To","Please Input Send Address:",Descript.Message.errAddress);
                self.promptGet(Schema,function(err,result){
                    if(!err){
                        self.contractArgs.push(result.Erc20To);
                        self.stepNext();
                    }else{
                        console.log(err.message);
                        process.exit();
                    }
                })

            }
            this[funcDefine.contract+"0021"] = function (){
                let Schema = new FloatProperty("Erc20Amount","Please Input Send Amount:",Descript.Message.errAmount,1e-18);
                self.promptGet(Schema,function(err,result){
                    if(!err){
                        let value = Number(result.Erc20Amount*1e18);
                        self.contractArgs.push("0x"+value.toString(16));
                        self.stepNext();
                    }else{
                        console.log(err.message);
                        process.exit();
                    }
                })

            }
        }
        this[funcDefine.contract+"002S"] = function (){
            let contractFunc = new ContractFunc(this.contract,this.contractFunc);
            this.data = contractFunc.getData(this.web3, ...this.contractArgs);
        }
    }
    CONTRACT(){
        this[funcDefine.contract+"0010S"] = function (){
            this.contract = new Contract(this.Abi,this.to);
            if(!this.Abi && this.file){
                this.contract.setFromSolFile(this.file);
            }
        }
    }
    contractFuncInput(){
        let self = this;
        this.initInputFunc();
        this[funcDefine.contract+"0019"] = function (){
            let Schema = new InputSchemaProperty("func",Descript.Description.funcName ,Descript.Message.errInput);
            self.promptGet(Schema,function(err,result){
                if(!err){
                    let item = self.contract.getFunctionItem(result.func);
                    if(item){
                        self.contractFunc = result.func;
                        self.contractInput(item.inputs);
                        self.stepNext();
                    }else{
                        console.log(Schema.message);
                        self.stepCurrent();
                    }
                }else{
                    console.log(err.message);
                    process.exit();
                }
            })
        }
    }
    CONTRACTVIEW(){
        let self = this;
        this.contractFuncInput();
        this[funcDefine.contract+"003"] = function (){
            let contractFunc = new ContractFunc(this.contract,this.contractFunc);
            contractFunc.getViewData(this.web3,...this.contractArgs).then(function (err,result) {
                if(err){
                    console.log(err);
                }else{
                    console.log(result);
                }
                self.stepNext();
            });
        }
    }
    CONTRACTFUNC(){
        this.contractFuncInput();
        this[funcDefine.contract+"002S"] = function (){
            let contractFunc = new ContractFunc(this.contract,this.contractFunc);
                this.data = contractFunc.getData(this.web3, ...this.contractArgs);
        }
    }
    DEPLOYDATA(){
        this.initInputFunc();
        this[funcDefine.contract+"0019S"] = function (){
            let item = this.contract.getConstructor();
            this.contractInput(item.inputs);
        }

        this[funcDefine.contract+"003S"] = function (){
            this.data = this.contract.deployContractData(this.web3,this.file,this.contract.name,...this.contractArgs);
        }
    }
    initInputFunc(){
        for (var i=0;i<10;i++) {
            this[funcDefine.contract + "002" + i] = null;
        }
    }
    contractInput(inputs){
        let self = this;
        self.contractArgs = [];
        if(inputs.length>0){
            for (var i=0;i<inputs.length;i++){
                let input = inputs[i];
                let args = 'args'+i;
                let Description = "Enter inputs argument " + input.name +"(type : " + input.type + "): ";
                let Schema;
                switch (input.type) {
                    case "address":
                        Schema = new addressProperty(args,Description,Descript.Message.errAddress);
                    break;
                    case "uint256":
                        Schema = new UintProperty(args,Description,Descript.Message.errAddress);
                        break;
                    default:
                        Schema = new InputSchemaProperty(args,Description,Descript.Message.errInput);
                        break;
                }
                this[funcDefine.contract+"002"+i] = function (){
                    self.promptGet(Schema,function(err,result){
                        if(!err){
                            self.contractArgs.push(result[args]);
                            self.stepNext();
                        }else{
                            console.log(err.message);
                            process.exit();
                        }
                    })
                }

            }
        }
    }
    createTrans(){
        let value = null;
        if(this.value){
            value = this.web3.utils.toWei(this.value);
        }
        return {from:this.from,to:this.to,value:value,data:this.data,gas:this.gas,gasPrice:this.gasPrice,nonce:this.nonce,chainId:this.chainId};
    }

}
const Bytes2HexString = (b)=> {
    if (b == undefined) {
        return "";
    }
    let hexs = "";
    for (let i = 0; i < b.length; i++) {
        let hex = b.charCodeAt(i).toString(16);
        if (hex.length === 1) {
            hexs = '0' + hex;
        }
        hexs += hex;
    }
    return hexs;
}
