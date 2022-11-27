const { insertCourse, findCourse, addStudentToCourse } = require("../models/courses.model");


function allowStaffOnly (req,res) {
    const authorization = req.user;

        if(authorization.role != "staff")
        {
            return {
                status: 400,
                data:{
                message:"No permission"
                }
            }
        }
        return {
            status: 408,
            data: {
                message:"Undefined error"
            }
        }
}


module.exports = {
    createCourse: async (req,res) => {

        let result = allowStaffOnly(req,res);

        const course = req.body;

        try {
            const resultId = await insertCourse({
                name:course.name,
                locked: course.locked,
                code: course.code
            });

            result = {
                status: 201,
                data: {
                    id:resultId
                }
            }
        }
        catch {
            result = {
                status: 400,
                data: {
                    message:"Course creation failed, maybe code is not available"
                }
            }
        }

        return res.status(result.status).json(result.data);
    },
    getCourse: async (req,res) => {

        let result = allowStaffOnly(req,res);

        const courseId = req.params.id;

        const course = await findCourse(courseId);

        if(course) {
            result = {
                status:200,
                data:course
            }
        }
        else {
            result = {
                status:404,
                data: {
                    message:"Not found"
                }
            }
        }
        return res.status(result.status).json(result.data);

    },
    deleteCourse: async (req,res) => {

    },
    addStudent: async (req,res) => {

    },
    addLecturer: async (req,res) => {

    },
    removeLecturer: async (req,res) => {

    },

}
   

