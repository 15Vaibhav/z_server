var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var saloonViewSchema = new Schema({
    saloonId: {
        type: String
    },
    noOfViews: {
        type: Number
    }
});

var SaloonViews = mongoose.model('SaloonViews', saloonViewSchema);
module.exports = SaloonViews;