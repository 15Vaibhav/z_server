var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var PCustomerSchema = new Schema({
    userId:{
        type:Number
    },
    name:{
        type:String
    },
    mobileNumber:{
    type:Number
}
})

var pcustomer = mongoose.model('pcustomer', PCustomerSchema );
module.exports = pcustomer;
