/**
 * Created by Ankur.Gupta on 27/10/17.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PackCoupAppliedSchema = new Schema({

    userId: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    couponApplied: {
        type: [String]
    },
    packageUsed: [{
        packageId: {
            type: String
        },
        packageName: {
            type: String
        }
    }]

});


var OffersApplied = mongoose.model('OffersApplied', PackCoupAppliedSchema);
module.exports = OffersApplied;