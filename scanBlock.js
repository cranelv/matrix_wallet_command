let ScanBlock = require('../transaction/ScanBlock.js');

let findObj = {
//    Ipc : "",
    Rpc : "http://192.168.4.66:8546",
    Start : 0,
//    End : 0,
//    From : "",
//    To : "",
}
let Scan = new ScanBlock(findObj);
Scan.run();
/*
let Scan = undefined;
let timeInv = setInterval(function(){
    if (Scan){
        findObj.Start = Scan.scanObj.End+1;
    }
    findObj.End = undefined;
    Scan = new ScanBlock(findObj);
    Scan.run();
},60000);
*/