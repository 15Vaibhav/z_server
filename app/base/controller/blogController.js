var Blog = require('../models/blogs');
var Constant = require('../../common/constant');
var Messages = require('../../common/message');
var reply = {}
exports.POST_BLOGS =  function(req,res){
    var str = "P";
    var d = str.concat(Date.now());
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    if(dd<10) {
        dd = '0'+dd;
    } 
    if(mm<10) {
        mm = '0'+mm;
    } 
    
    today = + dd + '/' +mm  + '/' + yyyy;
 
   var blog = new Blog({
        blogId:d,
        postTitle:req.body.postTitle,
        name:req.body.name,
        detailedPost:req.body.detailedPost,

        date: today,
        email:req.body.email
    })
    blog.save({},function(err,result){
        if(err){
            console.log('the err:', err)
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }else{
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = d;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }
    })
},
exports.GET_ALL_BLOGS=function(req,res){
    Blog.find({},function(err,result){
        if(err){
            console.log('the err:', err)
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
}
