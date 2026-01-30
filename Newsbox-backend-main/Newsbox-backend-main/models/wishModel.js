const mongoose = require ('mongoose')
const Joi = require('joi')

const wishSchema = mongoose.Schema({
  text: {type:String, required: true},
  sender: {type:String, required: true},
  profilePic: {type:String, required: false},
})

const wishValidator = Joi.object({
  text:Joi.string().required(),
})

const Wish = mongoose.model('Wish',wishSchema)

module.exports = {Wish,wishValidator}