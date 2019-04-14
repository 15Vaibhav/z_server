/**
 * Created by Dell on 8/10/2017.
 *//*

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var serviceSchema = new Schema({
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
    }


});
serviceSchema.index({category: 1, service: 1, item: 1}, {unique: true});

var Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
*/
