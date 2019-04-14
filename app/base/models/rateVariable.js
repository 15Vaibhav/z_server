var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RateVariableSchema = new Schema({

  zaloonzRate:{

      type:Number
  },
   type:{
       type:String, enum: ["Percent", "Amount"]
   }
});
var rateVariable = mongoose.model('rateVariable', RateVariableSchema);
module.exports = rateVariable;