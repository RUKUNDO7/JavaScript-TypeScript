const mongoose = require('mongoose')
const Joi = require('joi')

const profileSchema = mongoose.Schema({
  name:{type:String,required:true},
  familyName:{type:String,required:true},
  email:{type:String,required:true},
  birthday:{type:Date,required:true},
  subFam:{type:String,required:true},
  profilePic:{type:String,required:true}
})

const profileValidator = Joi.object({
  name:Joi.string().min(2).max(50).required(),
  familyName:Joi.string().min(2).max(50).required(),
  email:Joi.string().email().required(),
  birthday:Joi.date().less('now').required(),
  subFam:Joi.string().required(),
  profilePic: Joi.string().required()
})

const Profile = mongoose.model('Profile',profileSchema);

module.exports = {Profile,profileValidator}