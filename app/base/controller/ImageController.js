/**
/**
 * Created by Ankur.Gupta on 29-August-17.
 */
var Salon = require('../models/salonInformation');
var ImageInfo = require('../models/imageInformation');
var Constant = require('../../common/constant');
var Messages = require('../../common/message');
var multer = require('multer');
var reply = {};
var fs = require('fs');
var ImageController = require('../controller/ImageController');
var Product = require('../models/product')
var Artist = require('../models/Artist');
var Blog = require('../models/blogs');




exports.RATE_CARD_UPLOAD = function (req, res) {

    var dir = "../../var/www/html/Images";

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    var dir2 = "../../var/www/html/Images//SaloonImages";
    if (!fs.existsSync(dir2)) {
        fs.mkdirSync(dir2);
    }
    var str = "../../var/www/html/Images//SaloonImages//SaloonID";
    var directory;
    var rateDirec;
    var rateArray = [];
    var arrayIn = [];
    var arrayOut = [];
    var storage = multer.diskStorage({

        destination: function (req, files, callback) {
            directory = str.replace("SaloonID", req.body.saloonId);
            rateDirec = directory.concat("//rateCard");
            if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory);
            }
            if (!fs.existsSync(rateDirec)) {
                fs.mkdirSync(rateDirec);
            }
            callback(null, rateDirec);
        },

        filename: function (req, files, callback) {
            console.log(req.files.length);
            var name = files.fieldname + Date.now() + ".jpeg";
            var path = rateDirec.concat("//" + name);
            rateArray.push(path2);
            var path2 = path.replace("../../var/www/html/Images", "");
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
        } else {
            console.log("saloonId" + req.body.saloonId);
            console.log(rateArray);
            for (var i = 0; i < rateArray.length; i++) {
                UPDATE_RATE_URL(res, req.body.saloonId, rateArray, i, arrayIn, arrayOut);
            }


        }

    });
};

exports.WEB_RATE_CARD_UPLOAD = function (req, res) {
    if(!req.body.saloonId || !!req.body.saloonId){
        req.body.saloonId = req.query.saloonId;
    }
    let saloonId = (!req.body.saloonId || !!req.body.saloonId) ? req.query.saloonId : req.body.saloonId;
    var dir = "../../var/www/html/Images";

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    var dir2 = "../../var/www/html/Images//SaloonImages";
    if (!fs.existsSync(dir2)) {
        fs.mkdirSync(dir2);
    }
    var str = "../../var/www/html/Images//SaloonImages//SaloonID";
    var directory;
    var rateDirec;
    var rateArray = [];
    var arrayIn = [];
    var arrayOut = [];
    var storage = multer.diskStorage({

        destination: function (req, files, callback) {
            directory = str.replace("SaloonID", saloonId);
            rateDirec = directory.concat("//rateCard");
            if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory);
            }
            if (!fs.existsSync(rateDirec)) {
                fs.mkdirSync(rateDirec);
            }
            callback(null, rateDirec);
        },

        filename: function (req, files, callback) {
            console.log(req.files.length);
            var name = files.fieldname + Date.now() + ".jpeg";
            var path = rateDirec.concat("//" + name);
            var path2 = path.replace("../../var/www/html/Images", "");
            rateArray.push(path2);
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
        } else {
            console.log("saloonId" + saloonId);
            console.log(rateArray);
            for (var i = 0; i < rateArray.length; i++) {
                UPDATE_RATE_URL(res, saloonId, rateArray, i, arrayIn, arrayOut);
            }


        }

    });
};

function UPDATE_RATE_URL(res, saloonId, rateArray, i, arrayIn, arrayOut) {
    Salon.findOneAndUpdate({saloonId: saloonId}, {$push: {rateCardUrl: rateArray[i]}}, function (err) {
        if (err) {
            arrayOut.push(rateArray[i]);
            if (arrayOut.length == rateArray.length) {
                reply[Constant.REPLY.MESSAGE] = Messages.IMAGES_NOT_UPLOADED;
                reply[Constant.REPLY.DATA] = arrayOut;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;}
        } else {
            arrayIn.push(rateArray[i]);
            if (arrayIn.length == rateArray.length) {
                reply[Constant.REPLY.MESSAGE] = Messages.IMAGES_UPLOADED;
                reply[Constant.REPLY.DATA] = "";
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;}
        }
        var tot = arrayIn.length + arrayOut.length;
        if (tot == rateArray.length) {
            reply[Constant.REPLY.MESSAGE] = Messages.PARTIAL_UPLOAD;
            reply[Constant.REPLY.DATA] = "";
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;}
    })

}


exports.IMAGE_UPLOAD = function (req, res) {
    var dir = "../../var/www/html/Images";
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    var dir2 = "../../var/www/html/Images//SaloonImages";
    if (!fs.existsSync(dir2)) {
        fs.mkdirSync(dir2);
    }
    var str = "../../var/www/html/Images//SaloonImages//SaloonID";
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
            var path2 = path.replace("../../var/www/html/Images", "");
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
        } else {
            console.log("saloonId" + req.body.saloonId);
            console.log(imageArray);
            console.log('hello1');

           console.log('check'+ req.body.isTopImage);
            if (req.body.isTopImage == "true") {

                console.log('hello2');
                for (var i = 0; i < imageArray.length; i++) {
                    UPDATE_SALON_IMAGE_URL(res, req.body.saloonId, imageArray, i, arrayIn, arrayOut);
                    UPDATE_IMAGE_DETAILS(req, imageArray, i, arr, function (a) {

                    });
                }
            }
            else {
                console.log('hello3');
                for (var i = 0; i < imageArray.length; i++) {
                    console.log('hello4');

                    UPDATE_IMAGE_DETAILS(req, imageArray, i, arr, function (a) {
                        reply[Constant.REPLY.MESSAGE] = Messages.IMAGES_UPLOADED;
                        reply[Constant.REPLY.DATA] = "";
                        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                        reply[Constant.REPLY.TOKEN] = '';
                        return res.send(reply).end;


                    });
                }
            }


        }

    });
};

exports.WEB_IMAGE_UPLOAD = function (req, res) {
    if(!req.body.saloonId || !!req.body.saloonId){
        req.body.saloonId = req.query.saloonId;
    }
    let saloonId = (!req.body.saloonId || !!req.body.saloonId) ? req.query.saloonId : req.body.saloonId;
    let isTopImage = (!req.body.isTopImage || !!req.body.isTopImage) ? req.query.isTopImage : req.body.isTopImage ;
    var dir = "../../var/www/html/Images";
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    var dir2 = "../../var/www/html/Images//SaloonImages";
    if (!fs.existsSync(dir2)) {
        fs.mkdirSync(dir2);
    }
    var str = "../../var/www/html/Images//SaloonImages//SaloonID";
    var directory;
    var imageDirec;
    var imageArray = [];
    var arrayIn = [];
    var arrayOut = [];
    var arr = [];
    var storage = multer.diskStorage({

        destination: function (req, files, callback) {
            directory = str.replace("SaloonID", saloonId);
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
            var path2 = path.replace("../../var/www/html/Images", "");
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
        } else {
            console.log("saloonId" + saloonId);
            console.log(imageArray);
            console.log('hello1');

           console.log('check'+ isTopImage);
            if (isTopImage == "true") {

                console.log('hello2');
                for (var i = 0; i < imageArray.length; i++) {
                    UPDATE_SALON_IMAGE_URL(res, saloonId, imageArray, i, arrayIn, arrayOut);
                    UPDATE_IMAGE_DETAILS(req, imageArray, i, arr, function (a) {

                    });
                }
            }
            else {
                console.log('hello3');
                for (var i = 0; i < imageArray.length; i++) {
                    console.log('hello4');

                    UPDATE_IMAGE_DETAILS(req, imageArray, i, arr, function (a) {
                        reply[Constant.REPLY.MESSAGE] = Messages.IMAGES_UPLOADED;
                        reply[Constant.REPLY.DATA] = "";
                        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                        reply[Constant.REPLY.TOKEN] = '';
                        return res.send(reply).end;


                    });
                }
            }


        }

    });
};

function UPDATE_SALON_IMAGE_URL(res, saloonId, imageArray, i, arrayIn, arrayOut) {

    Salon.findOneAndUpdate({saloonId: saloonId}, {$push: {salonTopPhotosUrl: imageArray[i]}}, function (err) {
        if (err) {
            arrayOut.push(imageArray[i]);
            if (arrayOut.length == imageArray.length) {
                reply[Constant.REPLY.MESSAGE] = Messages.IMAGES_NOT_UPLOADED;
                reply[Constant.REPLY.DATA] = arrayOut;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
            }
        } else {
            arrayIn.push(imageArray[i]);
            if (arrayIn.length == imageArray.length) {
                reply[Constant.REPLY.MESSAGE] = Messages.IMAGES_UPLOADED;
                reply[Constant.REPLY.DATA] = "";
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
            }
        }
        var tot = arrayIn.length + arrayOut.length;
        if (tot == imageArray.length) {
            reply[Constant.REPLY.MESSAGE] = Messages.PARTIAL_UPLOAD;
            reply[Constant.REPLY.DATA] = "";
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }

    })
}

exports.WEB_ADD_LOGO_URL  = function (req, res) {
    let saloonId = req.body.saloonId;
    var dir = "../../var/www/html/Images";
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    var dir2 = "../../var/www/html/Images//SaloonImages";
    if (!fs.existsSync(dir2)) {
        fs.mkdirSync(dir2);
    }
    var str = "../../var/www/html/Images//SaloonImages//SaloonID";
    var directory;
    var imageDirec;
    var path;
    var frontUrl;
    var arrayIn = [];
    var arrayOut = [];

    var upload = multer().single('data');
    upload(req, res, function (err) {
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = "";
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end
        } else {
            console.log("here saloonId" + saloonId);
            let img = req.body.image;
            let image = img.split(';base64,').pop();
            directory = str.replace("SaloonID",saloonId);
            imageDirec = directory.concat("//LogoImage");
            if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory);
            }
            if (!fs.existsSync(imageDirec)) {
                fs.mkdirSync(imageDirec);
            }
            var name = req.body.name + Date.now() + ".jpeg";

            path = imageDirec.concat("//" + name);
            logoUrl = path.replace("../../var/www/html/Images", "");

            console.log('front:::', imageDirec, 'image name::',logoUrl)
            fs.writeFile(imageDirec+'//'+name, image, {encoding: 'base64'}, function(err) {
            if(err){
                console.log(err);
                return;
            } else {
                console.log('file created')
                Salon.findOneAndUpdate({saloonId: saloonId}, {logoUrl: logoUrl}, function (err) {
                if (err) {
                    reply[Constant.REPLY.MESSAGE] = Messages.IMAGES_NOT_UPLOADED;
                    reply[Constant.REPLY.DATA] = "";
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                    reply[Constant.REPLY.TOKEN] = '';
                    return res.send(reply).end;
                } else {
                    reply[Constant.REPLY.MESSAGE] = Messages.IMAGES_UPLOADED;
                    reply[Constant.REPLY.DATA] = "";
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                    reply[Constant.REPLY.TOKEN] = '';
                    return res.send(reply).end;
                }
            })
            }

        });

        }
    });
};

exports.ADD_LOGO_URL = function (req, res) {
    var dir = "../../var/www/html/Images";
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    var dir2 = "../../var/www/html/Images//SaloonImages";
    if (!fs.existsSync(dir2)) {
        fs.mkdirSync(dir2);
    }
    var str = "../../var/www/html/Images//SaloonImages//SaloonID";
    var directory;
    var imageDirec;
    var logoUrl;
    var arrayIn = [];
    var arrayOut = [];
    var storage = multer.diskStorage({

        destination: function (req, file, callback) {
            directory = str.replace("SaloonID", req.body.saloonId);
            imageDirec = directory.concat("//LogoImage");
            if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory);
            }
            if (!fs.existsSync(imageDirec)) {
                fs.mkdirSync(imageDirec);
            }
            callback(null, imageDirec);
        },

        filename: function (req, file, callback) {
            var name = file.fieldname + Date.now() + ".jpeg";
            var path = imageDirec.concat("//" + name);
            var path2 = path.replace("../../var/www/html/Images", "");
            logoUrl = path2;
            callback(null, file.fieldname + Date.now() + ".jpeg");
        }
    });

    var upload = multer({storage: storage}).single('data');
    upload(req, res, function (err) {
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = "";
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end
        } else {
            console.log("saloonId" + req.body.saloonId);
            Salon.findOneAndUpdate({saloonId: req.body.saloonId}, {logoUrl: logoUrl}, function (err) {
                if (err) {
                    reply[Constant.REPLY.MESSAGE] = Messages.IMAGES_NOT_UPLOADED;
                    reply[Constant.REPLY.DATA] = "";
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                    reply[Constant.REPLY.TOKEN] = '';
                    return res.send(reply).end;
                } else {
                    reply[Constant.REPLY.MESSAGE] = Messages.IMAGES_UPLOADED;
                    reply[Constant.REPLY.DATA] = "";
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                    reply[Constant.REPLY.TOKEN] = '';
                    return res.send(reply).end;
                }
            })
        }
    });

};

exports.UPDATE_FRONT_IMAGE_URL = function (req, res) {
    var dir = "../../var/www/html/Images";
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    var dir2 = "../../var/www/html/Images//SaloonImages";
    if (!fs.existsSync(dir2)) {
        fs.mkdirSync(dir2);
    }
    var str = "../../var/www/html/Images//SaloonImages//SaloonID";
    var directory;
    var imageDirec;
    var path;
    var frontUrl;
    var arrayIn = [];
    var arrayOut = [];
    var storage = multer.diskStorage({

        destination: function (req, file, callback) {
            directory = str.replace("SaloonID",req.body.saloonId);
            imageDirec = directory.concat("//FrontImage");
            if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory);
            }
            if (!fs.existsSync(imageDirec)) {
                fs.mkdirSync(imageDirec);
            }
            callback(null, imageDirec);
        },

        filename: function (req, file, callback) {
            var name = file.fieldname + Date.now() + ".jpeg";

            path = imageDirec.concat("//" + name);
            frontUrl = path.replace("../../var/www/html/Images", "");
            callback(null, file.fieldname + Date.now() + ".jpeg");
        }
    });

    var upload = multer({storage: storage}).single('data');
    upload(req, res, function (err) {
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = "";
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end
        } else {
            console.log("saloonId" + req.body.saloonId);
            Salon.findOneAndUpdate({saloonId: req.body.saloonId}, {frontPageUrl: frontUrl}, function (err) {
                if (err) {
                    reply[Constant.REPLY.MESSAGE] = Messages.IMAGES_NOT_UPLOADED;
                    reply[Constant.REPLY.DATA] = "";
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                    reply[Constant.REPLY.TOKEN] = '';
                    return res.send(reply).end;
                } else {
                    reply[Constant.REPLY.MESSAGE] = Messages.IMAGES_UPLOADED;
                    reply[Constant.REPLY.DATA] = "";
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                    reply[Constant.REPLY.TOKEN] = '';
                    return res.send(reply).end;
                }
            })
			//INSERT_FRONT_IMAGE_INFO(req,frontUrl);
        }
    });
};

function INSERT_FRONT_IMAGE_INFO(req,path){
	var str = "A";
    var id = str.concat(Date.now());
    	
	var info = new ImageInfo({
        saloonId:req.body.saloonId,
        activityId:id,
        postedBy:req.body.id,
        url:path,
        description:req.body.description,
        isAdvertisement:req.body.isAdvertisement,
        imageType:req.body.imageType
    });
	info.save({},function(err,img){
        console.log("details" + img);
        console.log('error', +err);

    })
	
	
}


exports.WEB_UPDATE_FRONT_IMAGE_URL = function (req, res) {
    console.log(!req.body.saloonId, 'the query::', req.query.saloonId)
    if(!req.body.saloonId || !!req.body.saloonId){
        req.body.saloonId = req.query.saloonId;
    }
    let saloonId = req.body.saloonId;
    var dir = "../../var/www/html/Images";
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    var dir2 = "../../var/www/html/Images//SaloonImages";
    if (!fs.existsSync(dir2)) {
        fs.mkdirSync(dir2);
    }
    var str = "../../var/www/html/Images//SaloonImages//SaloonID";
    var directory;
    var imageDirec;
    var path;
    var frontUrl;
    var arrayIn = [];
    var arrayOut = [];

    var upload = multer().single('data');
    upload(req, res, function (err) {
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = "";
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end
        } else {
            console.log("here saloonId" + saloonId);
            let img = req.body.image;
            let image = img.split(';base64,').pop();
            directory = str.replace("SaloonID",saloonId);
            imageDirec = directory.concat("//FrontImage");
            if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory);
            }
            if (!fs.existsSync(imageDirec)) {
                fs.mkdirSync(imageDirec);
            }
            var name = req.body.name + Date.now() + ".jpeg";

            path = imageDirec.concat("//" + name);
            frontUrl = path.replace("../../var/www/html/Images", "");

            console.log('front:::', imageDirec, 'image name::',frontUrl)
            fs.writeFile(imageDirec+'//'+name, image, {encoding: 'base64'}, function(err) {
                if(err){
                    console.log(err);
                    return;
                } else {
                    console.log('file created')
                    Salon.findOneAndUpdate({saloonId: saloonId}, {frontPageUrl: frontUrl}, function (err) {
                        if (err) {
                            reply[Constant.REPLY.MESSAGE] = Messages.IMAGES_NOT_UPLOADED;
                            reply[Constant.REPLY.DATA] = "";
                            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                            reply[Constant.REPLY.TOKEN] = '';
                            return res.send(reply).end;
                        } else {
                            reply[Constant.REPLY.MESSAGE] = Messages.IMAGES_UPLOADED;
                            reply[Constant.REPLY.DATA] = "";
                            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                            reply[Constant.REPLY.TOKEN] = '';
                            return res.send(reply).end;
                        }
                    })
                }

            });

        }
    });
};


function UPDATE_IMAGE_DETAILS(req, ratearray, i, arr, callback) {
    var str = "A";
    var id = str.concat(Date.now());
    console.log(req.body.saloonId);
    console.log("rateArr...."+ratearray);
    console.log("i...."+i);
    console.log("arr"+arr)
    console.log("imagetype is ",req.body.imageType);
    console.log("description"+req.body.description);
    if(req.body.tag) {
        var tag = JSON.parse(JSON.stringify(req.body.tag));
    }
    var info = new ImageInfo({
        saloonId:req.body.saloonId,
        activityId:id,
        postedBy:req.body.id,
        url:ratearray[i],
        description:req.body.description,
        tag:tag,
        isAdvertisement:req.body.isAdvertisement,
        imageType:req.body.imageType
    });

    info.save({},function(err,img){
        console.log("details" + img);
        console.log('error', +err);

        arr.push(ratearray[i]);
        if (ratearray.length == arr.length) {
            return callback(true);
        }
    })
}

exports.IMAGE_LIKE = function (req, res) {
    var likedBy = JSON.parse(JSON.stringify(req.body.listOfLike));
    ImageInfo.findOneAndUpdate({activityId:req.body.activityId, saloonId: req.body.saloonId},{$push: {listOfLike: likedBy}},function (err){
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

exports.IMAGE_ADD_COMMENT = function (req, res) {

    var listOfComment = JSON.parse(JSON.stringify(req.body.listOfComment));
  ImageInfo.findOneAndUpdate({activityId:req.body.activityId, saloonId: req.body.saloonId},{$push: {listOfComment: listOfComment}},function (err){
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

exports.SEARCH_BY_POSTED_ID = function (req, res) {
    ImageInfo.find({postedBy:req.body.postedBy},function(err,det){
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = det;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }
    })
};

exports.SEARCH_BY_SALOON_ID = function (req, res) {
    ImageInfo.find({saloonId:req.params.saloonId},function(err,img){
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = det;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }
    })
};






exports.GET_LOGO_URL = function (req, res) {

    Salon.findOne({saloonId: req.params.saloonId}, function (err, sal) {
        if (err || !sal) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.created;
            reply[Constant.REPLY.DATA] = sal.logoUrl;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }

    })


};

exports.GET_FRONT_IMAGE_URL = function (req, res) {
    Salon.findOne({saloonId: req.params.saloonId}, function (err, sal) {
        if (err || !sal) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.created;
            reply[Constant.REPLY.DATA] = sal.frontPageUrl;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }

    })


};

exports.WEB_GET_TOP_IMAGE_URL = function (req, res) {
    Salon.findOne({saloonId: req.params.saloonId}, function (err, sal) {
        if (err || !sal) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.created;
            reply[Constant.REPLY.DATA] = sal.salonTopPhotosUrl;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }

    })


};

exports.GET_SALOON_IMAGE_URL = function (req, res) {
      ImageInfo.find({saloonId: req.params.saloonId},function(err,img){
          var array = [];
        if (err || !img) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.created;
            reply[Constant.REPLY.DATA] = img;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }
      })
};

exports.GET_RATE_CARD_URL = function(req,res){
    Salon.findOne({saloonId:req.params.saloonId}, function (err, sal){
        if (err || !sal) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.created;
            reply[Constant.REPLY.DATA] = sal.rateCardUrl;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }
    })
};

exports.deleteImages = function(req,res){
	
	var path2 = '../../var/www/html/Images';
    var path = req.body.path;
	console.log("path",path);
	var path3 = path2.concat(path);
    console.log("p3"+path3);

    var path4 = path/*.split("/").join("//")*/;
    console.log("path4 is",path4);
    console.log("delete image saloonId is",req.body.saloonId);
    console.log("image type",req.body.imageType);
    if (req.body.imageType == Constant.IMAGE_TYPE.RateCard) {
        Salon.findOneAndUpdate({saloonId: req.body.saloonId}, {$pull:{rateCardUrl:path4}}, function (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.DELETED;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end

        })
    }
    else {
        var path5 = path.split("/").join("//");
        ImageInfo.remove({saloonId:req.body.saloonId,url:path5},function(err){
            reply[Constant.REPLY.MESSAGE] = Messages.DELETED;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end


        });
        if(req.body.imageType == Constant.IMAGE_TYPE.TopImage||req.body.imageType == Constant.IMAGE_TYPE.NormalImage){
            Salon.findOneAndUpdate({saloonId: req.body.saloonId}, {$pull:{salonTopPhotosUrl:path5}}, function (err) {

            })
        }
    }





    fs.unlink(path3,function(err) {
        console.log("errrrrr:"+err);
        /*if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.DELETE_ERROR;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end
        } else {
		*/
        //}
        
        
    })
};

exports.DELETE_ADD_MULTIPLE_IMAGES = function(req,res){

    //var path = JSON.parse(JSON.stringify(req.body.path));
	var path = (req.body.path + "").split("@");
    var pathOut =[];
    var pathIn =[];
	console.log("path is",path);
	console.log(req.body);

    for(var i =0;i<path.length;i++){
        REMOVE_IMAGE(path,pathOut,pathIn,i,function(err,c){

        })

    }
    if (req.body.imageType == Constant.IMAGE_TYPE.RateCard){
		console.log("image type"+req.body.imageType);
        ImageController.RATE_CARD_UPLOAD(req,res);
    }else{
       ImageController.IMAGE_UPLOAD(req,res);
	   
    }

};


function REMOVE_IMAGE(path,pathOut,pathIn,i,callback){
    fs.unlink(path[i],function(err) {
        if (err) {
            pathIn.push(path[i]);
            var count = pathIn.length + pathOut.length;
            if(count == path.length){
              return callback(pathIn);
			  console.log(err);
            }
        } else {
            pathOut.push(path[i]);
            if (req.body.imageType == Constant.IMAGE_TYPE.RateCard) {
                Salon.findOneAndUpdate({saloonId: req.body.saloonId}, {$pull:{rateCardUrl:path}}, function (err) {
                      console.log(err);

                })
            }
            else {
                ImageInfo.remove({saloonId:req.body.saloonId,url:path},function(err){
                    console.log(err);
                });
                if(req.body.imageType == Constant.IMAGE_TYPE.TopImage){
                    Salon.findOneAndUpdate({saloonId: req.body.saloonId}, {$pull:{salonTopPhotosUrl:path}}, function (err) {
                        console.log(err);
                    })
                }
            }
            var count = pathIn.length + pathOut.length;
            if(count == path.length){
                return callback(pathIn);
            }
        }

    })

};

exports.EDIT_TOP_IMAGE = function(req,res){
 var dir = "../../var/www/html/Images";
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    var dir2 = "../../var/www/html/Images//SaloonImages";
    if (!fs.existsSync(dir2)) {
        fs.mkdirSync(dir2);
    }
    var str = "../../var/www/html/Images//SaloonImages//SaloonID";
    var directory;
    var imageDirec;
    var imageArray = [];
    var arrayIn = [];
    var arrayOut = [];
    var arr = [];
	var path3;
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
            var path2 = path.replace("../../var/www/html/Images", "");
			path3 = path2;
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
        } else {
            console.log("saloonId" + req.body.saloonId);
            console.log("path",path3);
            Salon.findOneAndUpdate({saloonId:req.body.saloonId,salonTopPhotosUrl:req.body.url}, {"salonTopPhotosUrl.$":path3}, function (err) {    if(err){
			    reply[Constant.REPLY.MESSAGE] = Messages.IMAGES_NOT_UPLOADED;
                reply[Constant.REPLY.DATA] = "";
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;    
			}else{
				reply[Constant.REPLY.MESSAGE] = Messages.IMAGES_UPLOADED;
                reply[Constant.REPLY.DATA] = "";
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
			}
			})
			console.log("url is",req.body.url);
			ImageInfo.findOneAndUpdate({saloonId:req.body.saloonId,url:req.body.url},{url:path3},function (err){
	
        })
	 }
    });	
	
	
	
};

exports.GET_CUST_LIKE_IMAGE = function(req,res){
	
	ImageInfo.find({"listOfLike.userId":req.params.customerId,saloonId:req.params.saloonId},{activityId:1,url:1},function(err,img){
	  console.log("img"+img);
        if(err){
			reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;		  
	  }	else{
		    reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = img;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
	  }
		
	})
	
	
}
exports.GET_TIME_LINE= function(req,res) {
    console.log( req.body.pageNo);
    var no = req.body.pageNo;
    ImageInfo.find({imageType:"TimeLine"}).sort({postingDate:-1}).skip(Constant.TimeLine_Limit.size * no).limit(Constant.TimeLine_Limit.size).exec(function(err,result){
     if(err){
        console.log(err);
     }else{
        ImageInfo.find({imageType:"TimeLine"}).count().exec(function (err, count) {
         reply[Constant.REPLY.DATA] = result;
         reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
         reply[Constant.REPLY.TOKEN] = '';
         reply[Constant.REPLY.COUNT] = count;
         return res.send(reply).end;
        })
     }
    })
}
exports.POST_TIME_LINE =function(req,res){
var dir = "../../var/www/html/Images";
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    var dir2 = "../../var/www/html/Images//TimeLine";
    if (!fs.existsSync(dir2)) {
        fs.mkdirSync(dir2);
    }
    
    var imageDirec;
    var imageArray = [];
    var storage = multer.diskStorage({

        destination: function (req, files, callback) {
            imageDirec = dir2
            callback(null, imageDirec);
        },

        filename: function (req, files, callback) {
            var name = files.fieldname + Date.now() + ".jpeg";
            var path = imageDirec.concat("//" + name);
            var path2 = path.replace("../../var/www/html/Images", "");
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
        } else {
                var str = "A";
                var id = str.concat(Date.now());
                var date =new Date();
              if(req.body.tag) {
                    var tag = JSON.parse(JSON.stringify(req.body.tag));
                }
                var info = new ImageInfo({
                    saloonId:req.body.saloonId,
                    activityId:id,
                    postedBy:req.body.saloonId,
                    url:imageArray,
                    description:req.body.description,
                    tag:tag,
                   imageType:req.body.imageType,
                   postingDate:date,
                   salonName:req.body.saloonName
                   
                });
                  
             info.save({},function(err){
               if(err){
        console.log(err);

               }

                reply[Constant.REPLY.MESSAGE] = Messages.IMAGES_UPLOADED;
                reply[Constant.REPLY.DATA] = "";
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
  })
}
})};
exports.ADD_PRODUCT_IMAGE = function (req, res) {
  
 var dir = "../../var/www/html/Images";

 if (!fs.existsSync(dir)) {
     fs.mkdirSync(dir);
 }
 var dir2 = "../../var/www/html/Images/ProductImages";
 if (!fs.existsSync(dir2)) {
     fs.mkdirSync(dir2);
 }
 var str = "../../var/www/html/Images/ProductImages/ProductID";
 var directory;
 var rateDirec;
 var rateArray = [];
 var arrayIn = [];
 var arrayOut = [];
 var storage = multer.diskStorage({

     destination: function (req, files, callback) {
         directory = str.replace("ProductID", req.body.productId);
         rateDirec = directory.concat("/product");
         if (!fs.existsSync(directory)) {
             fs.mkdirSync(directory);
         }
         if (!fs.existsSync(rateDirec)) {
             fs.mkdirSync(rateDirec);
         }
         callback(null, rateDirec);
     },

     filename: function (req, files, callback) {
         console.log("filelen.............."+req.files.length);
         var name = files.fieldname + Date.now() + ".jpeg";
         var path = rateDirec.concat("/" + name);
         var path2 = path.replace("../../var/www/html/Images", "");
         rateArray.push(path2);
         
         callback(null, files.fieldname + Date.now() + ".jpeg");
     }
 });

 var upload = multer({storage: storage}).single('data');
 upload(req, res, function (err) {
     if (err) {
         reply[Constant.REPLY.MESSAGE] = Messages.Error;
         reply[Constant.REPLY.DATA] = "";
         reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
         reply[Constant.REPLY.TOKEN] = '';
         return res.send(reply).end
     } else {
         console.log("productId" + req.body.productId);
         console.log(rateArray);
         for (var i = 0; i < rateArray.length; i++) {
             console.log("rteArr"+rateArray);
             UPDATE_PRODUCT_URL(res, req.body.productId, rateArray, i, arrayIn, arrayOut);
         }


     }

 });
};
function UPDATE_PRODUCT_URL(res, productId, rateArray, i, arrayIn, arrayOut) {
    console.log("Url....2"+rateArray[i]);
    Product.findOneAndUpdate({productId: productId}, {$push: { productUrl: rateArray[i]}}, function (err) {
        if (err) {

        console.log(err)
            arrayOut.push(rateArray[i]);
            if (arrayOut.length == rateArray.length) {
                reply[Constant.REPLY.MESSAGE] = Messages.IMAGES_NOT_UPLOADED;
                reply[Constant.REPLY.DATA] = arrayOut;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;}
        } else {
            arrayIn.push(rateArray[i]);
            if (arrayIn.length == rateArray.length) {
                reply[Constant.REPLY.MESSAGE] = Messages.IMAGES_UPLOADED;
                reply[Constant.REPLY.DATA] = "";
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;}
        }
        var tot = arrayIn.length + arrayOut.length;
        if (tot == rateArray.length) {
            reply[Constant.REPLY.MESSAGE] = Messages.PARTIAL_UPLOAD;
            reply[Constant.REPLY.DATA] = "";
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;}
    })

};


exports.ARTIST_IMAGE = function (req, res) {
  
    var dir = "../../var/www/html/Images";
   
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    var dir2 = "../../var/www/html/Images/ArtistImages";
    if (!fs.existsSync(dir2)) {
        fs.mkdirSync(dir2);
    }
    var str = "../../var/www/html/Images/ArtistImages/ArtistId";
    var directory;
    var rateDirec;
    var rateArray = [];
    var arrayIn = [];
    var arrayOut = [];
    var storage = multer.diskStorage({
   
        destination: function (req, files, callback) {
            directory = str.replace("ArtistId", req.body.artistId);
            rateDirec = directory.concat("/Artist");
            if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory);
            }
            if (!fs.existsSync(rateDirec)) {
                fs.mkdirSync(rateDirec);
            }
            callback(null, rateDirec);
        },
   
        filename: function (req, files, callback) {
            // console.log("filelen.............."+req.files.length);
            var name = files.fieldname + Date.now() + ".jpeg";
            var path = rateDirec.concat("/" + name);
            var path2 = path.replace("../../var/www/html/Images", "");
            rateArray.push(path2);
            
            callback(null, files.fieldname + Date.now() + ".jpeg");
        }
    });
   
    var upload = multer({storage: storage}).array('data');
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = "";
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end
        } else {
            console.log("artistId" + req.body.artistId);
            console.log(rateArray);
            for (var i = 0; i < rateArray.length; i++) {
                console.log("rteArr"+rateArray);
                UPDATE_ARTIST_URL(res, req.body.artistId, rateArray, i, arrayIn, arrayOut);
            }
   
   
        }
   
    });
   }

function UPDATE_ARTIST_URL(res, artistId, rateArray, i, arrayIn, arrayOut) {
    console.log("Url....2"+rateArray[i]);
    Artist.findOneAndUpdate({artistId: artistId}, {$push:{imageUrl: rateArray[i]}}, function (err) {
        if (err) {

        console.log(err)
            arrayOut.push(rateArray[i]);
            if (arrayOut.length == rateArray.length) {
                reply[Constant.REPLY.MESSAGE] = Messages.IMAGES_NOT_UPLOADED;
                reply[Constant.REPLY.DATA] = arrayOut;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;}
        } else {
            arrayIn.push(rateArray[i]);
            if (arrayIn.length == rateArray.length) {
                reply[Constant.REPLY.MESSAGE] = Messages.IMAGES_UPLOADED;
                reply[Constant.REPLY.DATA] = "";
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;}
        }
        var tot = arrayIn.length + arrayOut.length;
        if (tot == rateArray.length) {
            reply[Constant.REPLY.MESSAGE] = Messages.PARTIAL_UPLOAD;
            reply[Constant.REPLY.DATA] = "";
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;}
    })

};
exports.ADD_BLOG_IMAGE = function (req, res) {
 
     
    var dir = "../../var/www/html/Images";
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    var dir2 = "../../var/www/html/Images/BlogImages";
    if (!fs.existsSync(dir2)) {
        fs.mkdirSync(dir2);
        
    }
    var str = "../../var/www/html/Images/BlogImages/BlogID";
        var directory;
    var rateDirec;
    var rateArray = [];
    var storage = multer.diskStorage({
   destination: function (req, files, callback) {
    console.log('the query::'+ req.body.email)
            var str2 = "P";
            datw =str2.concat(Date.now()); 
        
            directory = str.replace("BlogID",datw);
            
            rateDirec = directory.concat("/blog");
            if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory);
            }
            if (!fs.existsSync(rateDirec)) {
                fs.mkdirSync(rateDirec);
            }
            callback(null, rateDirec);
        },
   
        filename: function (req, files, callback) {
        var name = files.fieldname + Date.now() + ".jpeg";
            var path = rateDirec.concat("/" + name);
            var path2 = path.replace("../../var/www/html/Images", "");
            rateArray.push(path2);
            callback(null, files.fieldname + Date.now() + ".jpeg");
        }
    });
   
    var upload = multer({storage: storage}).array('data');
    upload(req, res, function (err){
        
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = "";
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end
        } else {
            console.log('the query::1'+ req.body.email)
            res.send("posted successfully");   
          //  console.log(rateArray[0]);       
           

            Blog.findOneAndUpdate({email: req.body.email}, {$push: { postUrl: rateArray[0]}},{new:true}, function (err,result) {
             console.log(result);
            })
        





















   
        }
   
    });
   }
