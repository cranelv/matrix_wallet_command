
module.exports = class BaseSyncClass
{
    constructor() {
        this.bWait = false;
        this.timeInv = null;
        this.func = [];
        this.index = 0;
    }
    stepNext()
    {
        this.bWait = false;
        this.index++;
    }
    stepCurrent()
    {
        this.bWait = false;
    }
    run()
    {
        this.index = 0;
        for (var key in this){
            if(key.indexOf("function")>=0){
                this.func.push(key);
            }
        }
        if(this.func.length>0){
            this.func.sort();
            this.waitInfo(5);
            this.callFunc();
        }
    }
    break(){
        clearInterval(this.timeInv);
        return "break";
    }
    quit(){
        //process.exit();
    }
    CallCurrent(){
        return this[this.func[this.index]]();
    }

    callFunc() {
        let self = this;
        while(!self.bWait)
        {
            if(self.index<self.func.length)
            {
                if(!this[this.func[this.index]] || typeof this[this.func[this.index]] != 'function'){
                    self.index++;
                    continue;
                }
                let Sync = self.bWait = this.func[this.index][this.func[this.index].length-1];
                let bAsync = (Sync != 'S' && Sync != 's');
                self.bWait = bAsync;
                if(self.CallCurrent() == "break"){
                    break;
                }
                if (!bAsync){
                    self.index++;
                }
            }
            else
            {
                self.break();
                break;
            }
        }
    }
    waitInfo(ms)
    {
        let self = this;
        self.timeInv = setInterval(function(){
            if(!self.bWait)
            {
                self.callFunc();
            }
        },ms);
    }
}