var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ArtistSchema = new Schema({
    artistName:{
     type:String
 },
 artistId:{
     type:String,
     unique:true,
     required:true
 },
 artistNumber: {
    type: String,
    unique: true
},
userType:{
    type:String
},
artistEmail: {
    type: String
},
imageUrl: {
    type: [String]
},
address: [{
    hno: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    country: {
        type: String
    },
    pincode: {
        type: String
    },
    locality: {
        type: String
    }

}],
location: {
    type: [Number],
    index: '2d'
},
travel:{
  type:Number
},
category: {
        type: String, enum: ["Male", "Female","Both"],
        
 },
 priceDetails:[{
    familyMakeUp:{
     type:String
    },
    outstation:{
        type:String
    },
    engagement:{
     type:String
    },
    bridalMakeUp:{
        type:String
    },
    airbrushCharges:{
        type:String
    }

 }],
 products:{
     type:[String]
 },
 services:{
     type:[String]
 },
 experience:{
  type:Number
 },
 about:{
     type:String
 },
averageRating: {
        type: Number,
        default:0
    },
  
   
})
var artist = mongoose.model('artists',ArtistSchema)
module.exports = artist;