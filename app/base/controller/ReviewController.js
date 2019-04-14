/**
 * Created by Ankur.Gupta on 29-October-17.
 */
var Salon = require('../models/salonInformation');
var ReviewInfo = require('../models/reviewInformation');
var Constant = require('../../common/constant');
var Messages = require('../../common/message');
var multer = require('multer');
var MyCash = require('../models/myCash');
var reply = {};
var fs = require('fs');

exports.GET_REVIEW = function(req,res) {

    ReviewInfo.find({saloonId: req.params.saloonId},function(err,review){
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }
        else {

            ReviewInfo.find({saloonId:req.params.saloonId}).count().exec(function(err,count){
                reply[Constant.REPLY.MESSAGE] = Messages.created;
                reply[Constant.REPLY.DATA] = review;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                reply[Constant.REPLY.TOKEN] = '';
                reply[Constant.REPLY.COUNT] = count;
                return res.send(reply).end;
            })



        }
    })
};






exports.ADD_REVIEW_WITH_IMAGE = function(err,res){
    var dir = "..//Images";
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    var dir2 = "..//Images//SaloonImages";
    if (!fs.existsSync(dir2)) {
        fs.mkdirSync(dir2);
    }
    var str = "..//Images//SaloonImages//SaloonID";
    var directory;
    var imageDirec;
    var imageArray = [];
    var arrayIn = [];
    var arrayOut = [];
    var arr = [];
    var storage = multer.diskStorage({

        destination: function (req, files, callback) {
            directory = str.replace("SaloonID", req.body.saloonId);
            imageDirec = directory.concat("//imageCard");
            if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory);
            }
            if (!fs.existsSync(imageDirec)) {
                fs.mkdirSync(imageDirec);
            }
            callback(null, imageDirec);
        },

        filename: function (req, files, callback) {
            console.log(req.files.length);
            var name = files.fieldname + Date.now() + ".jpeg";
            var path = imageDirec.concat("//" + name);
            var path2 = path.replace("..//Images", "");
            imageArray.push(path2);
            callback(null, files.fieldname + Date.now() + ".jpeg");
        }
    });

    var upload = multer({storage: storage}).array('data');

    upload(req, res, function (err) {
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = "";
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end
        }else{
            var str = "R";
            var id = str.concat(Date.now());
            var tag = JSON.parse(JSON.stringify(req.body.tag));
            var review = new ReviewInfo({
                saloonId:req.body.saloonId,
                reviewId:id,
                bookingId:req.body.bookingId,
                url:imageArray,
                rating:req.body.rating,
                review:req.body.review,
                tag:tag,
                postedBy:req.body.postedBy,
                postedName:req.body.postedName,
                dateAndTime:Date.now()
            });
            review.save({},function(err,rew) {
                if (err) {
                    reply[Constant.REPLY.MESSAGE] = Messages.Error;
                    reply[Constant.REPLY.DATA] = null;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                    reply[Constant.REPLY.TOKEN] = '';
                    return res.send(reply).end;
                } else {
				     MyCash.findOneAndUpdate({userId: req.body.customerId}, {
                   $inc: {myCash:10}  // added rs 10 for reviewing the saloon 
               }, function (err, upt) {
                   if(err){
                       console.log("error while updating my cash");
                   }else{
                       console.log("my cash updated")
                   }
               })
                    reply[Constant.REPLY.MESSAGE] = Messages.created;
                    reply[Constant.REPLY.DATA] = "";
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                    reply[Constant.REPLY.TOKEN] = '';
                    return res.send(reply).end;
                }
            })
        }
    })

};
exports.REVIEW_ADD_COMMENT = function (req, res) {

    var listOfComment = JSON.parse(JSON.stringify(req.body.listOfComment));
    ReviewInfo.findOneAndUpdate({reviewId:req.body.reviewId, saloonId: req.body.saloonId},{$addToSet: {listOfComment: listOfComment}},function(err){
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {

            reply[Constant.REPLY.MESSAGE] = Messages.created;
            reply[Constant.REPLY.DATA] = "";
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }


    })

};

exports.REVIEW_LIKE = function (req, res) {
    var likedBy = JSON.parse(JSON.stringify(req.body.listOfLike));
    ReviewInfo.findOneAndUpdate({reviewId:req.body.reviewId, saloonId: req.body.saloonId},{$addToSet: {listOfLike: likedBy}},function(err){
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.created;
            reply[Constant.REPLY.DATA] = "";
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }
    })
};




exports.ADD_REVIEW = function (req, res) {
    var str = "R";
    var id = str.concat(Date.now());
    var tag = (req.body.tag + "").split("@");
    var review = new ReviewInfo({
        saloonId:req.body.saloonId,
        reviewId:id,
        bookingId:req.body.bookingId,
        rating:req.body.rating,
        review:req.body.review,
        tag:tag,
        postedBy:req.body.postedBy,
        postedName:req.body.postedName,
        dateAndTime:Date.now()
    });
    review.save({},function(err,rew){

        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reviewRating(req);
            reply[Constant.REPLY.MESSAGE] = Messages.created;
            reply[Constant.REPLY.DATA] = "";
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }
    })
};
function reviewRating(req) {
    var rating = parseInt(req.body.rating);
    Salon.findOne({saloonId: req.body.saloonId}, function (err, sal) {

            var newRating;
            if (!sal.averageRating || sal.averageRating == ""|| sal.averageRating==0) {
                newRating = rating
            } else {
                newRating = (sal.averageRating + rating) / 2;
            }
            Salon.findOneAndUpdate({saloonId: req.body.saloonId}, {averageRating: newRating}, {new: true}, function (err, upt) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("rating updated");
                }

            })

    })
};