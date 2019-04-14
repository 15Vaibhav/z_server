var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BlogSchema = new Schema({
blogId:{
    type:String
},

email:{
    type:String
},
postTitle:{
    type:String
},
name:{
    type:String
},
detailedPost:{
    type:String
},
postUrl:{
    type:[String]
},
date:{
    type:String
}
})
var blog = mongoose.model('bogs',BlogSchema)
module.exports = blog