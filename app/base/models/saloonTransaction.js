/**
 * Created by Ankur.Gupta on 29-September-17.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TransactionSchema = new Schema({
    saloonId: {
        type: String,
        required: true
    },
    amountReceived: {
        type: Number
    },
	amountToPay: {
        type: Number
    },
	dateTime:{
		type:Date
	},
	status:{
		type:String
	},
	transactionType:{
		type:Number
	},
	paymentId:{
	  type: String	
	},
	bookingId:{
	  type: String	
	},
	generatePdf:{
		type:String
	}

});

var SaloonTransaction = mongoose.model('SaloonTransaction', TransactionSchema);
module.exports = SaloonTransaction;