var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var ProductSchema  = new Schema({
 productId:{
     type:String,
     unique:true
 },
 productName:{
     type:String
 },
 productDescription:{
     type:String
 },
 productUrl:{
    type:[String]
  },
  offlinePrice:{
      type:String
  },
  onlinePrice:{
      type:String
  },
  qty:{
      type:Number
  },
  categories:{
      type:String
  }

})

var product = mongoose.model('product', ProductSchema);
module.exports = product;
