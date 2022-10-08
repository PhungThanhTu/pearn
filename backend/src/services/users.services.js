const userModel = require('../models/users.model')
const bcrypt = require('bcrypt');
const {generateToken} = require('../lib/token.methods');
const randToken = require('rand-token');


const hashPassword = async  (rawPassword) => {
    var salt = await bcrypt.genSalt(10);
    console.info("Password sensitive :");
    console.log(typeof rawPassword);
    const result = await bcrypt.hash(rawPassword,salt);
    return result;
}

const checkUserExists = async (username) => {
    const user = await userModel.getUser(username);
    if(!user) return false;
    return true;
}

const createNewUser = async (username,rawpassword,fullname,email,role) => {
    const hashedPassword = await hashPassword(rawpassword);
    const newUser = {
        username,
        password: hashedPassword,
        fullname,
        email,
        role
    }
    const result = await userModel.createUser(newUser);
    if(!result) {
        return {
            statuscode:400,
            data:{
                message: "Error during creation"
            }
        }
    }
    return {
        statuscode:201,
        data: {
            username,
            fullname,
            email,
            role
        }
    }

}

const comparePassword = async (inputRawPassword,hashedValidPassword) => {
    return bcrypt.compareSync(inputRawPassword,hashedValidPassword);
}

const checkUsernameAndPasswordValid = async (username,password) => {
    const failedResult = {
        statuscode:401,
        data: {
            message:"Invalid credentials"
        }
    }

    const user = await userModel.getUser(username);
    if(!user) return  failedResult;

    const validHashedPassword = user.password;
    const isPasswordValid = await comparePassword(password,validHashedPassword);

    if(isPasswordValid) return user;

    return failedResult;

}

const createUserToken = async (user) => {

    const failedMessage = {
        statuscode:401,
        data:{
            message:"Authentication failed"
        }
    }

    const AccessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const AccessTokenLife = process.env.ACCESS_TOKEN_LIFE;

    // data for access token
    const DataForAccessToken = {
        username:user.username,
        role:user.role
    };

    const token = generateToken(DataForAccessToken,AccessTokenSecret,AccessTokenLife);

    if(!token) return failedMessage;

    return token;
}

const generateRefreshToken = async (username) => {
    // generate refresh token
    let refreshToken = randToken.generate(100);
    // generate new token if user have no token before
    const result = await userModel.updateUser(username,{
        refreshtoken: refreshToken
    })
    if(result) return refreshToken;
    return undefined;    
}

module.exports = {
    register: async (req,res) => {
        const BodyLogMessage = req.body;
        console.log(BodyLogMessage);
        const isExist = await checkUserExists(req.body.username);
        if(isExist){
            res.status(409).send({
                message:"Username unavailable"
            });
            return;
        }
        const result = await createNewUser(
            req.body.username,
            req.body.password,
            req.body.fullname,
            req.body.email,
            "admin"
        );
        res.status(result.statuscode).send(result.data); 
    },
    login: async (req,res) => {
        const credentials = await checkUsernameAndPasswordValid(req.body.username,req.body.password);
        if(credentials.statuscode)
            return res.status(credentials.statuscode).send(credentials.data);
        const token = await createUserToken(credentials);

        if(token.statuscode) return res.status(token.statuscode).send(token.data);

        const refreshToken = await generateRefreshToken(credentials.username);

        if(!refreshToken) return res.status(400).send({
            message: "Login failed"
        })

        return res.status(200).send({
            token:token,
            refreshToken:refreshToken,
        })

    }
}