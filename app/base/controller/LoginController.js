/**
 * Created by Dell on 8/19/2017.
 */
var Constant = require('../../common/constant');
// var twilio = require('twilio');
var Messages = require('../../common/message');
var Customer = require('../models/customerInformation');
var Employee = require('../models/employeeInformation');
var LoginDetails = require('../models/loginDetails');
var SaloonAccount = require('../models/saloonAccount');
var EmployeeActivity = require('../models/employeeActivity');
var ReferAndEarn = require('../models/referAndEarn');
var MyCash = require('../models/myCash');
var Artist = require('../models/Artist');
var bcrypt = require('bcrypt');
var formstream = require('formstream');
var OTP = require('../models/otp');
var http = require('http');
var nodemailer = require('nodemailer');
var Authenticate = require('../models/authentication');
const jwt = require('jsonwebtoken');
var reply = {};

exports.SIGN_UP = function (req, res) {

    console.log("customer",req.body);
    var password = req.body.password;
    var userType = Constant.USER_TYPE.CUSTOMER;
    var mobileNumber = req.body.mobileNumber;
    if(req.body.customerAddress) {
        var customerAddress = JSON.parse(JSON.stringify(req.body.customerAddress));
    }
    Customer.count({}, function (err, count) {
        var userId = count + 1;
        Add_LOGIN_DETAILS(userId, mobileNumber, userType, password, function (isSuccess) {
            if (isSuccess == true) {

                var customer = new Customer({
                    customerId: userId,
                    name: req.body.name,
                    mobileNumber: req.body.mobileNumber,
                    userType: Constant.USER_TYPE.CUSTOMER,
                    address: customerAddress
                });
                customer.save({}, function (err, cust) {
                    if (err) {
                        DELETE_LOGIN_DETAILS(mobileNumber, userType, function (a) {// if  login details is created and customer is not created then
                            // login details will also get deleted
                        });
                        reply[Constant.REPLY.MESSAGE] = Messages.notCreated;
                        reply[Constant.REPLY.DATA] = err;
                        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                        reply[Constant.REPLY.TOKEN] = '';
                        return res.send(reply).end;
                    } else {
                        GenerateReferralCode(mobileNumber, req.body.name,userId);
                        InsertMyCash(userId,mobileNumber,Constant.MY_CASH.ZER0_BALANCE);
                        UpdateReferral(req.body.referralCode);

                        reply[Constant.REPLY.MESSAGE] = Messages.created;
                        reply[Constant.REPLY.DATA] = cust;
                        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                        reply[Constant.REPLY.TOKEN] = '';
                        return res.send(reply).end;
                    }
                })
            } else {
                reply[Constant.REPLY.MESSAGE] = Messages.notCreated;
                reply[Constant.REPLY.DATA] = null;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
            }
        })
    })
};


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
                    console.log("err"+err);
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
function DELETE_LOGIN_DETAILS(loginId, userType, callback) {
    LoginDetails.remove({loginId: loginId, userType: userType}, function (err) {
        return callback(true);

    })
}


exports.logIn = function (req, res) {
    var loginId = req.body.loginId;//email or phone number
    var password = req.body.password;
    LoginDetails.findOne({loginId: loginId, userType: req.body.userType}, function (err, login) {
        if (err || !login) {
            if (err) {
                reply[Constant.REPLY.MESSAGE] = Messages.Error;
            } else {
                reply[Constant.REPLY.MESSAGE] = Messages.MOBILE_NO;

            }
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            if(req.body.userType == Constant.USER_TYPE.EMPLOYEE){
                Employee.findOne({mobileNumber:loginId,isBlocked:true},function(err,emp){
                    if(emp){
                        reply[Constant.REPLY.MESSAGE]=Messages.Blocked,
                            reply[Constant.REPLY.DATA] = null;
                        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Blocked;
                        reply[Constant.REPLY.TOKEN] = '';
                        return res.send(reply).end;
                    }

                })

            }
            ComparePassword(password, login.password, function (isSuccess) {
                if (isSuccess == true) {
                    login.password = null;
                    UPDATE_FCM_ID(req,login.userId);
                    reply[Constant.REPLY.MESSAGE] = Messages.LOGIN_SUCCESSFUL;
                    reply[Constant.REPLY.DATA] = login;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                    reply[Constant.REPLY.TOKEN] = '';
                    return res.send(reply).end;
                } else {
                    reply[Constant.REPLY.MESSAGE] = Messages.WRONG_PASSWORD;
                    reply[Constant.REPLY.DATA] = null;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                    reply[Constant.REPLY.TOKEN] = '';
                    return res.send(reply).end;
                }


            })
        }


    })
};

function ComparePassword(password, hash, callback) {
    bcrypt.compare(password, hash, function (err, res) {
        if (err) {
            return callback(false);
        }
        if (res == true) {

            return callback(true);

        } else {
            return callback(false);
        }

    })


}
exports.Employee_Sign_up = function (req, res) {
  console.log("emp sign");
    var password = req.body.password;
    var userType = Constant.USER_TYPE.EMPLOYEE;
    var number = req.body.mobileNumber;
    Employee.count({}, function (err, count) {
        var userId = count + 1;
        Add_LOGIN_DETAILS(userId, number, userType, password, function (isSuccess) {

            if (isSuccess == true) {

                var employee = new Employee({
                    employeeId: userId,
                    name: req.body.name,
                    mobileNumber: req.body.mobileNumber,
                    userType: Constant.USER_TYPE.EMPLOYEE
                });
                employee.save({}, function (err, cust) {
                    if (err) {
                        console.log(err);
                        DELETE_LOGIN_DETAILS(number, userType, function (a) {// if  login details is created and customer is not created then
                            // login details will also get deleted
                        });
                        reply[Constant.REPLY.MESSAGE] = Messages.notCreated;
                        reply[Constant.REPLY.DATA] = null;
                        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                        reply[Constant.REPLY.TOKEN] = '';
                        return res.send(reply).end;
                    } else {

                        SEND_MESSAGE(number,  Messages.WELCOME_MESSAGE2);

                        reply[Constant.REPLY.MESSAGE] = Messages.created;
                        reply[Constant.REPLY.DATA] = cust;
                        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                        reply[Constant.REPLY.TOKEN] = '';
                        return res.send(reply).end;
                    }
                })
            } else {
                reply[Constant.REPLY.MESSAGE] = Messages.notCreated;
                reply[Constant.REPLY.DATA] = null;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
            }
        })
    })


};

exports.SALON_SIGN_UP = function (saloonId, saloonName, mobileNumber, callback) {
    var userType = Constant.USER_TYPE.SALON;
    var password = Constant.Zaloonz.Default_Password;
    console.log("sign up in login controller")
    Add_LOGIN_DETAILS(saloonId, mobileNumber, userType, password, function (isSuccess) {
        // console.log("add login:"+isSuccess);
        if (isSuccess == true) {
            var saloon = new SaloonAccount({
                saloonId: saloonId,
                saloonName: saloonName,
                mobileNumber: mobileNumber,
                userType: Constant.USER_TYPE.SALON
            });
            saloon.save({}, function (err, sal) {
                console.log("err",err);
                if (err) {
                    DELETE_LOGIN_DETAILS(mobileNumber, userType, function (a) {

                    });
                    return callback(false);
                } else {
                    var  otp = Math.floor((Math.random() * 10000) + 1);
                    SAVE_OTP(mobileNumber, userType, otp,Constant.OTP_TYPE.SALOON_VERIFICATION);
                    var mess = Messages.WELCOME_MESSAGE.replace('num',otp);
                    SEND_MESSAGE(mobileNumber, mess);

                    return callback(true);
                }


            })
        } else {

            return callback(false);
        }
    })

};

exports.CHANGE_PASSWORD = function (req, res) {
    //test
    var newPassword = req.body.password;
    var currPassword = req.body.currPassword;
    var loginId = req.body.loginId;
    var userType = req.body.userType;

    LoginDetails.findOne({loginId: loginId, userType: userType}, function (err, login) {
        ComparePassword(currPassword, login.password, function (isSuccess) {
            if (isSuccess == true) {
                ENCRYPT_PASSWORD(newPassword, function (hash, isTrue) {
                    if (isTrue == true) {
                        LoginDetails.findOneAndUpdate({
                            loginId: loginId,
                            userType: userType
                        }, {password: hash}, function (err, login) {

                        });
                        reply[Constant.REPLY.MESSAGE] = Messages.created;
                        reply[Constant.REPLY.DATA] = login;
                        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                        reply[Constant.REPLY.TOKEN] = '';
                        return res.send(reply).end;
                    } else {
                        reply[Constant.REPLY.MESSAGE] = Messages.Error;
                        reply[Constant.REPLY.DATA] = err;
                        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                        reply[Constant.REPLY.TOKEN] = '';
                        return res.send(reply).end;
                    }


                })

            } else {
                reply[Constant.REPLY.MESSAGE] = Messages.PASSWORD_NOT_MATCH;
                reply[Constant.REPLY.DATA] = "";
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.WRONG_PASSWORD;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;


            }
        })

    })

};


exports.FORGET_PASSWORD = function (req, res) {
    console.log('forgetpassword',req.body);
    var loginId = req.body.loginId;
    var userType = req.body.userType;
    LoginDetails.findOne({loginId: loginId, userType: userType}, function (err, login) {
        if (err || !login) {
            if (err) {
                reply[Constant.REPLY.MESSAGE] = Messages.Error;
            } else {
                if (req.body.userType == Constant.USER_TYPE.CUSTOMER) {
                    reply[Constant.REPLY.MESSAGE] = Messages.USER_DOES_NOT_EXIST;
                }
                else {
                    reply[Constant.REPLY.MESSAGE] = Messages.MOBILE_NO;
                }
            }
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {

            var otp = Math.floor(1000 + Math.random()* 9000);
            var str = Messages.OTP.concat(" " + otp);
            http.get("http://nimbusit.co.in/api/swsendSingle.asp?username=t1factorial&password=98491455&sender=ZLOONZ&sendto=" + loginId + "&message=+" + str + "", function (isSuccess) {
                SAVE_OTP(loginId, userType, otp,req.body.otpType);
                if (isSuccess) {
                    reply[Constant.REPLY.DATA] = Messages.success;
                    reply[Constant.REPLY.DATA] = otp;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                    reply[Constant.REPLY.TOKEN] = '';
                    return res.send(reply).end;
                } else {
                    reply[Constant.REPLY.MESSAGE] = Messages.Error;
                    reply[Constant.REPLY.DATA] = null;
                    reply[Constant.REPLY.TOKEN] = '';
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                    return res.send(reply).end;
                }
            });
        }

    });
};

function SEND_MAIL(mess, email) {
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
        subject: 'OTP',
        text: mess
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent')
        }
    });


}

function SAVE_OTP(loginId, userType, otp,otpType) {

    var otp = new OTP({
        otp: otp,
        loginId: loginId,
        userType: userType,
        dateAndTime:Date.now(),
        otpType:otpType

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
exports.UPDATE_PASSWORD = function (req, res) {
    var password = req.body.password;
    var loginId = req.body.loginId;
    var userType = req.body.userType;
    console.log(password);
    console.log(loginId);
    ENCRYPT_PASSWORD(password, function (hash, isSuccess) {
        if (isSuccess == true) {

            LoginDetails.findOneAndUpdate({
                loginId: loginId,
                userType: userType
            }, {password: hash}, function (err, login) {
                reply[Constant.REPLY.DATA] = Messages.success;
                reply[Constant.REPLY.DATA] = login;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
            });
        } else {
            reply[Constant.REPLY.DATA] = Messages.Error;
            reply[Constant.REPLY.DATA] = '';
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;

        }

    })

};

function SEND_MESSAGE(mobileNumber, mess) {
    http.get("http://nimbusit.co.in/api/swsendSingle.asp?username=t1factorial&password=98491455&sender=ZLOONZ&sendto=" + mobileNumber + "&message=+" + mess + "", function (res) {


    });


}
exports.GET_EMPLOYEE_ACTIVITY = function (req, res) {

    EmployeeActivity.find({employeeId: req.params.employeeId}, function (err, emp) {
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end

        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.created;
            reply[Constant.REPLY.DATA] = emp;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;

        }

    })

};
exports.SEND_OTP = function(req,res){
    var loginId = req.body.loginId;
    var userType = req.body.userType;
    var otp = Math.floor(1000 + Math.random()* 9000);
    var str = Messages.OTP.concat(" " + otp);

	if (req.body.otpType == Constant.OTP_TYPE.CUSTOMER_SIGN_UP || req.body.otpType == Constant.OTP_TYPE.EMPLOYEE_SIGN_UP){
		LoginDetails.findOne({loginId:loginId},function(err,log){
            if(!log){
                http.get("http://nimbusit.co.in/api/swsendSingle.asp?username=t1factorial&password=98491455&sender=ZLOONZ&sendto=" + loginId + "&message=+" + str + "",
                 function (isSuccess) {
                     SAVE_OTP(loginId, userType, otp,req.body.otpType);
                     if (isSuccess) {
                         reply[Constant.REPLY.MESSAGE] = Messages.created;
                         reply[Constant.REPLY.DATA] = otp;
                         reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                         reply[Constant.REPLY.TOKEN] = '';
                         return res.send(reply).end;

                     } else {
                         reply[Constant.REPLY.MESSAGE] = Messages.Error;
                         reply[Constant.REPLY.DATA] = null;
                         reply[Constant.REPLY.TOKEN] = '';
                         reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                         return res.send(reply).end;
                     }

        });
         }
		 else{
			    reply[Constant.REPLY.MESSAGE] = Messages.MOBILE_NO_EXIST;
                reply[Constant.REPLY.DATA] = "";
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.MobileExists;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
		 }
		})
	}else{
        http.get("http://nimbusit.co.in/api/swsendSingle.asp?username=t1factorial&password=98491455&sender=ZLOONZ&sendto=" + loginId + "&message=+" + str + "",
            function (isSuccess) {
                SAVE_OTP(loginId, userType, otp,req.body.otpType);
                if (isSuccess) {
                    reply[Constant.REPLY.MESSAGE] = Messages.created;
                    reply[Constant.REPLY.DATA] = otp;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                    reply[Constant.REPLY.TOKEN] = '';
                    return res.send(reply).end;

                } else {
                    reply[Constant.REPLY.MESSAGE] = Messages.Error;
                    reply[Constant.REPLY.DATA] = null;
                    reply[Constant.REPLY.TOKEN] = '';
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                    return res.send(reply).end;
                }

            });
    }
};


function GenerateReferralCode(loginId,name,userId){
    var str = name.substr(0,2);
    var str2 = loginId.charAt(3);
    var str3 = loginId.charAt(5);
    var str4 = loginId.charAt(7);
    var str5 = loginId.charAt(9);
    var id = str.concat(str2,str3,str4,str5);
    var refer = new ReferAndEarn({
        loginId:loginId,
        referralCode:id,
        userId:userId
    }) ;
    refer.save({}, function (err) {
        if(err){
            console.log('referral code not created')
        }else{
            console.log('referral Code created');
        }
    });

}

function UpdateMyCash(mobileNumber,myCash){
    var myCashInt = parseInt(myCash);
	
    MyCash.findOneAndUpdate({phoneNumber:mobileNumber},{
        $inc:  { myCash:myCashInt}
    },function(err){
        if(err){
            console.log('myCash not save'+err);
        } else{
            console.log('myCash save');
        }

    });
}
function InsertMyCash(userId,mobileNumber,myCash){
    var myCash =new  MyCash({
        userId:userId,
        phoneNumber:mobileNumber,
        myCash:myCash

    });
    myCash.save({},function(err){
        if(err){
            console.log('myCash not inserted')

        }
        else{
            console.log('myCash inserted')
        }
    });
}
function UpdateReferral(referralCode){
    ReferAndEarn.findOneAndUpdate({referralCode:referralCode},{$inc:{noOfReferrals:1}},{new:true},function(err,refer){
        if(refer) {
			console.log("my cash is",Constant.MY_CASH.AMOUNT);
			console.log("my login id",refer.loginId);
            UpdateMyCash(refer.loginId, Constant.MY_CASH.AMOUNT);
        }else{
            console.log('not update');
        }

    })

}

exports.RETURN_TOKEN = function(req,res){
    Authenticate.findOne({deviceId:req.body.deviceId},function(err,auth) {
        console.log("err:"+err);
        console.log("aut:"+auth);
        if(err){
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = '';
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }else if(!auth) {

            var date = new Date().toLocaleDateString();
            var auth = new Authenticate({
                deviceId: req.body.deviceId,
                dateAndTime: Date.now(),
                date: date,
                userId:req.body.userId

            });
            auth.save(function (err) {
                if (err) {
                    reply[Constant.REPLY.MESSAGE] = Messages.Error;
                    reply[Constant.REPLY.DATA] = '';
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                    reply[Constant.REPLY.TOKEN] = '';
                    return res.send(reply).end;
                }
                else {
                    var token =  'JWT ' + jwt.sign(req.body.deviceId,'shhhhh');
                    reply[Constant.REPLY.MESSAGE] = Messages.created;
                    reply[Constant.REPLY.DATA] = null;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                    reply[Constant.REPLY.TOKEN] = token;
                    return res.send(reply).end;
                }
            })
        }else if(auth){
            var date = new Date().toLocaleDateString();
            Authenticate.findOneAndUpdate({deviceId:req.body.deviceId},{dateAndTime: Date.now(),
                date: date,userId:req.body.userId},function(err) {
                if(err){
                    reply[Constant.REPLY.MESSAGE] = Messages.Error;
                    reply[Constant.REPLY.DATA] = '';
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                    reply[Constant.REPLY.TOKEN] = '';
                    return res.send(reply).end;
                }else {
                    var token = 'JWT ' + jwt.sign(req.body.deviceId, 'shhhhh');
                    reply[Constant.REPLY.MESSAGE] = Messages.created;
                    reply[Constant.REPLY.DATA] = null;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                    reply[Constant.REPLY.TOKEN] = token;
                    return res.send(reply).end;
                }
            })

        }
    })
};


exports.CHECK_TOKEN = function(req,res,next) {

    var token = req.body.authorization || req.param('authorization') || req.headers['authorization'];
    if (token) {
        //next();
        var parted = token.split(' ');
        if (parted.length === 2) {
            token = parted[1];
        } else {


            return res.send(reply).end();
        }
        var deviceId   =  jwt.decode(token);
        Authenticate.findOne({deviceId:deviceId},function(err,dev){

            if(err||!dev){
                reply[Constant.REPLY.MESSAGE] = Messages.No_Token;
                reply[Constant.REPLY.DATA] = null;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;

            }
            else{
                next();


            }

        })
    }
};
exports.GET_OTP_INFO = function(req,res){

    OTP.find({loginId: req.params.loginId, userType: req.params.userType})
        .sort({dateAndTime: -1}).exec(function (err, otp) {
            if(err){
                reply[Constant.REPLY.MESSAGE] = Messages.Error;
                reply[Constant.REPLY.DATA] = '';
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
            }else{
                reply[Constant.REPLY.MESSAGE] = Messages.success;
                reply[Constant.REPLY.DATA] = otp[0];
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
            }

        })
};

exports.VERIFY_OTP = function(req,res){
    if(!req.body.skipReason) {
        OTP.findOne({loginId: req.body.loginId, otp: req.body.otp}, function (err, otp) {
            if (err || !otp) {
                reply[Constant.REPLY.MESSAGE] = Messages.Error;
                reply[Constant.REPLY.DATA] = '';
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
            } else {
                var mess = Messages.VERIFY_MESSAGE.replace('num', otp.otp).replace("salon", req.body.saloonName);
                SEND_MESSAGE(req.body.employeeNumber,mess);
                reply[Constant.REPLY.MESSAGE] = Messages.success;
                reply[Constant.REPLY.DATA] = '';
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
            }


        })
    }else{

        OTP.findOneAndUpdate({loginId: req.body.loginId,userType:req.body.userType},{skipReason:req.body.skipReason},{new:true},function(err,otp){
            if(err || !otp) {
                reply[Constant.REPLY.MESSAGE] = Messages.Error;
                reply[Constant.REPLY.DATA] = '';
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
            }else{
                var mess = Messages.VERIFY_MESSAGE.replace('num', otp.otp).replace("salon", req.body.saloonName);
                SEND_MESSAGE(req.body.employeeNumber,mess);
                reply[Constant.REPLY.MESSAGE] = Messages.success;
                reply[Constant.REPLY.DATA] = '';
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
            }

        })
    }

};

exports.UPDATE_CUSTOMER_INFO = function(req,res){


    if(req.body.address) {
        var address = JSON.parse(JSON.stringify(req.body.address));
    }

    Customer.findOneAndUpdate({customerId:req.body.customerId},{name:req.body.name,address:address,emailId:req.body.emailId,
        gender:req.body.gender},{new:true},function(err,customer){
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }
        else {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = customer;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end}
    })

};

exports.LOG_OUT = function(req,res){

    Authenticate.findOneAndUpdate({deviceId:req.body.deviceId},{userId:""},function(err,auth){
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }
        else {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end}
    })


};

exports.UPDATE_FCM_ID = function(req,res){
    var date = new Date().toLocaleDateString();
    Authenticate.findOneAndUpdate({deviceId:req.body.deviceId},{fcmId:req.body.fcmId,dateAndTime: Date.now(),
        date: date,userId:req.body.userId},{upsert: true},function(err,auth){
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }
        else {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end}
    })
}

function  UPDATE_FCM_ID(req,userId){
    var date = new Date().toLocaleDateString();
    Authenticate.findOneAndUpdate({deviceId:req.body.deviceId},{fcmId:req.body.fcmId,dateAndTime: Date.now(),
        date: date,userId:userId},{upsert: true},function(err,auth){
        if (err) {
            /*
             reply[Constant.REPLY.MESSAGE] = Messages.notFound;
             reply[Constant.REPLY.DATA] = null;
             reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
             reply[Constant.REPLY.TOKEN] = '';
             return res.send(reply).end;
             */
        }
        else {
            //reply[Constant.REPLY.MESSAGE] = Messages.success;
            //reply[Constant.REPLY.DATA] = null;
            //reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            //reply[Constant.REPLY.TOKEN] = '';
            //return res.send(reply).end
        }
    })


}
exports.IS_VALID_REFERAL = function(req, res){
    ReferAndEarn.find({referralCode:req.params.referralCode},function(err,refer){
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = '';
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }
        else {
            reply[Constant.REPLY.MESSAGE] = "";
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }

    })

}
exports.ARTIST_SIGNUP = function(req,res){
    console.log("Artist signup");
 var password = Constant.Zaloonz.Default_Password;
 var userType = Constant.USER_TYPE.SALON;
 var mobileNumber = req.body.artistNumber;
if(req.body.artistAddress) {
     var artistAddress = JSON.parse(JSON.stringify(req.body.artistAddress));
    // console.log("add"+artistAddress);

}
 if(req.body.priceDetails){
     var priceDetails = JSON.parse(JSON.stringify(req.body.priceDetails));
 }
 if (req.body.products) {
    var products = (req.body.products+ "").split("@");
}

 if (req.body.services) {
     var services = (req.body.services + "").split("@");
 }
 console.log(products);
 console.log(services);
    var str  = "A";
    var userId = str.concat(Date.now());
    Add_LOGIN_DETAILS(userId, mobileNumber, userType, password, function (isSuccess) {
        if (isSuccess == true) {
            var artist = new Artist({
                artistId: userId,
                artistName: req.body.artistName,
                artistNumber: req.body.artistNumber,
                userType: Constant.USER_TYPE.ARTIST,
                address: artistAddress,
                artistEmail: req.body.artistEmail,
                travel:req.body.travel,
                priceDetails:priceDetails,
                products:products,
                services:services,
                experience:req.body.experience,
                about:req.body.about

            });
            artist.save({}, function (err, artist) {
                console.log(artist);
                if (err) {
                    console.log("err"+err);
                    DELETE_LOGIN_DETAILS(mobileNumber, userType, function (a) {// if  login details is created and customer is not created then
                        // login details will also get deleted
                    });
                    reply[Constant.REPLY.MESSAGE] = Messages.notCreated;
                    reply[Constant.REPLY.DATA] = err;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                    reply[Constant.REPLY.TOKEN] = '';
                    return res.send(reply).end;
                } else {
                    reply[Constant.REPLY.MESSAGE] = Messages.created;
                    reply[Constant.REPLY.DATA] = artist.artistId;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;   
                    reply[Constant.REPLY.TOKEN] = '';
                    return res.send(reply).end;
                }
            })
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.notCreated;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }
    })


}