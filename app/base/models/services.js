/**
 * Created by Ankur.Gupta on 02-December-17.
 */
/**
 * Created by Dell on 8/10/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var servicesSchema = new Schema({
    category: {
        type: String,
        required: true
    },
    subCategory:{
      type:String
    },
    itemName: {
        type: String
    },
    itemId: {
        type: String
    },
    gender:{
        type:String
    }

});
servicesSchema.index({category: 1, subCategory: 1, itemName: 1,gender:1}, {unique: true});

var Services2 = mongoose.model('Service', servicesSchema);
module.exports = Services2;
