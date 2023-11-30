const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const UserSchema = new Schema({
    username: {type: String, required:true, unique:true},
    password: {type: String, required:true},
});

const UserModel = model('User', UserSchema);
module.exports = UserModel;

//mongodb+srv://tempodummy12:O6YzOhaFTn0qPOZC@cluster0.fou8jog.mongodb.net/?retryWrites=true&w=majority
//O6YzOhaFTn0qPOZC