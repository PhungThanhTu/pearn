const { handleNotFound, validateGuid, handleOk } = require("../lib/responseMessage");
const { populateUserWithUsername } = require("../models/users.model");
const {findCourse} = require('../models/courses.model');
const { rateCourse, getAverageStar } = require("../models/rating.model");


module.exports = {
    httpRateCourse: async (req,res) => {
        const courseId = req.params.courseId;
        const username = req.user.username;

        const stars = req.body.stars;

        if(!validateGuid(courseId)) return handleNotFound(res,"Invalid GUID");
        if(isNaN(stars)) return handleNotFound(res,"Invalid input");
        if(stars < 0 && stars > 5) return handleNotFound(res,"Invalid input");

        const users = await populateUserWithUsername(username);
        const user = users[0];
        const userId = user._id;

        const course = await findCourse(courseId);
        if(!course) return handleNotFound(res,"Course not found");

        const result = await rateCourse(courseId,userId,stars);
        
        return handleOk(res,result);

    },
    httpGetAverageStar: async (req,res) => {
        const courseId = req.params.courseId;
        if(!validateGuid(courseId)) return handleNotFound(res,"Invalid GUID");
        const course = await findCourse(courseId);
        if(!course) return handleNotFound(res,"Course not found");

        const result = await getAverageStar(courseId);
        return handleOk(res,result);

    }
}