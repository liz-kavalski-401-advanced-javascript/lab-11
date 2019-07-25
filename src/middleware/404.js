'use strict';
/**
 * If the route is not found.
 * req{*}- the client request
 * res{*}- the respons
 * next{}
  */
module.exports = (req,res,next) => {
  let error = { error: 'Resource Not Found' };
  res.statusCode = 404;
  res.statusMessage = 'Not Found';
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(error));
  res.end();
};