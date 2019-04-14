/**
 * Created by Ankur.Gupta on 26-September-17.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var myCashSchema = new Schema({
    userId: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    myCash: {
        type: Number
    }
});

var myCash = mongoose.model('myCash', myCashSchema);
module.exports = myCash;