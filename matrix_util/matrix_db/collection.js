"use strict";

module.exports = class manCollection{
    constructor(collectionName,UID,ItemDefine) {
        this.collectionName = collectionName;
        this.UID = UID;
        this.collection = null;
        this.ItemDefine = ItemDefine;
    }
    setDb(db){
        this.collection = db.getCollection(this.collectionName,this.UID);
        // if(this.collection)
        //     return this.collection;
        // else{
        // }
    }
    intertItem(item,autoIncrement){
        let newItem = this.cloneItem(item);
        if(autoIncrement){
            newItem[this.UID] = this.getAutoIncrementUID();
        }
        this.collection.insert(newItem);
    }
    getAutoIncrementUID()
    {
        var result = this.collection.maxRecord(this.UID);
        if(result && result.value)
        {
            return result.value + 1;
        }
        else
        {
            return 1;
        }
    }
    cloneItemDefine(){
        return this.cloneItem(this.ItemDefine);
    }
    cloneItem(item) {
        var newItem = {};
        for (var key in this.ItemDefine) {
            if(item.hasOwnProperty(key)){
                newItem[key] = item[key];
            }
        }
        return newItem;
    };
}
