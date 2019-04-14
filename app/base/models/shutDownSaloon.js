

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var shutDownSchema = new Schema({
    saloonId: {
        type: String
    },
    saloonName: {
        type: String
    },
    emailId: {
        type: String
    },
    mobileNumber: {
        type: String
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
    saloonType: {
        type: String, enum: ["Both", "Female", "Male"],
        required: true
    },
    location: {
        type: [Number],
        index: '2d'
    },
    parentName: {
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

    }]

});

var ShutDownSaloon = mongoose.model("ShutDownSaloon", shutDownSchema);
module.exports = ShutDownSaloon;