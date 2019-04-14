var Product = require('../models/product')
var Constant = require('../../common/constant');
var Messages = require('../../common/message');
var PaymentDetails = require('../models/purchase');
var reply ={};

exports.ADD_PRODUCTS = function(req,res){
Product.count({},function(err,count){
var c = count+1;
var str = "P";
var d = str.concat(c);
var product = new Product({
    productId:d,
    productName:req.body.productName,
    productDescription:req.body.productDescription,
    offlinePrice:req.body.offlinePrice,
    onlinePrice:req.body.onlinePrice,
    qty:req.body.qty,
    categories:req.body.categories

})
product.save({},function(err){
    if (err) {
        console.log(err)
       reply[Constant.REPLY.DATA] = "";
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
        reply[Constant.REPLY.TOKEN] = '';
        return res.send(reply).end;
    } else {
        reply[Constant.REPLY.DATA] = d;
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
        reply[Constant.REPLY.TOKEN] = '';
        return res.send(reply).end;
    }
})
})
},

exports.GET_ALL_PRODUCTS = function(req,res){
     Product.find({},function(err,products){
         reply[Constant.REPLY.DATA] = products;
         reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
         reply[Constant.REPLY.TOKEN] = '';
         return res.send(reply).end;
         

    })
},
exports.UPDATE_PRODUCT = function(req,res){
Product.update({productId:req.body.productId},{
    productName:req.body.productName,
    productDescription:req.body.productDescription,
    offlinePrice:req.body.offlinePrice,
    onlinePrice:req.body.onlinePrice,
    qty:req.body.qty,
    categories:req.body.categories     
     },function(err,result){
  if(err){
      console.log(err)
} 
else{
    console.log("updated.............")
    reply[Constant.REPLY.MESSAGE] = Messages.success;
    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
    reply[Constant.REPLY.TOKEN] = '';
    return res.send(reply).end;
}
})
},
exports.BUY_PRODUCTS = function(req,res){
    var str = "P";
    var d = str.concat(Date.now()); 
    var date = new Date();
    var o = "O";
    var od =o.concat(Date.now());
var paymentdetails = new  PaymentDetails({
        buyerId:req.body.saloonId,
        paymentId:d,
        dateTime: date,
        buyerName:req.body.saloonName,
        orderId:od,
        taxApplied:req.body.taxApplied,
        address:req.body.address,
        ammoutRecieved:req.body.totalAmountToPay,
        discoutedAmount:req.body.discoutedAmount,
        bookingStatus:req.body.bookingStatus,
        productList:req.body.productList

    })
       paymentdetails.save({},function(err,result){
           console.log("result.................."+result);
        if (err) {
            console.log(err)
           reply[Constant.REPLY.DATA] = "";
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        } else {
            //reply[Constant.REPLY.DATA] = 
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }

       })
     },
     exports.CANCEL_PRODUCT = function(req,res){
        var date = new Date(req.body.bookingDateAndTime);
        var dt = new Date();
        var diff = ( dt.getTime()-date.getTime())/(1000 * 3600);

        if(diff<=Constant.Constraints.Booking_Cancelled_Time){
            PaymentDetails.update({orderId:req.body.orderId},{bookingStatus:Constant.INVENTORY.Cancelled},function(err,result){
                if(err){
                    console.log('the err:', err)
                    reply[Constant.REPLY.MESSAGE] = Messages.Error;
                    reply[Constant.REPLY.DATA] = null;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                    reply[Constant.REPLY.TOKEN] = '';
                    return res.send(reply).end;
                }else{
                    reply[Constant.REPLY.MESSAGE] = Messages.success;
                    reply[Constant.REPLY.DATA] = null;
                    reply[Constant.REPLY.RESULT_CODE] = Constant.INVENTORY.Cancelled;
                    reply[Constant.REPLY.TOKEN] = '';
                    return res.send(reply).end;
                }
            })
        }else{
            reply[Constant.REPLY.MESSAGE] = "Booking Cannot Be Cancelled at this time";
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.INVENTORY.Not_Allowed;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }
    
    },
    exports.GET_ORDERS = function(req,res){
        PaymentDetails.find({buyerId:req.params.saloonId},function(err,orders){
            if (err) {
                console.log(err)
               reply[Constant.REPLY.DATA] = "";
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
            } else {
                console.log(orders)
                reply[Constant.REPLY.DATA] = orders;
                reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
                reply[Constant.REPLY.TOKEN] = '';
                return res.send(reply).end;
            }
    
        })

    }