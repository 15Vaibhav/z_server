/**
 * Created by Ankur.Gupta on 23-November-17.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var saloonServiceSchema = new Schema({

    saloonId: {
       type:String
    },
    
    saloonName:{
        type:String
     },
    location: {
        type: [Number],
        index: '2d'
    },
    rateCard:[{
        category:{
            type:String
        },
        subCategory: {
            type: String
        },
        itemId:{
            type:String
        },
        itemName:{
            type:String
        },
        gender:{
            type:String
        },
        onlinePrice:{
            type:Number
        },
        offlinePrice:{
          type:Number
        },
        timing:{
            type:Date
        }
    }],
    packages:[{
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
        },
        totalOnlinePrice:{
            type:Number
        },
        totalOfflinePrice:{
            type:Number
        },
        previousPrice:{
            type:Number
        },
        isValid:{
            type:Number
        }
    }]
});

saloonServiceSchema.index({category: 1, saloonId: 1, subCategory:1,"rateCard.gender":1}, {unique: true});
var SaloonService = mongoose.model('SaloonService', saloonServiceSchema);
module.exports = SaloonService;
