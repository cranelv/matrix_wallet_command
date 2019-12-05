module.exports = class Web3Request{
    constructor(web3,funcArr,Args){
        this.obj = web3;
        for (var i=0;i<funcArr.length;i++){
            if (this.obj.hasOwnProperty(funcArr[i])){
                this.obj = this.obj[funcArr[i]];
            }else{
                console.error(funcArr[i] + "is not Property")
                break;
            }
        }
        this.Args = Args
    }
    getValue(callback){
        this.obj(...this.Args,function (err,result) {
            if(err){
                console.error(err);
            }else{
                callback(result);
            }
        })
    }
}