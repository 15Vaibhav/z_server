
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sponsoredSaloonSchema = new Schema({
    saloonId: {
        type: String
    },
    validTo: {
        type: Date
    },
    validFrom: {
        type: Date
    },
    location: {
        type: [Number],
        index: '2d'
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
    planType:{
        type:Number
    }


});


var sponsoredSaloons = mongoose.model('sponsoredSaloons', sponsoredSaloonSchema);
module.exports = sponsoredSaloons;