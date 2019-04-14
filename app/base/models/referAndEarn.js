/**
 * Created by Ankur.Gupta on 27-October-17.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var referSchema = new Schema({
   loginId:{
       type: String,
       required: true
   },
    referralCode:{
       type:String
   },
    noOfReferrals:{
        type:Number
    },
    userId:{
        type:String
    }
});

var ReferAndEarn = mongoose.model('ReferAndEarn',referSchema);
module.exports = ReferAndEarn;