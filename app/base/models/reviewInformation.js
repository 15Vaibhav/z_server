/**
 * Created by Ankur.Gupta on 28-October-17.
 */
/**
 * Created by Ankur.Gupta on 13-September-17.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var reviewInfo = new Schema({
    saloonId: {
        type: String
    },

    reviewId: {
        type: String
    },
    bookingId:{
        type: String
    },
    url: {
        type: String
    },
    rating: {
        type: String
    },
    review: {
        type: String
    },
    tag: {
        type: [String]
    },
    postedBy: {
        type: String
    },
    postedName: {
        type: String
    },
    dateAndTime:{
        type:Date
        //default:Date.now()
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
            type:Date
        },
        name:{
            type:String
        }

    }]

});
var ReviewInformation = mongoose.model('ReviewInformation', reviewInfo);
module.exports = ReviewInformation;