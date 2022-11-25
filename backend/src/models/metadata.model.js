const mongoose = require('mongoose');

// shared meta schema
var MetaSchema = mongoose.Schema(
    {
        config:String,
        value: Boolean
    }
)

var Meta = mongoose.model('meta', MetaSchema, 'meta');

// handle CRUD for user
module.exports = {
    
    getFreeRegister: async function () {
        const filter = {
            'config':'FreeRegisterUnlocked',
        }
        const result =  await Meta.findOne(filter);
        return result.value;
    },
    lockFreeRegister: async () => {
        const filter = { "config": "FreeRegisterUnlocked" };
        const updatingData = {
            "value":false
        }

        let doc = await Meta.findOne(filter);
        if(!doc){
            console.log("default metadata has not been initialized");
            let defaultData = {
                config: "FreeRegisterUnlocked",
                value: true
            }

            const newData = new Meta(defaultData);

            const result = await newData.save();

            console.log("Default data created successfully");
        }

        try {
            let doc = await Meta.findOneAndUpdate(filter, updatingData);
            console.log(`free register locked ${doc}`);
            return true;
        }
        catch (err) {
            console.log(`update failed due to error ${err}`);
            return false;
        }
    },
}