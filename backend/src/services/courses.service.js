const { insertCourse, findCourse, deleteCourse, addStudentToCourse, changeLecturer, removeLecturer, checkStudentInCourse, removeStudent} = require("../models/courses.model");
const { getUser } = require("../models/users.model");

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
                message:"Authentication success but some error has occured"
            }
        }
}

module.exports = {
    httpCreateCourse: async (req,res) => {

        let result = allowStaffOnly(req,res);
        if(result.status === 400)
            return res.status(result.status).json(result.data);

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
    httpGetCourse: async (req,res) => {

        let result = allowStaffOnly(req,res);

        if(result.status === 400){
            return res.status(result.status).json(result.data);
        }

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
    httpDeleteCourse: async (req,res) => {
        let result = allowStaffOnly(req,res);

        const courseId = req.params.id;

        if(result.status === 400)
        {
            return res.status(result.status).json(result.data)
        }

        try {
            const deleteResult = await deleteCourse(courseId);

            console.log(courseId);
            console.log(deleteResult);

            if(deleteResult) {

                console.log(deleteResult);
                
                result = {
                    status:200,
                    data: {
                        message:`deleted ${deleteResult.deletedCount} course `
                    }
                }

                if(deleteResult.deletedCount === 0){
                    result.status = 404;
                    result.data.message = `Queried course not found`;
                }
            }
        }
        catch {
            result = {
                status:408,
                data: {
                    message:"Delete failed"
                }
            }
        }

        return res.status(result.status).json(result.data);

        
    },
    httpAddStudent: async (req,res) => {
        let result = allowStaffOnly(req,res);

        if(result.status === 400) {
            return res.status(result.status).json(result.data);
        }

            const username = req.body.username;
            const courseId = req.body.courseId;

            try {
                const foundStudent = await getUser(username);
                const foundCourse = await findCourse(courseId);

                

                if(!foundStudent || !foundCourse || foundStudent.role !== "student")
                {
                    result.status = 404;
                    result.data = {
                        message : "Student or course not found"
                    }
                    return res.status(result.status).json(result.data);
                }

                const isAlreadyAdded = await checkStudentInCourse(foundCourse,foundStudent);

                if(isAlreadyAdded)
                {
                    result.status = 408;
                    result.data = {
                        message : "Student has already in course"
                    }
                    return res.status(result.status).json(result.data);
                }

                const queryResult = await addStudentToCourse(foundCourse,foundStudent);

                result.status = 200;
                result.data = {
                    message:`Added student ${username} to course ${courseId}`,
                    debugResult: queryResult._id
                }

            }
            catch {

                result.status = 408
                result.data = {
                    message:"Add failed"
                }

            }

            return res.status(result.status).json(result.data);

    },
    httpRemoveStudent: async (req,res) => {
        let result = allowStaffOnly(req,res);

        if(result.status === 400) {
            return res.status(result.status).json(result.data);
        }

            const username = req.body.username;
            const courseId = req.body.courseId;

            try {
                const foundStudent = await getUser(username);
                const foundCourse = await findCourse(courseId);

                if(!foundStudent || !foundCourse || foundStudent.role !== "student")
                {
                    result.status = 404;
                    result.data = {
                        message : "Student or course not found"
                    }
                    return res.status(result.status).json(result.data);
                }

                const isAlreadyAdded = await checkStudentInCourse(foundCourse,foundStudent);

                if(!isAlreadyAdded)
                {
                    result.status = 408;
                    result.data = {
                        message : "Student hasn't been added to the course"
                    }
                    return res.status(result.status).json(result.data);
                }

                const queryResult = await removeStudent(foundCourse,foundStudent);

                result.status = 200;
                result.data = {
                    message:`Removed student ${username} from course ${courseId}`,
                    debugResult: queryResult._id
                }

            }
            catch {

                result.status = 408
                result.data = {
                    message:"Deletion failed"
                }

            }

            return res.status(result.status).json(result.data);
    },
    httpAddLecturer: async (req,res) => {
        
        let result = allowStaffOnly(req,res);

        if(result.status === 400) {
            return res.status(result.status).json(result.data);
        }

            const username = req.body.username;
            const courseId = req.body.courseId;

            try {
                const foundLecturer = await getUser(username);
                const foundCourse = await findCourse(courseId);

                

                if(!foundLecturer || !foundCourse || foundLecturer.role !== "lecturer")
                {
                    result.status = 404;
                    result.data = {
                        message : "Lecturer or course not found"
                    }
                    return res.status(result.status).json(result.data);
                }

                const queryResult = await changeLecturer(foundCourse,foundLecturer);

                result.status = 200;
                result.data = {
                    message:`Assigned lecturer ${username} to course ${courseId}`,
                    debugResult: queryResult._id
                }

            }
            catch {

                result.status = 408
                result.data = {
                    message:"Change lecturer failed"
                }

            }

            return res.status(result.status).json(result.data);
    },
    httpRemoveLecturer: async (req,res) => {

        let result = allowStaffOnly(req,res);

        if(result.status === 400) {
            return res.status(result.status).json(result.data);
        }

        const courseId = req.body.courseId;

        try {
            const foundCourse = await findCourse(courseId);

            if(!foundCourse){
                result.status = 404;
                    result.data = {
                        message : "Course not found"
                    }
                    return res.status(result.status).json(result.data);
            }

            const queryResult = await removeLecturer(foundCourse);

            result.status = 200;
                result.data = {
                    message:`Removed lecturer from course ${courseId}`,
                    debugResult: queryResult
                }
        }
        catch {
            result.status = 408
            result.data = {
                message:"Remove failed"
            }

        }
        return res.status(result.status).json(result.data);
    },

}