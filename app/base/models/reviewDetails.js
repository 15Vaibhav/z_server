/*

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reviewSchema = new Schema({
    saloonId: {
        type: String
    },
    reviewList: [{
        reviewId: {
            type: String
        },
        url: {
            type: [String]
        },
        rating: {
            type: String
        },
        review: {
            type: String
        },
        tag: {
            type: String
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
            likedBy: {
                type: String
            },
            name: {
                type: String
            }
        }],
        listOfComment: [{
            commentedBy: {
                type: String
            },
            commentDesc: {
                type: String
            },
            dateAndTime: {
                type:Date
            }

        }]
    }]

});
var reviewDetails = mongoose.model('reviewDetails', reviewSchema);
module.exports = reviewDetails;*/
