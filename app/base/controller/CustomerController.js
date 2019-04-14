


var Salon = require('../models/salonInformation');
var ReviewInfo = require('../models/reviewInformation');
var RateVariable = require('../models/rateVariable');
var SaloonOffers = require('../models/saloonOffers');
var Constant = require('../../common/constant');
var Messages = require('../../common/message');
var saloonService = require('../models/saloonService');
var DayDeal = require('../models/dayDeal');
var MyCash = require('../models/myCash');
var MyFavoriteSaloon = require('../models/myFavoriteSaloons');
var BookingAppointment = require('../models/bookingAppointment');
var packageCouponApplied = require('../models/packageCouponApplied');
var Coupon = require('../models/coupon');
var Banners = require('../models/banner');
var Offer = require('../models/offersprovide');
var reply = {};


exports.OPEN_NOW = function (req, res) {

    Salon.findOne({
        saloonId: req.params.saloonId,
        "scheduleTiming.day": req.params.day
    }, {
        "scheduleTiming.$": 1
    }, function (err, sal) {

        if (sal) {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = sal;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }

    })


};

exports.BASED_ON_RATINGS = function (req, res) {

    Salon.find({
        averageRating: {
            $gt: 1
        }
    }, function (err, sal) {
        if (sal) {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = sal;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }

    });

};




exports.BASED_ON_GENDER = function (req, res) {
    Salon.find({
        saloonType: req.params.saloonType
    }).limit(Constant.PAGE_LIMIT.size).exec(function (err, sal) {
        var lastId = sal[sal.length - 1].id;
        reply[Constant.REPLY.MESSAGE] = Messages.success;
        reply[Constant.REPLY.DATA] = sal;

        reply[Constant.REPLY.RESULT_CODE] = lastId;
        reply[Constant.REPLY.TOKEN] = '';
        return res.send(reply).end;


    })
};


exports.BASED_ON_GENDER_NEXT = function (req, res) {

    Salon.find({
        saloonType: req.params.saloonType,
        _id: {
            $gt: req.params.lastId
        }
    }).limit(Constant.PAGE_LIMIT.size).exec(function (err, sal) {
        var lastId = sal[sal.length - 1].id;
        reply[Constant.REPLY.MESSAGE] = Messages.success;
        reply[Constant.REPLY.DATA] = sal;
        reply[Constant.REPLY.RESULT_CODE] = lastId;
        reply[Constant.REPLY.TOKEN] = '';
        return res.send(reply).end;
    })
};


exports.test = function (req, res) {
    var saloonName = '';
    var saloonType = '';
    var averageRating = 0;
    var day = '';
    var openNow = req.body.openNow;
    if (req.body.openNow == true) {
        var d = new Date();
        var n = d.getDay();
        if (n == 0) {
            day = 'Sun'

        } else if (n == 1) {
            day = 'Mon'
        } else if (n == 2) {
            day = 'Tue'
        } else if (n == 3) {
            day = 'Wed'
        } else if (n == 4) {
            day = 'Thu';
        } else if (n == 5) {
            day = 'Fri'
        } else if (n == 6) {
            day = 'Sat'
        }
    }
   
    if (req.body.itemId) {
     var itemId = JSON.parse(JSON.stringify(req.body.itemId));
    }
    if (req.body.day) {
        day = req.body.day;
    }
    if (req.body.saloonName) {
        saloonName = req.body.saloonName;
    }
    if (req.body.saloonType) {
        saloonType = req.body.saloonType;
    }
  
    if (req.body.averageRating) {
        averageRating = req.body.averageRating;
      
    }
   
    var array = [];
    array[0] = req.body.longitude;
    array[1] = req.body.latitude;
    var maxDistance = Constant.DISTANCE.Limit / Constant.DISTANCE.EARTH_RADIUS;
    var no = parseInt(req.body.pageNo);

    if (req.body.sortBy == "averageRating") {
     Salon.find({
            saloonName: new RegExp(saloonName, "i"),
            saloonType: new RegExp(saloonType),
           location: {
                 $near: array,
                 $maxDistance: maxDistance
         },
            averageRating: {
                  $gte: averageRating
             },
              "scheduleTiming.day": new RegExp(day, "i"),
              "scheduleTiming.open": {
                  $ne: null
              },
           
        }).sort({
            averageRating: -1
        }).limit(Constant.PAGE_LIMIT.size).skip(Constant.PAGE_LIMIT.size * no).exec(function (err, sal) {
            saloonCount(saloonName, saloonType, averageRating, day, array, maxDistance, function (count) {
            SEND_DETAILS(res, sal, count);
               })
        })
    }
    if (req.body.sortBy == "location") {
       
        Salon.find({
            saloonName: new RegExp(saloonName, "i"),
            saloonType: new RegExp(saloonType),
            averageRating: {
                $gte:averageRating
            },
            location: {
                $near: array,
                $maxDistance: maxDistance

             },
            "scheduleTiming.day": new RegExp(day, "i"),
            "scheduleTiming.open": {
                $ne: null
            },
          
        
        }).sort({
            location:1
        }).limit(Constant.PAGE_LIMIT.size).skip(Constant.PAGE_LIMIT.size * no).exec(function (err, sal) {
            saloonCount(saloonName, saloonType, averageRating, day, array, maxDistance, function (count) {
                SEND_DETAILS(res, sal, count);
            })
        })
    }
    if (req.body.sortBy == 'popularity' || !req.body.sortBy) {
        Salon.find({
            saloonName: new RegExp(saloonName, "i"),
            saloonType: new RegExp(saloonType),
            averageRating: {
                $gte: averageRating
            },
            location: {
                $near: array,
                $maxDistance: maxDistance

            },
            "scheduleTiming.day": new RegExp(day, "i"),
            "scheduleTiming.open": {
                $ne: null
            },
        
        }).sort({
            noOfViews: -1
        }).limit(Constant.PAGE_LIMIT.size).skip(Constant.PAGE_LIMIT.size * no).exec(function (err, sal) {
            saloonCount(saloonName, saloonType, averageRating, day, array, maxDistance, function (count) {
                SEND_DETAILS(res, sal, count);
            })
        })
    }
    if (req.body.sortBy == 'services') {
        saloonService.find({
            "rateCard.itemId": {
                $in: itemId
            }
        }, function (err, saloon) {
            var saloons = [];
            for (var i = 0; i < saloon.length; i++) {
                saloons.push(saloon[i].saloonId)
            }
            Salon.find({
                saloonId: {
                    $in: saloons
                },
                saloonName: new RegExp(saloonName, "i"),
                saloonType: new RegExp(saloonType),
                averageRating: {
                    $gte: averageRating
                },
                location: {
                    $near: array,
                    $maxDistance: maxDistance

                },
                "scheduleTiming.day": new RegExp(day, "i"),
                "scheduleTiming.open": {
                    $ne: null
                }}).sort({
                noOfViews: -1
            }).limit(Constant.PAGE_LIMIT.size).skip(Constant.PAGE_LIMIT.size * no).exec(function (err, sal) {
                saloonCount(saloonName, saloonType, averageRating, day, homeService, array, maxDistance, function (count) {
                    SEND_DETAILS(res, sal, count);
                })
            })
        })
    }

};

exports.GET_SALOON_INFO = function (req, res) {

    var array = [];
    var info = [];
    var salInfo = {};
    Salon.findOne({
        saloonId: req.params.saloonId
    }, function (err, sal) {
        if (sal) {
            info.push(sal);
            salInfo.SaloonInformation = sal;
        } else {
            info.push('does not exist');
            salInfo.SaloonInformation = "does not exist"
        }
        SEND_INFORMATION(info, res, salInfo);
    });



    ReviewInfo.find({
        saloonId: req.params.saloonId,
        rating: {
            $gt: 3
        }
    }, {
        review: 1
    }, function (err, rev) {


        for (var i = 0; i < rev.length; i++) {
            info.push(rev);
            if (info.length == 5) {
                break;
            }
        }
        salInfo.reviewList = rev;
        SEND_INFORMATION(info, res, salInfo);
    });


    SaloonOffers.find({
        saloonId: req.params.saloonId
    }, function (err, salonOffer) {
        if (salonOffer) {
            info.push(salonOffer);
            salInfo.saloonOffers = salonOffer
        } else {

            info.push('does not exist');
            salInfo.saloonOffers = 'does not exist';
        }
        SEND_INFORMATION(info, res, salInfo);
    })

};

function SEND_INFORMATION(info, res, salInfo) {

    if (info.length == 4) {
        reply[Constant.REPLY.MESSAGE] = Messages.success;
        reply[Constant.REPLY.DATA] = salInfo;
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
        reply[Constant.REPLY.TOKEN] = '';
        return res.send(reply).end;
    }
}
exports.FIND_SALON_SERVICES = function (req, res) {

    var service = (req.body.service + "").split("@");
    Salon.find({
        "services.service": {
            $in: service
        }
    }, function (err, sal) {
        if (sal) {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = sal;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }
    })
};

function SEND_DETAILS(res, sal, count) {
    if (sal) {
        reply[Constant.REPLY.MESSAGE] = Messages.success;
        reply[Constant.REPLY.DATA] = sal;
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
        reply[Constant.REPLY.TOKEN] = '';
        reply[Constant.REPLY.COUNT] = count;
        return res.send(reply).end;
    } else {
        reply[Constant.REPLY.MESSAGE] = Messages.notFound;
        reply[Constant.REPLY.DATA] = null;
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
        reply[Constant.REPLY.TOKEN] = '';
        return res.send(reply).end;
    }
}


exports.NEAR_BY_SALOON = function (req, res) {
    var maxDistance = Constant.NEAR_BUY_LIMIT.Limit / Constant.DISTANCE.EARTH_RADIUS;
    var array = [];
    array[0] = req.body.longitude;
    array[1] = req.body.latitude;
   Salon.find({
        location: {
            $near: array,
            $minDistance: 0,
            $maxDistance: maxDistance
        },
        validTo: {
            $gt: Date.now()
        }
    }).sort({
        location: 1,
        planType: -1
    }).limit(4).exec(function (err, sal) {
       if (sal && sal.length == 4) {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = sal;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            var sortLimit = 4 - sal.length;
            Salon.find({
                location: {
                    $near: array,
                    $maxDistance: maxDistance

                }
            }).limit(sortLimit).exec(function (err, sals) {
                var saloons = sal.concat(sals);
                reply[Constant.REPLY.MESSAGE] = Messages.success;
                reply[Constant.REPLY.DATA] = saloons;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
            })
        }


    })

};

exports.DEALS_OFFERS_PACKAGES = function (req, res) {


    var date = new Date();

    SaloonOffers.find({
        validTo: {
            $gte: date
        },
        validFrom: {
            $lte: date
        }
    }).limit(6).exec(function (err, sal) {
        if (sal) {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = sal;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }

    });
};

exports.BUDGET_SALOON = function (req, res) {
    var maxDistance = Constant.DISTANCE.Limit / Constant.DISTANCE.EARTH_RADIUS;
    var array = [];
    array[0] = req.body.longitude;
    array[1] = req.body.latitude;
    var saloon = [];

    Salon.find({
        location: {
            $near: array,
            $maxDistance: maxDistance
        },
        salonCat: {
            $eq: 2
        }
    }).sort({
        planType: -1,
        location: 1
    }).limit(4).exec(function (err, sal) {
        if (sal) {
            for (var i = 0; i < sal.length; i++) {
                saloon.push(sal[i].saloonId);
            }

            Salon.find({
                saloonId: {
                    $in: saloon
                }
            }, function (err, saloons) {
                reply[Constant.REPLY.MESSAGE] = Messages.success;
                reply[Constant.REPLY.DATA] = saloons;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
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

    });
};
exports.LUXURY_SALOONS = function (req, res) {
    var maxDistance = Constant.NEAR_BUY_LIMIT.Limit / Constant.DISTANCE.EARTH_RADIUS;
    var array = [];
    array[0] = req.body.longitude;
    array[1] = req.body.latitude;
    var date = new Date();
    var saloons = [];
    Salon.find({
        location: {
            $near: array,
            $maxDistance: maxDistance

        },
        salonCat: {
            $eq: 1
        }
    }).
    sort({
        planType: -1,
        location: 1
    }).exec(function (err, sal) {
        if (sal) {
            for (var i = 0; i < sal.length; i++) {
                saloons.push(sal[i].saloonId);
            }

            Salon.find({
                saloonId: {
                    $in: saloons
                }
            }).limit(4).exec(function (err, saloons) {
                Salon.find({
                    saloonId: {
                        $in: saloons
                    }
                }).count().exec(function (err, c) {

                    reply[Constant.REPLY.MESSAGE] = Messages.success;
                    reply[Constant.REPLY.DATA] = saloons;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                    reply[Constant.REPLY.TOKEN] = '';
                    reply[Constant.REPLY.COUNT] = c;
                    return res.send(reply).end;
                })
            });

        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }

    });
};
exports.SALOON_AT_HOME = function (req, res) {
    var maxDistance = Constant.DISTANCE.Limit / Constant.DISTANCE.EARTH_RADIUS;
    var array = [];
    array[0] = req.body.longitude;
    array[1] = req.body.latitude;

    Salon.find({
        homeService: {
            $in: [Constant.homeService.both, Constant.homeService.only]
        },
        location: {
            $near: array,
            $maxDistance: maxDistance

        }
    }).sort({
        noOfViews: -1
    }).limit(6).exec(function (err, sal) {
        if (sal) {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = sal;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }


    })


};

exports.ACTIVE_COUPON = function (req, res) {



    Coupon.find({
        saloonId: req.params.saloonId,
        validTo: {
            $gt: Date.now()
        }
    }, function (err, coupon) {
        if (coupon) {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = coupon;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;

        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }


    })


};

exports.TOTAL_PENDING_APPOINTMENT = function (req, res) {

    BookingAppointment.find({
        bookingStatus: Constant.BOOKING_STATUS.Pending,
        saloonId: req.params.saloonId
    }).sort({
        bookingDateAndTime: -1
    }).exec(function (err, bookings) {
        if (bookings) {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = bookings;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;

        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }


    })
};

exports.TOTAL_UPCOMING_APPOINTMENT = function (req, res) {

    BookingAppointment.find({
        bookingStatus: Constant.BOOKING_STATUS.Approved,
        saloonId: req.params.saloonId
    }, function (err, bookings) {
        if (bookings) {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = bookings;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;

        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }


    })
};

exports.GET_ALL_BANNERS = function (req, res) {

    Banners.find({}, function (err, banners) {
        if (banners) {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = banners;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;

        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }


    })

}

exports.SALOON_ACTIVE_COUPON_DEALS = function (req, res) {

    var saloonId = req.params.saloonId;
    var arr = [];
    var ob = {};
    var date = new Date().toLocaleDateString();

    Coupon.find({
        $or: [{
            saloonId: req.params.saloonId,
            validTo: {
                $gte: date
            }
        }, {
            saloonId: null,
            validTo: {
                $gte: date
            }
        }]
    }, function (err, coupon) {
        if (coupon) {
            ob.coupons = coupon;
            arr.push(coupon);
            if (arr.length == 2) {
                reply[Constant.REPLY.MESSAGE] = Messages.success;
                reply[Constant.REPLY.DATA] = ob;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
            }
        } else {
            if (arr.length == 2) {

                reply[Constant.REPLY.MESSAGE] = Messages.notFound;
                reply[Constant.REPLY.DATA] = ob;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
            }
        }


    });

    DayDeal.find({
        saloonId: req.params.saloonId,
        validTo: {
            $gte: date
        }
    }, function (err, deal) {
        if (deal) {
            arr.push(deal);
            ob.deals = deal;
            if (arr.length == 2) {
                reply[Constant.REPLY.MESSAGE] = Messages.success;
                reply[Constant.REPLY.DATA] = ob;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
            }
        } else {
            if (arr.length == 2) {

                reply[Constant.REPLY.MESSAGE] = Messages.notFound;
                reply[Constant.REPLY.DATA] = null;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
            }
        }

    })
};

exports.ACTIVE_COUPON_DEALS = function (req, res) {
    var maxDistance = Constant.DISTANCE.Limit / Constant.DISTANCE.EARTH_RADIUS;
    var array = [];
    array[0] = req.body.longitude;
    array[1] = req.body.latitude;
    var arr = [];
    var ob = {};
    Coupon.find({
        location: {
            $near: array,
            $maxDistance: maxDistance

        },
        validTo: {
            $gte: Date.now()
        }
    }, function (err, coupon) {
        if (coupon) {
            ob.coupons = coupon;
            arr.push(coupon);
            if (arr.length == 2) {
                reply[Constant.REPLY.MESSAGE] = Messages.success;
                reply[Constant.REPLY.DATA] = ob;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
            }
        } else {
            arr.push(coupon);
            if (arr.length == 2) {

                reply[Constant.REPLY.MESSAGE] = Messages.notFound;
                reply[Constant.REPLY.DATA] = ob;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
            }
        }


    });

    DayDeal.find({
        location: {
            $near: array,
            $maxDistance: maxDistance

        },
        validTo: {
            $gte: Date.now()
        }
    }, function (err, deal) {
        if (deal) {
            arr.push(deal);
            ob.deals = deal;
            if (arr.length == 2) {
                reply[Constant.REPLY.MESSAGE] = Messages.success;
                reply[Constant.REPLY.DATA] = ob;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
            }
        } else {
            arr.push(deal);
            if (arr.length == 2) {
                reply[Constant.REPLY.MESSAGE] = Messages.notFound;
                reply[Constant.REPLY.DATA] = null;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
            }
        }

    })
};

exports.FIND_DEALS = function (req, res) {
    var array = [];
    array[0] = req.body.longitude;
    array[1] = req.body.latitude;
    var date = new Date();
    var maxDistance = Constant.DISTANCE.Limit / Constant.DISTANCE.EARTH_RADIUS;

    DayDeal.find({
        location: {
            $near: array,
            $maxDistance: maxDistance

        },
        validTo: {
            $gte: date
        }
    }).sort({
        discountAmount: -1,
        validTo: 1
    }).limit(15).exec(function (err, deals) {
        if (deals) {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = deals;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;


        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }
    });


};

exports.FIND_SCREEN_BANNERS = function (req, res) {
    var array = [];
    array[0] = req.body.longitude;
    array[1] = req.body.latitude;
    screen = req.body.screens;
    var date = new Date();
    var maxDistance = Constant.DISTANCE.Limit / Constant.DISTANCE.EARTH_RADIUS;
    if (array[0] == 0 && array[1] == 0) {
            Banners.find({bannerCat: 1,screens:screen}, function (req, banners) {
            if (banners) {

                reply[Constant.REPLY.MESSAGE] = Messages.success;
                reply[Constant.REPLY.DATA] = banners;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
    } else {
                reply[Constant.REPLY.MESSAGE] = Messages.notFound;
                reply[Constant.REPLY.DATA] = null;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
            }
        })
    } else {
            Banners.find({
            location: {
            $near: array,
            $maxDistance: maxDistance
            },
            screens: req.body.screens}, function (req, banners) {
            Banners.find({bannerCat: 1,screens:screen}, function (req, banner) {
            banners = banners.concat(banner)
    if (banners) {
                    reply[Constant.REPLY.MESSAGE] = Messages.success;
                    reply[Constant.REPLY.DATA] = banners;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                    reply[Constant.REPLY.TOKEN] = '';
                    return res.send(reply).end;

                } else {
                    reply[Constant.REPLY.MESSAGE] = Messages.notFound;
                    reply[Constant.REPLY.DATA] = null;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                    reply[Constant.REPLY.TOKEN] = '';
                    return res.send(reply).end;
                }
            })
        })
    }


};

exports.GET_HOME_PAGE_PACKAGE = function (req, res) {
    var maxDistance = Constant.DISTANCE.Limit / Constant.DISTANCE.EARTH_RADIUS;
    var array = [];
    array[0] = req.body.longitude;
    array[1] = req.body.latitude;

    saloonService.find({
        location: {
            $near: array,
            $maxDistance: maxDistance

        },
        "packages.isValid": Constant.packageValid.Yes
    }, {
        "packages.$": 1,
        saloonId: 1,
        saloonName:1
    }).sort({
        location: 1
    }).limit(10).exec(function (err, pack) {

        if (!err) {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = pack;
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
    })
};
exports.getOffers = function(req,res){
    var maxDistance = Constant.DISTANCE.Limit / Constant.DISTANCE.EARTH_RADIUS;
    var array = [];
    array[0] = req.body.longitude;
    array[1] = req.body.latitude;
   

    Offer.find({
        location: {
            $near: array,
            $maxDistance: maxDistance

        }}).sort({
        location: 1
    }).limit(10).exec(function (err, offer) {

        if (!err) {
            RateVariable.findOne({},function(err,rat) {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = offer;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            reply[Constant.REPLY.Rate]= rat;
            return res.send(reply).end;
            })
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }
    })
};
exports.GET_ALL_OFFER = function(req,res){
    var maxDistance = Constant.DISTANCE.Limit / Constant.DISTANCE.EARTH_RADIUS;
    var array = [];
    array[0] = req.body.longitude;
    array[1] = req.body.latitude;
    var no = parseInt(req.body.pageNo);
    Offer.find({
        location: {
            $near: array,
            $maxDistance: maxDistance
        }}).sort({
        location: 1
    }).limit(Constant.PAGE_LIMIT.size).skip(Constant.PAGE_LIMIT.size * no).exec(function (err, offer) {
     Offer.find({
            location: {
                $near: array,
                $maxDistance: maxDistance
            }}).count().exec(function (err, c) {
                RateVariable.findOne({},function(err,rat) {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = offer;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            reply[Constant.REPLY.COUNT] = c;
            reply[Constant.REPLY.Rate]= rat;
            return res.send(reply).end;
                })
        })

    })
}

exports.GET_ALL_PACKAGES = function (req, res) {
    var maxDistance = Constant.DISTANCE.Limit / Constant.DISTANCE.EARTH_RADIUS;
    var array = [];
    array[0] = req.body.longitude;
    array[1] = req.body.latitude;
    var no = parseInt(req.body.pageNo);
    saloonService.find({
        location: {
            $near: array,
            $maxDistance: maxDistance

        },
        "packages.isValid": Constant.packageValid.Yes
    }, {
        "packages.$": 1,
        saloonId: 1
    }).sort({
        location: 1
    }).limit(Constant.PAGE_LIMIT.size).skip(Constant.PAGE_LIMIT.size * no).exec(function (err, pack) {


        saloonService.find({
            location: {
                $near: array,
                $maxDistance: maxDistance
            },
            "packages.isValid": Constant.packageValid.Yes
        }).count().exec(function (err, c) {


            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = pack;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            reply[Constant.REPLY.COUNT] = c;
            return res.send(reply).end;
        })

    })
};



exports.GET_ALL_DEALS = function (req, res) {
    var array = [];
    array[0] = req.body.longitude;
    array[1] = req.body.latitude;
    var date = new Date();
    var maxDistance = Constant.DISTANCE.Limit / Constant.DISTANCE.EARTH_RADIUS;

    DayDeal.find({
        location: {
            $near: array,
            $maxDistance: maxDistance

        },
        validTo: {
            $gte: date
        }
    }).sort({
        discountAmount: -1,
        validTo: 1
    }).limit(Constant.PAGE_LIMIT.size).exec(function (err, deals) {

        DayDeal.find({
            location: {
                $near: array,
                $maxDistance: maxDistance
            },
            validTo: {
                $gte: date
            }
        }).count().exec(function (err, c) {


            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = deals;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            reply[Constant.REPLY.COUNT] = c;
            return res.send(reply).end;
        })

    });


};
exports.ALL_BUDGET_SALOON = function (req, res) {
    var maxDistance = Constant.DISTANCE.Limit / Constant.DISTANCE.EARTH_RADIUS;
    var array = [];
    array[0] = req.body.longitude;
    array[1] = req.body.latitude;
    var saloons = [];



    Salon.find({
        location: {
            $near: array,
            $maxDistance: maxDistance

        },
        salonCat: {
            $eq: 2
        }
    }).
    sort({
        planType: -1,
        location: 1
    }).exec(function (err, sal) {
        if (sal) {
            for (var i = 0; i < sal.length; i++) {
                saloons.push(sal[i].saloonId);
            }

            Salon.find({
                saloonId: {
                    $in: saloons
                }
            }).limit(Constant.PAGE_LIMIT.size).exec(function (err, saloons) {
                Salon.find({
                    saloonId: {
                        $in: saloons
                    }
                }).count().exec(function (err, c) {

                    reply[Constant.REPLY.MESSAGE] = Messages.success;
                    reply[Constant.REPLY.DATA] = saloons;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                    reply[Constant.REPLY.TOKEN] = '';
                    reply[Constant.REPLY.COUNT] = c;
                    return res.send(reply).end;
                })
            });

        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }

    });
};

exports.ALL_LUXURY_SALOONS = function (req, res) {
    var maxDistance = Constant.NEAR_BUY_LIMIT.Limit / Constant.DISTANCE.EARTH_RADIUS;
    var array = [];
    array[0] = req.body.longitude;
    array[1] = req.body.latitude;
    var date = new Date();
    var saloons = [];

    Salon.find({
        location: {
            $near: array,
            $maxDistance: maxDistance

        },
        salonCat: {
            $eq: 1
        }
    }).sort({
        planType: -1,
        location: 1
    }).exec(function (err, sal) {
        if (sal) {
            for (var i = 0; i < sal.length; i++) {
                saloons.push(sal[i].saloonId);

            }
            Salon.find({
                saloonId: {
                    $in: saloons
                }
            }).limit(Constant.PAGE_LIMIT.size).exec(function (err, saloons) {
                Salon.find({
                    saloonId: {
                        $in: saloons
                    }
                }).count().exec(function (err, c) {


                    reply[Constant.REPLY.MESSAGE] = Messages.success;
                    reply[Constant.REPLY.DATA] = saloons;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                    reply[Constant.REPLY.TOKEN] = '';
                    reply[Constant.REPLY.COUNT] = c;
                    return res.send(reply).end;
                })
            });
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }

    });

};

exports.GET_BANNER_TYPE_SALOON = function (req, res) {
    var array = [];
    array[0] = req.body.longitude;
    array[1] = req.body.latitude;
    var maxDistance = Constant.DISTANCE.Limit / Constant.DISTANCE.EARTH_RADIUS;
    var saloon = [];
    Banners.find({
        $or: [{
            location: {
                $near: array,
                $maxDistance: maxDistance

            },
            bannerType: req.body.bannerType
        }, {
            location: {
                $near: array,
                $maxDistance: maxDistance

            },
            bannerType: req.body.bannerType
        }]
    }, function (err, ban) {
        if (ban) {
            for (var i = 0; i < ban.length; i++) {
                saloon.push(ban[i].saloonId);
            }

            Salon.find({
                saloonId: {
                    $in: saloon
                }
            }, {
                saloonName: 1,
                mobileNumber: 1,
                address: 1,
                frontPageUrl: 1,
                salonTopPhotosUrl: 1
            }).sort({
                location: 1
            }).exec(function (err, sal) {
                if (!err) {
                    reply[Constant.REPLY.MESSAGE] = Messages.success;
                    reply[Constant.REPLY.DATA] = sal;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                    reply[Constant.REPLY.TOKEN] = '';
                    return res.send(reply).end;
                } else {
                    reply[Constant.REPLY.MESSAGE] = Messages.notFound;
                    reply[Constant.REPLY.DATA] = null;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                    reply[Constant.REPLY.TOKEN] = '';
                    return res.send(reply).end;
                }


            });
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }
    })


};

exports.INSERT_PACKAGE_COUPON_APPLIED = function (req, res) {

    var couponApplied = (req.body.couponApplied + "").split("@");
    var packageUsed = JSON.parse(JSON.stringify(req.body.packageUsed));
    var packCoupApplied = new packageCouponApplied({
        userId: req.body.userId,
        phoneNumber: req.body.phoneNumber,
        couponApplied: couponApplied,
        packageUsed: packageUsed
    });
    packCoupApplied.save(function (err, data) {
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;

        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = data;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;

        }
    })
}
exports.USER_COUPON_VALID = function (req, res) {
    var count =1;
    Coupon.findOne({
        couponCode: req.body.couponCode,
         validTo: {
            $gte: Date.now()
        }
    }, function (err, coupon) {
        
      if (!coupon) {
            DayDeal.findOne({
                dealCode: req.body.couponCode,
                validTo: {
                    $gte: Date.now()
                }
            }, function (err, deal) {
                reply[Constant.REPLY.MESSAGE] = Messages.success;
                reply[Constant.REPLY.DATA] = deal;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end
            })
        } else {
            console.log(req.body)
        packageCouponApplied.find({
            phoneNumber:req.body.phoneNumber,
              couponCode:req.body.couponApplied
            }).exec(function(err,coup){
                if (!coup) {
                     reply[Constant.REPLY.MESSAGE] = Messages.success;
                     reply[Constant.REPLY.DATA] = coupon;
                     reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                     reply[Constant.REPLY.TOKEN] = '';
                     return res.send(reply).end;
                 } else{
                     if(coup){
                 coup.forEach(function(element){
                    if (element.couponApplied[0] == req.body.couponCode) {
                        count++
                    }
  
                 })
                if (count > coupon.usageCount) {
                    console.log("if"+count);
                             reply[Constant.REPLY.MESSAGE] = Messages.CouponCanNotBeUsed;
                             reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                             return res.send(reply).end;
                            } 
                        else {
                            console.log("else"+count);
                            // reply[Constant.REPLY.MESSAGE] = Messages.success;
                            // reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                        reply[Constant.REPLY.DATA] = coup;
                        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                        reply[Constant.REPLY.TOKEN] = '';
                        return res.send(reply).end;

                        }
                      

                    } 

                }

            })

        }

    })
};


exports.GET_MY_CASH = function (req, res) {
    MyCash.find({
        userId: req.params.userId
    }, function (err, cash) {
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


exports.VALID_BOOKING_FEATURE = function (req, res) {
    var maxDistance = Constant.NEAR_BUY_LIMIT.Limit / Constant.DISTANCE.EARTH_RADIUS;
    var array = [];
    array[0] = req.body.longitude;
    array[1] = req.body.latitude;
    var no = req.body.pageNo;
    Salon.find({
        planType: {
            $in: [1, 2, 3]
        },
        location: {
            $near: array,
            $maxDistance: maxDistance

        },
        validTo: {
            $gt: Date.now()
        }
    }).sort({
        planType: -1,
        location: 1
    }).limit(Constant.PAGE_LIMIT.size).skip(Constant.PAGE_LIMIT.size * no).exec(function (err, results) {
        if (err) {
            console.log(err);
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;


        } else {
            Salon.find({
                planType: {
                    $in: [1, 2, 3]
                },
                location: {

                    $near: array,
                    $maxDistance: maxDistance

                }
            }).count().exec(function (err, count) {
                
                reply[Constant.REPLY.MESSAGE] = Messages.success;
                reply[Constant.REPLY.DATA] = results;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                reply[Constant.REPLY.TOKEN] = '';
                reply[Constant.REPLY.COUNT] = count;
                return res.send(reply).end;

            })

        }

    })


};

exports.MY_FAVORITE_SALOON = function (req, res) {

    MyFavoriteSaloon.findOne({
        userId: req.body.userId
    }, function (err, fav) {

        if (!fav) {
            var favoriteSaloon = new MyFavoriteSaloon({
                userId: req.body.userId,
                saloonId: req.body.saloonId

            });
            favoriteSaloon.save({}, function (err) {
                if (err) {
                    reply[Constant.REPLY.MESSAGE] = Messages.notFound;
                    reply[Constant.REPLY.DATA] = null;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                    reply[Constant.REPLY.TOKEN] = '';
                    return res.send(reply).end;
                } else {
                    reply[Constant.REPLY.MESSAGE] = Messages.success;
                    reply[Constant.REPLY.DATA] = null;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                    reply[Constant.REPLY.TOKEN] = '';
                    return res.send(reply).end
                }

            })
        } else {
            MyFavoriteSaloon.findOneAndUpdate({
                userId: req.body.userId
            }, {
                $push: {
                    saloonId: req.body.saloonId
                }
            }, function (err) {
                if (err) {
                    reply[Constant.REPLY.MESSAGE] = Messages.notFound;
                    reply[Constant.REPLY.DATA] = null;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                    reply[Constant.REPLY.TOKEN] = '';
                    return res.send(reply).end;
                } else {
                    reply[Constant.REPLY.MESSAGE] = Messages.success;
                    reply[Constant.REPLY.DATA] = null;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                    reply[Constant.REPLY.TOKEN] = '';
                    return res.send(reply).end

                }


            })
        }
    })
};

function saloonCount(saloonName, saloonType, averageRating, day,  array, maxDistance, callback) {
    Salon.find({
        saloonName: new RegExp(saloonName, "i"),
        saloonType: new RegExp(saloonType), //
        averageRating: {
            $gte: averageRating
        },
        location: {
            $near: array,
            $maxDistance: maxDistance

        },
        "scheduleTiming.day": new RegExp(day, "i"),
        "scheduleTiming.open": {
            $ne: null
        }}).count().exec(function (err, count) {
        return callback(count);
    })
};


exports.REMOVE_FAVORITE_SALOON = function (req, res) {

    MyFavoriteSaloon.findOneAndUpdate({
        userId: req.body.userId
    }, {
        $pull: {
            saloonId: req.body.saloonId
        }
    }, function (err, sal) {
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end

        }



    })

};

exports.IS_FAVOURITE_SALOON = function (req, res) {

    MyFavoriteSaloon.findOne({
        userId: req.body.userId,
        saloonId: req.body.saloonId
    }, function (err, fav) {
        if (!fav || err) {
            if (err) {
                reply[Constant.REPLY.MESSAGE] = Messages.Error;
            } else {
                reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            }
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end

        }
    })

};
exports.Fetch_All_Favorite_Saloon = function (req, res) {

    MyFavoriteSaloon.findOne({
        userId: req.params.userId
    }, {
        saloonId: 1
    }, function (err, sal) {
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            console.log("length is", sal.saloonId.length);
            var saloon = [];
            for (var i = 0; i < sal.saloonId.length; i++) {

                saloon.push(sal.saloonId[i])
                console.log(saloon);
            }

            Salon.find({
                saloonId: {
                    $in: saloon
                }
            }, function (err, saloons) {
                reply[Constant.REPLY.MESSAGE] = Messages.success;
                reply[Constant.REPLY.DATA] = saloons;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end
            })

        }

    })
};

exports.VIEW_ALL_BOOKING_APPOINTMENT = function (req, res) {

    BookingAppointment.find({
            customerId: req.params.customerId
        }).sort({
            bookingDateAndTime: -1
        })
        .exec(function (err, bookings) {
            if (err) {
                reply[Constant.REPLY.MESSAGE] = Messages.notFound;
                reply[Constant.REPLY.DATA] = null;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
            } else {
                reply[Constant.REPLY.MESSAGE] = Messages.success;
                reply[Constant.REPLY.DATA] = bookings;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end

            }


        });

}

exports.GET_PLATINUM_SALOON = function (req, res) {
    var maxDistance = Constant.NEAR_BUY_LIMIT.Limit / Constant.DISTANCE.EARTH_RADIUS;
    var array = [];
    var date = new Date();
    array[0] = req.body.longitude;
    array[1] = req.body.latitude;
    Salon.find({
        planType: 3,
        location: {
            $near: array,
            $minDistance: 0,
            $maxDistance: maxDistance

        },
        validTo: {
            $gte: date
        }
    }).sort({
        location: 1
    }).exec(function (err, sal) {
        if (err) {
            reply[Constant.REPLY.MESSAGE] = Messages.notFound;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = sal;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end
        }
    })

}