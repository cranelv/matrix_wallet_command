let promptClass = require('../Prompt/promptClass.js');
let keystoreDir = require('../matrix_util/keystore/keystoreDir.js');
let config = require('../config');
class  createKeystore extends promptClass{
    constructor(){
        super(["PASSWORD","REPEATPASS"]);
        let self = this;
        this.function5001 = function () {
            let keystore = new keystoreDir(config.keyStorePath);
            keystore.CreateAccount(this.password,function (result) {
                console.log("new Account address: 0x"+result);
                self.stepNext();
            });
        }
    }
}
let createkeystore = new createKeystore();
createkeystore.run();