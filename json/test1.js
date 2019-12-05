var erc2011 = [ {"constant": false,"inputs": [{"name": "to","type": "address"},{"name": "value","type": "uint256"}],"name": "transfer","outputs": [{"name": "","type": "bool" }], "payable": false,"stateMutability": "nonpayable","type": "function"}]
contractDef = eth.contract(erc2011);
coinContractAddr = "0x0000000000000000000000000000000000000064";
coinContract = contractDef.at(coinContractAddr);
txBuyData = coinContract.transfer.getData(coinContractAddr, web3.toWei(1));