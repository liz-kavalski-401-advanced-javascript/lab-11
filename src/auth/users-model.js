'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); //add elements to the orginal password.
const jwt = require('jsonwebtoken');//make to token

const users = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type: String},
  role: {type: String, required:true, default:'user', enum:['admin','editor','user'] },
});
/** 
 * this encrypt the password by adding the letters/elements to the orginal password
 * */
users.pre('save', function(next) {
  bcrypt.hash(this.password,10)
    .then(hashedPassword => {
      this.password = hashedPassword;
      next();
    })
    .catch( error => {throw error;} );
});
// when it gose throught the schema it going to look at the given username:password and compare the username and password listed in the schema.  
users.statics.authenticateBasic = function(auth) {
  let query = {username:auth.username};
  return this.findOne(query)
    .then(user => user && user.comparePassword(auth.password))
    .catch(console.error);
};

// Compare a plain text password against the hashed one we have saved
/** this is compareing the clinent password to the hashed one saved. The plained text and hashed text will be the same one matter how many times it get re-enterd.
 */
users.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password)
  .then(vaild => valid ? this : null); // it will return if it ture or not
};

/** 
 * Generate a JWT from the user id and a secret- creating a token
*/
users.methods.generateToken = function() {
  let tokenData = {
    id:this._id,
    capabilities: (this.acl && this.acl.capabilities) || [],
  };
  return jwt.sign(tokenData, process.env.SECRET || 'changeit' );
};

module.exports = mongoose.model('users', users);
