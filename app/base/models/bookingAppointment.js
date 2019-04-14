var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BookingSchema = new Schema({
    bookingId:{
        type:String  // Booking Id which is generated While booking
    },
    bookingCode: {
        type: String // Otp
    },
    saloonId:{
        type:String 
    },
    saloonName:{
        type:String
    },
    saloonAddress:{
      type:String

    },
    customerId:{
        type:String
    },
    services:[{
        category:{
            type:String
        },
        subCategory:{
            type:String
        },
        itemId:{
            type:String
        },
        itemName:{
          type:String
        },
        onlinePrice:{
            type:Number
        },
        gender:{
            type:String
        },
        chargedAmount:{
            type:Number
        },
        count:{
            type:Number
        },
        offlinePrice:{
            type:Number
        }
    }],
    totalAmountToPay:{
        type:Number
    },
    totalOfflinePrice:{
        type:Number
    },
    totalOnlinePrice:{
      type:Number
    },

    discountedAmount:{
        type:Number
    },
	cashbackAmount:{
		type:Number
	},
    bookingStatus:{
        type:String
    },
    bookingDateAndTime:{
        type:Date
    },
    postingDateTime:{
        type:Number
    },
    couponApplied:{
        type:String
    },
    replyDateAndTime:{
        type:Date
    },
    packages: [{
        packageId: {
            type: String
        },
        packageName: {
            type: String
        },
        packageType: {
            type: String
        },
        itemId: {
            type: [String]
        },
        itemName: {
            type: [String]
        },
        gender: {
            type: String
        },
        totalOnlinePrice: {
            type: Number
        },
        totalOfflinePrice: {
            type: Number
        },
        previousPrice: {
            type: Number
        },
        count: {
            type: Number
        },
        chargedAmount: {
            type: Number
        }
    }],
	myCashUsed:{
		type:Number
	},
    dealCode:{
        type:String
    },
    customerName :{
        type:String
    },
    taxAmount:{
        type:Number
    },
    loginId:{
        type:String
    },
    reasonForRejection:{
      type:String
    },
    instructions:{
      type:String
    },
    imageRefUrl:[String],
	zaloonzRate:{
		type:Number
	},
    rateType:{
		type:String, enum: ["Percent", "Amount"]
	}
});
var bookingAppointment = mongoose.model('bookingAppointment', BookingSchema);
module.exports = bookingAppointment;
