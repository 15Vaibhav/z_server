/**
 * Created by Dell on 10/15/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SalonSchema = new Schema({

    parentName: {
        type: String
    },
    branchId: {
        type: String  // branchId for same salons in different location will be same
    }
});
var branch = mongoose.model('branch', SalonSchema);
module.exports = branch;
