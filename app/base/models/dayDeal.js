/**
 * Created by Ankur.Gupta on 17-December-17.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DealSchema = new Schema({
    dealCode: {
        type: String
    },
    dealId:{
        type:String,
        unique: true
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
        type: String
    },
    saloonName: {
        type: String
    },
    services:[{
        category:{
                type:String
            },
        subCategory:{
            type:String
        },
        itemId:{
            type:String
        },
        itemName:{
            type:String
        },
        onlinePrice:{
            type:Number
        },
        offlinePrice:{
            type:Number
        },
        gender:{
            type:String
        },
        chargedAmount:{
            type:Number
        }
    }],
    dealCreatedBy: {
    type: String
    },
    createdOn: {
        type: Date
    },
    isCombinedWithOtherOffers:{
        type:Boolean
    },
    usageCount:{
        type:Number
    },
    location: {
        type: [Number],
        index: '2d'
    },
    dayDealUrl: {
        type: String
    },
    discountType:{
        type:String, enum: ["Percent", "Amount"]
    },
    discountAmount:{
        type:Number
    }


    });

var dayDeals = mongoose.model('dayDeals', DealSchema);
module.exports = dayDeals;
