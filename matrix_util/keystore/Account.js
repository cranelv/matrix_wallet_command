const fs = require('fs');
var keythereum = require("keythereum");
module.exports = class Account{
    constructor(fileName){
        try{
            this.fileName = fileName;
            let keystoreStr = fs.readFileSync(fileName, "utf8");
            this.keystore = JSON.parse(keystoreStr);
        }catch (e){
            this.keystore = null;
        }
    }
    getPrivateKey(password){
        if(!this.privateKey){
            this.privateKey = this.getPrivateKeyFunc({version:this.keystore.version, crypto:this.keystore.crypto},password);
        }
        return this.privateKey;
    }
    getWanPrivateKey(password){
        return this.getPrivateKeyFunc({version:this.keystore.version, crypto:this.keystore.crypto2},password);
    }
    getPrivateKeyFunc(cryptoObj,password){
        let privateKey;
        try {
            privateKey = keythereum.recover(password, cryptoObj);
        }catch(error){
            console.log('wrong password!');
            return null;
        }
        return privateKey;
    }
    getAddress(){
        return '0x'+this.keystore.address;
    }
    getWaddress(){
        return '0x'+this.keystore.waddress;
    }
    getOTAPrivateKey(password,OTAAddress) {
        let privateKey = this.getPrivateKey(password);
        let wanKey = this.getWanPrivateKey(password);
        if (privateKey && wanKey) {
            return wanUtil.computeWaddrPrivateKey(OTAAddress, privateKey, wanKey);
        }
        return null;
    }
    changePassword(oldPassword,newPassword){
        var privateKey = this.getPrivateKey(oldPassword);
        var keyObject = keythereum.dump(newPassword, privateKey, this.keystore.crypto.kdfparams.salt, this.keystore.crypto.cipherparams.iv);
        fs.writeFileSync(this.fileName,JSON.stringify(keyObject));
    }
}