/**
 * Created by Ankur.Gupta on 22/10/17.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmployeeSchema = new Schema({
    employeeId: {
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
    isBlocked:{
        type:Boolean
    }
});;


var Employee = mongoose.model('Employee', EmployeeSchema);
module.exports = Employee;
