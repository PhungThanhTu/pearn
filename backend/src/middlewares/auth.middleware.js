const userModel = require('../models/users.model');
const authMethods = require('../lib/token.methods'); const { use } = require('../routes');
;

function getAccessTokenFromHeader(req) {
    return req.headers.authorization;
}

module.exports = {
    authorize: async (req, res, next) => {

        this.filterAttack(req,res,next);

        const accessToken = getAccessTokenFromHeader(req);
        const secret = process.env.ACCESS_TOKEN_SECRET;
        if (!accessToken) {
            return res.status(401).send("unauthorized");
        }

        const result = await authMethods.verifyToken(accessToken, secret);

        if (!result)
            return res.status(401).send("unauthorized");

        const user = result.payload;

        console.log(user);

        req.user = user;

        return next();
    },
    filterAttack: async (req,res,next) => {
        if(req.user)
            return res.status(400).send("attack detected");
        return next();
    }
}