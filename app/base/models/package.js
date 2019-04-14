/**
 * Created by Ankur.Gupta on 26/10/7.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var packageSchema = new Schema({
        packageId:{
            type:String
        },
        packageName: {
            type: String
        },
        packageType:{
            type: String
        },
        itemId:{
            type:[String]
        },
        itemName:{
            type:[String]
        },
        gender:{
            type:String
        }

});

packageSchema.index({packageId:1},{unique:true});
var packages = mongoose.model('packages', packageSchema);
module.exports = packages;