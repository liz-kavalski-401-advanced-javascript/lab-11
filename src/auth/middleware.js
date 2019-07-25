'use strict';

const User = require('./users-model.js');

/**
 *Check off errors while the code is being executed
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
module.exports = (req, res, next) => {
//The 'try' statement allows you to define a block of code to be tested for errors while it is being executed.
  
  try {

    let [authType, authString] = req.headers.authorization.split(/\s+/);

    // BASIC Auth  ... Authorization:Basic ZnJlZDpzYW1wbGU=

    switch(authType.toLowerCase()) {
      case 'basic':
        return _authBasic(authString);
      default:
        return _authError();
    }

  } catch(e) {
    return _authError();
  }

  /**
   *A function that check the user and password
   *
   * @param {*} authString
   * @returns
   */
  function _authBasic(authString) {
    let base64Buffer = Buffer.from(authString,'base64'); // <Buffer 01 02...>
    let bufferString = base64Buffer.toString(); // john:mysecret
    let [username,password] = bufferString.split(':');  // variables username="john" and password="mysecret"
    let auth = {username,password};  // {username:"john", password:"mysecret"}- it need to be an object not a array

    return User.authenticateBasic(auth)
      .then( user => _authenticate(user) );
  }

  /**
   *a function check the user and make a token
   *
   * @param {*} user
   */
  function _authenticate(user) {
    if ( user ) {
      req.user = user;
      req.token = user.generateToken();//makes the token
      next();
    }
    else {
      _authError();
    }
  }

  function _authError() {
    next({status: 401, statusMessage: 'Unauthorized', message: 'Invalid User ID/Password'});
  }

};

