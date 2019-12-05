let BaseSyncClass = require('../matrix_util/BaseSyncClass.js')
let prompt = require('./prompt.js')
let SchemaFactory = require('./schema/SchemaFactory.js');
let InputSchemaProperty = require('./schema/NormalSchemaProperty.js').InputSchemaProperty;
let pattern = require('./schema/pattern.js');
let keystoreDir = require('../matrix_util/keystore/keystoreDir.js');
let config = require('../config');
let funcDefine = require("../functionDefine.js");
const Web3 = require("web3");
let net = require('net');
let collectionDefine = require('../database/collectionDefine.js');
const fs = require('fs');
module.exports = class promptClass extends BaseSyncClass{
    constructor(schemaAry){
        super();
        if(config.IpcPath){
            this.web3 = new Web3(new Web3.providers.IpcProvider( config.IpcPath, net));
        }else if(config.Rpc){
            this.web3 = new Web3(new Web3.providers.HttpProvider(config.Rpc));
        }
        this.schemaAry = schemaAry

    }
    run(){
        for(var i=0;i<this.schemaAry.length;i++){
            if(this[this.schemaAry[i]]){
                this[this.schemaAry[i]]();
            }
        }
        super.run()
    }
    SUBMIT(){
        let self = this;
        this[funcDefine.submit+"001"] = function () {
            prompt.get(SchemaFactory.submitSend(),function(err,result){
                if(!err){
                    if(result.submit == 'Y' || result.submit == 'y'){
                        self.stepNext();
                    }else{
                        console.log("You have stopped this command");
                        self.quit();
                    }
                }
                else{
                    console.log(err.message);
                    self.quit();
                }
            })
        }
    }
    setPassword(funcKey,valueKey){
        let self = this;
        this[valueKey] = '';
        this.passwordLen = 8;
        this[funcDefine.password+funcKey] = function () {
            if(this.repeatNum>5){
                console.error("Error: password input error!");
                this.quit();
            }
            prompt.get(SchemaFactory.password(valueKey),function(err,result){
                if(!err){
                    let password = new String(result[valueKey]);
                    if(password.length>=self.passwordLen){
                        var bCheck = true;
                        if (self.checkPassword){
                            if(!self.checkPassword(result[valueKey])){
                                bCheck = false;
                                self.repeatNum++;
                                self.stepCurrent();
                            }
                        }
                        if(bCheck){
                            self[valueKey] = result[valueKey];
                            self.stepNext();
                        }
                    }else{
                        self.repeatNum++;
                        console.error("Error: not enough password length! please input password more than ",self.passwordLen," charactors!");
                        self.stepCurrent();
                    }
                }
                else{
                    console.log(err.message);
                    self.quit();
                }
            })
        }

    }
    OLDPASSWORD(){
        this.setPassword("0001","oldPassword");
        this[funcDefine.password+"0001S"] = function (){
            this.checkPassword = null;
        }
    }
    PASSWORD() {
        if (!this.password) {
            this.setPassword("001","password");
        }else{
            if (this.checkPassword){
                this.checkPassword(this.password);
            }
        }
    }
    REPEATPASS() {
        let self = this;
        this.repeatPass = '';
        this[funcDefine.password+"002"] = function () {
            if(this.repeatNum>5){
                console.error("Error: password input error!");
                this.quit();
            }
            prompt.get(SchemaFactory.repeatPass(), function (err, result) {
                if(!err) {
                    let password = new String(result.repeatPass);
                    if (password.length >= self.passwordLen) {
                        if(result.repeatPass == self.password){
                            self.repeatPass = result.repeatPass;
                            self.stepNext();
                        }else{
                            self.repeatNum++;
                            console.error("Error: repeat password Error! try again");
                            self.index--;
                            self.stepCurrent();
                        }
                    }else{
                        self.repeatNum++;
                        console.error("Error: not enough password length! please input password more than ",self.passwordLen," charactors!");
                        self.stepCurrent();
                    }
                }
                else{
                    console.log(err.message);
                    self.quit();
                }
            })

        }
    }
    FROM(){
        if (!this.from){
//            return
            let self = this;
            this.from = "";
            this.accountArray = [];
            let index = 0;
            if(config.IpcPath && !config.FromKeystoreDir){
                this[funcDefine.from + "001"] = function () {
                    this.web3.eth.getAccounts(function (err,results) {
                        if(!err || results.length == 0)
                        {
                            for(var i=0;i<results.length;++i) {
                                self.accountArray.push({address:results[i]});
                            }
                            self.stepNext();
                        }
                        else
                        {
                            console.log(err.message);
                            self.quit();
                        }
                    });
                }
            }else{
                this[funcDefine.from + "0010S"] = function () {
                    let keystore = new keystoreDir(config.keyStorePath);
                    keystore.initAccounts();
                    for (var key in keystore.Accounts){
                        self.accountArray.push({address:keystore.Accounts[key].getAddress()});
                    }
                }
            }
            this[funcDefine.from + "0011"] = function () {
                this.web3.eth.getBalance(self.accountArray[index].address,function (err,result) {
                    if(!err)
                    {
                        self.accountArray[index].balance = self.web3.utils.fromWei(result);
                        console.log(index+1 + ". " + JSON.stringify(self.accountArray[index]));
                        index++;
                        if(index<self.accountArray.length){
                            self.stepCurrent();
                        }else{
                            self.stepNext();
                        }
                    }
                    else
                    {
                        console.log(err.message);
                        self.quit();
                    }
                });
            }
            this[funcDefine.from + "002"] = function () {
                let fromSchema = SchemaFactory.fromAccount();
                prompt.get(fromSchema, function (err, result) {
                    if(!err) {
                        if(typeof result.from === 'number' || pattern.UintPattern.test(result.from))
                        {
                            if(result.from>0 && result.from<=self.accountArray.length) {
                                self.from = self.accountArray[result.from-1].address;
                                self.stepNext();
                            }else {
                                console.log(fromSchema.message);
                                self.stepCurrent();

                            }
                        }else{
                            var bHave = false;
                            for(var i=0;i<self.accountArray.length;++i){
                                if(self.accountArray[i].address.toLowerCase() == result.from.toLowerCase())
                                    bHave = true;
                                    break;
                            }
                            if(bHave){
                                self.from = result.from;
                                self.stepNext();
                            }else {
                                console.log(fromSchema.message);
                                self.stepCurrent();

                            }
                        }
                    }
                    else
                    {
                        console.log(err.message);
                        self.quit();
                    }
                });
            }
        }

        this.checkPassword = function(password){
            let keystore = new keystoreDir(config.keyStorePath);
            this.fromAccount = keystore.getAccount(this.from);
            return this.fromAccount.getPrivateKey(password);
        }
    }
    TO(){
        if (this.to){
            return
        }
         let self = this;
        this.to = "";
        this[funcDefine.to + "001"] = function () {
            prompt.get(SchemaFactory.toAccount(), function (err, result) {
                if(!err) {
                    self.to = result.to;
                    self.stepNext();
                }
                else
                {
                    console.log(err.message);
                    self.quit();
                }
            });
        }
    }
    SOLFILE(){
        let self = this;
        if (!this.file){
            this[funcDefine.file+"001"] = function(){
                prompt.get(SchemaFactory.fileName(), function (err, result) {
                    if(!err) {
                        try {
                            fs.readFileSync(result.file, 'utf8');
                            self.file = result.file;
                            self.stepNext();

                        }
                        catch (e) {
                            console.log(e);
                            self.stepCurrent();
                        }
                    }
                    else
                    {
                        console.log(err.message);
                        self.quit();
                    }
                });
            }
        }
        /*
        if (!this.name){
            this[funcDefine.file+"002"] = function(){
                prompt.get(SchemaFactory.contractName(), function (err, result) {
                    if(!err) {
                        self.name = result.name;
                        self.stepNext();
                    }
                    else
                    {
                        console.log(err.message);
                        self.quit();
                    }
                });
            }
        }
        */
    }
    AMOUNT(){
        let self = this;
        this.value = "";
        this[funcDefine.amount+"001"] = function () {
            prompt.get(SchemaFactory.Amount(), function (err, result) {
                if(!err) {
                    self.value = result.amount;
                    self.stepNext();
                }
                else
                {
                    console.log(err.message);
                    self.quit();
                }
            });
        }
    }
    GAS(){
        if (this.gas && this.gasPrice) {
            return
        }
        let self = this;
        this.value = "";
        this[funcDefine.gas+"001"] = function () {
            console.log('1.   Default');
            console.log('2.   Advanced option');
            let feeOption = SchemaFactory.FeeOption();
            prompt.get(feeOption, function (err, result) {
                if(!err) {
                    if(result.fee == 1){
                        self.gas = config.gas;
                        self.gasPrice = config.gasPrice;
                        self[funcDefine.gas+"002"] = null;
                        self[funcDefine.gas+"003"] = null;
                        self.stepNext();
                    }else if(result.fee == 2){
                        self.stepNext();
                    }else{
                        console.log(feeOption.message);
                        self.stepCurrent();
                    }
                }
                else
                {
                    console.log(err.message);
                    self.quit();
                }
            });
        }
        this[funcDefine.gas+"002"] = function () {
            prompt.get(SchemaFactory.gasPrice(), function (err, result) {
                if(!err) {
                    self.gasPrice = result.gasPrice*1e9;
                    self.stepNext();
                }
                else
                {
                    console.log(err.message);
                    self.quit();
                }
            });
        }
        this[funcDefine.gas+"003"] = function () {
            prompt.get(SchemaFactory.gasLimit(), function (err, result) {
                if(!err) {
                    self.gas = result.gas;
                    self.stepNext();
                }
                else
                {
                    console.log(err.message);
                    self.quit();
                }
            });
        }
    }
    TXLIST(){
        let self = this;
        this[funcDefine.txlist+"001S"] = function(){
            this.transCollection = collectionDefine.transaction(this.transDb);
            var data = this.transCollection.collection.find({'from': this.from});
            if(data)
            {
                this.txHashArray = [];
                for (var i=0;i<data.length;i++){
                    var item = this.transCollection.cloneItem(data[i]);
                    this.txHashArray.push(item);
                    console.log(i+1 + ". " + JSON.stringify(item));
                }
            }
        }
        this[funcDefine.txlist+"002"] = function () {
            let hashSchema = SchemaFactory.hash();
            prompt.get(hashSchema, function (err, result) {
                if (!err) {
                    if (typeof result.hash === 'number' || pattern.UintPattern.test(result.hash)) {
                        if (result.hash > 0 && result.hash <= self.txHashArray.length) {
                            self.hash = self.txHashArray[result.hash - 1].hash;
                            self.stepNext();
                        } else {
                            console.log(hashSchema.message);
                            self.stepCurrent();

                        }
                    } else {
                        var bHave = false;
                        for (var i = 0; i < self.txHashArray.length; ++i) {
                            if (self.accountArray[i].hash.toLowerCase() == result.hash.toLowerCase())
                                bHave = true;
                            break;
                        }
                        if (bHave) {
                            self.hash = result.hash;
                            self.stepNext();
                        } else {
                            console.log(hashSchema.message);
                            self.stepCurrent();

                        }
                    }
                }
                else {
                    console.log(err.message);
                    self.quit();
                }
            });
        }
    }
    EXTRA(){
        if (this.ExtraData){
            return
        }
        let self = this;
        this[funcDefine.Extra+"001"] = function (){
            let Schema = new InputSchemaProperty('ExtraData',"Enter transaction Extra Data:",'Invalid input.')
             prompt.get(Schema, function (err, result) {
                if(!err) {
                    self.ExtraData = result.ExtraData;
                    self.stepNext();
                }
                else
                {
                    console.log(err.message);
                    self.quit();
                }
            });
        }
    }
    break(){
        super.break();
        this.web3.currentProvider.disconnect()
    }
    promptGet(Schema,callback){
        prompt.get(Schema,callback);
    }
}
