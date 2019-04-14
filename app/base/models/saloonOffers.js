/*
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var salOffer = new Schema({
    saloonId: {
        type: String,
        unique: true
    },
    offers: [{
        category: {
            type: String, enum: ["Male", "Female"]

        },
        service: {
            type: String
        },
        item: {
            type: String
        },
        discount: {
            type: String
        },
        validity: {
            type: Boolean
        },
        offerType: {
            type: String// it will contain monthly Scheme or one time offer
        },
        validTo: {
            type: Date
        },
        validFrom: {
            type: Date
        },
        postingOn:{
            type:Date
        }
    }]
});


var SaloonOffer = mongoose.model('SaloonOffer', salOffer);
 module.exports = SaloonOffer;*/
