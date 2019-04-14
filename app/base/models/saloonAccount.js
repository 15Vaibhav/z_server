
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SaloonSchema = new Schema({
    saloonId: {
        type: String,
        required: true,
        unique: true
    },
    saloonName: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true
    },
    userType: {
        type: Number,
        required: true
    }
});


var saloonAccount = mongoose.model('saloonAccount', SaloonSchema);
module.exports = saloonAccount;