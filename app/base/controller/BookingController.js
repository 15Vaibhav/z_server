var BookingAppointment = require('../models/bookingAppointment');
var Salon = require('../models/salonInformation');
//var sha512 = require('js-sha512');
var Coupon = require('../models/coupon');
var ReferAndEarn = require('../models/referAndEarn');
var MyCash = require('../models/myCash');
var packageCouponApplied = require('../models/packageCouponApplied');
var Constant = require('../../common/constant');
var Messages = require('../../common/message');
var Customer = require('../models/customerInformation');
var PCustomer = require('../models/pramotional');
var EarnPoints = require('../models/earnPoints');
var http = require('http');
var SaloonTransaction = require('../models/saloonTransaction');
var Authentication = require('../models/authentication');
var FCM = require('fcm-node');
var serverKey = 
'AAAAFl_84kg:APA91bEQhoOp0znrNS2joIGJJcT0VpcoADJ6hmXSbCQqnX_vznu7ALx0W6bmirDWjUwbRbj5a-oj3B5Tr8TX9htnfyJzxcryLymvcYfE7XmFscb6FvaTkxiAfTYvCd_vu_3UVAcy_JA7'
var fcm = new FCM(serverKey);
var reply ={};


exports.BOOK_APPOINTMENT = function(req,res){
    var services;
    var packages;
    if (req.body.services) {
        services = JSON.parse(JSON.stringify(req.body.services));
    }
    if (req.body.packages) {
        packages = JSON.parse(JSON.stringify(req.body.packages));

    }
    if(req.body.loginId==''||req.body.loginId==null||req.body.customerId==''||req.body.customerId==null){
        reply[Constant.REPLY.MESSAGE] = Messages.Error;
        reply[Constant.REPLY.DATA] = "loginId and Customer Id is required";
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
        reply[Constant.REPLY.TOKEN] = '';
        return res.send(reply).end;  
      
    }else{
          
        var str = 'ZA';
        var bookingDateAndTime = new Date(req.body.bookingDateAndTime);
        var id = str.concat(Date.now());
        var len = id.length;
        var code = id.substring((len - 5), len);
        var str2 = 'ZB'
        var code2 = str2.concat(code);
        var book = new BookingAppointment({
                bookingId:id,
                bookingCode: code2,
                saloonId:req.body.saloonId,
                saloonName:req.body.saloonName,
                saloonAddress:req.body.saloonAddress,
                customerId:req.body.customerId,
                services:services,
                dealCode:req.body.dealCode,
                taxAmount:req.body.taxAmount,
                couponApplied:req.body.couponApplied,
                packages: packages,
                bookingStatus:Constant.BOOKING_STATUS.Pending,
                bookingDateAndTime:bookingDateAndTime,
                loginId:req.body.loginId,
                customerName:req.body.customerName,
                totalOnlinePrice:req.body.totalOnlinePrice,
                totalOfflinePrice:req.body.totalOfflinePrice,
                totalAmountToPay:req.body.totalAmountToPay,
                postingDateTime:Date.now(),
                myCashUsed:req.body.myCashUsed,
                discountedAmount:req.body.discountedAmount,
                cashbackAmount:req.body.cashbackAmount,
                zaloonzRate:req.body.zaloonzRate,
                rateType:req.body.rateType,
               instructions:req.body.instructions
    
        });
    
        book.save({},function(err,booking){
            console.log("error" + err);
           if(err || !booking){
               reply[Constant.REPLY.MESSAGE] = Messages.Error;
               reply[Constant.REPLY.DATA] = err;
               reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
               reply[Constant.REPLY.TOKEN] = '';
               return res.send(reply).end;
           }else{
            //   var mess = Messages.CONFIRM_BOOKING.replace('ZZZZ',code2);
              var managebook = Messages.MANAGE_BOOKING.replace('numb',req.body.mobileNumber);
            SEND_NOTIFICATION(req.body.saloonId,Messages.Pending_booking);
            Salon.find({saloonId:req.body.saloonId},function(err,salon){
                   if(salon){
               SEND_MESSAGE(salon[0].mobileNumber, managebook);
                   }
               })
              INSERT_PACKAGE_COUPON_APPLIED(req.body.customerId, req.body.loginId, req.body.couponApplied);
               if(req.body.myCashUsed){
                   var used = req.body.myCashUsed;
                   MyCash.findOneAndUpdate({userId: req.body.customerId}, {
                       $inc: {myCash: -used}
                   }, function (err, upt) {
                       if(err){
                           console.log("error while updating my cash"+err);
                       }else{
                           console.log("my cash updated")
                       }
                   })
               }
               reply[Constant.REPLY.MESSAGE] = Messages.Booking;
               reply[Constant.REPLY.DATA] = null;
               reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
               reply[Constant.REPLY.TOKEN] = '';
               return res.send(reply).end;
              }
    
    
        })
    }
   
};




exports.ACCEPT_BOOKING = function(req,res){
// var str = 'ZA';
// var id = str.concat(Date.now());
// var len = id.length;
// var code = id.substring((len - 5), len);
// var str2 = 'ZB'
// var code2 = str2.concat(code);
BookingAppointment.findOneAndUpdate({bookingId:req.body.bookingId},{bookingStatus:Constant.BOOKING_STATUS.Approved},function(err,result){
    if(err){
        reply[Constant.REPLY.MESSAGE] = Messages.Error;
        reply[Constant.REPLY.DATA] = null;
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
        reply[Constant.REPLY.TOKEN] = '';
        return res.send(reply).end;
    }else{
        reply[Constant.REPLY.MESSAGE] = Messages.success;
        reply[Constant.REPLY.DATA] = null;
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
        reply[Constant.REPLY.TOKEN] = '';
        var mess = Messages.Accept_booking;
        SEND_NOTIFICATION(result.customerId,mess);
        var mess = Messages.CONFIRM_BOOKING.replace('ZZZZ',result.bookingCode);
        Customer.find({customerId:result.customerId},function(err,cust){
            console.log(cust[0].mobileNumber)
            SEND_MESSAGE(cust[0].mobileNumber,mess);
        })
        
        return res.send(reply).end;
    }


})
};

exports.CANCEL_BOOKING = function(req,res){
    var date = new Date(req.body.bookingDateAndTime);
    var dt = new Date();
    var diff = (date.getTime() - dt.getTime())/(1000 * 3600);
    if(diff>=Constant.Constraints.Booking_Cancelled_Time){
        BookingAppointment.findOneAndUpdate({bookingId:req.body.bookingId},{bookingStatus:Constant.BOOKING_STATUS.Cancelled},function(err,result){
            if(err){
                console.log('the err:', err)
                reply[Constant.REPLY.MESSAGE] = Messages.Error;
                reply[Constant.REPLY.DATA] = null;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
            }else{
                var mess = Messages.CANCELLED_BOOKING;
                var mess2 = mess.replace("ID",req.body.bookingId);
                SEND_NOTIFICATION(req.body.userId,mess2);
                SEND_NOTIFICATION(result.saloonId,mess2);
                reply[Constant.REPLY.MESSAGE] = Messages.success;
                reply[Constant.REPLY.DATA] = null;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
            }
 })
    }else{
        reply[Constant.REPLY.MESSAGE] = "Booking Cannot Be Cancelled at this time";
        reply[Constant.REPLY.DATA] = null;
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Check_Msg;
        reply[Constant.REPLY.TOKEN] = '';
        return res.send(reply).end;
    }

};


exports.REJECT_BOOKING = function(req,res){

    if(req.body.reasonForRejection = "" || !req.body.reasonForRejection )
    {
        reply[Constant.REPLY.MESSAGE] = Messages.BLANK_ERROR;
        reply[Constant.REPLY.DATA] = null;
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
        reply[Constant.REPLY.TOKEN] = '';
        return res.send(reply).end;
    }
    BookingAppointment.findOneAndUpdate({bookingId:req.body.bookingId},{bookingStatus:Constant.BOOKING_STATUS.Rejected,reasonForRejection:req.body.reasonForRejection},
        function(err){
        if(err){
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }else{
			var mess = Messages.REJECTED_BOOKING;
            SEND_NOTIFICATION(req.body.userId,mess);
            console.log("Rej.................................................................2"+req.body.userId)
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }



    })
};



exports.GET_ACTIVE_COUPONS = function(req,res){

    var date = new Date();
    Coupon.find({saloonId:req.body.saloonId,validTo:{$gte:date},validFrom:{$lte:date}},function(err,coupon) {
        if (err|| !coupon) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;

        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.created;
            reply[Constant.REPLY.DATA] = coupon;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }
    })
};



exports.UPDATE_MISSED_BOOKINGS = function(req,res) {

    var date = new Date.now();
    BookingAppointment.findOneAndUpdate({
        saloonId: req.body.saloonId,
        bookingDateAndTime: {$lt: date},bookingStatus: Constant.BOOKING_STATUS.Pending
    }, {bookingStatus: Constant.BOOKING_STATUS.Missed_Booking}, function (err) {
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
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


    });
};


function INSERT_PACKAGE_COUPON_APPLIED(userId,loginId,coupon){
   // console.log("success", userId);
 packageCouponApplied.findOne({userId:userId},function(err,userId){
     if(userId){
       packageCouponApplied.findOneAndUpdate({userId:userId},{$push: {couponApplied:coupon}},function(err){
           // console.log("updated");
         })
         //console.log("user is", userId);
     }else {
         var packCoupApplied = new packageCouponApplied({
             userId: userId,
             phoneNumber: loginId,
             couponApplied: coupon
         });
         packCoupApplied.save(function (err, data) {
           //  console.log("created");
         })
         //console.log("success");
     }

 })
};


exports.VIEW_SALOON_BOOKING = function(req,res){

    BookingAppointment.find({saloonId:req.params.saloonId,bookingStatus:[0,3]}).sort({bookingDateAndTime:-1}).exec(function(err,app){
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = app;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }


    });
};

exports.VIEW_CUSTOMER_DETAILS = function(req,res){

 Customer.findOne({customerId:req.params.customerId},{customerId:0},function(err,cust){
     if (err) {
         reply[Constant.REPLY.MESSAGE] = Messages.Error;
         reply[Constant.REPLY.DATA] = null;
         reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
         reply[Constant.REPLY.TOKEN] = '';
         return res.send(reply).end;
     } else {
       MyCash.findOne({phoneNumber:req.params.phoneNumber},function(err,cash) {
           ReferAndEarn.findOne({loginId: req.params.phoneNumber}, function (err, referal) {


               reply[Constant.REPLY.MESSAGE] = Messages.success;
               reply[Constant.REPLY.DATA] = cust;
               reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
               reply[Constant.REPLY.TOKEN] = '';
               reply[Constant.REPLY.MY_CASH] = cash;
               reply[Constant.REPLY.REFER_CODE] = referal.referralCode;

               return res.send(reply).end;
           })
       })
     }


 });


}

exports.COMPLETE_BOOKING = function (req, res) {
    var services;
    var packages;
    if (req.body.services) {
        services = JSON.parse(JSON.stringify(req.body.services));
    }
    if (req.body.packages) {
        packages = JSON.parse(JSON.stringify(req.body.packages));
    }
    BookingAppointment.findOneAndUpdate({
        saloonId: req.body.saloonId,
        bookingId: req.body.bookingId
    }, {$unset: {services: "", packages: ""}}, function (err) {
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;

        } else {

            BookingAppointment.findOneAndUpdate({saloonId: req.body.saloonId, bookingId: req.body.bookingId}, {
                packages: packages,
                services: services,
                bookingStatus: Constant.BOOKING_STATUS.completed,
                totalOnlinePrice:req.body.totalOnlinePrice,
                totalOfflinePrice:req.body.totalOfflinePrice,
				totalAmountToPay:req.body.totalAmountToPay,
				dealCode:req.body.dealCode}, function (err) {
					if(req.body.extraCashUsed != 0) {
						 MyCash.findOneAndUpdate({userId: req.body.customerId}, {
                   $inc: {myCash: req.body.extraCashUsed}
               }, function (err, upt) {
                   if(err){
                       console.log("error while updating my cash");
                   }else{
                       console.log("my cash updated")
                   }
               })
					}
					
                 var amt = req.body.totalOnlinePrice -req.body.totalAmountToPay;
                 console.log("online.."+req.body.totalOnlinePrice );
                 console.log("offline"+req.body.totalAmountToPay);
				 if (amt > 0){
					UPDATE_SALOON_TRANSACTION(req,amt,1,0);
				 }else if(amt < 0){
					 UPDATE_SALOON_TRANSACTION(req,amt,0,1);
				 }
                  UPDATE_SALOON_COMMISION_AND_EARN_POINTS(req,req.body.totalAmountToPay);
                				  
                reply[Constant.REPLY.MESSAGE] = Messages.success;
                reply[Constant.REPLY.DATA] = null;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;


            })

        }


    })

};

function UPDATE_SALOON_TRANSACTION(req,amt,amtToPay,amtReceived){
	var TransType;
	if (amtToPay == 1){
		amtToPay = amt;
		TransType = Constant.Transaction_Type.Discount_by_Zaloonz;
	}
	if (amtReceived == 1){
		amtReceived = amt;
		TransType = Constant.Transaction_Type.sold_On_high_price_by_zaloonz;
	}
	var ser = new SaloonTransaction({
		saloonId:req.body.saloonId,
		amountReceived:amtReceived,
		amountToPay:amtToPay,
		dateTime:Date.now(),
		bookingId:req.body.bookingId,
		status:Constant.Transaction_Status.pending,
		transactionType:TransType
	});
	ser.save({},function(err){
	    if(err){
			console.log("error while saving saloon transaction");
		}else{
			console.log("transaction save successfully");
		}
	})
}
function UPDATE_SALOON_COMMISION_AND_EARN_POINTS(req,amt){
	var amount;
	var points;
	var planType = req.body.planType;
	if (planType == 0){
		amount = (parseInt(amt) * parseInt(Constant.COMMISION.FREE_PLAN))/100;
		ponits =0;
	};
	if (planType == 1){
		amount = (parseInt(amt) * parseInt(Constant.COMMISION.SILVER))/100;
		ponits =0;
		
	};
	if (planType == 2){
		amount = (parseInt(amt) * parseInt(Constant.COMMISION.GOLD))/100;
		points = (parseInt(amt) * parseInt(Constant.Earn_Ponits.GOLD))/100;
	};
	if (planType == 3){
		amount = (parseInt(amt) * parseInt(Constant.COMMISION.PLATINUM))/100;
		points = (parseInt(amt) * parseInt(Constant.Earn_Ponits.PLATINUM))/100;
	};
	
	var ser = new SaloonTransaction({
		saloonId:req.body.saloonId,
		amountReceived:0,
		amountToPay:amount,
		dateTime:Date.now(),
		bookingId:req.body.bookingId,
		status:Constant.Transaction_Status.pending,
		transactionType:Constant.Transaction_Type.Commision_On_booking
	});
	ser.save({},function(err){
	    if(err){
			console.log("error while saving saloon transaction");
		}else{
			console.log("transaction save successfully");
		}
	})
	
	EarnPoints.findOne({saloonId:req.body.saloonId},function(err,erp){
		if(!erp){
	  var earnPoints = new EarnPoints({
		
		saloonId:req.body.saloonId,
		points:points
		
	   })
	   earnPoints.save({},function(err){
		   if(err){
		   console.log("error earnPoints");
		   }else{
			 console.log("earnPoints save successfully");  
		   }
	   })
		}else {
		 EarnPoints.findOneAndUpdate({saloonId:req.body.saloonId},{
                   $inc: {points: points}
               },function(err){
				   
			   })
		}
	})
	
}

function SEND_MESSAGE(mobileNumber, mess) {
http.get("http://nimbusit.co.in/api/swsendSingle.asp?username=t1factorial&password=98491455&sender=ZLOONZ&sendto=" + mobileNumber + "&message=+" + mess + "", function (res) {


    });

}

exports.SHOW_SALOON_BOOKING_LIST = async function (req, res) {
    console.log('inside the booking...', req.body)
    let limit = 5;
    let pageNum = req.body.page || 1;

    let skip = limit * (pageNum - 1);
    let salonsCount = await Salon.count({saloonName:  new RegExp(req.body.search, "i")});
    let salons = await Salon.find({saloonName:  new RegExp(req.body.search, "i")}, ['saloonName', 'saloonId', 'branchId', 'parentName'])
        .skip(parseInt(skip)).limit(parseInt(limit)).sort({ saloonName: -1 })
    console.log('the salons::', salons.length)
    if (!salons.length) {
        reply[Constant.REPLY.MESSAGE] = Messages.Error;
        reply[Constant.REPLY.DATA] = null;
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
        reply[Constant.REPLY.TOKEN] = '';
        return res.send(reply).end;
    }
    let Result = [];
    for (let salon in salons) {
        let bookingInfo = 0, branchInfo = 0;
        bookingInfo = await BookingAppointment.count({ saloonId: salons[salon].saloonId });
        if(salons[salon].branchId) branchInfo = await Salon.count({ branchId: salons[salon].branchId });
        console.log(salons.length, 'index----------->', salon)
        let x = JSON.parse(JSON.stringify(salons[salon]));
        x['overallBookings'] = bookingInfo;
        x['overallBranches'] = branchInfo;

        Result.push(x);

        if (parseInt(salon)+1 == salons.length) {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = Result;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            reply[Constant.REPLY.COUNT] = salonsCount;
            return res.send(reply).end;
        }
    }
}

exports.GET_PARTICULAR_BOOKINGS = async function (req, res) {
    console.log('inside the booking...', req.body)
    let limit = 5;
    let pageNum = req.body.page || 1;

    let skip = limit * (pageNum - 1);
    let countObj = {};
    countObj.Pending = await BookingAppointment.count({$and: [{saloonId: req.body.saloonId}, {bookingStatus: 0}]})
    countObj.Rejected = await BookingAppointment.count({$and: [{saloonId: req.body.saloonId}, {bookingStatus: 1}]})
    countObj.Cancelled = await BookingAppointment.count({$and: [{saloonId: req.body.saloonId}, {bookingStatus: 2}]})
    countObj.Approved = await BookingAppointment.count({$and: [{saloonId: req.body.saloonId}, {bookingStatus: 3}]})
    countObj.Completed = await BookingAppointment.count({$and: [{saloonId: req.body.saloonId}, {bookingStatus: 4}]})
    countObj.Missed_Booking = await BookingAppointment.count({$and: [{saloonId: req.body.saloonId}, {bookingStatus: 5}]})

    let overallBookings = await BookingAppointment.find({$and: [{saloonId: req.body.saloonId}, {bookingStatus: req.body.bookingStatus}]},
        ["bookingDateAndTime", "services", "bookingId", "customerId", "totalAmountToPay"])
        .skip(parseInt(skip)).limit(parseInt(limit)).sort({ bookingDateAndTime: -1 })
    console.log('the overall bookings::', overallBookings.length)
    if (!overallBookings.length) {
        reply[Constant.REPLY.MESSAGE] = Messages.Error;
        reply[Constant.REPLY.DATA] = null;
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
        reply[Constant.REPLY.TOKEN] = '';
        return res.send(reply).end;
    }
    let Result = [];
    for (let booking in overallBookings) {
        let customer = await Customer.findOne({customerId: overallBookings[booking].customerId},
            ["name", "mobileNumber"]);
        let x = JSON.parse(JSON.stringify(overallBookings[booking]));
        x['customer'] = customer;
        Result.push(x);
        if(parseInt(booking)+1 == overallBookings.length){
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = Result;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            reply[Constant.REPLY.COUNT] = countObj;
            return res.send(reply).end;
        }
    }
}

exports.GET_CANCELLED_BOOKINGS = function(req,res){
	
	BookingAppointment.find({saloonId:req.params.saloonId,bookingStatus:Constant.BOOKING_STATUS.Cancelled}).sort({bookingDateAndTime:-1}).exec(function(err,result){
		
		if(err){
	    reply[Constant.REPLY.MESSAGE] = Messages.Error;
        reply[Constant.REPLY.DATA] = null;
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
        reply[Constant.REPLY.TOKEN] = '';
        return res.send(reply).end;
		}
		else{
	    reply[Constant.REPLY.MESSAGE] = Messages.success;
        reply[Constant.REPLY.DATA] = result;
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
        reply[Constant.REPLY.TOKEN] = '';
        return res.send(reply).end;
		}
	   	
		
		
	})
	
};
exports.GET_REJECTED_BOOKINGS = function(req,res){
	
	BookingAppointment.find({saloonId:req.params.saloonId,bookingStatus:Constant.BOOKING_STATUS.Rejected})
        .sort({bookingDateAndTime:-1}).exec(function(err,result){
		
		if(err){
			reply[Constant.REPLY.MESSAGE] = Messages.Error;
			reply[Constant.REPLY.DATA] = null;
			reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
			reply[Constant.REPLY.TOKEN] = '';
			return res.send(reply).end;
		}else{
			reply[Constant.REPLY.MESSAGE] = Messages.success;
			reply[Constant.REPLY.DATA] = result;
			reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
			reply[Constant.REPLY.TOKEN] = '';
			return res.send(reply).end;
		}
	   	
		})
	};
	
exports.GET_COMPLETED_BOOKINGS = function(req,res){

	BookingAppointment.find({saloonId:req.params.saloonId,bookingStatus:Constant.BOOKING_STATUS.completed})
        .sort({bookingDateAndTime:-1}).exec(function(err,result){

		if(err){
			reply[Constant.REPLY.MESSAGE] = Messages.Error;
			reply[Constant.REPLY.DATA] = null;
			reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
			reply[Constant.REPLY.TOKEN] = '';
			return res.send(reply).end;
		}else{
			reply[Constant.REPLY.MESSAGE] = Messages.success;
			reply[Constant.REPLY.DATA] = result;
			reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
			reply[Constant.REPLY.TOKEN] = '';
			return res.send(reply).end;
		}

		})
	};

function SEND_NOTIFICATION(userid,mess) {
Authentication.find({userId: userid}, function (err,auth) {
        console.log("auth"+auth);
        if(auth){
          for (var i = 0; i < auth.length; i++) {
            //  console.log("message....."+auth[i].fcmId);
            var message = {
                to: auth[i].fcmId,
                notification: {
                    title: 'ZALOONZ',
                    body: mess
                }

            };
        fcm.send(message, function (err, response) {
                if (err) {
                    console.log("err:"+err);
                } else {
                    console.log("resp:"+response);
                }})
        }
    }else{
        console.log(err);
    }
    })
	
	
}
exports.PRAMOTIONAL_MESSAGES = function(req,res){
    console.log("pr run");
       PCustomer.find({},function(e,r){
           console.log(e);
           console.log(r);
          r.forEach(function(element){
        console.log(element.mobileNumber)
        console.log(element.name);
        SEND_MESSAGE(element.mobileNumber,Messages.pramotionalMessage)
          })
        })
}
exports.GET_INVOICE_REQUEST = function(req,res){
    var reqmsg = "Hii I am requesting for invoice. Name: "+req.body.name+" mobileNumber: "+req.body.mobileNumber
   SEND_MESSAGE("9958863008",reqmsg);
   SEND_MESSAGE("9899773129",reqmsg);
   reply[Constant.REPLY.MESSAGE] = Messages.success;
   reply[Constant.REPLY.DATA] = '';
   reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
   reply[Constant.REPLY.TOKEN] = '';
   return res.send(reply).end;
   
    
}
// exports.GET_HASH_PARAM = function(req,res){
// var  services = JSON.parse(JSON.stringify(req.body));
//      console.log(services);
//      var MERCHANT_KEY = services.key;
//      var txnid = services.txnid;
//      var amount = services.amount;
//      var productInfo =services.productinfo;
//      var name = services.firstname;
//      var email =services.email;
//      var SALT = "Q0TcPSxzZs";
// //$hashSequence = "key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10";
// var hashString = MERCHANT_KEY+"|"+txnid+"|"+amount+"|"+productInfo+"|"+name+"|"+email+"|||||||||||"+SALT;
// console.log(hashString);
//      var hash = sha512.update(hashString);
//      var hashkey = hash.hex();
//      console.log(hashkey);
//     // reply[Constant.REPLY.MESSAGE] = Messages.success;
//      reply[Constant.REPLY.HASH] = hashkey;
//      //reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
//     // reply[Constant.REPLY.TOKEN] = '';
//      return res.send(reply).end;

// }
