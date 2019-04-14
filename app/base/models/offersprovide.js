var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OffersSchema = new Schema({
  
   saloonId:{
    type:String
},
salonName:{
    type:String
},
location: {
    type: [Number],
        index: '2d'
},
   description:{
       type:String
   },
   offlinePrice:{
       type:Number
   },
   onlinePrice:{
       type:Number
   },
   offerId:{
       type:String
   },
   gender:{
       type:String
   }

});

                     
module.exports =  mongoose.model('offersprovided', OffersSchema );
