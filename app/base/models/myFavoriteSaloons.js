/**
 * Created by Ankur.Gupta on 15-January-18.
 */
/**
 * Created by Ankur.Gupta on 26-September-17.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var myFavoriteSaloon = new Schema({
    userId: {
        type: String
    },
   saloonId:{
       type:[String]
   }
});

var MyFavoriteSaloons = mongoose.model('MyFavoriteSaloons', myFavoriteSaloon);
module.exports = MyFavoriteSaloons;