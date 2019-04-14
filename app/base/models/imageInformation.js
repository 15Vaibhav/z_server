/**
 * Created by Ankur.Gupta on 27/10/17.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var imageInfoSchema = new Schema({

    saloonId: {
        type: String
    },
    activityId: {
        type: String,
        unique:true
    },
    postedBy: {
        type: String
    },
    url: {
        type: String
    },
    description: {
        type: String
    },
    tag: {
        type: [String]
    },
    isAdvertisement:{
        type:String
    },
    imageType:{
        type: String, enum: ["SaloonImage", "TimeLine", "Both"]
    },
    listOfLike: [{
        userId: {
            type: String
        },
        name: {
            type: String
        }
    }],
    listOfComment: [{

        userId: {
            type: String
        },
        commentDesc: {
            type: String
        },
        dateAndTime: {
            type: Date
        },
        name: {
            type: String
        }

    }],
    postingDate:{
        type:Date
    },
    salonName:{
        type:String
    }

});

var ImageInformation = mongoose.model('ImageInformation',imageInfoSchema);
module.exports = ImageInformation;