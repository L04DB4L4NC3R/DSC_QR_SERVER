const mongoose = require("mongoose");

let urlschema = new mongoose.Schema({
    url:{
        type:String,
        required:true
    }
});


module.exports.urlmodel = mongoose.model("url",urlschema);