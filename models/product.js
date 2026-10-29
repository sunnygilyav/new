const mongoose = require("mongoose");

const productSchema= new mongoose.Schema({

    name:{
     type:"string",
    require:true
},
price:{
    type:"number",
    require:true,
    min:0
},

quantity:{
    type:"number",
    default:0,
    min:0
}
},{
    timestamps: true
}
);

module.exports = mongoose.model("Product", productSchema);
