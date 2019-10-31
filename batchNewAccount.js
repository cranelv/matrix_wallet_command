let keystoreDir = require('../matrix_util/keystore/keystoreDir.js');
let config = require('../config');
const fs = require('fs');
const path = require('path');
function mkdirsSync(dirname) {

    if (fs.existsSync(dirname)) {

        return true;

    } else {

        if (mkdirsSync(path.dirname(dirname))) {

            fs.mkdirSync(dirname);

            return true;

        }

    }

}
let keyStoreNum = 100;
let passwordLen = [15,6];
let password = [];
for (var i=0;i<10;i++) {
    password.push(i);
}
for (var i=0;i<10;i++) {
    password.push(i);
}
password.push(...['a','b','c','d','e','f','g','h','i','j','k','m','n','o','p','q','r','s','t','u','v','w','x','y','z']);
password.push(...['A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z']);
/*
password.push('+');
password.push('-');
password.push('_');
password.push('=');
password.push('#');
password.push('$');
password.push('%');
password.push('!');
password.push('.');
password.push(',');
password.push('(');
password.push(')');
password.push('[');
password.push(']');
*/

let keystore = new keystoreDir(config.keyStorePath);
mkdirsSync(keystore.keystorePath);
let keyStoreAry = [];
for(var i = 0;i<keyStoreNum;i++){
    let passLen = passwordLen[0] + Math.floor(Math.random() * passwordLen[1]);
    let curPass = "";
    for (var j=0;j<passLen;j++){
        var index = Math.floor(Math.random() * password.length);
        curPass += password[index];
    }
    let address = keystore.CreateAccount(curPass);
    keyStoreAry.push({address:address,password:curPass});
}
fs.writeFileSync(path.join(keystore.keystorePath,'keystore.json'),JSON.stringify(keyStoreAry,null,2),"utf8");
setTimeout(function () {
    keystore.initAccounts();
    let accountAry = JSON.parse(fs.readFileSync(path.join(keystore.keystorePath,'keystore.json')));
    for (var i=0;i<accountAry.length;i++){
        let account = accountAry[i];
        keystore.getAccount(account.address).getPrivateKey(account.password);
    }
    console.log("Keystore generation is finished!")
},100);
