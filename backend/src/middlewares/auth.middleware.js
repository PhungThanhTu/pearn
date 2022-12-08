const userModel = require("../models/users.model");
const authMethods = require("../lib/token.methods");
const { use } = require("../routes");
function getAccessTokenFromHeader(req) {
  return req.headers.authorization;
}

const handleUnauthorizedError = (res) => res.status(401).json("Unauthorized");

const handleNoPermissionError = (res,role) => res.status(401).json(`No Permission, required role ${role}`);

module.exports = {
  authorize: (role) =>{ 
    return  async (req, res, next) => 
    {
      const accessToken = getAccessTokenFromHeader(req);
      const secret = process.env.ACCESS_TOKEN_SECRET;

    if (!accessToken) {
      return handleUnauthorizedError(res);
    }

    const result = await authMethods.verifyToken(accessToken, secret);

    if (!result) {
      return handleUnauthorizedError(res);
    }

    const user = result.payload;

    if(!role)
      return next();

    if(user.role !== role) return handleNoPermissionError(res,role);

    req.user = user;

    return next();
  }
}

};
