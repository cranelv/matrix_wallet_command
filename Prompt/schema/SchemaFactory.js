let passwordProperty = require('./NormalSchemaProperty.js').passwordProperty;
let InputSchemaProperty = require('./NormalSchemaProperty.js').InputSchemaProperty;
let addressProperty = require('./NormalSchemaProperty.js').addressProperty;
let UintProperty= require('./NormalSchemaProperty.js').UintProperty;
let FloatProperty= require('./NormalSchemaProperty.js').FloatProperty;
let YesNoProperty= require('./NormalSchemaProperty.js').YesNoProperty;
//let TokencollectionSchama = require('./TokencollectionSchama.js');
//let localAccountProperty = require('./localAccountSchema.js');
let Descript= require('./DescAndMsg.js');
module.exports = {
    password(valueKey) {
        return new passwordProperty(valueKey,'Enter '+valueKey + ' : ',Descript.Message.errPassword,5);
    },
    repeatPass() {
        return new passwordProperty('repeatPass',Descript.Description.repeatPassword,Descript.Message.errRepeatPass,5);
    },
    hash(){
        return new InputSchemaProperty('hash',Descript.Description.transactionHash,Descript.Message.errOptionNum);
    },
    fromAccount(){
        return new InputSchemaProperty('from',Descript.Description.localAddress,Descript.Message.errOptionNum);
    },
    fileName(){
        return new InputSchemaProperty('file',Descript.Description.solidity,Descript.Message.errFileName);
    },
    contractName(){
        return new InputSchemaProperty('name',Descript.Description.contractName,Descript.Message.errcontractName);
    },
    fromKeystoreAccount(lockTxchainType) {
        if(lockTxchainType == 'WAN')
            return new keystoreAccountSchema('from', Descript.Description.localWANAddress, Descript.Message.errOptionNum, global.WanKeyStoreDir,lockTxchainType);
            //return new keystoreAccountSchema('from', Descript.Description.localWANAddress, Descript.Message.errOptionNum, walletCore.WanKeyStoreDir,lockTxchainType);
        else
            return new keystoreAccountSchema('from', Descript.Description.localETHAddress, Descript.Message.errOptionNum, global.EthKeyStoreDir,lockTxchainType);
//            return new keystoreAccountSchema('from', Descript.Description.localETHAddress, Descript.Message.errOptionNum, walletCore.EthKeyStoreDir,lockTxchainType);
    },
    getStoremanGroup(sendServer) {
        return new getStoremanGroup('storemanGroup',Descript.Description.getStoremanGroup,Descript.Message.errOptionNum,sendServer);
    },
    crossTransOptionalSchama(lockTxchainType){
        return new crossTransOptionalSchama('lockTxHash',Descript.Description.lockTxHash,Descript.Message.errOptionNum,lockTxchainType);
    },
    toAccount(){
        return new addressProperty('to',Descript.Description.toAddress,Descript.Message.errAddress);
    },
    crossAccount(chainType){
        return new addressProperty('cross',Descript.Description.toAddress,Descript.Message.errAddress,chainType);
    },
    account(chainType){
        return new addressProperty('account',Descript.Description.address,Descript.Message.errAddress,chainType);
    },
    Amount(){
        return new FloatProperty('amount',Descript.Description.amount,Descript.Message.errAmount,1e-18);
    },
    FeeGroup(){
        let Fee = this.Fee();
        let gasPrice = this.gasPrice();
        let gasLimit = this.gasLimit();
        Fee.SkippedPrompt = [gasPrice,gasLimit];
        return [Fee,gasPrice,gasLimit];
    },
    FeeOption(){
        return new UintProperty('fee',Descript.Description.inputFee,Descript.Message.errInput);
    },
    gasPrice(){
        return new UintProperty('gasPrice',Descript.Description.gasPrice,Descript.Message.gasPrice,18,600);
    },
    gasLimit(){
        return new UintProperty('gas',Descript.Description.gasLimit,Descript.Message.gasLimit,21000,4700000);
    },
    submitSend(){
        let submit = new YesNoProperty('submit',Descript.Description.submitSend,Descript.Message.errSubmit);
        return submit;
    },
    submitSendGroup(){
        let submit = this.submitSend();
        let password = this.password();
        submit.SkippedPrompt = [password];
        return [submit,password];
    },
    // localTokenBalance(collections,collectionName){
    //     return new TokencollectionSchama('tokenAddress',Descript.Description.tokenBalance,Descript.Message.errOptionNum,collections,collectionName);
    // }
}
