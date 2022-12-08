const { insertCourse, findCourse, deleteCourse, addStudentToCourse, changeLecturer, removeLecturer, checkStudentInCourse, removeStudent} = require("../models/courses.model");
const { getUser } = require("../models/users.model");

const handleCreated = (res,data) => res.status(201).json(data);
const handleBadRequest = (res,err) => res.status(400).json(err);
const handleOk = (res,data) => res.status(200).json(data);
const handleNotFound = (res,err) => res.status(404).json(err);

module.exports = {
    httpCreateCourse: async (req,res) => {

        const course = req.body;

        try {
            const resultId = await insertCourse({
                name:course.name,
                locked: course.locked,
                code: course.code
            });
            return handleCreated(res,resultId);
        }
        catch {
            return handleBadRequest(res,"Creation failed");
        }
    },
    httpGetCourse: async (req,res) => {

        const courseId = req.params.id;

        const course = await findCourse(courseId);

        if(!course) return handleNotFound(res,{
            message:"Not found"
        });

        return handleOk(res,course);
    },
    httpDeleteCourse: async (req,res) => {
        
        const courseId = req.params.id;
        try {
            const deleteResult = await deleteCourse(courseId);

            if(deleteResult.deletedCount === 0) return handleNotFound(res,{
                message:"Not found"
            });
            if(deleteResult) {       
                 return handleOk(res,{
                        message:`deleted ${deleteResult.deletedCount} course `
                    })
                }
        }
        catch {
            return handleBadRequest(res,{
                message:"Delete failed"
            })
        }        
    },
    httpAddStudent: async (req,res) => {

            const username = req.body.username;
            const courseId = req.body.courseId;

            try {
                const foundStudent = await getUser(username);
                const foundCourse = await findCourse(courseId);

                

                if(!foundStudent || !foundCourse || foundStudent.role !== "student")
                {
                    const notFoundMessage = {
                        message : "Student or course not found"
                    }
                    return handleNotFound(res,notFoundMessage);
                }

                const isAlreadyAdded = await checkStudentInCourse(foundCourse,foundStudent);

                if(isAlreadyAdded)
                {
                    const alreadyAddedMessage = {
                        message : "Student has already in course"
                    }
                    return handleBadRequest(res,alreadyAddedMessage);
                }

                const queryResult = await addStudentToCourse(foundCourse,foundStudent);

                const addedSuccessMessage = {
                    message:`Added student ${username} to course ${courseId}`,
                    debugResult: queryResult._id
                }

                return handleOk(res,addedSuccessMessage);

            }
            catch {
                const addFailedMessage = {
                    message:"Add failed"
                }

                return handleBadRequest(res,addFailedMessage);
            }

    },
    httpRemoveStudent: async (req,res) => {

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
                    const notAddedMessage = {
                        message : "Student hasn't been added to the course"
                    }
                    return handleBadRequest(res,notAddedMessage);
                }

                const queryResult = await removeStudent(foundCourse,foundStudent);

                const removedSuccessMessage = {
                    message:`Removed student ${username} from course ${courseId}`,
                    debugResult: queryResult._id
                }
                return handleOk(res,removedSuccessMessage);
            }
            catch {
                const failedMessage = {
                    message:"Deletion failed"
                }
                return handleBadRequest(res,failedMessage);
            }
    },
    httpAddLecturer: async (req,res) => {

            const username = req.body.username;
            const courseId = req.body.courseId;

            try {
                const foundLecturer = await getUser(username);
                const foundCourse = await findCourse(courseId);

                if(!foundLecturer || !foundCourse || foundLecturer.role !== "lecturer")
                {
                    const notFoundMessage = {
                        message : "Lecturer or course not found"
                    }
                    return handleNotFound(res,notFoundMessage);
                }

                const queryResult = await changeLecturer(foundCourse,foundLecturer);

                const successMessage = {
                    message:`Assigned lecturer ${username} to course ${courseId}`,
                    debugResult: queryResult._id
                }
                return handleOk(res,successMessage);
            }
            catch {

                const failedMessage = {
                    message:"Change lecturer failed"
                }
                return handleBadRequest(res,failedMessage);
            }
    },
    httpRemoveLecturer: async (req,res) => {

        const courseId = req.body.courseId;

        try {
            const foundCourse = await findCourse(courseId);

            if(!foundCourse){
                const notFoundMessage = {
                        message : "Course not found"
                    }
                    return handleNotFound(res,notFoundMessage);
            }

            const queryResult = await removeLecturer(foundCourse);

            const successMessage = {
                    message:`Removed lecturer from course ${courseId}`,
                    debugResult: queryResult
                }
            return handleOk(res,successMessage);
        }
        catch {
            const failedMessage = {
                message:"Remove failed"
            }
            return handleBadRequest(res,failedMessage);
        }
    },

}