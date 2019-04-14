/*
 * Created by Ankur on 8/10/2017
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SalonSchema = new Schema({
    saloonId: {
        required: true,
        unique: true,
        type: String
    },
    salonCat:{
        type:Number
    },
    parentName: {
        type: String
    },
    saloonName: {
        type: String
    },
    tagLine: {
        type: String
    },
    mobileNumber: {
        type: String,
        unique: true
    },
    alternateNumber:{
        type: [String]
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
    branchId: {
        type: String  // branchId for same salons in different location will be same
    },
    emailId: {
        type: String
    },
    saloonType: {
        type: String, enum: ["Both", "Female", "Male"],
        required: true
    },
    scheduleTiming: [{
        day: {
            type: String, enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            required: true
        },
        open: {
            type: Number
        },
        close: {
            type: Number
        }
    }],
    description: {
        type: String
    },
    ownerInformation: [{
        ownerName: {
            type: String
        },
        ownerNumber: {
            type: String
        },
        ownerEmail: {
            type: String
        }

    }],
    logoUrl: {
        type: String
    },
    rateCardUrl: {
        type: [String]
    },
    frontPageUrl: {
        type: String
    },
    salonTopPhotosUrl: {
        type: [String]//will contain only 4 images
    },
    location: {
        type: [Number],
        index: '2d'
    },
    services: [{
        category: {
            type: String, enum: ["Male", "Female"],
            required: true
        },
        service: {
            type: String
        },
        item: {
            type: String
        },
        itemId: {
            type: String
        },
        itemRate: {
            type: Number
        }
    }],
    validTo: {
        type: Date
    },
    validFrom: {
        type: Date
    },
    averageRating: {
        type: Number,
        default:0
    },
    brands: {
        type: [String]
    },
    moreInformation: {
        type: [String]
    },
    specialFor: {
        type: [String]
    },
    homeService:{
        type:Number
    },
    noOfViews: {

        type: Number
    },
    sponsoredValidFrom:{
        type:Date
    },
    sponsoredValidTo:{
        type:Date
    },
    gstIn:{
        type:String
    },
    panNo:{
        type:String
    },
    planType:{
        type:Number
    }

});

var Salon = mongoose.model('Salon', SalonSchema);
module.exports = Salon;


