const userModel = require('../models/users.model')
const metaModel = require('../models/metadata.model')
const bcrypt = require('bcrypt');
const { generateToken, decodeToken } = require('../lib/token.methods');
const randToken = require('rand-token');
const { getUser, updateUser, deleteUser, getUsers } = require('../models/users.model');


const hashPassword = async (rawPassword) => {
    var salt = await bcrypt.genSalt(10);
    console.info("Password sensitive :");
    console.log(typeof rawPassword);
    const result = await bcrypt.hash(rawPassword, salt);
    return result;
}

const checkUserExists = async (username) => {
    const user = await userModel.getUser(username);
    if (!user) return false;
    return true;
}

const createNewUser = async (username, rawpassword, fullname, email, role) => {
    const hashedPassword = await hashPassword(rawpassword);
    const newUser = {
        username,
        password: hashedPassword,
        fullname,
        email,
        role
    }
    const result = await userModel.createUser(newUser);
    if (!result) {
        return {
            statuscode: 400,
            data: {
                message: "Error during creation"
            }
        }
    }
    return {
        statuscode: 201,
        data: {
            username,
            fullname,
            email,
            role
        }
    }

}

const comparePassword = async (inputRawPassword, hashedValidPassword) => {
    return bcrypt.compareSync(inputRawPassword, hashedValidPassword);
}

const checkUsernameAndPasswordValid = async (username, password) => {
    const failedResult = {
        statuscode: 401,
        data: {
            message: "Invalid credentials"
        }
    }

    const user = await userModel.getUser(username);
    if (!user) return failedResult;

    const validHashedPassword = user.password;
    const isPasswordValid = await comparePassword(password, validHashedPassword);

    if (isPasswordValid) return user;

    return failedResult;

}

const createUserToken = async (user) => {

    const failedMessage = {
        statuscode: 401,
        data: {
            message: "Authentication failed"
        }
    }

    const AccessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const AccessTokenLife = process.env.ACCESS_TOKEN_LIFE;

    // data for access token
    const DataForAccessToken = {
        username: user.username,
        role: user.role
    };

    const token = generateToken(DataForAccessToken, AccessTokenSecret, AccessTokenLife);

    if (!token) return failedMessage;

    return token;
}

const generateRefreshToken = async (username) => {
    // generate refresh token
    let refreshToken = randToken.generate(100);
    // generate new token if user have no token before
    const result = await userModel.updateUser(username, {
        refreshtoken: refreshToken
    })
    if (result) return refreshToken;
    return undefined;
}

const updateUserProfile = async (username, updatingUser) => {
    const user = await getUser(username);

    const password = user.password;

    // we dont allow user to update role
    updatingUser.role = user.role;

    // we don't allow user to update username
    updatingUser.username = username;

    // we don't allow to update password when updating profile because of 
    // encryption issue
    updatingUser.password = password;

    
    

    const updateResult = await updateUser(username,updatingUser);

    return updateResult;

}

const changePassword = async (username,oldPassword,newPassword) => {

    const failedResult = {
        statuscode:403,
        data:{
            message:"Change password failed"
        }
    }

    const successResult = {
        statuscode:200,
        data:{
            message:"Change password successfully"
        }
    }

    const user = await getUser(username);

    const password = user.password;

    const isPasswordValid = await comparePassword(oldPassword,password);

    if(!isPasswordValid)
        return failedResult;
    
    const newHashedPassword = await hashPassword(newPassword);

    user.password = newHashedPassword;

    const result =  await updateUser(username,user);

    if(result) return successResult;

    return failedResult;

}

const getSingleUserProfile = async (username) => {
    const failedResult = {
        statuscode:400,
        data:{
            message:"Cannot fetch user profile"
        }
    }

    const user = await getUser(username);

    if(!user) return failedResult;

    const successResult = {
        statuscode:200,
        data:{
            fullname:user.fullname,
            email:user.email,
            role: user.role,
            avatar:user.avatar
        }
    }
    return successResult;
}

module.exports = {
    register: async (req, res) => {
        const BodyLogMessage = req.body;
        console.log(BodyLogMessage);
        const isExist = await checkUserExists(req.body.username);

        if(req.user.role !== "admin") {
            return res.status(400).send({
                message:"Not allowed"
            });
        };

        if (isExist) {
            res.status(409).send({
                message: "Username unavailable"
            });
            return;
        }
        const parseDateOfBirth = new Date(req.body.dateofbirth);

        if(!parseDateOfBirth)
            return res.status(408).json({
                message:"Date of birth is not valid"
            });

        const result = await createNewUser(
            req.body.username,
            req.body.password,
            req.body.fullname,
            req.body.email,
            req.body.role,
            parseDateOfBirth,
        );
        
        res.status(result.statuscode).send(result.data);
    },
    login: async (req, res) => {
        const credentials = await checkUsernameAndPasswordValid(req.body.username, req.body.password);
        if (credentials.statuscode)
            return res.status(credentials.statuscode).send(credentials.data);
        const token = await createUserToken(credentials);

        if (token.statuscode) return res.status(token.statuscode).send(token.data);

        const refreshToken = await generateRefreshToken(credentials.username);

        if (!refreshToken) return res.status(400).send({
            message: "Login failed"
        })

        return res.status(200).send({
            token: token,
            refreshToken: refreshToken,
            role: credentials.role
        })

    },
    refresh: async (req, res) => {
        const expiredAccessToken = req.body.token;
        const refreshToken = req.body.refreshToken;
        const secretSignature = process.env.ACCESS_TOKEN_SECRET;
        const tokenLife = process.env.ACCESS_TOKEN_LIFE;

        if (!refreshToken || !expiredAccessToken)
            return res.status(401).send({
                message: "Unauthorized"
            });

        const decodedPayload = await decodeToken(expiredAccessToken, secretSignature);
        const username = decodedPayload.payload.username;
        const user = await userModel.getUser(username);
        const role = user.role;

        if (user.refreshtoken !== refreshToken)
            return res.status(401).send({
                message: "Unauthorized"
            });

        const dataForAccessToken = {
            username,
            role
        };

        const newAccessToken = await generateToken(dataForAccessToken, secretSignature, tokenLife);
        const newRefreshToken = await generateRefreshToken(username);

        return res.status(201).send({
            token: newAccessToken,
            refreshToken: newRefreshToken
        })


    },
    oneTimeAdminRegister: async (req,res) => {
        const locked = await metaModel.getFreeRegister();
        console.log(locked);

        
        if(locked){
            const result = await createNewUser(
                req.body.username,
                req.body.password,
                req.body.fullname,
                req.body.email,
                "admin"
            );
            lockResult = await metaModel.lockFreeRegister();
            return res.status(result.statuscode).send({
                lockRegisterResult:lockResult,
                registerResult:result.data
            });
            


        }
        
        return res.status(401).send("Unauthorized");

        
    },
    editProfile: async (req,res) => {
        const username = req.user.username;
        const updatingData = req.body;

        const result = await updateUserProfile(username,updatingData);

        if(!result) return res.status(408).json("Failed");

        return res.status(200).json({
            message: "Updated Successfully"
        });
    },
    changeUserPassword: async (req,res) => {
        const username = req.user.username;

        const result = await changePassword(username,req.body.oldPassword,req.body.newPassword);

        return res.status(result.statuscode).json(result.data);
    },
    getProfile: async (req,res) => {
        const username = req.user.username;

        const result = await getSingleUserProfile(username);

        return res.status(result.statuscode).json(result.data);
    },
    delete: async (req,res) => {
        if(req.user.role !== "admin") {
            return res.status(400).send({
                message:"Not allowed"
            });
        };

        const username = req.body.username;

        const userExists = await checkUserExists(username);

        if(!userExists){
            return res.status(404).send({
                message:"Not found"
            });
        }

        const result = await deleteUser(username);

        if(result) {
            return res.status(200).json({
                message:`User ${username} has been deleted successfully`
            })
        }

        
        return res.status(408).json({
                message:`User delete failed`
            })
    },
    getAllUsers: async (req,res) => {
        const role = req.user.role;

        if(role !== "admin")
            return res.status(401).json("Unauthorized");
        
        const users = await getUsers();

        return res.status(200).json(users);
        
    }

}