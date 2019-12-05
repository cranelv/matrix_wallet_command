let promptClass = require('../Prompt/promptClass.js');
let keystoreDir = require('../matrix_util/keystore/keystoreDir.js');
let config = require('../config');
class  createKeystore extends promptClass{
    constructor(){
        super(["FROM","OLDPASSWORD","PASSWORD","REPEATPASS"]);
        let self = this;
        this.function5001S = function () {
            let keystore = new keystoreDir(config.keyStorePath);
            keystore.changePassword(this.from,this.oldPassword,this.password);
            console.log(this.from + " has changed password successful!");
        }
    }
}
let createkeystore = new createKeystore();
createkeystore.run();