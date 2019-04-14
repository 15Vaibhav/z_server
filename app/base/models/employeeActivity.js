/**
 * Created by Ankur.Gupta on 29-September-17.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmployeeActivitySchema = new Schema({
    employeeId: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    mobileNumber: {
        type: String,
        required: true
    },
    workType: {
        type: String, enum: ["SC", "PA"],//Salon Creation , Payment Received
        required: true
    },
    saloonId: {
        type: String,
        required: true
    },
    paymentId: {
        type: String
    },
    dateTime: {
        type: Date
    }

});

//EmployeeActivitySchema.index({workType:1,saloonId:1},{unique:true});
var EmployeeActivity = mongoose.model('EmployeeActivity', EmployeeActivitySchema);
module.exports = EmployeeActivity;