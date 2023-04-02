const mongoose = require('mongoose');
const passport = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({

    url: String,
    filename: String

})
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200');
 })
 const opts = { toJSON: { virtuals: true } };
const userSchema = new Schema({
    name: {
        type: String
    },
    images: [ImageSchema],
    ip: {
        type: String
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            
        },

        coordinates: {
            type: [Number],
            
        }

        },
    email:{
        type: String
    },
    hospital: {
        type: String
    },
    degree: {
        type: String,
    },
    specification:{
        type: String,
    },
    phone: {
        type: Number
    },
    isPatient: {
        type: Number,
        default: 0
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
},opts);

// userSchema.virtual('properties.popUpMarkup').get(function(){
//     return `<strong><a href="/user/${this._id}">${this.title}</a><strong><p>${this.specification.substring(0, 20)}...</p>`
//  })


userSchema.plugin(passport,{usernameField: 'email'})

module.exports = mongoose.model('huser', userSchema);