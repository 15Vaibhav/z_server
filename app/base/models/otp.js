/**
 * Created by Ankur.Gupta on 05/10/17.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var otpSchema = new Schema({

    loginId: {
        type: String
    },
    otp: {
        type: Number
    },
    userType: {
        type: Number,
        required: true
    },
    dateAndTime:{
        type:Date
    },
    otpType:{
        type:Number
    },
    skipReason:{
        type:String
    }

});

var otp = mongoose.model('otp', otpSchema);
module.exports = otp;