/**
 * Created by Ankur
 */
var Salon = require('../models/salonInformation');
var Branch = require('../models/branchInformation');
var Service = require('../models/service');
var Approval = require('../models/saloonApproval');
var Constant = require('../../common/constant');
var Messages = require('../../common/message');
var base64 = require('../../common/Base64');
var NodeGeocoder = require('node-geocoder');
var Offer = require('../models/offersprovide');

//var base64Img = require('base64-img');
var LoginController = require('../controller/LoginController');
var saloonPayment = require('../models/saloonPaymentHistory');
var SaloonTransaction = require('../models/saloonTransaction');
var shutDownSaloon = require('../models/shutDownSaloon');
var SaloonOffer = require('../models/saloonOffers');
var ImageInfo = require('../models/imageInformation');
var ReviewInfo = require('../models/reviewInformation');
var RateVariable = require('../models/rateVariable');
var SaloonViews = require('../models/saloonViews');
var Banner = require('../models/banner');
var EmployeeActivity = require('../models/employeeActivity');
var Coupon = require('../models/coupon');
var EarnPoints = require('../models/earnPoints');
var SponsoredSaloon = require('../models/sponsoredSaloons');
var saloonService = require('../models/saloonService')
var services = require('../models/services');
var DayDeal = require('../models/dayDeal');
var nodemailer = require('nodemailer');
var MyFavoriteSaloon = require('../models/myFavoriteSaloons');
var converter = require('number-to-words')
var multer = require('multer');
var request = require('request');
var MyFavoriteSaloon = require('../models/myFavoriteSaloons');
var reply = {};
var fs = require('fs');
var csvwriter = require('csvwriter');

var PdfDocument = require('pdfkit');
var http = require('http');
var package = require('../models/package');
var LoginDetails = require('../models/loginDetails');
var bcrypt = require('bcrypt');
var SaloonAccount = require('../models/saloonAccount');
var OTP = require('../models/otp');

exports.WEB_CREATE_SALON = async function (req, res) {

    let salonPhone = await Salon.findOne({ mobileNumber: req.body.mobileNumber })
    if (salonPhone) {
        reply[Constant.REPLY.MESSAGE] = Messages.SALON_PHONE_DUPLICATE;
        reply[Constant.REPLY.DATA] = null;
        reply[Constant.REPLY.RESULT_CODE] = 1;
        reply[Constant.REPLY.TOKEN] = '';
        return res.send(reply).end;
    }
    createSaloon(req, res);
}


exports.createSalon = function (req, res) {
createSaloon(req, res);
};
exports.FETCH_SALON = function (req, res) {
    var maxDistance = Constant.DISTANCE.Limit / Constant.DISTANCE.EARTH_RADIUS;
    var array = [];
    array[0] = req.body.longitude;
    array[1] = req.body.latitude;
    var no = req.body.pageNo;

    Salon.find({
        location: {
            $near: array,
            $maxDistance: maxDistance

        }
    }).skip(Constant.PAGE_LIMIT.size * no).limit(Constant.PAGE_LIMIT.size).exec(function (err, salons) {
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            Salon.find({
                location: {
                    $near: array,
                    $maxDistance: maxDistance
                }
            }).count().exec(function (err, count) {
                reply[Constant.REPLY.MESSAGE] = Messages.success;
                reply[Constant.REPLY.DATA] = salons;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                reply[Constant.REPLY.TOKEN] = '';
                reply[Constant.REPLY.COUNT] = count;
                return res.send(reply).end;
            })

        }
    })

};


exports.SEARCH_SALON = function (req, res) {
    var saloonName = req.params.saloonName;
    var city = req.params.city;

    if ((saloonName != 0) && (city != 0)) {
        Salon.find({
            saloonName: new RegExp(saloonName, "i"), "address.city": new RegExp(city, "i")
        }, {
                saloonId: 1, saloonName: 1,
                mobileNumber: 1, address: 1, _id: 0
            }, function (err, salons) {
                if (err) {
                    reply[Constant.REPLY.MESSAGE] = Messages.notFound;
                    reply[Constant.REPLY.DATA] = null;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                    reply[Constant.REPLY.TOKEN] = '';
                    return res.send(reply).end;
                } else {
                    reply[Constant.REPLY.MESSAGE] = Messages.success;
                    reply[Constant.REPLY.DATA] = salons;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                    reply[Constant.REPLY.TOKEN] = '';
                    return res.send(reply).end;
                }
            })

    } else {
        Salon.find({
            $or: [{ saloonName: new RegExp(saloonName, "i") }, { "address.city": new RegExp(city, "i") }]
        }, {
                saloonId: 1, saloonName: 1,
                mobileNumber: 1, address: 1, _id: 0
            }, function (err, salons) {
                if (err) {
                    reply[Constant.REPLY.MESSAGE] = Messages.notFound;
                    reply[Constant.REPLY.DATA] = null;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                    reply[Constant.REPLY.TOKEN] = '';
                    return res.send(reply).end;

                } else {
                    reply[Constant.REPLY.MESSAGE] = Messages.success;
                    reply[Constant.REPLY.DATA] = salons;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                    reply[Constant.REPLY.TOKEN] = '';
                    return res.send(reply).end;
                }
            })
    }
};

exports.EMPLOYEE_UPDATE_SALON = function (req, res) {
    var homeService = parseInt(req.body.homeService);

    console.log('home service is ' + homeService + "" + req.body.homeService);
    var address = JSON.parse(JSON.stringify(req.body.address));
    var scheduleTiming = JSON.parse(JSON.stringify(req.body.scheduleTiming));
    var ownerInformation = JSON.parse(JSON.stringify(req.body.ownerInformation));
    if (req.body.alternateNumber) {
        var alternateNumber = JSON.parse(JSON.stringify(req.body.alternateNumber));
    }
    if (req.body.brands) {
        var brands = JSON.parse(JSON.stringify(req.body.brands));
    }
    if (req.body.specialFor) {
        var specialFor = JSON.parse(JSON.stringify(req.body.brands));
    }
    if (req.body.moreInformation) {
        var moreInformation = JSON.parse(JSON.stringify(req.body.moreInformation));
    }


    Salon.findOneAndUpdate({ saloonId: req.body.saloonId }, {
        saloonName: req.body.saloonName,
        tagLine: req.body.tagLine,
        mobileNumber: req.body.mobileNumber,
        address: address,
        emailId: req.body.emailId,
        saloonType: req.body.saloonType,
        scheduleTiming: scheduleTiming,
        description: req.body.description,
        ownerInformation: ownerInformation,
        location: [req.body.longitude, req.body.latitude],
        branchId: req.body.branchId,
        moreInformation: moreInformation,
        brands: brands,
        specialFor: specialFor,
        homeService: homeService,
        alternateNumber: alternateNumber,
        gstIn: req.body.gstIn,
        panNo: req.body.panNo
    }, { new: true }, function (err, salon) {
        if (err) {
            console.log('error is' + err);
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = err;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.updated;
            reply[Constant.REPLY.DATA] = salon;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }
    })
};

exports.WEB_EMPLOYEE_UPDATE_SALON = function (req, res) {
    req.body.location = [req.body.longitude, req.body.latitude]
    Salon.findOneAndUpdate({ saloonId: req.body.saloonId }, req.body)
        .then(salon => {
            console.log('after update::', salon)
            reply[Constant.REPLY.MESSAGE] = Messages.updated;
            reply[Constant.REPLY.DATA] = salon;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        })
        .catch(err => {
            console.log('error is' + err);
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = err;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        })
};
exports.UPDATE_SALON = function (req, res) {
    var homeService = parseInt(req.body.homeService);

    console.log('home service is ' + homeService + "" + req.body.homeService);

    if (req.body.alternateNumber) {
        var alternateNumber = JSON.parse(JSON.stringify(req.body.alternateNumber));
    }

    Salon.findOneAndUpdate({ saloonId: req.body.saloonId }, {
        saloonName: req.body.saloonName,
        tagLine: req.body.tagLine,
        mobileNumber: req.body.mobileNumber,
        emailId: req.body.emailId,
        saloonType: req.body.saloonType,
        description: req.body.description,
        branchId: req.body.branchId,
        homeService: homeService,
        alternateNumber: alternateNumber,
        gstIn: req.body.gstIn,
        panNo: req.body.panNo
    }, { new: true }, function (err, salon) {
        if (err) {
            console.log('error is' + err);
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.updated;
            reply[Constant.REPLY.DATA] = salon;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }
    })
};

//new
exports.Update_Schedule_Timing = function (req, res) {

    var scheduleTiming = JSON.parse(JSON.stringify(req.body.scheduleTiming));
    Salon.findOneAndUpdate({ saloonId: req.body.saloonId }, {
        scheduleTiming: scheduleTiming
    }, { new: true }, function (err, salon) {
        if (err) {
            console.log('error is' + err);
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.updated;
            reply[Constant.REPLY.DATA] = salon;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }
    })



};
exports.UPDATE_OWNER_INFORMATION = function (req, res) {

    // var ownerInformation = JSON.parse(JSON.stringify(req.body.ownerInformation));
    Salon.findOneAndUpdate({ saloonId: req.body.saloonId }, {
        $set: {
            "ownerInformation.0.ownerEmail": req.body.ownerEmail,
            "ownerInformation.0.ownerName": req.body.ownerName
        }
    }, { new: true }, function (err, salon) {
        if (err) {
            console.log('error is' + err);
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.updated;
            reply[Constant.REPLY.DATA] = salon;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }
    })


};

exports.UPDATE_ADDITIONAL_INFO = function (req, res) {
    if (req.body.brands) {
        var brands = (req.body.brands + "").split("@");
    }
    if (req.body.specialFor) {
        var specialFor = (req.body.specialFor + "").split("@");
    }
    if (req.body.moreInformation) {
        var moreInformation = (req.body.moreInformation + "").split("@");
    }




    Salon.findOneAndUpdate({ saloonId: req.body.saloonId }, {
        brands: brands,
        specialFor: specialFor,
        moreInformation: moreInformation

    }, { new: true }, function (err, salon) {
        if (err) {
            console.log('error is' + err);
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.updated;
            reply[Constant.REPLY.DATA] = salon;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }
    })

};
exports.ADD_BRANCH = function (req, res) {

    if (!req.body.parentName) {
        console.log('No parent name provided');
        reply[Constant.REPLY.DATA] = Messages.ParentName_Blank;
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
        return res.send(reply);
    }
    createSaloon2(req, res, function (a, newlyCreatedSalon) {
        if (a == true) {
            if (req.body.previousSaloonId) {

                Branch.count({}, function (err, count) {
                    var c = count + 1;
                    var branchInfo = new Branch({
                        parentName: req.body.parentName,
                        branchId: c
                    });
                    branchInfo.save({}, function (err, branchInformation) {
                        if (err) {
                            console.log('error adding new branch', +err);


                        } else {

                            ADD_BRANCH(req.body.parentName, c, req.body.previousSaloonId, res, newlyCreatedSalon)

                        }
                    })
                })

            } else {
                ADD_BRANCH(req.body.parentName, req.body.branchId, null, res, newlyCreatedSalon);
            }

        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.notCreated;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end
        }
    })
};

function ADD_BRANCH(parentName, branchId, saloonId, res, newlyCreatedSalon) {
    Salon.update({ parentName: parentName }, { branchId: branchId }, { multi: true }, function (err) {
        if (err) {
            console.log('error');
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            console.log('success');
            reply[Constant.REPLY.MESSAGE] = Messages.branchAdded;
            reply[Constant.REPLY.DATA] = newlyCreatedSalon;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }

    });
    if (saloonId) {
        Salon.update({ saloonId: saloonId }, { branchId: branchId, parentName: parentName }, function (err) {
            if (err) {
                console.log('error');
            } else {
                console.log('success');
            }
        })
    }
}


exports.excel = function (req, res) {

    var directory = "..//SaloonInfo";
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }

    Salon.find({}, function (err, data) {
        var json = JSON.stringify(data);
        var jsonObj = JSON.parse(json);
        csvwriter(jsonObj, function (err, cvv) {
            var str = Date.now() + ".csv";
            var str2 = directory.concat("//" + str);
            fs.writeFile(str2, cvv, function (err) {
                console.log('success');
                reply[Constant.REPLY.MESSAGE] = Messages.success;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                return res.send(reply).end;
            })
        })
    })
};




exports.RAISE_Request = function (req, res) {
    console.log(req.body);
    Approval.count({}, function (err, count) {
        var c = count + 1;
        var date = new Date().toLocaleDateString();
        var request = new Approval({
            requestId: c,
            saloonName: req.body.saloonName,
            emailId: req.body.emailId,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            status: Constant.Status.PENDING_APPROVAL,
            requestTime: date,
            saloonCreation: Constant.requestType.saloonCreation
        });
        request.save({}, function (err, details) {
            if (err) {
                if (err.code == 11000) {
                    reply[Constant.REPLY.MESSAGE] = Messages.REQUEST_ALREADY_RAISE;
                } else {

                    reply[Constant.REPLY.MESSAGE] = Messages.notCreated;
                }
                reply[Constant.REPLY.DATA] = null;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
            } else {
                reply[Constant.REPLY.MESSAGE] = Messages.success;
                reply[Constant.REPLY.DATA] = "";
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
            }
        })
    })
};


exports.RejectRequest = function (req, res) {
    Approval.findOneAndUpdate({ requestId: req.params.requestId }, { status: Constant.Status.REJECTED }, { new: true }, function (err, upt) {
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = upt;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }
    })
};


function UPDATE_REQUEST_STATUS(requestId, employeeId) {
    var date = new Date().toLocaleDateString();
    Approval.findOneAndUpdate({ requestId: requestId }, {
        status: Constant.Status.APPROVED,
        actionTime: date,
        employeeId: employeeId
    },
        function (err, upt) {
        })
}

exports.WEB_FETCH_PACKAGES = function (req, res) {

    package.find({}).sort({ packageName: 1 }).exec(function (err, sals) {
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }
        else {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = sals;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;


        }
    })
};


exports.FETCH_SERVICES = function (req, res) {

    services.find({}).sort({ itemName: 1 }).exec(function (err, sals) {
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }
        else {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = sals;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;


        }
    })
};


exports.FETCH_SALON_SERVICE = function (req, res) {

    Salon.find({ saloonId: req.params.saloonId }).select({ "services": 1 }).sort({ "services.item": 1 }).exec(function (err, ser) {
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;

        }
        else {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = ser;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }

    })
};


exports.WEB_FETCH_SALON_SERVICE = function (req, res) {

    saloonService.findOne({ saloonId: req.params.saloonId }).exec(function (err, ser) {
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;

        }
        else {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = ser;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }

    })
};


exports.SALOON_PAYMENT = function (req, res) {
    var str = "P";
    var qty;
    var cgst;
    var sgst;
    var validTo = new Date(req.body.validTo);
    var validFrom = new Date(req.body.validFrom);
    var date = new Date().toLocaleDateString();
    var amount = parseInt(req.body.amount);
    var billName = req.body.billName;
    var add = req.body.address;
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }

    today = mm + '/' + dd + '/' + yyyy;
    console.log(validTo.getFullYear() - validFrom.getFullYear())
    if(validTo.getFullYear() == validFrom.getFullYear() ){
     qty = validTo.getMonth() - validFrom.getMonth();
    }else{
      qty = 11-validFrom.getMonth();
      qty +=validTo.getMonth()+1;
      console.log(qty);
    }
    console.log(req.body.paymentMode);
    
   if(req.body.generate ==1||req.body.paymentMode=="Check"){
        saloonPayment.find({$or:[{generatePdf:1},{paymentMode:"Check"}]}).count(function(err,count){
            console.log("count is "+ count);
                var da = new Date();
                var month = da.getMonth() + 1;
                var year = da.getFullYear()
                var c = count + 1;
                var d = str.concat(Date.now());
                var paymentDetails = new saloonPayment({
                    invoiceNo: c,
                    paymentId: d,
                    saloonId: req.body.saloonId,
                    saloonName: req.body.saloonName,
                    validFrom: validFrom,
                    validTo: validTo,
                    paymentMode: req.body.paymentMode,
                    receivedBy: req.body.employeeId,
                    dateTime: date,
                    serviceType: req.body.serviceType,
                    amount: req.body.amount,
                    billName: req.body.billName,
                    add: req.body.address,
                    state: req.body.state,
                    planType: req.body.planType,
                    generatePdf:1,
                    pdfUrl: "/Invoices/" + month + "-" + year + "cheque/" + d + ".pdf"
        
                });
        
                paymentDetails.save({}, function (err, det) {
                    if (err) {
                        console.log(err);
                        reply[Constant.REPLY.MESSAGE] = Messages.PAYMENT_DETAILS_ERROR;
                        reply[Constant.REPLY.DATA] = null;
                        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                        reply[Constant.REPLY.TOKEN] = '';
                        return res.send(reply).end;
                    } else {
                        //console.log("saloon payment2");
                        createEmployeeAcityity(req, req.body.saloonId, d, Constant.WORK_TYPE.PAYMENT_ACCEPTED);
                        UPDATE_SALOON_BOOKING_VALIDITY(req, function (a) {
                            // var mess = Messages.PAYMENT_MESSAGE.replace('name', a.saloonName);
                            // var mess2 = mess.replace('amt', req.body.amount);
                            // SEND_MESSAGE(a.ownerInformation[0].ownerNumber, mess2);
                            createPDF2(req, res, det,amount, a.emailId, a.ownerInformation[0].ownerEmail, a, req.body.planType, billName, today, add, req.body.gstIn, qty, c, req.body.state);
                            reply[Constant.REPLY.MESSAGE] = Messages.PAYMENT_DETAILS;
                            reply[Constant.REPLY.DATA] = det;
                            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                            reply[Constant.REPLY.PDF_URL] = "/Invoices/" + month + "-" + year + "cheque/" + d + ".pdf";
                            reply[Constant.REPLY.TOKEN] = '';
                            return res.send(reply).end;
                        })
                        UPDATE_SALOON_TRANSACTION(req, d, req.body.amount);
        
                    }
                })
            })
           }
           else{
            saloonPayment.find({generatePdf:0}).count(function(err,count){
                console.log("count is "+ count);
                var da = new Date();
                var month = da.getMonth() + 1;
                var year = da.getFullYear()
                var c = count + 1;
                var d = str.concat(Date.now());
                var paymentDetails = new saloonPayment({
                    invoiceNo: c,
                    paymentId: d,
                    saloonId: req.body.saloonId,
                    saloonName: req.body.saloonName,
                    validFrom: validFrom,
                    validTo: validTo,
                    paymentMode: req.body.paymentMode,
                    receivedBy: req.body.employeeId,
                    dateTime: date,
                    serviceType: req.body.serviceType,
                    amount: req.body.amount,
                    billName: req.body.billName,
                    add: req.body.address,
                    state: req.body.state,
                    planType: req.body.planType,
                    generatePdf:0,
                    pdfUrl: "/Invoices/" + month + "-" + year + "/" + d + ".pdf"
        
                });
        
                paymentDetails.save({}, function (err, det) {
                    if (err) {
                        console.log(err);
                        reply[Constant.REPLY.MESSAGE] = Messages.PAYMENT_DETAILS_ERROR;
                        reply[Constant.REPLY.DATA] = null;
                        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                        reply[Constant.REPLY.TOKEN] = '';
                        return res.send(reply).end;
                    } else {
                        //console.log("saloon payment2");
                        createEmployeeAcityity(req, req.body.saloonId, d, Constant.WORK_TYPE.PAYMENT_ACCEPTED);
                        UPDATE_SALOON_BOOKING_VALIDITY(req, function (a) {
                            // var mess = Messages.PAYMENT_MESSAGE.replace('name', a.saloonName);
                            // var mess2 = mess.replace('amt', req.body.amount);
                            // SEND_MESSAGE(a.ownerInformation[0].ownerNumber, mess2);
                            createPDF(req, res, det,amount, a.emailId, a.ownerInformation[0].ownerEmail, a, req.body.planType, billName, today, add, req.body.gstIn, qty, c, req.body.state);
                            reply[Constant.REPLY.MESSAGE] = Messages.PAYMENT_DETAILS;
                            reply[Constant.REPLY.DATA] = det;
                            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                            reply[Constant.REPLY.PDF_URL] = null;
                            reply[Constant.REPLY.TOKEN] = '';
                            return res.send(reply).end;
                        })
                        UPDATE_SALOON_TRANSACTION(req, d, req.body.amount);
                    }
                })
            })
    }
  
}
function UPDATE_SALOON_TRANSACTION(req, paymentId, amount) {

    var ser = new SaloonTransaction({
        saloonId: req.body.saloonId,
        amountReceived: amount,
        amountToPay: 0,
        dateTime: Date.now(),
        paymentId: paymentId,
        status: Constant.Transaction_Status.pending,
        transactionType: Constant.Transaction_Type.Monthly_Payment,
        planType: req.body.planType
    });
    ser.save({}, function (err) {
        if (err) {
            console.log("error while saving saloon transaction");
        } else {
            console.log("transaction save successfully");
        }
    })

}

function UPDATE_SALOON_BOOKING_VALIDITY(req, callback) {
    var validTo = new Date(req.body.validTo);
    var validFrom = new Date(req.body.validFrom);
    var planType = req.body.planType;
    Salon.findOneAndUpdate({ saloonId: req.body.saloonId },
        { validTo: validTo, validFrom: validFrom, gstIn: req.body.gstIn, planType: planType }, { new: true }, function (err, sal) {
            if (err) {
                console.log("error:" + err);
                return callback(false);
            }
            else {
                // console.log("success");
                return callback(sal)
            }
        });
}
function createPDF(req, res,det, amount, emailId, ownerEmail, sal, service, billName, date, add, gstIn, qty, count, state) {
    
    var tot = amount / 1.18;
    tot = Math.round(tot);
    var  r = tot / qty;
    var cgst;
    var sgst;
    var ig;
    var rate = r.toFixed(3);
    var pad = "000000";
    var n = '5';
    var result = (pad + n).slice(-pad.length);
    function paddy(num, padlen, padchar) {
        var pad_char = typeof padchar !== 'undefined' ? padchar : '0';
        var pad = new Array(1 + padlen).join(pad_char);
        return (pad + num).slice(-pad.length);
    }
    var bar = paddy(count, 4);
    var stcode;
    var planType;
    switch (state) {
        case "HR":
            stcode = "06";
            break;
        case "DL":
            stcode = "07";
            break;
        case "UP":
            stcode = "09"
            break;
        case "RJ":
            stcode = "08";
            break;

    }
    console.log(stcode);
    if (state == "HR") {
        cgst = Math.round(tot * .09);
        sgst = Math.round(tot * .09);
        ig = 0;
    } else {
        ig = .18;
        cgst =0;
        sgst =0;
    }
    var igst = Math.round(tot * ig);
    var aminwords = converter.toWords(amount);
    if(service ==1){
       planType = "SILVER"
       
   }else if(service ==2){
     planType = "GOLD"
   }else{
       planType ="PLATINUM";
   }
    var pdf = new PdfDocument({
        autoFirstPage: false
    })
    pdf.addPage({ marginTop: 0 }, { marginBottom: 0 }, { marginLeft: 72 }, { marginRight: 72 });
    pdf.font('Times-Roman')
    pdf.fontSize(12)
    pdf.text("INVOICE", 281, 10, { underline: true })
    pdf.fontSize(12)
    pdf.text("GST No. :", 38, 40)
    pdf.text("06AAFCS1880A2ZO", 89, 40)
    //pdf.image(path,  24, 14, {width: 100})
    pdf.text("SANCHI ENGINEERING (P) LTD", 38, 80)
    pdf.text("SCO-100,Shop No.LG 1,Sector-16,Market", 38, 96)
    pdf.text("Near IDBI Bank, Faridabad (Haryana)", 38, 112)
    pdf.text("Tel. :9958863008", 38, 128)
    pdf.text("Invoice No.", 405, 40)
    pdf.text("Zal " + count, 460, 40)
    pdf.lineWidth(.5)
    pdf.moveTo(38, 138)
        .lineTo(560, 138)
        .stroke()
    pdf.moveTo(400, 138)
        .lineTo(400, 40)
        .stroke()
    pdf.text("Date :" + date, 405, 128)
    pdf.text("Name :", 38, 148)
    pdf.text(billName, 80, 148)
    pdf.moveTo(75, 158)
        .lineTo(337, 158)
        .stroke()
    pdf.text("", 38, 168)
    pdf.moveTo(38, 178)
        .lineTo(337, 178)
        .stroke()
    pdf.text("State/State Code", 360, 148)
    pdf.text(stcode, 442, 148)
    pdf.moveTo(442, 158)
        .lineTo(560, 158)
        .stroke()
    pdf.text("GSTIN Number", 360, 168)
    pdf.text(gstIn, 442, 168)
    pdf.moveTo(442, 178)
        .lineTo(560, 178)
        .stroke()
    pdf.text("Address :", 38, 188)
    pdf.text(add, 80, 188)
    pdf.moveTo(80, 198)
        .lineTo(335, 198)
        .stroke()
    // pdf.text (add,38,208,) 
    pdf.moveTo(38, 218)
        .lineTo(335, 218)
        .stroke()
    //*************************crate a rect*****************************8 
    pdf.rect(38, 230, 525, 340)
    pdf.stroke()
    //*****************create a first horizontal line***************************** */
    pdf.moveTo(38, 257)
        .lineTo(560, 257)
        .stroke()
    pdf.text("Sr No", 40, 238)
    pdf.moveTo(68, 230)
        .lineTo(68, 468)
        .stroke()
    pdf.text("DESCRIPTIONS", 135, 238)
    //  pdf.image('../../var/www/html/Images/zaloonL/Zaloonz Logo-06.png',  60, 366, {width: 200})
    pdf.text(planType, 70, 262,{ columns: 2 })
    pdf.moveTo(290, 230)
        .lineTo(290, 468)
        .stroke()
    pdf.text("HSN/SAC", 300, 238)
    pdf.text("CODE", 304, 248)
    pdf.text(Constant.HSN_CODE.HSN, 300, 262)
    pdf.moveTo(357, 230)
        .lineTo(357, 468)
        .stroke()
    pdf.text("QTY.", 368, 238)
    pdf.text(qty, 368, 262)
    pdf.moveTo(408, 230)
        .lineTo(408, 548)
        .stroke()
    pdf.text("RATE", 428, 238)
    pdf.text(rate, 428, 262)
    pdf.moveTo(477, 230)
        .lineTo(477, 568)
        .stroke()
    pdf.text("Amount(Rs)", 480, 238)
    pdf.text(tot, 480, 262)
    //*************************************bottom horizontal line************* */
    pdf.moveTo(38, 468)
        .lineTo(560, 468)
        .stroke()
    pdf.text("Amount (in Words)", 58, 488)
    pdf.text("Rs. " + aminwords + " Only", 165, 488)
    pdf.moveTo(150, 498)
        .lineTo(380, 498)
        .stroke()
    pdf.moveTo(58, 522)
        .lineTo(380, 522)
        .stroke()
    pdf.moveTo(58, 546)
        .lineTo(380, 546)
        .stroke()
    pdf.text("Gst PAYABLE ON REVERSE CHARGES", 260, 554)
    pdf.text("Total", 418, 432)
    pdf.text(tot, 480, 432)
    pdf.moveTo(408, 428)
        .lineTo(560, 428)
        .stroke()
    pdf.fontSize(8);
    pdf.text("Freight &", 418, 452)
    pdf.text("Forwarding Charges", 408, 458)
    pdf.fontSize(12)
    pdf.text("0", 480, 458)
    pdf.moveTo(408, 448)
        .lineTo(560, 448)
        .stroke()
    pdf.fontSize(12)
    pdf.text("CGST", 418, 472)
    pdf.text(cgst, 480, 472)
    pdf.moveTo(408, 488)
        .lineTo(560, 488)
        .stroke()
    pdf.text("SGST", 418, 492)
    pdf.text(sgst, 480, 492)
    pdf.moveTo(408, 508)
        .lineTo(560, 508)
        .stroke()
    pdf.text("IGST", 418, 512)
    pdf.text(igst, 480, 512)
    pdf.moveTo(408, 528)
        .lineTo(560, 528)
        .stroke()
    pdf.text("Grand Total", 418, 532)
    pdf.text(amount, 480, 532)
    pdf.moveTo(408, 548)
        .lineTo(560, 548)
        .stroke()
    //*************************************************below rect************************** */
    pdf.fontSize(10)
    pdf.text("Certified that the Particulars given above are true and correct", 60, 570)
    pdf.fontSize(12)
    pdf.text("For SANCHI ENGINEERING (P) LTD.", 340, 572)
    pdf.text("E.& O.E.", 38, 582)
    pdf.text("Terms & Conditions :", 38, 598, { underline: true })
    pdf.fontSize(8)
    pdf.text("1.Interest @18% will be charged from the data of issue.Bill till Actual Realisation.", 40, 618)
    pdf.text("2.Plan once sold will not be taken back or exchanged.", 40, 638)
    pdf.text("3.Any Disputes are Subject to Faridabad jurisdiction Only ", 40, 658)
    pdf.text("4.All disputes shall be refred to Arbitration of the Sole Arbitration to be Appointed by the Director Sanchi Engineering (P) Ltd.", 40, 678)
    pdf.text("The Director Shall be the Sole Appointing Authority. The Seat of Arbitration Shall be Faridabad alone.", 40, 698)
    pdf.fontSize(12)
    pdf.text("Authorised Signatory", 460, 648)
    pdf.text("Authorised ", 460, 680)

    var da = new Date();
    var month = da.getMonth() + 1;
    var year = da.getFullYear();

    var directory2 = "../../var/www/html/Invoices";
    if (!fs.existsSync(directory2)) {
        fs.mkdirSync(directory2);
    }
    var directory = "../../var/www/html/Invoices/" + month + "-" + year;
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }
    var mainDir = directory.concat("//path");
    var dir = mainDir.replace("path", det.paymentId);

    //  console.log("expect...  "+det.paymentId)
    x: det.paymentId;
    var path = dir + ".pdf";
    pdf.pipe(fs.createWriteStream(dir + ".pdf"));

    pdf.end();
    var mess = Messages.EMAIL_MESS.replace('saloonName', req.body.saloonName);
    // console.log('emailId' + req.body.emailId + "" + ownerInformation[0].ownerEmail);
    SENDMAIL(emailId, ownerEmail, path, mess)// Ankur Gupta

}
function createPDF2(req, res, det, amount, emailId, ownerEmail, sal, service, billName, date, add, gstIn, qty, count, state) {
    var tot = amount / 1.18;
    tot = Math.round(tot);
    var  r = tot / qty;
    var cgst;
    var sgst;
    var ig;
    var rate = r.toFixed(3);
    var pad = "000000";
    var n = '5';
    var result = (pad + n).slice(-pad.length);
    function paddy(num, padlen, padchar) {
        var pad_char = typeof padchar !== 'undefined' ? padchar : '0';
        var pad = new Array(1 + padlen).join(pad_char);
        return (pad + num).slice(-pad.length);
    }
    var bar = paddy(count, 4);
    var stcode;
    var planType;
    switch (state) {
        case "HR":
            stcode = "06";
            break;
        case "DL":
            stcode = "07";
            break;
        case "UP":
            stcode = "09"
            break;
        case "RJ":
            stcode = "08";
            break;

    }
    console.log(stcode);
    if (state == "HR") {
        cgst = Math.round(tot * .09);
        sgst = Math.round(tot * .09);
        ig = 0;
    } else {
        ig = .18;
        cgst =0;
        sgst =0;
    }
    var igst = Math.round(tot * ig);
    var aminwords = converter.toWords(amount);
    if(service ==1){
       planType = "SILVER"
       
   }else if(service ==2){
     planType = "GOLD"
   }else{
       planType ="PLATINUM";
   }
    var pdf = new PdfDocument({
        autoFirstPage: false
    })
    pdf.addPage({ marginTop: 0 }, { marginBottom: 0 }, { marginLeft: 72 }, { marginRight: 72 });
    pdf.font('Times-Roman')
    pdf.fontSize(12)
    pdf.text("INVOICE", 281, 10, { underline: true })
    pdf.fontSize(12)
    pdf.text("GST No. :", 38, 40)
    pdf.text("06AAFCS1880A2ZO", 89, 40)
    //pdf.image(path,  24, 14, {width: 100})
    pdf.text("SANCHI ENGINEERING (P) LTD", 38, 80)
    pdf.text("SCO-100,Shop No.LG 1,Sector-16,Market", 38, 96)
    pdf.text("Near IDBI Bank, Faridabad (Haryana)", 38, 112)
    pdf.text("Tel. :9958863008", 38, 128)
    pdf.text("Invoice No.", 405, 40)
    pdf.text("Zal " + count, 460, 40)
    pdf.lineWidth(.5)
    pdf.moveTo(38, 138)
        .lineTo(560, 138)
        .stroke()
    pdf.moveTo(400, 138)
        .lineTo(400, 40)
        .stroke()
    pdf.text("Date :" + date, 405, 128)
    pdf.text("Name :", 38, 148)
    pdf.text(billName, 80, 148)
    pdf.moveTo(75, 158)
        .lineTo(337, 158)
        .stroke()
    pdf.text("", 38, 168)
    pdf.moveTo(38, 178)
        .lineTo(337, 178)
        .stroke()
    pdf.text("State/State Code", 360, 148)
    pdf.text(stcode, 442, 148)
    pdf.moveTo(442, 158)
        .lineTo(560, 158)
        .stroke()
    pdf.text("GSTIN Number", 360, 168)
    pdf.text(gstIn, 442, 168)
    pdf.moveTo(442, 178)
        .lineTo(560, 178)
        .stroke()
    pdf.text("Address :", 38, 188)
    pdf.text(add, 80, 188)
    pdf.moveTo(80, 198)
        .lineTo(335, 198)
        .stroke()
    // pdf.text (add,38,208,) 
    pdf.moveTo(38, 218)
        .lineTo(335, 218)
        .stroke()
    //*************************crate a rect*****************************8 
    pdf.rect(38, 230, 525, 340)
    pdf.stroke()
    //*****************create a first horizontal line***************************** */
    pdf.moveTo(38, 257)
        .lineTo(560, 257)
        .stroke()
    pdf.text("Sr No", 40, 238)
    pdf.moveTo(68, 230)
        .lineTo(68, 468)
        .stroke()
    pdf.text("DESCRIPTIONS", 135, 238)
    //  pdf.image('../../var/www/html/Images/zaloonL/Zaloonz Logo-06.png',  60, 366, {width: 200})
    pdf.text(planType, 70, 262,{ columns: 2 })
    pdf.moveTo(290, 230)
        .lineTo(290, 468)
        .stroke()
    pdf.text("HSN/SAC", 300, 238)
    pdf.text("CODE", 304, 248)
    pdf.text(Constant.HSN_CODE.HSN, 300, 262)
    pdf.moveTo(357, 230)
        .lineTo(357, 468)
        .stroke()
    pdf.text("QTY.", 368, 238)
    pdf.text(qty, 368, 262)
    pdf.moveTo(408, 230)
        .lineTo(408, 548)
        .stroke()
    pdf.text("RATE", 428, 238)
    pdf.text(rate, 428, 262)
    pdf.moveTo(477, 230)
        .lineTo(477, 568)
        .stroke()
    pdf.text("Amount(Rs)", 480, 238)
    pdf.text(tot, 480, 262)
    //*************************************bottom horizontal line************* */
    pdf.moveTo(38, 468)
        .lineTo(560, 468)
        .stroke()
    pdf.text("Amount (in Words)", 58, 488)
    pdf.text("Rs. " + aminwords + " Only", 165, 488)
    pdf.moveTo(150, 498)
        .lineTo(380, 498)
        .stroke()
    pdf.moveTo(58, 522)
        .lineTo(380, 522)
        .stroke()
    pdf.moveTo(58, 546)
        .lineTo(380, 546)
        .stroke()
    pdf.text("Gst PAYABLE ON REVERSE CHARGES", 260, 554)
    pdf.text("Total", 418, 432)
    pdf.text(tot, 480, 432)
    pdf.moveTo(408, 428)
        .lineTo(560, 428)
        .stroke()
    pdf.fontSize(8);
    pdf.text("Freight &", 418, 452)
    pdf.text("Forwarding Charges", 408, 458)
    pdf.fontSize(12)
    pdf.text("0", 480, 458)
    pdf.moveTo(408, 448)
        .lineTo(560, 448)
        .stroke()
    pdf.fontSize(12)
    pdf.text("CGST", 418, 472)
    pdf.text(cgst, 480, 472)
    pdf.moveTo(408, 488)
        .lineTo(560, 488)
        .stroke()
    pdf.text("SGST", 418, 492)
    pdf.text(sgst, 480, 492)
    pdf.moveTo(408, 508)
        .lineTo(560, 508)
        .stroke()
    pdf.text("IGST", 418, 512)
    pdf.text(igst, 480, 512)
    pdf.moveTo(408, 528)
        .lineTo(560, 528)
        .stroke()
    pdf.text("Grand Total", 418, 532)
    pdf.text(amount, 480, 532)
    pdf.moveTo(408, 548)
        .lineTo(560, 548)
        .stroke()
    //*************************************************below rect************************** */
    pdf.fontSize(10)
    pdf.text("Certified that the Particulars given above are true and correct", 60, 570)
    pdf.fontSize(12)
    pdf.text("For SANCHI ENGINEERING (P) LTD.", 340, 572)
    pdf.text("E.& O.E.", 38, 582)
    pdf.text("Terms & Conditions :", 38, 598, { underline: true })
    pdf.fontSize(8)
    pdf.text("1.Interest @18% will be charged from the data of issue.Bill till Actual Realisation.", 40, 618)
    pdf.text("2.Plan once sold will not be taken back or exchanged.", 40, 638)
    pdf.text("3.Any Disputes are Subject to Faridabad jurisdiction Only ", 40, 658)
    pdf.text("4.All disputes shall be refred to Arbitration of the Sole Arbitration to be Appointed by the Director Sanchi Engineering (P) Ltd.", 40, 678)
    pdf.text("The Director Shall be the Sole Appointing Authority. The Seat of Arbitration Shall be Faridabad alone.", 40, 698)
    pdf.fontSize(12)
    pdf.text("Authorised Signatory", 460, 648)
    pdf.text("Authorised ", 460, 680)

    var da = new Date();
    var month = da.getMonth() + 1;
    var year = da.getFullYear();

    var directory2 = "../../var/www/html/Invoices";
    if (!fs.existsSync(directory2)) {
        fs.mkdirSync(directory2);
    }
    var directory = "../../var/www/html/Invoices/" + month + "-" + year;
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }
    var directory3 = "../../var/www/html/Invoices/" + month + "-" + year+"cheque"
    if (!fs.existsSync(directory3)) {
        fs.mkdirSync(directory3);
    }
    var mainDir = directory3.concat("//path");
    var dir = mainDir.replace("path", det.paymentId);

    //  console.log("expect...  "+det.paymentId)
    det.paymentId;
    var path = dir + ".pdf";
    pdf.pipe(fs.createWriteStream(dir + ".pdf"));

    pdf.end();
    var mess = Messages.EMAIL_MESS.replace('saloonName', req.body.saloonName);
    // console.log('emailId' + req.body.emailId + "" + ownerInformation[0].ownerEmail);
    SENDMAIL(emailId, ownerEmail, path, mess)// Ankur Gupta

}

function SENDMAIL(emailId, emailId2, path, mess) {

    var emails;
    if (emailId2 == "" || !emailId2) {
        emails = emailId
    } else {

        emails = emailId.concat("," + emailId2);
    }
    // console.log('emails' + emails);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'zaloonz.in@gmail.com',
            pass: 'zaloonz@123'
        }
    });
    var mailOptions = {
        from: 'zaloonz.in@gmail.com',
        to: emails,
        subject: 'INVOICE',
        text: mess,
        attachments: [
            {   // file on disk as an attachment
                filename: 'Invoice.pdf',
                path: path // stream this file
            }
        ]
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            //  console.log(error);
        } else {
            // console.log('Email sent')
        }
    });
}


exports.FIND_SALON = function (req, res) {

    Salon.findOne({ saloonId: req.params.saloonId }, function (err, sal) {
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            INSERT_SALOON_VIEWS(req.params.saloonId);
            GET_SALOON_FAVORITE_COUNT(req.params.saloonId, function (no) {
                GET_NO_OF_REVIEWS(req.params.saloonId, function (count, x) {
                    reply[Constant.REPLY.MESSAGE] = Messages.success;
                    reply[Constant.REPLY.DATA] = sal;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                    reply[Constant.REPLY.TOKEN] = '';
                    reply[Constant.REPLY.REVIEW_COUNT] = count;
                    // console.log("http://139.59.9.202/"+x);
                    reply[Constant.REPLY.FAVORITE_COUNT] = no;
                    return res.send(reply).end;
                })
            })
        }
    })
};




// When a saloon isgiing to shutdown then saloon info will be move from saloonInformation to shut down Saloon and
// info will be removed from saloon Information.
exports.SHUT_DOWN = function (req, res) {
    Salon.findOne({ saloonId: req.params.saloonId }, function (err, sal) {
        if (err || !sal) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            var saloon = new shutDownSaloon({
                saloonId: sal.saloonId,
                saloonName: sal.saloonName,
                address: sal.address,
                saloonType: sal.saloonType,
                ownerInformation: sal.ownerInformation,
                branchId: sal.branchId,
                location: sal.location,
                parentName: sal.parentName,
                emailId: sal.emailId,
                mobileNumber: sal.mobileNumber
            });
            saloon.save({}, function (err) {
                if (err) {
                    reply[Constant.REPLY.MESSAGE] = Messages.Error;
                    reply[Constant.REPLY.DATA] = null;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                    reply[Constant.REPLY.TOKEN] = '';
                    return res.send(reply).end;
                } else {
                    Salon.findOneAndRemove({ saloonId: req.params.saloonId }, function (err) {
                        if (err) {
                            reply[Constant.REPLY.MESSAGE] = Messages.SHUT_DOWN;
                            reply[Constant.REPLY.DATA] = null;
                            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                            reply[Constant.REPLY.TOKEN] = '';
                            return res.send(reply).end;
                        } else {
                            reply[Constant.REPLY.MESSAGE] = Messages.success;
                            reply[Constant.REPLY.DATA] = null;
                            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                            reply[Constant.REPLY.TOKEN] = '';
                            return res.send(reply).end;
                        }
                    })
                }
            })
        }
    })
};



exports.POSTMAN_Service = function (req, res) {
    var arrayIn = [];
    var arrayOut = [];
    var services = JSON.pars(req.body.services);
    for (var i = 0; i < services.length; i++) {
        service(req, res, arrayIn, arrayOut, i, services, function () {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            return res.send(reply).end;

        })
    }

};


exports.service = function (req, res) {
    var arrayIn = [];
    var arrayOut = [];
    var services = JSON.parse(JSON.stringify(req.body.services));
    for (var i = 0; i < services.length; i++) {
        service(req, res, arrayIn, arrayOut, i, services, function () {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            return res.send(reply).end;

        })
    }

};
function service(req, res, arrayIn, arrayOut, i, services, callback) {
    var isTrue;
    // console.log('item id is' + services[i].itemId);
    // console.log("service is"+services[i]);
    if (services[i].itemId == "" || !services[i].itemId) {

        var str = "I";
        var id = str.concat(Date.now());
        var service = new Service({
            category: services[i].category,
            service: services[i].service,
            item: services[i].item,
            itemId: id

        });
        services[i].itemId = id;
        service.save({}, function (err, ser) {
            if (err) {
                // console.log("ErrOr is"+ err);
                arrayOut.push(services[i]);
                isTrue = Check(arrayIn, arrayOut, services.length);
                if (isTrue) {
                    return callback()
                }
            } else {
                // console.log("saved");
                arrayIn.push(services[i]);
                ADD_SERVICE(req, req.body.saloonId, services[i]);
                isTrue = Check(arrayIn, arrayOut, services.length);
                if (isTrue) {
                    return callback()
                }
            }


        })
    } else {
        Salon.findOne({
            saloonId: req.body.saloonId,
            "services.itemId": services[i].itemId
        }, { "services.$": 1 }, function (err, sal) {
            // console.log("MGL" + sal + "");
            // console.log("iteration" + i);
            if (!sal) {
                arrayIn.push(services[i]);
                ADD_SERVICE(req, req.body.saloonId, services[i]);
                isTrue = Check(arrayIn, arrayOut, services.length);
                if (isTrue) {
                    return callback()
                }
            } else {
                arrayIn.push(services[i]);
                Edit_Rate(req, req.body.saloonId, services[i]);
                isTrue = Check(arrayIn, arrayOut, services.length);
                if (isTrue) {
                    return callback()
                }

            }


        })
    }
}


function Edit_Rate(req, saloonId, services) {
    //  console.log("mgl id " + services.itemId);
    Salon.findOneAndUpdate({
        saloonId: saloonId, "services.itemId": services.itemId
    },
        { "services.$.itemRate": services.itemRate }, function (err, sal) {

            if (err) {

            } else {

            }


        })
}
function ADD_SERVICE(req, saloonId, services) {
    Salon.findOneAndUpdate({ saloonId: req.body.saloonId }, { $push: { services: services } }, function (err) {

        if (err) {


        } else {

        }
    })


}

function Check(arrayIn, arrayOut, length) {
    var total = arrayIn.length + arrayOut.length;
    if (total == length) {
        return true;
    }

}





exports.ADD_OFFERS = function (req, res) {
    var arrayIn = [];
    var arrayOut = [];
    var offers = JSON.parse(req.body.offers);
    var sal = new SaloonOffer({
        saloonId: req.body.saloonId

    });
    sal.save({}, function (err, save) {
        for (var i = 0; i < offers.length; i++) {
            ADD_OFFERS(i, arrayIn, arrayOut, offers, req.body.saloonId, function (a) {
                reply[Constant.REPLY.MESSAGE] = Messages.success;
                reply[Constant.REPLY.DATA] = a;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                return res.send(reply).end;

            })

        }
    });

};

function ADD_OFFERS(i, arrayIn, arrayOut, offers, saloonId, callback) {
    offers[i].validFrom = new Date(offers[i].validFrom);
    offers[i].validTo = new Date(offers[i].validTo);
    offers[i].postingOn = new Date(Date.now());
    SaloonOffer.findOneAndUpdate({ saloonId: saloonId }, { $push: { offers: offers[i] } }, function (err) {
        if (err) {
            arrayOut.push(offers[i]);
        } else {
            arrayIn.push(offers[i])
        }
        var tot = arrayIn.length + arrayOut.length;
        if (tot == offers.length) {
            return callback(arrayOut);
        }
    })
}
exports.EDIT_OFFER = function (req, res) {
    var arrayIn = [];
    var arrayOut = [];
    var offers = JSON.parse(req.body.offers);
    for (var i = 0; i < offers.length; i++) {
        EDIT_OFFER(i, arrayIn, arrayOut, offers, req.body.saloonId, function (a) {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = a;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            return res.send(reply).end;

        })
    }
};

function EDIT_OFFER(i, arrayIn, arrayOut, offers, saloonId, callback) {
    offers[i].validFrom = new Date(offers[i].validFrom);
    offers[i].validTo = new Date(offers[i].validTo);
    SaloonOffer.findOneAndUpdate({
        saloonId: saloonId, "offers.service": offers[i].service, "offers.item": offers[i].item,
        "offers.category": offers[i].category
    },
        { "offers.$": offers[i] }, { new: true }, function (err, ofer) {
            if (err) {
                arrayOut.push(offers[i]);
            } else {
                arrayIn.push(offers[i]);
            }
            var tot = arrayIn.length + arrayOut.length;
            if (tot == offers.length) {
                return callback(arrayOut);
            }
        })

}


exports.SUGGESTION_LIST = function (req, res) {
    /*var maxDistance = Constant.DISTANCE.Limit / Constant.DISTANCE.EARTH_RADIUS;
    var array = [];
    array[0] = req.body.longitude;
    array[1] = req.body.latitude;*/
    var saloonName = req.body.saloonName;

	/*location: {
                $near: array,
                $maxDistance: maxDistance

            },*/

    Salon.distinct("saloonName", {
        saloonName: new RegExp(saloonName, "i")
    }, function (err, salons) {
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {

            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = salons;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;


        }
    })

};


function INSERT_SALOON_VIEWS(saloonId) {

    SaloonViews.findOneAndUpdate({ saloonId: saloonId }, {
        saloonId: saloonId,
        $inc: { noOfViews: 1 }
    }, { upsert: true }, function (err) {

    });
    Salon.findOneAndUpdate({ saloonId: saloonId }, {
        $inc: { noOfViews: 1 }
    }, function (err) {

    });
}



exports.GET_SALON = function (req, res) {
    console.log('ankur');
    // console.log(req.body);
    var maxDistance = Constant.DISTANCE.Limit / Constant.DISTANCE.EARTH_RADIUS;
    var array = [];
    array[0] = req.body.longitude;
    array[1] = req.body.latitude;
    var no = parseInt(req.body.pageNo);
    var saloonName = req.body.saloonName;

    if (saloonName) {
        Salon.find({
            saloonName: new RegExp(req.body.saloonName, "i")
        }).sort({ location: 1 }).limit(Constant.PAGE_LIMIT.size).skip(Constant.PAGE_LIMIT.size * no).exec(function (err, salons) {

            Salon.find({ saloonName: new RegExp(req.body.saloonName, "i") }).count().exec(function (err, c) {
                //  console.log("response" + salons);
                reply[Constant.REPLY.MESSAGE] = Messages.notFound;
                reply[Constant.REPLY.DATA] = salons;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                reply[Constant.REPLY.TOKEN] = '';
                reply[Constant.REPLY.COUNT] = c;
                return res.send(reply).end;
            })

        })

    }


    else {

        Salon.find({
            location: {
                $near: array,
                $maxDistance: maxDistance

            }
        }).sort({ location: 1 }).limit(Constant.PAGE_LIMIT.size).skip(Constant.PAGE_LIMIT.size * no).exec(function (err, salons) {

            Salon.find({
                location: {
                    $near: array,
                    $maxDistance: maxDistance

                }
            }).count().exec(function (err, c) {


                reply[Constant.REPLY.MESSAGE] = Messages.notFound;
                reply[Constant.REPLY.DATA] = salons;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                reply[Constant.REPLY.TOKEN] = '';
                reply[Constant.REPLY.COUNT] = c;
                return res.send(reply).end;
            })

        })
    }
};





exports.GET_SALOON_BY_NAME = function (req, res) {
    var no = req.body.pageNo;
    Salon.find({ saloonName: req.body.saloonName }).skip(Constant.PAGE_LIMIT.size * no).limit(Constant.PAGE_LIMIT.size).exec(function (err, salons) {
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            Salon.find({ saloonName: req.body.saloonName })
                .count().exec(function (err, count) {

                    reply[Constant.REPLY.MESSAGE] = Messages.success;
                    reply[Constant.REPLY.DATA] = salons;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                    reply[Constant.REPLY.TOKEN] = '';
                    reply[Constant.REPLY.COUNT] = count;
                    return res.send(reply).end;


                })

        }
    })
};

exports.FIND_BY_SALOON_ID = function (req, res) {

    Salon.findOne({ saloonId: req.body.saloonId }, function (err, sal) {
        if (err) {

            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {

            ImageInfo.find({ saloonId: req.body.saloonId }).count().exec(function (err, count) {

                ReviewInfo.find({ saloonId: req.body.saloonId }, function (err, rew) {

                    var rewLen = rew.length;
                    var array = [];
                    for (var i = 0; i < rew.length; i++) {
                        if (rew[i].rating > 3.5) {
                            array.push(rew[i].review);
                        }
                        if (array.length == 5) {
                            break;
                        }
                    }
                    reply[Constant.REPLY.MESSAGE] = Messages.success;
                    reply[Constant.REPLY.NoOfImages] = count;
                    reply[Constant.REPLY.NoOfReviews] = rewLen;
                    reply[Constant.REPLY.reviews] = array;
                    reply[Constant.REPLY.DATA] = sal;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                    reply[Constant.REPLY.TOKEN] = '';
                    return res.send(reply).end;

                })
            })
        }
    })

};


function createSaloon(req, res) {
    var str = "S";
    var address = JSON.parse(JSON.stringify(req.body.address));
    var homeService = parseInt(req.body.homeService);

    var scheduleTiming = JSON.parse(JSON.stringify(req.body.scheduleTiming));
    var ownerInformation = JSON.parse(JSON.stringify(req.body.ownerInformation));
    if (req.body.alternateNumber) {
        var alternateNumber = JSON.parse(JSON.stringify(req.body.alternateNumber));
    }
    var id = str.concat(Date.now());

    var salon = new Salon({
        saloonId: id,
        saloonName: req.body.saloonName,
        tagLine: req.body.tagLine,
        mobileNumber: req.body.mobileNumber,
        address: address,
        emailId: req.body.emailId,
        saloonType: req.body.saloonType,
        scheduleTiming: scheduleTiming,
        description: req.body.description,
        ownerInformation: ownerInformation,
        location: [req.body.longitude, req.body.latitude],
        parentName: req.body.parentName,
        homeService: homeService,
        alternateNumber: alternateNumber,
        gstIn: req.body.gstIn,
        panNo: req.body.panNo
    });

    salon.save({}, function (err, sal) {
        if (err) {
            // console.log(err);
            reply[Constant.REPLY.MESSAGE] = Messages.notCreated;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;

        } else {
            createEmployeeAcityity(req, id, '', Constant.WORK_TYPE.SALOON_CREATED);
            if (req.body.requestId) {          // send the requestId and employeeId if an request has been raised
                UPDATE_REQUEST_STATUS(req.body.requestId, req.body.employeeId);
            }

            console.log("before salon sign up.....................")
            SALON_SIGN_UP(sal.saloonId, req.body.saloonName, ownerInformation[0].ownerNumber, function (isSuccess) {
                if (isSuccess == true) {

                    reply[Constant.REPLY.MESSAGE] = Messages.created;
                    reply[Constant.REPLY.DATA] = sal;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                    reply[Constant.REPLY.TOKEN] = '';
                    return res.send(reply).end;

                } else {

                    reply[Constant.REPLY.MESSAGE] = Messages.SALOON_CREATED;
                    reply[Constant.REPLY.DATA] = null;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                    reply[Constant.REPLY.TOKEN] = '';
                    return res.send(reply).end
                }
            })
        }
    })
}
exports.EMPLOYEE_ADD_COUPON = function (req, res) {
    var str = 'CZ';
    var couponCode = str.concat(Date.now());
    var validTo = new Date(req.body.validTo);
    var validFrom = new Date(req.body.validFrom);
    var date = new Date().toLocaleDateString();
    var itemName = (req.body.itemName + "").split("@");
    var itemId = (req.body.itemId + "").split("@");
    var saloonId = (req.body.saloonId + "").split("@");
    var coup = new Coupon({
        couponCode: couponCode,
        couponName: req.body.couponName,
        minOrderAmount: req.body.minOrderAmount,
        maxOrderAmount: req.body.maxOrderAmount,
        validTo: validTo,
        validFrom: validFrom,
        itemId: itemId,
        itemName: itemName,
        saloonId: saloonId,// saloonId and saloon name will be all if it is for all saloon
        couponCreatedBy: req.body.id,
        createdOn: date,
        couponDescription: req.body.description,
        couponType: req.body.codeType,
        usageCount: req.body.usageCount
    });
    coup.save({}, function (err) {
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = err;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.created;
            reply[Constant.REPLY.DATA] = '';
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;

        }


    })
};
exports.WEB_EMPLOYEE_ADD_COUPON = function (req, res) {
    var str = 'CZ';
    var couponCode = str.concat(Date.now());
    var validTo = new Date(req.body.validTo);
    var validFrom = new Date(req.body.validFrom);
    var date = new Date().toLocaleDateString();
    var itemName = req.body.itemName;
    var itemId = req.body.itemId;
    var saloonId = req.body.saloonId;
    var coup = new Coupon({
        couponCode: couponCode,
        couponName: req.body.couponName,
        minOrderAmount: req.body.minOrderAmount,
        maxOrderAmount: req.body.maxOrderAmount,
        validTo: validTo,
        validFrom: validFrom,
        itemId: itemId,
        itemName: itemName,
        saloonId: saloonId,// saloonId and saloon name will be all if it is for all saloon
        couponCreatedBy: req.body.id,
        createdOn: date,
        couponDescription: req.body.description,
        couponType: req.body.codeType,
        usageCount: req.body.usageCount
    });
    coup.save({}, function (err) {
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = err;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.created;
            reply[Constant.REPLY.DATA] = '';
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;

        }


    })
};

exports.SALOON_ADD_COUPON = function (req, res) {
    var str = 'CS';
    var couponCode = str.concat(Date.now());
    var validTo = new Date(req.body.validTo);
    var validFrom = new Date(req.body.validFrom);
    var date = new Date().toLocaleDateString();
    var services = JSON.parse((req.body.services));
    var coup = new Coupon({
        couponCode: couponCode,
        couponName: req.body.couponName,
        minOrderAmount: req.body.minOrderAmount,
        maxOrderAmount: req.body.maxOrderAmount,
        validTo: validTo,
        validFrom: validFrom,
        services: services,
        saloonId: req.body.saloonId,
        saloonName: req.body.saloonName,
        couponCreatedBy: req.body.id,
        createdOn: date,
        couponDescription: req.body.description,
        couponType: req.body.codeType,
        discountType: req.body.discountType,
        discountAmount: req.body.discountAmount

    });

    coup.save({}, function (err) {
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = err;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.created;
            reply[Constant.REPLY.DATA] = '';
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;

        }


    })

};


exports.UPDATE_COUPON = function (req, res) {
    var date = new Date().toLocaleDateString();
    var validTo = new Date(req.body.validTo);
    var validFrom = new Date(req.body.validFrom);
    var services = JSON.parse(JSON.stringify(req.body.services));
    Coupon.findOneAndUpdate({ couponCode: req.body.couponCode, saloonId: req.body.saloonId }, {
        minOrderAmount: req.body.minOrderAmount,
        maxOrderAmount: req.body.maxOrderAmount,
        validTo: validTo,
        validFrom: validFrom,
        saloonName: req.body.saloonName,
        couponCreatedBy: req.body.id,
        modifiedOn: date,
        couponDescription: req.body.description,
        couponType: req.body.codeType,
        $push: { services: services }
    }, { new: true }, function (err, upt) {

        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.created;
            reply[Constant.REPLY.DATA] = upt;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }


    })

};


exports.ADD_SPONSORED_SALOON = function (req, res) {
    var validTo = new Date(req.body.validTo);
    var validFrom = new Date(req.body.validFrom);
    var billName = req.body.billName;
    var add = req.body.address;
    var st = req.body.state;
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }

    today = mm + '/' + dd + '/' + yyyy;
    var qty = validFrom.getMonth() - validTo.getMonth();

    UPDATE_SPONSORSHIP__IN_SALOON(req, validFrom, validTo, function (sal) {
        var sponsor = new SponsoredSaloon({
            saloonId: req.body.saloonId,
            location: sal.location,
            address: sal.address,
            validTo: validTo,
            validFrom: validFrom,
            planType: req.body.planType
        });

        sponsor.save({}, function (err) {
            if (err) {
                console.log("err1234" + err);
                reply[Constant.REPLY.MESSAGE] = Messages.Error;
                reply[Constant.REPLY.DATA] = null;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end
            } else {

                var date = new Date().toLocaleDateString();
                var str = "P";
                var cgst;
                var sgst;
                var total;
                var amount = parseInt(req.body.amount);
                saloonPayment.count({}, function (err, count) {
                    console.log("err456" + err);
                    console.log("count" + count);
                    var c = count + 1;
                    var d = str.concat(Date.now());
                    var paymentDetails = new saloonPayment({
                        invoiceNo: c,
                        paymentId: d,
                        saloonId: req.body.saloonId,
                        saloonName: req.body.saloonName,
                        validFrom: validFrom,
                        validTo: validTo,
                        paymentMode: req.body.paymentMode,
                        receivedBy: req.body.receivedBy,
                        dateTime: date,
                        billName: req.body.billName,
                        add: req.body.address,
                        state: req.body.state,
                        serviceType: req.body.serviceType,
                        amount: req.body.amount,
                        planType: req.body.planType
                    });
                    paymentDetails.save({}, function (err, det) {
                        if (err) {
                            console.log(err);
                            reply[Constant.REPLY.MESSAGE] = Messages.PAYMENT_DETAILS_ERROR;
                            reply[Constant.REPLY.DATA] = null;
                            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                            reply[Constant.REPLY.TOKEN] = '';
                            return res.send(reply).end;
                        } else {
                            createEmployeeAcityity(req, req.body.saloonId, d, Constant.WORK_TYPE.PAYMENT_ACCEPTED);
                            var mess = Messages.PAYMENT_MESSAGE2.replace('name', sal.saloonName);
                            var mess2 = mess.replace('amt', req.body.amount);
                            SEND_MESSAGE(sal.ownerInformation[0].ownerNumber, mess2);
                            /*  var amt = (amount * 15.26) / 100;
                              amount = amount - amt;
                              amount = Math.round(amount);
                              var amt2 = amt / 2;
                              cgst = Math.round(amt2);
                              sgst = Math.round(amt2);
                              total = amount + cgst + sgst;
                            */
                            var tot = amount / 1.18;
                            tot = Math.round(tot);
                            console.log(tot + ".....................................................tot");
                            cgst = Math.round(tot * .09);
                            sgst = Math.round(tot * .09);

                            createPDF(req, res, det, cgst, sgst, amount, sal.emailId, sal.ownerInformation[0].ownerEmail, sal, Constant.SERVICE.BASIC_PLAN, billName, today, add, req.body.gstIn, qty, c, req.body.state, tot);
                            //createPDF(req, res, det, sal.address, sal.ownerInformation, total, cgst, sgst, amount, sal.emailId, sal.ownerInformation[0].ownerEmail, sal, Constant.SERVICE.SPONSORSHIP);
                            UPDATE_SALOON_TRANSACTION(req, d, req.body.amount);
                            reply[Constant.REPLY.MESSAGE] = Messages.PAYMENT_DETAILS;
                            reply[Constant.REPLY.DATA] = det;
                            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                            reply[Constant.REPLY.TOKEN] = '';
                            return res.send(reply).end;

                        }
                    })
                })
            }
        })

    })

};




function createEmployeeAcityity(req, saloonId, paymentId, workType) {
    var date = new Date().toLocaleString();
    var empActivity = new EmployeeActivity({
        employeeId: req.body.employeeId,
        name: req.body.employeeNumber,
        mobileNumber: req.body.employeeNumber,
        workType: workType,
        saloonId: saloonId,
        paymentId: paymentId,
        dateTime: date


    });
    empActivity.save({}, function (err, empAct) {
        if (err) {
            console.log('some error occured ')
        } else {
            console.log('employee activity save')
        }


    })
}
exports.EMPLOYEE_GET_SALOON = function (req, res) {
    var no = req.body.pageNo;
    if (req.body.longitude && req.body.latitude) {
        var maxDistance = Constant.DISTANCE.Limit / Constant.DISTANCE.EARTH_RADIUS;
        var array = [];
        array[0] = req.body.longitude;
        array[1] = req.body.latitude;


        Salon.find({
            location: {
                $near: array,
                $maxDistance: maxDistance

            }
        }
        ).select({
            saloonId: 1, saloonName: 1,
            mobileNumber: 1, branchId: 1, address: 1, parentName: 1, _id: 0
        }).skip(Constant.PAGE_LIMIT.size * no).limit(Constant.PAGE_LIMIT.size).exec(function (err, salons) {
            if (err) {
                reply[Constant.REPLY.MESSAGE] = Messages.notFound;
                reply[Constant.REPLY.DATA] = null;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
            } else {
                Salon.find({
                    location: {
                        $near: array,
                        $maxDistance: maxDistance
                    }
                }).count().exec(function (err, count) {
                    reply[Constant.REPLY.MESSAGE] = Messages.success;
                    reply[Constant.REPLY.DATA] = salons;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                    reply[Constant.REPLY.TOKEN] = '';
                    reply[Constant.REPLY.COUNT] = count;
                    return res.send(reply).end;
                })

            }
        })
    } else {
        Salon.find({
            saloonName: new RegExp(req.body.saloonName, "i")
        }).select({
            saloonId: 1, saloonName: 1,
            mobileNumber: 1, branchId: 1, address: 1, parentName: 1, _id: 0
        }).skip(Constant.PAGE_LIMIT.size * no).limit(Constant.PAGE_LIMIT.size).exec(function (err, salons) {
            if (err) {
                reply[Constant.REPLY.MESSAGE] = Messages.notFound;
                reply[Constant.REPLY.DATA] = null;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
            } else {
                Salon.find({
                    saloonName: new RegExp(req.body.saloonName, "i")
                }).count().exec(function (err, count) {
                    reply[Constant.REPLY.MESSAGE] = Messages.success;
                    reply[Constant.REPLY.DATA] = salons;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                    reply[Constant.REPLY.TOKEN] = '';
                    reply[Constant.REPLY.COUNT] = count;
                    return res.send(reply).end;

                })
            }
        })
    }
};

exports.WEB_EMPLOYEE_GET_SALOON = function (req, res) {
    var no = req.body.pageNo;
    let limit = req.body.pageSize || 10;
    let skip = limit * (parseInt(req.body.pageNo) - 1);
    if (req.body.longitude && req.body.latitude) {
        var maxDistance = Constant.DISTANCE.Limit / Constant.DISTANCE.EARTH_RADIUS;
        var array = [];
        array[0] = req.body.longitude;
        array[1] = req.body.latitude;


        Salon.find({
            location: {
                $near: array,
                $maxDistance: maxDistance

            }
        }
        ).select({
            saloonId: 1, saloonName: 1,
            mobileNumber: 1, branchId: 1, address: 1, parentName: 1, _id: 0
        }).skip(Constant.PAGE_LIMIT.size * no).limit(Constant.PAGE_LIMIT.size).exec(function (err, salons) {
            if (err) {
                reply[Constant.REPLY.MESSAGE] = Messages.notFound;
                reply[Constant.REPLY.DATA] = null;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
            } else {
                Salon.find({
                    location: {
                        $near: array,
                        $maxDistance: maxDistance
                    }
                }).count().exec(function (err, count) {
                    reply[Constant.REPLY.MESSAGE] = Messages.success;
                    reply[Constant.REPLY.DATA] = salons;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                    reply[Constant.REPLY.TOKEN] = '';
                    reply[Constant.REPLY.COUNT] = count;
                    return res.send(reply).end;
                })

            }
        })
    } else {
        Salon.find({
            saloonName: new RegExp(req.body.saloonName, "i"),
            emailId: new RegExp(req.body.emailId, "i")
        }).select({
            ownerInformation: 1, saloonId: 1, saloonName: 1, emailId: 1,
            mobileNumber: 1, branchId: 1, address: 1, parentName: 1, _id: 0
        })
            .skip(parseInt(skip)).limit(parseInt(limit)).exec(function (err, salons) {
                if (err) {
                    reply[Constant.REPLY.MESSAGE] = Messages.notFound;
                    reply[Constant.REPLY.DATA] = null;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                    reply[Constant.REPLY.TOKEN] = '';
                    return res.send(reply).end;
                } else {
                    Salon.find({
                        saloonName: new RegExp(req.body.saloonName, "i")
                    }).count().exec(function (err, count) {
                        reply[Constant.REPLY.MESSAGE] = Messages.success;
                        reply[Constant.REPLY.DATA] = salons;
                        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                        reply[Constant.REPLY.TOKEN] = '';
                        reply[Constant.REPLY.COUNT] = count;
                        return res.send(reply).end;

                    })
                }
            })
    }
}

exports.WEB_EMPLOYEE_GET_SALOON_NAME = async function (req, res) {
    let saloons = await Salon.find({}, ["saloonName", "saloonId"]);
    if (saloons.length) {
        reply[Constant.REPLY.MESSAGE] = Messages.success;
        reply[Constant.REPLY.DATA] = saloons;
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
        reply[Constant.REPLY.TOKEN] = '';
        return res.send(reply).end;
    }
    else {
        reply[Constant.REPLY.MESSAGE] = Messages.notFound;
        reply[Constant.REPLY.DATA] = null;
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
        reply[Constant.REPLY.TOKEN] = '';
        return res.send(reply).end;
    }
}
exports.WEB_EMPLOYEE_GET_SALOON_WITH_SERVICES = async function (req, res) {
    var no = req.body.pageNo;
    let limit = req.body.pageSize || 10;
    let skip = limit * (parseInt(req.body.pageNo) - 1);
    let salonsCount = await Salon.count({
        saloonName: new RegExp(req.body.saloonName, "i"),
        emailId: new RegExp(req.body.emailId, "i")
    })
    let salons = await Salon.find({
        saloonName: new RegExp(req.body.saloonName, "i"),
        emailId: new RegExp(req.body.emailId, "i")
    }).select({
        ownerInformation: 1, saloonId: 1, saloonName: 1, emailId: 1, location: 1,
        mobileNumber: 1, branchId: 1, address: 1, parentName: 1, _id: 0
    })
        .skip(parseInt(skip)).limit(parseInt(limit))
    if (!salons.length) {
        reply[Constant.REPLY.MESSAGE] = Messages.notFound;
        reply[Constant.REPLY.DATA] = null;
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
        reply[Constant.REPLY.TOKEN] = '';
        return res.send(reply).end;
    }
    else {
        let Result = [];
        for (let salon in salons) {
            let serviceInfo = await saloonService.findOne({ saloonId: salons[salon].saloonId });
            let x = JSON.parse(JSON.stringify(salons[salon]))
            if (serviceInfo) { x['rateCard'] = serviceInfo.rateCard.length; x['packages'] = serviceInfo.packages.length; }
            else { x['rateCard'] = 0; x['packages'] = 0; }
            Result.push(x)
            if (parseInt(salon) + 1 == salons.length) {
                reply[Constant.REPLY.MESSAGE] = Messages.success;
                reply[Constant.REPLY.DATA] = Result;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                reply[Constant.REPLY.TOKEN] = '';
                reply[Constant.REPLY.COUNT] = salonsCount;
                return res.send(reply).end;
            }
        }
    }
}

exports.WEB_EMPLOYEE_GET_SALOON_COUNT = async function (req, res) {
    let count = await
        Salon.count()
    if (count) {
        reply[Constant.REPLY.MESSAGE] = Messages.success;
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
        reply[Constant.REPLY.TOKEN] = '';
        reply[Constant.REPLY.COUNT] = count;
        return res.send(reply).end;
    }
    else {
        reply[Constant.REPLY.MESSAGE] = Messages.Error;
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
        reply[Constant.REPLY.TOKEN] = '';
        reply[Constant.REPLY.COUNT] = count;
        return res.send(reply).end;
    }
}
exports.WEB_EMPLOYEE_GET_SALOON_BY_ID = function (req, res) {
    Salon.findOne({
        saloonId: req.body.saloonId
    }).exec(function (err, salons) {
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = salons;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }
    })
}
function createSaloon2(req, res, callbeck) {
    var str = "S";
    var address = JSON.parse(JSON.stringify(req.body.address));
    var homeService = parseInt(req.body.homeService);

    var scheduleTiming = JSON.parse(JSON.stringify(req.body.scheduleTiming));
    var ownerInformation = JSON.parse(JSON.stringify(req.body.ownerInformation));
    if (req.body.alternateNumber) {
        var alternateNumber = JSON.parse(JSON.stringify(req.body.alternateNumber));
    }
    var id = str.concat(Date.now());

    var salon = new Salon({
        saloonId: id,
        saloonName: req.body.saloonName,
        tagLine: req.body.tagLine,
        mobileNumber: req.body.mobileNumber,
        address: address,
        emailId: req.body.emailId,
        saloonType: req.body.saloonType,
        scheduleTiming: scheduleTiming,
        description: req.body.description,
        ownerInformation: ownerInformation,
        location: [req.body.longitude, req.body.latitude],
        parentName: req.body.parentName,
        homeService: homeService,
        alternateNumber: alternateNumber,
        gstIn: req.body.gstIn,
        panNo: req.body.panNo
    });

    salon.save({}, function (err, sal) {
        if (err) {
            callbeck(false);

        } else {
            createEmployeeAcityity(req, id, '', Constant.WORK_TYPE.SALOON_CREATED);
            if (req.body.requestId) {          // send the requestId and employeeId if an request has been raised
                UPDATE_REQUEST_STATUS(req.body.requestId, req.body.employeeId);
            }
            SALON_SIGN_UP(sal.saloonId, req.body.saloonName, ownerInformation[0].ownerNumber, function (isSuccess) {
                if (isSuccess == true) {
                    callbeck(true, sal);
                } else {
                    callbeck(false, sal);

                }
            })

            /* LoginController.SALON_SIGN_UP(sal.saloonId, req.body.saloonName, ownerInformation[0].ownerNumber, function (isSuccess) {
                 if (isSuccess == true) {
                     callbeck(true,sal);
                 } else {
                     callbeck(false,sal);
 
                 }
             })*/

        }
    })
}



function UPDATE_SPONSORSHIP__IN_SALOON(req, validFrom, validTo, callback) {

    Salon.findOneAndUpdate({ saloonId: req.body.saloonId }, { sponsoredValidFrom: validFrom, sponsoredValidTo: validTo, gstIn: req.body.gstIn, planType: req.body.planType }, { new: true }, function (err, sal) {

        if (err) {
            conole.log("error:" + err);
            return callback(false);
        }
        else {
            console.log("success");
            return callback(sal)
        }

    });


};
exports.WEB_SERVICE_LIST = async function (req, res) {
    var no = req.body.pageNo;
    let limit = req.body.pageSize || 10;
    let skip = limit * (parseInt(req.body.pageNo) - 1);
    let servicesCount = await services.count({
        $or: [
            { category: RegExp(req.body.search, "i") },
            { subCategory: RegExp(req.body.search, "i") },
            { gender: RegExp(req.body.search, "i") },
            { itemName: RegExp(req.body.search, "i") }
        ]
    });
    let serviceList = await services.find({
        $or: [
            { category: RegExp(req.body.search, "i") },
            { subCategory: RegExp(req.body.search, "i") },
            { gender: RegExp(req.body.search, "i") },
            { itemName: RegExp(req.body.search, "i") }
        ]
    }).skip(skip).limit(parseInt(limit))
    if (serviceList.length) {
        reply[Constant.REPLY.MESSAGE] = Messages.success;
        reply[Constant.REPLY.DATA] = serviceList;
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
        reply[Constant.REPLY.TOKEN] = '';
        reply[Constant.REPLY.COUNT] = servicesCount;
        return res.send(reply).end;
    }
    else {
        reply[Constant.REPLY.MESSAGE] = Messages.notFound;
        reply[Constant.REPLY.DATA] = null;
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
        reply[Constant.REPLY.TOKEN] = '';
        return res.send(reply).end;
    }
}
exports.WEB_PACKAGE_LIST = async function (req, res) {
    var no = req.body.pageNo;
    let limit = req.body.pageSize || 10;
    let skip = limit * (parseInt(req.body.pageNo) - 1);
    let packagesCount = await package.count({
        $or: [
            { packageName: RegExp(req.body.search, "i") },
            { packageType: RegExp(req.body.search, "i") },
            { gender: RegExp(req.body.search, "i") },
            { itemName: RegExp(req.body.search, "i") }
        ]
    });
    let packageList = await package.find({
        $or: [
            { packageName: RegExp(req.body.search, "i") },
            { packageType: RegExp(req.body.search, "i") },
            { gender: RegExp(req.body.search, "i") },
            { itemName: RegExp(req.body.search, "i") }
        ]
    }).skip(skip).limit(parseInt(limit))
    if (packageList.length) {
        reply[Constant.REPLY.MESSAGE] = Messages.success;
        reply[Constant.REPLY.DATA] = packageList;
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
        reply[Constant.REPLY.TOKEN] = '';
        reply[Constant.REPLY.COUNT] = packagesCount;
        return res.send(reply).end;
    }
    else {
        reply[Constant.REPLY.MESSAGE] = Messages.notFound;
        reply[Constant.REPLY.DATA] = null;
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
        reply[Constant.REPLY.TOKEN] = '';
        return res.send(reply).end;
    }
}
exports.WEB_UPDATE_COUPON = async function (req, res) {
    Coupon.update({ couponCode: req.body.couponCode }, { $set: req.body })
        .then(val => {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = val;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        })
        .catch(err => {
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        })
}
exports.WEB_GET_PARTICULAR_COUPON_WITH_DETAILS = async function (req, res) {
    let coupon = await Coupon.findOne({ couponCode: req.body.couponCode });
    if (coupon) {
        reply[Constant.REPLY.MESSAGE] = Messages.success;
        reply[Constant.REPLY.DATA] = coupon;
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
        reply[Constant.REPLY.TOKEN] = '';
        return res.send(reply).end;
    }
    else {
        reply[Constant.REPLY.MESSAGE] = Messages.notFound;
        reply[Constant.REPLY.DATA] = null;
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
        reply[Constant.REPLY.TOKEN] = '';
        return res.send(reply).end;
    }
}
exports.WEB_GET_COUPON_WITH_DETAILS = async function (req, res) {
    var no = req.body.pageNo;
    let limit = req.body.pageSize || 10;
    let skip = limit * (parseInt(req.body.pageNo) - 1);
    let couponsCount = await Coupon.count({ couponName: RegExp(req.body.search, "i") });
    let coupons = await Coupon.find({ couponName: RegExp(req.body.search, "i") })
        .skip(skip).limit(parseInt(limit))
    if (coupons.length) {
        reply[Constant.REPLY.MESSAGE] = Messages.success;
        reply[Constant.REPLY.DATA] = coupons;
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
        reply[Constant.REPLY.TOKEN] = '';
        reply[Constant.REPLY.COUNT] = couponsCount;
        return res.send(reply).end;
    }
    else {
        reply[Constant.REPLY.MESSAGE] = Messages.notFound;
        reply[Constant.REPLY.DATA] = null;
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
        reply[Constant.REPLY.TOKEN] = '';
        return res.send(reply).end;
    }
}
exports.WEB_GET_COUPONS = async function (req, res) {
    let coupons = await Coupon.find({}, ["couponCode", "couponName"]);
    if (coupons.length) {
        reply[Constant.REPLY.MESSAGE] = Messages.success;
        reply[Constant.REPLY.DATA] = coupons;
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
        reply[Constant.REPLY.TOKEN] = '';
        return res.send(reply).end;
    }
    else {
        reply[Constant.REPLY.MESSAGE] = Messages.notFound;
        reply[Constant.REPLY.DATA] = null;
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
        reply[Constant.REPLY.TOKEN] = '';
        return res.send(reply).end;
    }
}
exports.WEB_GET_PACKAGES = async function (req, res) {
    let packages = await package.find({}, ["packageName", "packageId"]);
    if (packages.length) {
        reply[Constant.REPLY.MESSAGE] = Messages.success;
        reply[Constant.REPLY.DATA] = packages;
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
        reply[Constant.REPLY.TOKEN] = '';
        return res.send(reply).end;
    }
    else {
        reply[Constant.REPLY.MESSAGE] = Messages.notFound;
        reply[Constant.REPLY.DATA] = null;
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
        reply[Constant.REPLY.TOKEN] = '';
        return res.send(reply).end;
    }
}
exports.WEB_GET_BANNER = async function (req, res) {
    let banner = await Banner.findOne({ saloonId: req.body.saloonId });
    if (banner) {
        reply[Constant.REPLY.MESSAGE] = Messages.success;
        reply[Constant.REPLY.DATA] = banner;
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
        reply[Constant.REPLY.TOKEN] = '';
        return res.send(reply).end;
    }
    else {
        reply[Constant.REPLY.MESSAGE] = Messages.notFound;
        reply[Constant.REPLY.DATA] = null;
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
        reply[Constant.REPLY.TOKEN] = '';
        return res.send(reply).end;
    }
}
exports.WEB_ADD_BANNER = function (req, res) {
    console.log('query::', req.query);
    var dir = "..//Images";
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    var dir2 = "..//Images//Banners";
    if (!fs.existsSync(dir2)) {
        fs.mkdirSync(dir2);
    }
    var str = "..//Images//Banners//SaloonID";
    var directory;
    var bannerUrl;
    var arrayIn = [];
    var arrayOut = [];
    var id = req.body.saloonId;
    if (!req.body.saloonId) {
        id = "Saloons"
    }
    let img = req.body.image;
    let image = img.split(';base64,').pop();
    directory = str.replace("SaloonID", id);
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }
    var name = file.fieldname + Date.now() + ".jpeg";
    var path = directory.concat("//" + name);
    var path2 = path.replace("..//Images", "");
    bannerUrl = path2;

    console.log('front:::', imageDirec, 'image name::', logoUrl)
    fs.writeFile(bannerUrl, image, { encoding: 'base64' }, function (err) {
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = "";
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end
        } else {
            console.log("saloonId" + req.body.saloonId);
            WEB_INSERT_BANNER_DETAILS(req, res, bannerUrl);


        }
    })
};
function WEB_INSERT_BANNER_DETAILS(req, res, bannerUrl) {
    console.log('body::', req.body, bannerUrl)
    var str = "BAN";
    var id = str.concat(Date.now());
    var validTo = new Date(req.body.validTo);
    var validFrom = new Date(req.body.validFrom);
    banner = new Banner({
        bannerId: id,
        saloonId: req.body.saloonId,
        bannerUrl: bannerUrl,
        bannerValidFrom: validFrom,
        bannerValidTo: validTo,
        location: [req.body.longitude, req.body.latitude],
        couponId: req.body.couponId,
        packageId: req.body.packageId,
        bannerType: req.body.bannerType,
        screens: req.body.screens

    });
    banner.save({}, function (err, ban) {
        if (err) {
            console.log('err::', err)
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = "";
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = ban;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end
        }

    })
};
exports.ADD_BANNER = function (req, res) {
    var dir = "..//Images";
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    var dir2 = "..//Images//Banners";
    if (!fs.existsSync(dir2)) {
        fs.mkdirSync(dir2);
    }
    var str = "..//Images//Banners//SaloonID";
    var directory;
    var bannerUrl;
    var arrayIn = [];
    var arrayOut = [];
    var id = req.body.saloonId;
    if (!req.body.saloonId) {
        id = "Saloons"
    }
    var storage = multer.diskStorage({

        destination: function (req, file, callback) {
            directory = str.replace("SaloonID", id);
            if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory);
            }

            callback(null, directory);
        },

        filename: function (req, file, callback) {
            var name = file.fieldname + Date.now() + ".jpeg";
            var path = directory.concat("//" + name);
            var path2 = path.replace("..//Images", "");
            bannerUrl = path2;
            callback(null, file.fieldname + Date.now() + ".jpeg");
        }
    });

    var upload = multer({ storage: storage }).single('data');
    upload(req, res, function (err) {
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = err;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end
        } else {
            console.log("saloonId" + req.body.saloonId);
            INSERT_BANNER_DETAILS(req, res, bannerUrl);


        }
    });
};

function INSERT_BANNER_DETAILS(req, res, bannerUrl) {
    var str = "BAN";
    var id = str.concat(Date.now());
    var validTo = new Date(req.body.validTo);
    var validFrom = new Date(req.body.validFrom);
    var banner = new Banner({
        bannerId: id,
        saloonId: req.body.saloonId,
        bannerUrl: bannerUrl,
        bannerValidFrom: validFrom,
        bannerValidTo: validTo,
        location: [req.body.longitude, req.body.latitude],
        couponId: req.body.couponId,
        packageId: req.body.packageId,
        bannerType: req.body.bannerType,
        screens: req.body.screens

    });
    banner.save({}, function (err, ban) {
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = "";
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = ban;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end
        }

    })
};

exports.GET_BANNER = function (req, res) {

    Banner.find({ bannerId: req.params.bannerId }, function (err, ban) {
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = "";
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = ban;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }
    })
};


exports.ADD_SALOON_SERVICE = function (req, res) {
    console.log('ankur');
    console.log(req.body);
    saloonService.findOne({ saloonId: req.body.saloonId }, function (err, ser) {

        if (ser) {
            UPDATE_SERVICE(req, res);
        } else
            if (!ser) {
                ADD_SERVICE2(req, res);
            }
    })
};
function ADD_SERVICE3(req, res) {

    var rateCard = JSON.parse(JSON.stringify(req.body.rateCard));
    for (var i = 0; i < rateCard.length; i++) {
        if (rateCard[i].itemId == "" || !rateCard[i].itemId) {
            var id = Date.now();
            rateCard[i].itemId = id + "" + i;
            Services(i, rateCard);
        }
    }
    var ser = new saloonService({
        saloonId: req.body.saloonId,
        saloonName: req.body.saloonName,
        rateCard: rateCard,
        requestId:req.body.requestId
    });
    ser.save({}, function (err, sr) {
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = "";
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = "";
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }


    })
}



function ADD_SERVICE2(req, res) {

    var rateCard = JSON.parse(JSON.stringify(req.body.rateCard));
    for (var i = 0; i < rateCard.length; i++) {
        if (rateCard[i].itemId == "" || !rateCard[i].itemId) {
            var id = Date.now();
            rateCard[i].itemId = id + "" + i;
            Services(i, rateCard);
        }
    }
    var ser = new saloonService({
        saloonId: req.body.saloonId,
        saloonName: req.body.saloonName,
        location: [req.body.longitude, req.body.latitude],
        rateCard: rateCard
    });
    ser.save({}, function (err, sr) {
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = "";
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = "";
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }


    })
};

function UPDATE_SERVICE(req, res) {

    var rateCard = JSON.parse(JSON.stringify(req.body.rateCard));
    for (var i = 0; i < rateCard.length; i++) {
        if (rateCard[i].itemId == "" || !rateCard[i].itemId) {
            var id = Date.now();
            rateCard[i].itemId = id + "" + i;
            //console.log("new service is",rateCard[i].itemId);  
            EDIT_RATE_CARD(req.body.saloonId, rateCard, i);
            Services(i, rateCard);
          
        } else {
            updateSaloonService(req, i, rateCard);
            //  console.log("existing service is",rateCard[i].itemId);
        
        }

    }
    reply[Constant.REPLY.MESSAGE] = Messages.success;
    reply[Constant.REPLY.DATA] = "";
    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
    reply[Constant.REPLY.TOKEN] = '';
    return res.send(reply).end;
   

}

function Services(i, rateCard) {

    var ser = new services({

        category: rateCard[i].category,
        subCategory: rateCard[i].subCategory,
        itemId: rateCard[i].itemId,
        itemName: rateCard[i].itemName,
        gender: rateCard[i].gender

    });
    ser.save({}, function (err, service) {
        if (err) {
            console.log("service is saved");
        } else {
            console.log("service is not saved");
        }


    })

}

function EDIT_RATE_CARD(saloonId, rateCard, i) {


    saloonService.findOneAndUpdate({
        saloonId: saloonId
    }, { $push: { rateCard: rateCard[i] } },
        function (err, ser) {

        })
}

exports.WEB_CREATE_DEAL = function (req, res) {

    var cnst = Constant.DealConstant.Code;
    var code = cnst.concat(req.body.dealCode);
    var validTo = new Date(req.body.validTo);
    var validFrom = new Date(req.body.validFrom);
    var services = req.body.services;
    var dealId = Date.now();

    var deal = new DayDeal({
        dealCode: code,
        dealId: dealId,
        minOrderAmount: req.body.minOrderAmount,
        maxOrderAmount: req.body.maxOrderAmount,
        validTo: validTo,
        validFrom: validFrom,
        saloonId: req.body.saloonId,
        saloonName: req.body.saloonName,
        dealCreatedBy: req.body.dealCreatedBy,
        services: services,
        location: [req.body.longitude, req.body.latitude],
        discountType: req.body.discountType,
        discountAmount: req.body.discountAmount
    });
    deal.save({}, function (err, deals) {
        if (err) {
            console.log(err)
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = "";
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = deals;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }


    })


};
exports.CREATE_DEAL = function (req, res) {

    var cnst = Constant.DealConstant.Code;
    var code = cnst.concat(req.body.dealCode);
    var validTo = new Date(req.body.validTo);
    var validFrom = new Date(req.body.validFrom);
    if (req.body.services)
        var services = JSON.parse(JSON.stringify(req.body.services));
    var dealId = Date.now();

    var deal = new DayDeal({
        dealCode: code,
        dealId: dealId,
        minOrderAmount: req.body.minOrderAmount,
        maxOrderAmount: req.body.maxOrderAmount,
        validTo: validTo,
        validFrom: validFrom,
        saloonId: req.body.saloonId,
        saloonName: req.body.saloonName,
        dealCreatedBy: req.body.dealCreatedBy,
        services: services,
        location: [req.body.longitude, req.body.latitude],
        discountType: req.body.discountType,
        discountAmount: req.body.discountAmount
    });
    deal.save({}, function (err, deals) {
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = "";
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = deals;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }


    })


};

// it will find (for example deal20 is present  in which saloons on the basis of location
exports.FIND_SALOON_DEAL = function (req, res) {

    var maxDistance = Constant.DISTANCE.Limit / Constant.DISTANCE.EARTH_RADIUS;
    var array = [];
    array[0] = req.body.longitude;
    array[1] = req.body.latitude;
    var dealCode = Constant.DealConstant.Code.concat(req.body.off);

    DayDeal.find({
        location: {
            $near: array,
            $maxDistance: maxDistance

        }, dealCode: dealCode
    }, function (err, deals) {
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = "";
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = deals;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }


    })

};

exports.GET_SALOON_SERVICE_LIST = function (req, res) {

    saloonService.findOne({ saloonId: req.params.saloonId, }, function (err, salon) {
        if (salon) {
            RateVariable.findOne({}, function (err, rat) {
                reply[Constant.REPLY.MESSAGE] = Messages.success;
                reply[Constant.REPLY.DATA] = salon;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                reply[Constant.REPLY.Rate] = rat;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
            })

        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }


    })
};

exports.WEB_ADD_PACKAGES = function (req, res) {

    saloonService.findOne({ saloonId: req.body.saloonId }, function (err, ser) {

        if (ser) {
            WEB_ADD_PACKAGES(req, res);
        }
        else {
            var serv = new saloonService({
                saloonId: req.body.saloonId
            });
            serv.save(function (err, sal) {
                if (err) {
                    reply[Constant.REPLY.MESSAGE] = Messages.Error;
                    reply[Constant.REPLY.DATA] = null;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                    reply[Constant.REPLY.TOKEN] = '';
                    return res.send(reply).end;
                } else {

                    WEB_ADD_PACKAGES(req, res);
                }

            })

        }
    })
};


function WEB_ADD_PACKAGES(req, res) {
    console.log('adding pckg...')
    var packages = req.body.packages;
    for (var i = 0; i < packages.length; i++) {
        if (packages[i].packageId == '' || !packages[i].packageId) {
            packages[i].packageId = Date.now();
            console.log('inserting pckg...', packages[i])
            INSERT_SALOON_PACKAGE(req.body.saloonId, packages, i);
            INSERT_PACKAGE(packages, i)

        } else {
            console.log('updating pckg...', packages[i])
            UPDATE_PACKAGE(req.body.saloonId, packages, i);
        }

    }
    reply[Constant.REPLY.MESSAGE] = Messages.success;
    reply[Constant.REPLY.DATA] = "";
    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
    reply[Constant.REPLY.TOKEN] = '';
    return res.send(reply).end;
}

exports.WEB_ADD_SINGLE_PACKAGE = function (req, res) {
    let pckg = new package();
    pckg.packageId = Date.now();
    pckg.packageName = req.body.packageName;
    pckg.packageType = req.body.packageType;
    pckg.itemId = req.body.itemId;
    pckg.itemName = req.body.itemName;
    pckg.gender = req.body.gender;
    pckg.save()
        .then(val => {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = "";
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        })
        .catch(err => {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = "";
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        })
}
exports.WEB_ADD_SINGLE_SERVICE = function (req, res) {
    let ser = new services();
    ser.category = req.body.category,
        ser.subCategory = req.body.subCategory,
        ser.itemId = Date.now();
    ser.itemName = req.body.itemName,
        ser.gender = req.body.gender
    ser.save()
        .then(val => {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = "";
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        })
        .catch(err => {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = "";
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        })
}


exports.ADD_PACKAGES = function (req, res) {

    saloonService.findOne({ saloonId: req.body.saloonId }, function (err, ser) {

        if (ser) {
            ADD_PACKAGES(req, res);
        }
        else {
            var serv = new saloonService({
                saloonId: req.body.saloonId
            });
            serv.save(function (err, sal) {
                if (err) {
                    reply[Constant.REPLY.MESSAGE] = Messages.Error;
                    reply[Constant.REPLY.DATA] = null;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                    reply[Constant.REPLY.TOKEN] = '';
                    return res.send(reply).end;
                } else {

                    ADD_PACKAGES(req, res);
                }

            })

        }
    })
};


function ADD_PACKAGES(req, res) {
    var packages = JSON.parse(JSON.stringify(req.body.packages));
    for (var i = 0; i < packages.length; i++) {
        if (packages[i].packageId == '' || !packages[i].packageId) {
            packages[i].packageId = Date.now();

            INSERT_SALOON_PACKAGE(req.body.saloonId, packages, i);
            INSERT_PACKAGE(packages, i)

        } else {
            UPDATE_PACKAGE(req.body.saloonId, packages, i);
        }

    }
    reply[Constant.REPLY.MESSAGE] = Messages.success;
    reply[Constant.REPLY.DATA] = "";
    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
    reply[Constant.REPLY.TOKEN] = '';
    return res.send(reply).end;
}
function UPDATE_PACKAGE(saloonId, packages, i) {
    saloonService.findOneAndUpdate({ saloonId: saloonId, "packages.packageId": packages[i].packageId }, { "packages.$": packages[i] }, { new: true },
        function (err, pack) {
            if (!err) {

            }
            else {

            }
        })
};


function updateSaloonService(req, i, rateCard) {

    saloonService.findOneAndUpdate({
        saloonId: req.body.saloonId, "rateCard.itemId": rateCard[i].itemId
    }, { "rateCard.$": rateCard[i] },
        function (err, ser) {
            if (!ser) {
                saloonService.findOneAndUpdate({
                    saloonId: req.body.saloonId
                }, { $push: { rateCard: rateCard[i] } },
                    function (err) {

                    })
            }


        })


}

function GET_NO_OF_REVIEWS(saloonId, callback) {

    ReviewInfo.find({ saloonId: saloonId }).count().exec(function (err, count) {

        return callback(count);

    })


};
exports. SERVICE_APPROVAL_REQUEST = function (req, res) {
    if (req.body.requestId) {
    console.log("requestId.."+req.body.requestId);
    RAISE_SERVICE_REQUEST(req,res,req.body.requestId);
    }else{
    Approval.count({},function(err,c){
        var count = c + 1;
        RAISE_SERVICE_REQUEST(req,res,count);

            })



    }
     
    

};

exports.ACCEPT_SERVICE_REQUEST = function (req, res) {
console.log('accept service request');
var rateCard = JSON.parse(JSON.stringify(req.body.rateCard));
saloonService.findOne({saloonId: req.body.saloonId,"rateCard.itemId":rateCard[0].itemId},function(err,resi){
        if(resi){
           updateSaloonService(req, 0, rateCard);
           Approval.update({ "requestId": req.body.requestId }, { $pull: { "rateCard": { itemId: rateCard[0].itemId, } } }, function (e, r) {
            reply[Constant.REPLY.MESSAGE] = Messages.Success;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;        
        })
        }else{
            saloonService.findOne({ saloonId: req.body.saloonId }, function (err, salon) {
            if (salon) {
             console.log("if run");
             console.log(rateCard[0].itemId);
             UPDATE_SERVICE(req, res);
            if(res){
            Approval.update({ "requestId": req.body.requestId }, { $pull: { "rateCard": { itemId: rateCard[0].itemId, } } }, function (e, r) {
                
                  })}
            }else{
            console.log("else run");
            ADD_SERVICE3(req, res);
            if(res){
            Approval.update({ "requestId": req.body.requestId }, { $pull: { "rateCard": { itemId: rateCard[0].itemId, } } }, function (e, r) {
             })}
        }

    })


        }

    })
   
}

exports.DELETE_SERVICE_REQUEST = function (req, res) {
    var rateCard = JSON.parse(JSON.stringify(req.body.rateCard));
    console.log(rateCard);
    // Approval.updateOne({"rateCard.itemId":rateCard[0].itemId}, {$set: { "rateCard.$.status" : 2}},function(err,response){
    Approval.update({ "requestId": req.body.requestId }, { $pull: { "rateCard": { itemId: rateCard[0].itemId, } } }, function (e, r) {
        if (!e) {
            reply[Constant.REPLY.MESSAGE] = Messages.success
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }
        else {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }
    })
};

function GET_SALOON_FAVORITE_COUNT(saloonId, callback) {
    MyFavoriteSaloon.find({ saloonId: saloonId }).count().exec(function (err, count) {
        return callback(count);

    })
}


function INSERT_PACKAGE(packages, i) {

    var pack = new package({
        packageId: packages[i].packageId,
        packageName: packages[i].packageName,
        packageType: packages[i].packageType,
        itemId: packages[i].itemId,
        itemName: packages[i].itemName,
        gender: packages[i].gender
    });
    pack.save({}, function (err) {
        if (err) {
            console.log('error while adding package', err);
        } else {
            console.log('package succesully added');
        }
    });
}

function INSERT_SALOON_PACKAGE(saloonId, packages, i) {

    saloonService.findOneAndUpdate({ saloonId: saloonId }, { $push: { packages: packages[i] } }, { new: true },
        function (err, pack) {
            if (!err) {

            } else {

            }

        });
};


function RAISE_SERVICE_REQUEST(req, res, requestId) {

    if (req.body.rateCard) {
        var rateCard = JSON.parse(JSON.stringify(req.body.rateCard));
    }
    if (req.body.packages) {
        var packages = JSON.parse(JSON.stringify(req.body.packages));
    }
    var date = new Date().toLocaleDateString();
    console.log("email...................................................................... "+req.body.emailId)
    var approvalRequest = new Approval({
        requestId: requestId,
        saloonId: req.body.saloonId,
        saloonName: req.body.saloonName,
        emailId:req.body.emailId,
        rateCard: rateCard,
        packages: packages,
        requestType: Constant.requestType.serviceApproval,
        status: req.body.status
    });
    approvalRequest.save(function (err, app) {
        if (!err) {

            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = app;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }
        else {
            console.log("error in service "+err);
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }
    })
}


exports.GET_PENDING_RAISE_REQUEST = function (req, res) {
    Approval.find({}, function (err, app) {

        if (!err) {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = app;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }
    });
};

exports.GET_PACKAGE = function (req, res) {
    var no = req.body.no;

    package.find({}).skip(Constant.PAGE_LIMIT.size * no).limit(300).exec(function (err, salon) {
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = salon;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            package.find({}).count().exec(function (err, c) {


                reply[Constant.REPLY.MESSAGE] = Messages.success;
                reply[Constant.REPLY.DATA] = salon;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                reply[Constant.REPLY.TOKEN] = '';
                reply[Constant.REPLY.COUNT] = c;
                return res.send(reply).end;
            })

        }
    })
};




exports.DOES_PACKAGE_EXIST = function (req, res) {
    var items = JSON.parse(JSON.stringify(req.body.itemId));

    package.findOne({ itemId: items }, function (err, pck) {
        if (pck) {
            reply[Constant.REPLY.MESSAGE] = Messages.alreadyExist;
            reply[Constant.REPLY.DATA] = pck;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = '';
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }
    })

}

exports.GET_DEAL = function (req, res) {
    DayDeal.find({ dealCode: req.body.dealCode }, function (err, deals) {

        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = deals;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;

        }




    })
};
exports.GET_COUPON = function (req, res) {

    Coupon.find({ couponCode: req.body.couponCode }, function (err, coupon) {
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = coupon;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;

        }

    })

}

exports.CHANGE_PACKAGE_VALID = function (req, res) {

    saloonService.findOneAndUpdate({ "packages.packageId": req.params.packageId }, { "packages.$.isValid": req.params.isValid }, function (err, pack) {

        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = "";
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }

    })

}


exports.GET_EARN_POINTS = function (req, res) {
    EarnPoints.find({ saloonId: req.params.saloonId }, function (err, cash) {
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = cash;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }

    })
}





function SALON_SIGN_UP(saloonId, saloonName, mobileNumber, callback) {
    var userType = Constant.USER_TYPE.SALON;
    var password = Constant.Zaloonz.Default_Password;
    console.log("sign up...")
    Add_LOGIN_DETAILS(saloonId, mobileNumber, userType, password, function (isSuccess) {
        console.log("add login:" + isSuccess);
        if (isSuccess == true) {
            var saloon = new SaloonAccount({
                saloonId: saloonId,
                saloonName: saloonName,
                mobileNumber: mobileNumber,
                userType: Constant.USER_TYPE.SALON
            });
            saloon.save({}, function (err, sal) {
                //console.log("err",err);
                if (err) {
                    DELETE_LOGIN_DETAILS(mobileNumber, userType, function (a) {

                    });
                    return callback(false);
                } else {
                    var otp = Math.floor((Math.random() * 10000) + 1);
                    SAVE_OTP(mobileNumber, userType, otp, Constant.OTP_TYPE.SALOON_VERIFICATION);
                    var mess = Messages.WELCOME_MESSAGE.replace('num', otp);
                    SEND_MESSAGE(mobileNumber, mess);

                    return callback(true);
                }


            })
        } else {

            return callback(false);
        }
    })


}
function Add_LOGIN_DETAILS(userId, loginId, userType, password, callback) {
    ENCRYPT_PASSWORD(password, function (hash, isSuccess) {

        if (isSuccess == true) {
            var login = new LoginDetails({
                userId: userId,
                loginId: loginId,
                password: hash,
                userType: userType

            });
            login.save({}, function (err, detail) {
                if (err) {
                    return callback(false)
                } else {

                    return callback(true);
                }
            })
        } else {

            return callback(false);
        }
    })

}
function DELETE_LOGIN_DETAILS(loginId, userType, callback) {
    LoginDetails.remove({ loginId: loginId, userType: userType }, function (err) {
        return callback(true);

    })
}

function SAVE_OTP(loginId, userType, otp, otpType) {

    var otp = new OTP({
        otp: otp,
        loginId: loginId,
        userType: userType,
        dateAndTime: Date.now(),
        otpType: otpType

    });
    otp.save({}, function (err) {
        if (err) {
            console.log(err + "while saving OTP");
        }
        else {
            console.log("success OTP SAVE");
        }
    })

}
function SEND_MESSAGE(mobileNumber, mess) {
    http.get("http://nimbusit.co.in/api/swsendSingle.asp?username=t1factorial&password=98491455&sender=ZLOONZ&sendto=" + mobileNumber + "&message=+" + mess + "", function (res) {


    });


}

function ENCRYPT_PASSWORD(password, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            return callback(err, false);
        }
        bcrypt.hash(password, salt, function (err, hash) {
            if (err) {
                return callback(err, false);
            }
            return callback(hash, true);

        })
    })

}

exports.SEND_MAIL = function (req, res) {


    var email = req.params.email;
    var mess = req.params.message;
    var sub = req.params.subject;
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'zaloonz.in@gmail.com',
            pass: 'zaloonz@123'
        }
    });
    var mailOptions = {
        from: 'zaloonz.in@gmail.com',
        to: email,
        subject: sub,
        text: mess,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = '';
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = '';
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }
    });

};

exports.SEND_MESSAGE = function (req, res) {
    var mobileNumber = req.params.number;

    var mess = "To download our app for ios https://itunes.apple.com/in/app/zaloonz-look-book-dazzle/id1358130455?mt=8 \nfor android  https://play.google.com/store/apps/details?id=in.zaloonz.zaloonzcustomer";

    http.get("http://nimbusit.co.in/api/swsendSingle.asp?username=t1factorial&password=98491455&sender=ZLOONZ&sendto=" + mobileNumber + "&message=+" + mess + "", function (err) {
        reply[Constant.REPLY.MESSAGE] = Messages.success;
        reply[Constant.REPLY.DATA] = '';
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
        reply[Constant.REPLY.TOKEN] = '';
        return res.send(reply).end;

    });
};

exports.RETURN_AVERAGERATE_VIEWS = function (req, res) {

    MyFavoriteSaloon.find({ saloonId: req.params.saloonId }).count().exec(function (err, count) {
        Salon.findOne({ saloonId: req.params.saloonId }, { noOfViews: 1, averageRating: 1 }, function (err, sal) {
            if (err) {
                reply[Constant.REPLY.MESSAGE] = Messages.Error;
                reply[Constant.REPLY.DATA] = '';
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
            } else {
                reply[Constant.REPLY.MESSAGE] = Messages.success;
                reply[Constant.REPLY.DATA] = sal;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                reply[Constant.REPLY.TOKEN] = '';
                reply[Constant.REPLY.COUNT] = count;
                return res.send(reply).end;
            }


        })
    })

}

exports.SALON_NAME_CHANGE = function (req, res) {
    Salon.findOneAndUpdate({ saloonId: req.body.saloonId }, { saloonName: req.body.newName }, function (err, sal) {
        console.log("err" + err);
    });
    SaloonAccount.findOneAndUpdate({ saloonId: req.body.saloonId }, { saloonName: req.body.newName }, function (err, sal) {
        console.log("err" + err);
    });
    saloonService.findOneAndUpdate({ saloonId: req.body.saloonId }, { saloonName: req.body.newName }, function (err, sal) {
        console.log("err" + err);
    });
    reply[Constant.REPLY.MESSAGE] = "";
    reply[Constant.REPLY.DATA] = null;
    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
    reply[Constant.REPLY.TOKEN] = '';
    return res.send(reply).end;
}
exports.Update_CATEGORIES_CHANGE = function (req, res) {
    //console.log("Cahnge_cat");
    Salon.update({ saloonId: req.body.saloonId }, { $set: { salonCat: req.body.salonCat } }, { upsert: true }, function (err, result) {
        console.log(result)
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = '';
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }

    })
},
    exports.addOffers = function (req, res) {
        var str = "O";
        var d = str.concat(Date.now());
        var offer = new Offer({
            offerId: d,
            saloonId: req.body.saloonId,
            salonName: req.body.saloonName,
            description: req.body.description,
            offlinePrice: req.body.offlinePrice,
            onlinePrice: req.body.onlinePrice,
            gender: req.body.gender,
            location: [req.body.longitude, req.body.latitude]
        });
        offer.save({}, function (err) {
            if (err) {

                reply[Constant.REPLY.MESSAGE] = Messages.notCreated;
                reply[Constant.REPLY.DATA] = null;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;

            } else {
                reply[Constant.REPLY.MESSAGE] = Messages.created;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
            }

        })
    },

    exports.CLICK_ON_CALL = function (req, res) {
        var message = Messages.CLICK_ON_CALL.replace('name', req.params.name);
        SEND_MESSAGE(req.params.mobileNumber, message);
        res.send("").end();
    }

exports.GET_SALOON_PLAN_LIST = function (req, res) {
    console.log("hello" + req.params.saloonId);
    saloonPayment.find({ saloonId: req.params.saloonId }, function (err, result) {
        console.log("hello in" + req.params.saloonId);

        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            reply[Constant.REPLY.DATA] = result;
            return res.send(reply).end;
        }

    })
},
    exports.EDIT_ADDRESS = function (req, res) {
        console.log("....................................................................." + req.body.saloonId)
        var addres = JSON.parse(JSON.stringify(req.body.address))
        console.log(addres);
        console.log(addres[0].hno);
        console.log(req.body.location);

        Salon.find({ saloonId: req.body.saloonId }, function (err, salon) {
            if (req.body.location[0] != salon[0].location[1] || req.body.location[1] != salon[0].location[0]) {
                //    console.log(req.body.latitude);
                //    console.log(salon[0].location[0]);

                Salon.update({ saloonId: req.body.saloonId }, {
                    address: [{
                        "country": addres[0].country,
                        "state": addres[0].state,
                        "pincode": addres[0].pincode,
                        "city": addres[0].city,
                        "locality": addres[0].locality,
                        "hno": addres[0].hno
                    }]
                }, function (err, result) {
                    if (err) {
                        console.log(err)
                    }
                })
                UpdateLocation(req.body.location[0], req.body.location[1], req.body.saloonId)
            } else {
                console.log("updated.............")
            }
        })
        reply[Constant.REPLY.MESSAGE] = Messages.success;
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
        reply[Constant.REPLY.TOKEN] = '';
        return res.send(reply).end;
    },
    exports.EditAllAddress = function (err, res) {
        var c = 1;
        Salon.find({}, async function (req, res) {

            for (const element of res) {

                console.log("........................!!!!!!!!!!!!!!!!!!!!!!!! " + c);
                c++;
                console.log(element.saloonId)
                console.log("long" + element.location[0]);
                console.log("lati" + element.location[1]);
                var a = element.address[0].hno + " " + element.address[0].locality + " " + element.address[0].city
                var result = await GET_LAT_LONG(a);
                if (result.length == 0) {
                    continue;
                } else {
                    console.log("result............................." + result[0].latitude);
                    console.log("result............................." + result[0].longitude);
                    UpdateLocation(result[0].latitude, result[0].longitude, element.saloonId);

                }
            }
        });
        if (c == Salon.count())
            reply[Constant.REPLY.MESSAGE] = Messages.success;
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
        reply[Constant.REPLY.TOKEN] = '';
        return res.send(reply).end;



    }
GET_LAT_LONG = function (a) {
    var options = {
        provider: 'google',

        httpAdapter: 'https',
        apiKey: 'AIzaSyDAGh2EOR1gsTxr7GgR-W9zTgcvEqPJMVg',
        formatter: null
    };

    var geocoder = NodeGeocoder(options);
    return new Promise(resolve => {
        geocoder.geocode(a, function (err, result) {
            if (result) {
                resolve(result);
            }
            else {
                resolve(err)
            }
        });
    })

}
UpdateLocation = function (latitude, longitude, saloonId) {
    console.log("inside" + saloonId)
    console.log(latitude)
    console.log(longitude)
    Salon.findOneAndUpdate({ saloonId: saloonId }, { $set: { "location": [longitude, latitude] } }, function (err, res) {
        // console.log(err);
        // console.log(res);
    }),
        DayDeal.findOneAndUpdate({ saloonId: saloonId }, { $set: { "location": [longitude, latitude] } }, function (err, res) {
            // console.log(err);
            // console.log(res);
        }),
        saloonService.findOneAndUpdate({ saloonId: saloonId }, { $set: { "location": [longitude, latitude] } }, function (err, res) {
            // console.log(err);
            // console.log(res);
        }),

        SponsoredSaloon.findOneAndUpdate({ saloonId: saloonId }, { $set: { "location": [longitude, latitude] } }, function (err, res) {
            // console.log(err);
            // console.log(res);
        })

}
exports.GET_SALON_NUMBERS = function(req,res){
    Salon.find({},(err,salon)=>{
        salon.forEach((element)=>{
            console.log(element.mobileNumber);
        })
       })
}

exports.RODI = function(req,res){
        saloonPayment.find({$or:[{generatePdf:1},{paymentMode:"Check"}]}).count(function(err,count){
            console.log("count is "+ count);
            var da = new Date();
            var month = da.getMonth() + 1;
            var year = da.getFullYear();
    
                var c = count + 1;
                var str = "R";
                var d = str.concat(Date.now());
                var paymentDetails = new saloonPayment({
                    invoiceNo: c,
                    paymentId: d,
                    date: req.body.date,
                    generatePdf:1,
                    pdfUrl: "/Invoices/Rodi" + month + "-" + year +"/"+ d + ".pdf"
                    });
        
                paymentDetails.save({}, function (err, det) {
                    if (err) {
                        console.log(err);
                        reply[Constant.REPLY.MESSAGE] = Messages.PAYMENT_DETAILS_ERROR;
                        reply[Constant.REPLY.DATA] = null;
                        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                        reply[Constant.REPLY.TOKEN] = '';
                        return res.send(reply).end;
                    } else {
                       createPDF3(count,req.body.date,req.body.vehicleNo,req.body.qty,req.body.rate,d);
                            reply[Constant.REPLY.MESSAGE] = Messages.PAYMENT_DETAILS;
                            reply[Constant.REPLY.DATA] = '';
                            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                            reply[Constant.REPLY.PDF_URL] = "/Invoices/Rodi" + month + "-" + year +"/"+ d + ".pdf";
                            reply[Constant.REPLY.TOKEN] = '';
                            return res.send(reply).end;
                    
        
                    }
                })
            })
           
    
}
function createPDF3(count,date,vehicleNo,qty,rate,paymentId){
    count  = count+89;
       var amount = rate*qty;
       var cgst = amount*.025;
        cgst = cgst.toFixed(3);
       var total =amount+ 2*cgst;
        total = Math.round(total);
       var aminwords = converter.toWords(total);
       
        var pdf = new PdfDocument({
            autoFirstPage: false
        })
        pdf.addPage({ marginTop: 0 }, { marginBottom: 0 }, { marginLeft: 72 }, { marginRight: 72 });
        pdf.font('Times-Roman')
        pdf.fontSize(12)
        pdf.text("INVOICE", 281, 10, { underline: true })
        pdf.fontSize(12)
        pdf.text("GST No. :", 38, 40)
        pdf.text("06AAFCS1880A2ZO", 89, 40)
        //pdf.image(path,  24, 14, {width: 100})
        pdf.text("SANCHI ENGINEERING (P) LTD", 38, 80)
        pdf.text("SCO-100,Shop No.LG 1,Sector-16,Market", 38, 96)
        pdf.text("Near IDBI Bank, Faridabad (Haryana)", 38, 112)
        pdf.text("Tel. :9958863008", 38, 128)
        pdf.text("Invoice No.", 405, 40)
        pdf.text("Zal " + count, 460, 40)
        pdf.lineWidth(.5)
        pdf.moveTo(38, 138)
            .lineTo(560, 138)
            .stroke()
        pdf.moveTo(400, 138)
            .lineTo(400, 40)
            .stroke()
        pdf.text("Date :" + date, 405, 128)
        pdf.text("Name :", 38, 148)
        pdf.text('S.K.Mittal', 80, 148)
        pdf.moveTo(75, 158)
            .lineTo(337, 158)
            .stroke()
        pdf.text("", 38, 168)
        pdf.moveTo(38, 178)
            .lineTo(337, 178)
            .stroke()
        pdf.text("State/State Code", 360, 148)
        pdf.text('06', 442, 148)
        pdf.moveTo(442, 158)
            .lineTo(560, 158)
            .stroke()
        pdf.text("GSTIN Number", 340, 168)
        pdf.text('06AAVPM2520L1ZE', 432, 168)
        pdf.moveTo(442, 178)
            .lineTo(560, 178)
            .stroke()
            pdf.text("Transportation", 360, 188)
            pdf.text('By Road', 442, 188)
            pdf.moveTo(442, 198)
                .lineTo(560, 198)
                .stroke()
                pdf.text("Vehicle No", 360, 218)
                pdf.text(vehicleNo, 442, 218)
               
        pdf.text("Address :", 38, 188)
        pdf.text('Bahrampur Road Gurugram', 80, 188)
        pdf.moveTo(80, 198)
            .lineTo(335, 198)
            .stroke()
        // pdf.text (add,38,208,) 
        pdf.moveTo(38, 218)
            .lineTo(335, 218)
            .stroke()
        //*************************crate a rect*****************************8 
        pdf.rect(38, 230, 525, 340)
        pdf.stroke()
        //*****************create a first horizontal line***************************** */
        pdf.moveTo(38, 257)
            .lineTo(560, 257)
            .stroke()
        pdf.text("Sr No", 40, 238)
        pdf.moveTo(68, 230)
            .lineTo(68, 468)
            .stroke()
        pdf.text("DESCRIPTIONS", 135, 238)
        pdf.text('Rodi/Dust', 70, 262,{ columns: 2 })
        pdf.moveTo(290, 230)
            .lineTo(290, 468)
            .stroke()
        pdf.text("HSN/SAC", 300, 238)
        pdf.text("CODE", 304, 248)
        pdf.text('2517', 300, 262)
        pdf.moveTo(357, 230)
            .lineTo(357, 468)
            .stroke()
        pdf.text("QTY.", 368, 238)
        pdf.text(qty, 368, 262)
        pdf.moveTo(408, 230)
            .lineTo(408, 548)
            .stroke()
        pdf.text("RATE", 428, 238)
        pdf.text(rate, 428, 262)
        pdf.moveTo(477, 230)
            .lineTo(477, 568)
            .stroke()
        pdf.text("Amount(Rs)", 480, 238)
        pdf.text(amount, 480, 262)
        //*************************************bottom horizontal line************* */
        pdf.moveTo(38, 468)
            .lineTo(560, 468)
            .stroke()
        pdf.text("Amount", 58, 488)
        pdf.text("Rs. " + aminwords, 100, 488)
        pdf.moveTo(85, 498)
            .lineTo(380, 498)
            .stroke()
        pdf.moveTo(58, 522)
            .lineTo(380, 522)
            .stroke()
        pdf.moveTo(58, 546)
            .lineTo(380, 546)
            .stroke()
        pdf.text("Gst PAYABLE ON REVERSE CHARGES", 260, 554)
        pdf.text("Total", 418, 432)
        pdf.text(amount, 480, 432)
        pdf.moveTo(408, 428)
            .lineTo(560, 428)
            .stroke()
        pdf.fontSize(8);
        pdf.text("Freight &", 418, 452)
        pdf.text("Forwarding Charges", 408, 458)
        pdf.fontSize(12)
        pdf.text("0", 480, 458)
        pdf.moveTo(408, 448)
            .lineTo(560, 448)
            .stroke()
        pdf.fontSize(12)
        pdf.text("CGST", 418, 472)
        pdf.text(cgst, 480, 472)
        pdf.moveTo(408, 488)
            .lineTo(560, 488)
            .stroke()
        pdf.text("SGST", 418, 492)
        pdf.text(cgst, 480, 492)
        pdf.moveTo(408, 508)
            .lineTo(560, 508)
            .stroke()
        pdf.text("IGST", 418, 512)
        pdf.text('0', 480, 512)
        pdf.moveTo(408, 528)
            .lineTo(560, 528)
            .stroke()
        pdf.text("Grand Total", 418, 532)
        pdf.text(total, 480, 532)
        pdf.moveTo(408, 548)
            .lineTo(560, 548)
            .stroke()
        //*************************************************below rect************************** */
        pdf.fontSize(10)
        pdf.text("Certified that the Particulars given above are true and correct", 60, 570)
        pdf.fontSize(12)
        pdf.text("For SANCHI ENGINEERING (P) LTD.", 340, 572)
        pdf.text("E.& O.E.", 38, 582)
        pdf.text("Terms & Conditions :", 38, 598, { underline: true })
        pdf.fontSize(8)
        pdf.text("1.Interest @18% will be charged from the data of issue.Bill till Actual Realisation.", 40, 618)
        pdf.text("2.Plan once sold will not be taken back or exchanged.", 40, 638)
        pdf.text("3.Any Disputes are Subject to Faridabad jurisdiction Only ", 40, 658)
        pdf.text("4.All disputes shall be refred to Arbitration of the Sole Arbitration to be Appointed by the Director Sanchi Engineering (P) Ltd.", 40, 678)
        pdf.text("The Director Shall be the Sole Appointing Authority. The Seat of Arbitration Shall be Faridabad alone.", 40, 698)
        pdf.fontSize(12)
        pdf.text("Authorised Signatory", 460, 648)
        pdf.text("Authorised ", 460, 680)
    
        var da = new Date();
        var month = da.getMonth() + 1;
        var year = da.getFullYear();
    
        var directory2 = "../../var/www/html/Invoices/Rodi";
        if (!fs.existsSync(directory2)) {
            fs.mkdirSync(directory2);
        }
        var directory3 = "../../var/www/html/Invoices/Rodi" + month + "-" + year;
        if (!fs.existsSync(directory3)) {
            fs.mkdirSync(directory3);
        }
        // var directory = directory3.concat('/cheque')
        var mainDir = directory3.concat("//path");
        var dir = mainDir.replace("path", paymentId);
        pdf.pipe(fs.createWriteStream(dir + ".pdf"));
       pdf.end();
    
    
}