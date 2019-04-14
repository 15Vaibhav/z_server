
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var saloonPayment = new Schema({
    invoiceNo: {
        type: Number,
        unique: true
    },
    paymentId: {
        type: String,
        unique: true
    },
    saloonId: {
        type: String
    },
    amount: {
        type: Number
    },
    validFrom: {
        type: Date
    },
    validTo: {
        type: Date
    },
    paymentMode: {
        type: String
    },
    receivedBy: {
        type: String
    },
    dateTime: {
        type: Date
    },
    paymentStatus: {
        type: String
    },
    serviceType: {
        type: String
    },
	planType:{
        type:Number
    },
    pdfUrl:{
        type:String
    },
    generatePdf:{
        type:Number
    },
    date:{
        type:String
    }

});
saloonPayment.index({paymentId: 1});
var SaloonPaymentHistory = mongoose.model('SaloonPaymentHistory', saloonPayment);
module.exports = SaloonPaymentHistory;