const fs = require('fs');
let filename = "../json/accounts.json"
let jsonArr = fs.readFileSync(filename, "utf8");
let Arr = JSON.parse(jsonArr);
let sum = 0;
for (var i=0;i<Arr.length;i++){
    sum += Arr[i]["打款金额"]
}
console.log(sum)
let bbb = Arr.sort(function (a,b) {
    return a["打款金额"] - b["打款金额"]
});
fs.writeFileSync('../json/sort_accounts.json',JSON.stringify(bbb,null,4),"utf8");
