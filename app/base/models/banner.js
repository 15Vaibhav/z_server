var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bannerSchema = new Schema({
  saloonId:{
      type:String
  },
    location: {
        type: [Number],
            index: '2d'
    },
    bannerId:{
        type:String
    },
    bannerUrl:{
      type:String
    },
    bannerValidFrom:{
      type:Date
    },
    bannerValidTo:{
        type:Date
    },
    couponId:{
        type:String
    },
    packageId:{
      type:String
    },
    itemId:{
     type:String
    },
    itemPrice:{
        type:Number
    },
    bannerType:{
        type:String
    },
    screens:{
        type:String,enum: ["Deals", "NearBy"]
    },
    bannerCat:{
       type:Number
    }

});

var banners = mongoose.model('banners', bannerSchema);
module.exports = banners;
