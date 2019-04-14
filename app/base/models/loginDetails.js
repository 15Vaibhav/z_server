/**
 * Created by Ankur on 10/19/2017.
 */
// NOTE :userId ,LoginId,userType all are the primary key in combination
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LoginSchema = new Schema({
    userId: {     //it will be either salon id  or customer Id or employee id
        type: String,
        required: true
    },
    loginId: {            // it can be email phone number based  on userType
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: Number,
        required: true
    }
});
LoginSchema.index({ loginId: 1, userType: 1}, {unique: true});
var loginDetails = mongoose.model('loginDetails', LoginSchema);
module.exports = loginDetails;