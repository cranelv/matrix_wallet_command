'use strict';

const Err_Address =  'Address check error';
let EthTx = require('ethereumjs-tx');
let ethUtil = require('ethereumjs-util');
var rlp = require('rlp');
let Tx = require('ethereumjs-tx');
class IRawTransaction
{
    constructor(trans)
    {
        this.trans = trans;
    }
    setKeyStore(keystoreDir){
        this.Account = keystoreDir.getAccount(this.trans.from);
    }
    sign(web3,privateKey,callback)
    {
//       console.log(this.trans);
         let Key = "0x"+privateKey.toString("hex");
//       var rawTransaction = this.MatrixSign(privateKey);
//        setTimeout(function () {
//            callback(false,{"rawTransaction":rawTransaction})
//        },0);

         web3.eth.accounts.signTransaction(this.trans,Key,callback);
    }
    signAndHash(privateKey)
    {
        const tx = new Tx(this.trans);
        tx.sign(privateKey);
        var hash = tx.hash(true);
        const serializedTx = tx.serialize();
        return ["0x"+serializedTx.toString('hex'),hash];
    }

    MatrixSign(privateKey){

        var txData = [];
        this.trans.value = Number(this.trans.value);
        txData = [
            ethUtil.toBuffer(this.trans.nonce),
            ethUtil.toBuffer(this.trans.gasPrice),
            ethUtil.toBuffer(this.trans.gas),
            ethUtil.toBuffer(this.trans.to),
            ethUtil.toBuffer(this.trans.value),
            ethUtil.toBuffer(this.trans.data),
//            this.trans.Txtype,
            ethUtil.toBuffer(this.trans.chainId),
            ethUtil.toBuffer(),ethUtil.toBuffer()
        ];
        var hash = ethUtil.rlphash(txData);
        const sig = ethUtil.ecsign(hash, privateKey)
        sig.v += this.trans.chainId * 2 + 8
        txData = txData.slice(0,6)
        txData.push(ethUtil.toBuffer(sig.v),ethUtil.toBuffer(sig.r),ethUtil.toBuffer(sig.s));
        var txrlp = rlp.encode(txData)
//const serializedTx = tx.serialize();
        return "0x"+txrlp.toString('hex');
    }
    signFromKeystore(password)
    {
        let privateKey = this.Account.getPrivateKey(password);
        if(privateKey)
        {
            return this.sign(privateKey);
        }
        else
        {
            return null;
        }
    }
    send(web3,password,callback){
        console.log(this.trans);
        web3.eth.personal.sendTransaction(this.trans,password,callback)
    }
    sendRaw(web3,rawTx,callback){
        web3.eth.sendSignedTransaction(rawTx,callback);
    }
    Bytes2HexString(b){
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
};
//normal transaction
class NormalSend extends IRawTransaction
{
    constructor(trans)
    {
        super(trans);
    }
};
class TokenSend extends IRawTransaction
{
    constructor(from,to,gas,gasPrice,nonce)
    {
        super(from,to,gas,gasPrice,nonce);
        this.trans.setValue(0);
    }
};
exports.NormalSend = NormalSend;
exports.TokenSend = TokenSend;
