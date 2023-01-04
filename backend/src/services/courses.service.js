const { insertCourse, findCourse, deleteCourse, addStudentToCourse, changeLecturer, removeLecturer, checkStudentInCourse, removeStudent, getStudentsInCourse, addStudentsToCourse, getCourses, removeStudentsFromCourse} = require("../models/courses.model");
const { getUser, populateUserWithUsername } = require("../models/users.model");

const {handleBadRequest,handleCreated,handleNotFound,handleOk, handleNotAllowed} = require('../lib/responseMessage')

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

        if(!validateGuid(courseId)) return handleNotFound(res,"Invalid GUID");

        const course = await findCourse(courseId);

        if(!course) return handleNotFound(res,{
            message:"Not found"
        });

        return handleOk(res,course);
    },
    httpDeleteCourse: async (req,res) => {
        
        const courseId = req.params.id;
        if(!validateGuid(courseId)) return handleNotFound(res,"Invalid GUID");

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

            const usernames = req.body.usernames;
            const courseId = req.body.courseId;

            if(!validateGuid(courseId)) return handleNotFound(res,"Invalid GUID");

            try {

                console.log(usernames);

                const foundUsers = await populateUserWithUsername(usernames);
                const foundStudents = [...foundUsers].filter(user => user.role === "student");
                const foundCourse = await findCourse(courseId);
                
                if([...foundStudents].length === 0 || !foundCourse) return handleNotFound(res,"Not found");

                const studentsInCourse = await getStudentsInCourse(foundCourse);
                const studentsInCourseIdsInString = [...studentsInCourse].map(student => student._id.toString());
                const finalInsertData = foundStudents.filter(student => !studentsInCourseIdsInString.includes(student._id.toString()));

                console.log("Student currently in course");
                console.log(studentsInCourseIdsInString);
                console.log("Filtered Data");
                console.log(finalInsertData);

                const queryResult = await addStudentsToCourse(foundCourse,finalInsertData);
                
                if(finalInsertData.length === 0) return handleBadRequest(res,"Students has been already added into the course");
 
                const messageResult = `Added student ${finalInsertData.map(student => student.username)} to course ${foundCourse.code}`

                const addedSuccessMessage = {
                    message:messageResult,
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

        const usernames = req.body.usernames;
        const courseId = req.body.courseId;

        if(!validateGuid(courseId)) return handleNotFound(res,"Invalid GUID");

        try {

            console.log(usernames);

            const foundUsers = await populateUserWithUsername(usernames);
            const foundStudents = [...foundUsers].filter(user => user.role === "student");
            const foundCourse = await findCourse(courseId);
            
            if([...foundStudents].length === 0 || !foundCourse) return handleNotFound(res,"Not found");

            const studentsInCourse = await getStudentsInCourse(foundCourse);
            const studentsInCourseIdsInString = [...studentsInCourse].map(student => student._id.toString());
            const finalDeleteData = foundStudents.filter(student => studentsInCourseIdsInString.includes(student._id.toString()));

            console.log("Student currently in course");
            console.log(studentsInCourseIdsInString);
            console.log("Filtered Data");
            console.log(finalDeleteData);

            const queryResult = await removeStudentsFromCourse(foundCourse,finalDeleteData)
            
            if(finalDeleteData.length === 0) return handleBadRequest(res,"Students has been alread removed from the course");

            const messageResult = `Removed student ${finalDeleteData.map(student => student.username)} from course ${foundCourse.code}`

            const removedSuccessMessage = {
                message:messageResult,
                debugResult: queryResult._id
            }

            return handleOk(res,removedSuccessMessage);

        }
        catch {
            const removeFailedMessage = {
                message:"Remove failed"
            }

            return handleBadRequest(res,removeFailedMessage);
        }
    },
    httpAddLecturer: async (req,res) => {

            const username = req.body.username;
            const courseId = req.body.courseId;

            if(!validateGuid(courseId)) return handleNotFound(res,"Invalid GUID");

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

        if(!validateGuid(courseId)) return handleNotFound(res,"Invalid GUID");

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
    httpGetCourses: async (req,res) => {

        const identity = await getUser(req.user.username);

        if(req.user.role === "lecturer")
        {
            const result = await getCourses({
                lecturer: identity._id
            })
            return handleOk(res,result);
        }
        if(req.user.role === "student")
        {
            const result = await getCourses({
                students: identity._id
            });
            return handleOk(res,result);
        }
        if(req.user.role === "staff"){
            const result = await getCourses({});
            return handleOk(res,result);
        }
        else return handleNotAllowed(res);
    }
}