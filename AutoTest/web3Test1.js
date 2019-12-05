let web3Checker = require("../AutoRunClass/Web3Checker.js");
let web3Request = require("../AutoRunClass/Web3Request.js");
let config = require('../config');
let Checker = new web3Checker(config);
let request = new web3Request(Checker.web3,["eth","getBlock"],[0])
request.getValue(function (result) {
    console.log(result)
})