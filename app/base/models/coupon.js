/**
 * Created by Ankur.Gupta on 25-September-17.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var CouponSchema = new Schema({
    couponCode: {
        type: String,
        required : true,
        unique: true
    },
    location: {
        type: [Number],
        index: '2d'
    },
    couponName: {
        type: String
    },
    minOrderAmount: {
        type: Number//  it is minimum amount on which customer can take the discount
    },
    maxOrderAmount: {
        type:Number  //it is max amount on which customer can take the discount(as in case of % discount)
    },
    validTo: {
        type: Date
    },
    validFrom: {
        type: Date
    },
    saloonId: {
        type: [String]
    },
    itemId:{
        type:[String]
    },
    itemName:{
        type:[String]
    },

   couponCreatedBy: {
        type: String
    },
    createdOn: {
        type: Date
    },
    modifiedOn: {
        type: Date
    },
    couponDescription: {
        type: String
    },
    couponType: {
        type: String
    },
    isCombinedWithOtherOffers:{
        type:Boolean
    },
    usageCount:{
        type:Number
    },
    couponUrl: {
        type: String
    },
    discountType:{
        type:String, enum: ["Percent", "Amount"]
    },
    discountAmount:{
        type:Number
    },
	cashback:[{
		couponType:{
			type:String , enum: ["Percent", "Amount"]
		},
		
		maxCashBack :{
			type:Number
		},
		discount : {
			type:Number 
			}
	}]

});

var coupons = mongoose.model('coupons', CouponSchema);
module.exports = coupons;
