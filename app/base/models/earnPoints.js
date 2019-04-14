/**
 * Created by Ankur.Gupta on 29-September-17.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EarnPointSchema = new Schema({
    saloonId: {
        type: String,
        required: true
    },
    points: {
        type: Number
    }

});

var EarnPoint = mongoose.model('EarnPoint', EarnPointSchema);
module.exports = EarnPoint;