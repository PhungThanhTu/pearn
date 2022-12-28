const mongoose = require('mongoose');

// shared user schema
var UserSchema = mongoose.Schema(
    {
        username:
        {
            required: true,
            type: String,
            index: true,
            unique: true
        },
        password: String,
        fullname: String,
        email: {

            type: String,
            required: true
        },
        dateofbirth: Date,
        role:
        {
            type: String,
            enum: [
                "admin",
                "student",
                "lecturer",
                "staff"
            ],
            required: true
        },
        dateofbirth:Date,
        refreshtoken: String,
        avatar: String
    }
)

var User = mongoose.model('user', UserSchema, 'users');

// handle CRUD for user
module.exports = {
    getUsers: async () => {
        return await User.find({},{
            username:1,
            fullname:1,
            email:1,
            role:1
        });
    },
    getLecturers: async () => await User.find({
        role: "lecturer"
        },{
        username:1,
        fullname:1,
        email:1,
        role:1
        })
    ,
    createUser: async (user) => {
        let newUser = new User(user);
        try {
            var result = await newUser.save();
            console.log(`create success ${result}`);
            return true;
        }
        catch (err) {
            console.log(`create failed due to error ${err}`);
            return false;
        }

    },
    getUser: async function (username) {
        return await User.findOne().where('username').equals(username);
    },
    updateUser: async (username, updatingData) => {
        const filter = { "username": username };
        try {
            let doc = await User.findOneAndUpdate(filter, updatingData);
            console.log(`user updated ${doc}`);
            return true;
        }
        catch (err) {
            console.log(`update failed due to error ${err}`);
            return false;
        }
    },
    deleteUser: async (username) => {
        const filter = { "username": username };
        try {
            let doc = await User.findOneAndDelete(filter);
            console.log(`user updated ${doc}`);
            return true;
        }
        catch (err) {
            console.log(`update failed due to error ${err}`);
            return false;
        }
    },
    populateUserWithUsername: async (usernames) => {
        return await User.find().where('username').in(usernames).exec();
    }
}