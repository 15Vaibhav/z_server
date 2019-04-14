/*

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imageSchema = new Schema({

    saloonId: {
        type: String
    },

    detailList: [{
        activityId: {
            type: String
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
            type: String
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
                type: String
            }

        }]
    }]

});

var imageDetails = mongoose.model('imageDetails', imageSchema);
module.exports = imageDetails;*/
