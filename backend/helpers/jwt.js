const   jwt  = require("express-jwt");
require('dotenv').config();

function authJwt() {
  const secret = process.env.SECRET;
  return jwt({
    secret,
    algorithms: ['HS256'],
  });
}

module.exports = authJwt;
