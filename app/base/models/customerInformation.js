/**
 * Created by Dell on 10/19/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CustomerSchema = new Schema({
    customerId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
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
    },
    address: [{
        hno: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        },
        country: {
            type: String
        },
        pincode: {
            type: String
        },
        locality: {
            type: String
        }

    }],
    emailId:{
        type:String
    },
    url: {
        type: String
    },
    gender:{
        type:String
    }
});

var Customer = mongoose.model('Customer', CustomerSchema);
module.exports = Customer;
