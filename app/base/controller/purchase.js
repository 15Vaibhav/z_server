var mongoose = require('mongoose')
var Schema = mongoose.Schema
var PaymentSchema = new Schema({
buyerId:{
    type:String
},
paymentId:{
    type:String
},
dateTime:{
    type:String
},
buyerName:{
    type:String
},
orderId:{
    type:String
},
taxApplied:{
    type:Number
},
address:{
    trype:String
},
ammoutRecieved:{
    type:Number
},
discoutedAmount:{
    type:Number
},
productList:[{
    productName:{
        type:String
    },
    productId:{
        type:String
    },
    productPrice:{
        type:Number
    },
    orderQty:{
        type:Number
    },
    category:{
        type:Number
    },
    itemPrice:{
       type:Number
    },
    productDescription:{
        type:String
    },
    productImage:{
        type:[String]
    },



}],
bookingStatus:{
    type:String
}
})
var ProductPayment = mongoose.model('payement', PaymentSchema);
module.exports = ProductPayment;
