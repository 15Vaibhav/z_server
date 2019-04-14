/**
 * Created by Ankur.Gupta on 08-November-17.
 */
//FCMID
//DEVICED
//DATEAND TIME
//COUNT
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AuthenticateSchema = new Schema({

    fcmId:{
        type:String
    },
    deviceId:{
        type:String
    },
    dateAndTime:{
        type:Date
    },
    date:{
        type:Date
    },
    userId:{
      type:String
    }
});


var authenticate = mongoose.model('authenticate', AuthenticateSchema);
module.exports = authenticate;