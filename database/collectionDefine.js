let manCollection = require("../matrix_util/matrix_db/collection.js");
module.exports = {
    transaction(db){
        let collection = new manCollection("transaction","hash",{
            hash : '',
            from : '',
            to : '',
            value : '',
            time : '',
            state : ''
        });
        collection.setDb(db);
        return collection;
    } ,
}