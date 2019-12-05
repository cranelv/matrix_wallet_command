let config = require('../config');

let gKeyStore = new keystoreDir(config.keyStorePath);
gKeyStore.initAccounts();
module.exports = class Account{
    constructor(address,password) {
        this.Account = gKeyStore.getAccount(address);
        this.privateKey = this.Account.getPrivateKey(password);
    }
    signAndHash(trans){
        return trans.signAndHash(this.privateKey);
    }
}