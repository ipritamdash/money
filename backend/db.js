const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
},
    password: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 128 // change if needed
},
    username: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },

    lastname:{
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }

});

UserSchema.methods.createHash = async function (plainTextPassword) {

    const saltRounds = 10;
  
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(plainTextPassword, salt);

  };
    UserSchema.methods.validatePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password_hash);
  };
  
  module.exports.User = mongoose.model("User", UserSchema);

const User = mongoose.model('User', userSchema);

modules.exports = {
    User
};


