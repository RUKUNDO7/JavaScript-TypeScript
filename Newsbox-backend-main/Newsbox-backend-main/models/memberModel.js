const mongoose = require('mongoose')
const Joi = require('joi')

const allowedAdmins = process.env.ADMINNAMES.split(',').map(e => e.trim().toUpperCase());

const memberSchema = mongoose.Schema(
  {
    familyName:{type:String,required:true},
    userType:{type:String,enum:['member','admin']},
    isAdmin:{type:Boolean }
  }
)

memberSchema.pre('save',function(next){
  const shouldBeAdmin = allowedAdmins.includes(this.familyName.toLowerCase());
  this.isAdmin = shouldBeAdmin;
  next();
})

const memberValidator = Joi.object({
  familyName:Joi.string().required(),
})

const Member = mongoose.model('Member',memberSchema);

module.exports = Member,memberValidator
