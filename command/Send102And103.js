let transactionClass = require('../transaction/transactionClass.js');
let keystoreDir = require('../matrix_util/keystore/keystoreDir.js');
let NormalSend = require('../matrix_util/matrix_trans/transaction.js').NormalSend;
let config = require('../config');
let funcDefine = require("../functionDefine.js");

let deploy = new transactionClass(["ERC20","CONTRACT"]);
deploy.from = "0x0d88376b308cf4282451a14e44e6203b1e96b27f";
deploy.to = "0x95913fca18ce60190eb7571f3f9d0c791918894b";
let BurnAddr = "0x73103a36a8fcaf1be18e53fda6e4175caa853f57";

deploy.contractArgs = [BurnAddr,21000000];
deploy.gas = 100000;
deploy.gasPrice = 18e9;
deploy.ExtraData = "MAN.2Uoz8g8jauMa2mtnwxrschj2qPJrE"
deploy.password = "1111111111";

deploy[funcDefine.submit+"001"] = function(){
    deploy.web3.eth.getTransactionCount(this.from,function (err, result) {
        if (!err) {
            deploy.nonce = result;
            deploy.stepNext();
        } else {
            console.log(err.message);
            deploy.quit();
        }
    })
}
deploy[funcDefine.from + "0010S"] = function () {
    deploy.accountArray = [];
    let keystore = new keystoreDir(config.keyStorePath);
    keystore.initAccounts();
    for (var key in keystore.Accounts){
        deploy.accountArray.push({address:keystore.Accounts[key].getAddress()});
    }
    deploy.fromAccount = keystore.getAccount(deploy.from)
}
deploy[funcDefine.trans+"001"] = function(){
    deploy.web3.eth.getTransactionCount(this.from,function (err, result) {
        if (!err) {
            deploy.nonce = result;
            deploy.stepNext();
        } else {
            console.log(err.message);
            deploy.quit();
        }
    })
}
deploy[funcDefine.trans+"002"] = function () {
    let trans = deploy.createTrans();
    let normalSend = new NormalSend(trans);
    console.log(trans);
    let priKey = deploy.fromAccount.getPrivateKey(deploy.password);
    let obj = normalSend.signAndHash(priKey);
    console.log(obj);
    deploy.hash = obj[1].toString("hex");
    trans.value = 0;
    trans.nonce++;
    trans.to = BurnAddr;
    trans.data = "0x"+deploy.hash+Bytes2HexString(deploy.ExtraData);
    console.log(trans);
    let Trans103 = new NormalSend(trans);
    let Obj1 = Trans103.signAndHash(priKey)
    normalSend.sendRaw(deploy.web3,obj[0],function (err,result) {
        if(!err){
            console.log(result);
            deploy.hash = result;
            deploy.stepNext();
        }else{
            console.log(err.message);
            deploy.quit();
        }
    })
    normalSend.sendRaw(deploy.web3,Obj1[0],function (err,result) {
        if(!err){
            console.log(result);
            deploy.hash1 = result;
            deploy.stepNext();
        }else{
            console.log(err.message);
            deploy.quit();
        }
    })
}
deploy.run();
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
