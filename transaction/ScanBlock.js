let BaseSyncClass = require('../matrix_util/BaseSyncClass.js');
const Web3 = require("web3");
let net = require('net');
module.exports = class ScanBlock extends BaseSyncClass {
    constructor(scanObj){
        super()
        this.scanObj = scanObj;
        if(scanObj.Ipc){
            this.web3 = new Web3(new Web3.providers.IpcProvider( scanObj.Ipc, net));
        }else if(scanObj.Rpc){
            this.web3 = new Web3(new Web3.providers.HttpProvider(scanObj.Rpc));
        }
        let self = this;
        this.BlockNum = this.scanObj.Start ? this.scanObj.Start : 0;
        if (!this.scanObj.End){
            this.function400 = function () {
                this.web3.eth.getBlockNumber((err, n) => {
                    if (!err) {
                        self.scanObj.End = n;
                    }
                    self.stepNext();
                });
            }
        }
        this.function500 = function () {
            this.web3.eth.getBlock(this.BlockNum,true,function (err,result) {
                if (err){
                    console.log(err)
                }else if(result){
                    self.ScanBlockTxs(result)
                }
                self.BlockNum++;
                if(self.BlockNum<=self.scanObj.End){
                    self.stepCurrent();
                }else{
                    self.stepNext();
                }

            })
        }
    }
    ScanBlockTxs(block){
        for (var i = 0;i<block.transactions.length;i++){
            let bFind = true;
            let item = block.transactions[i];
            for (var key in this.scanObj){
                if (item.hasOwnProperty(key) && item[key] != this.scanObj[key]){
                    bFind = false;
                    break;
                }
            }
            if(bFind){
                console.log(item)
            }
        }
    }
    break(){
        super.break();
        this.web3.currentProvider.disconnect()
    }
}