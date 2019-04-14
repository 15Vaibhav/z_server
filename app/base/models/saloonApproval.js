
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var salApproval = new Schema({
    requestId: {
        type: String
    },
    employeeId: {
        type: String
    },
    saloonName: {
        type: String
    },
    emailId: {
        type: String
    },
    phoneNumber: {
        type: String

    },
    address:{
        type:String
    },
    status: {
        type: Number
    },
    requestTime: {
        type: Date
    },
    actionTime: {
        type: Date
    },
    saloonId:{
        type:String
    },
    rateCard:[{
        category:{
            type:String
        },
        subCategory: {
            type: String
        },
        itemId:{
            type:String
        },
        itemName:{
            type:String
        },
        gender:{
            type:String
        },
        onlinePrice:{
            type:Number
        },
        offlinePrice:{
            type:Number
        },
        timing:{
            type:Date
        },
        status:{
            type:String
        }
    }],
    packages:[{
        packageId:{
            type:String
        },
        packageName: {
            type: String
        },
        packageType:{
            type: String
        },
        itemId:{
            type:[String]
        },
        itemName:{
            type:[String]
        },
        gender:{
            type:String
        },
        totalOnlinePrice:{
            type:Number
        },
        totalOfflinePrice:{
            type:Number
        },
        previousPrice:{
            type:Number
        },
        isValid:{
            type:Number
        }
    }],
     requestType:{
       type:String
     }
});

var saloonApproval = mongoose.model('saloonApproval', salApproval);
module.exports = saloonApproval;