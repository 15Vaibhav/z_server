var artistInformation = require("../models/Artist");
var Constant = require('../../common/constant');
var Messages = require('../../common/message');
var reply = {};

exports.GET_ARTIST = function(req,res){
artistInformation.find({},function(err,result){
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
exports.FIND_ARTIST = (req,res)=>{
artistInformation.find({artistName: new RegExp(req.body.artistName,'i')}).select({
    artistId: 1, artistName: 1,
    artistNumber: 1, address: 1, _id: 0
}).exec(function(err,artist){
    if(err){
        console.log('the err:', err)
        reply[Constant.REPLY.MESSAGE] = Messages.Error;
        reply[Constant.REPLY.DATA] = null;
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
        reply[Constant.REPLY.TOKEN] = '';
        return res.send(reply).end;
    }else{
        reply[Constant.REPLY.MESSAGE] = Messages.success;
        reply[Constant.REPLY.DATA] = artist;
        reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
        reply[Constant.REPLY.TOKEN] = '';
        return res.send(reply).end;
    }
})
}
exports.FIND_ARTIST_BY_ID = (req,res)=>{
    artistInformation.find({artistId:req.body.artistId},(err,artist)=>{
        if(err){
            console.log('the err:', err)
            reply[Constant.REPLY.MESSAGE] = Messages.Error;
            reply[Constant.REPLY.DATA] = null;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Error;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }else{
            reply[Constant.REPLY.MESSAGE] = Messages.success;
            reply[Constant.REPLY.DATA] = artist;
            reply[Constant.REPLY.RESULT_CODE] = Constant.RESULT_CODE.Success;
            reply[Constant.REPLY.TOKEN] = '';
            return res.send(reply).end;
        }
    })
    }
exports.POST_RATE_CARD =function(req,res){

}