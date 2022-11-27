const mongoose = require('mongoose');
const { getUser } = require('./users.model');

const courseSchema = mongoose.Schema({
    name: {
        required: true,
        type: String,
    },
    lecturer: 
    {   required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    code: {
        type: String,
        unique: true,
        required: true
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    locked: Boolean
})

let Course = mongoose.model('course',courseSchema,'courses');


module.exports = {
    // basic CRUD
    insertCourse: async ({name,code,locked}) => {
        const newCourse = new Course({
            name,
            code,
            locked,
            students: [],
        });

        const result = await newCourse.save();

        console.info('SAVE COURSE SUCCESS');
        console.log(result);

        return result._id.toString();
    },
    findCourse: async (courseId) => {
        const course = await Course.findById(courseId).populate('students',{
            _id:0,
            username:1,
            fullname:1
        });

        console.info('FINDING COURSE');
        console.log(course);

        return course;
    },
    getCourses: async (query) => {
        return await Course.find(query);
    },
    updateCourse: async (courseId, {name,locked}) => {
        const result = await Course.findByIdAndUpdate(courseId,{
            name,
            locked
        },{
            new: true
        });

        console.info('UPDATING COURSE');
        console.log(result);

        return result;
    },
    deleteCourse: async (courseId) => {
        return await Course.findByIdAndDelete(courseId);
    },
    // additional function for optimization
    addStudentToCourse: async (course,student) => {

        course.students.push(student);

        const result = await course.save()

        console.info("ADDING STUDENT");
        console.log(result);

        return result;
    },
    removeStudent: async (course, user) => {

        const result = await Course.updateOne(course,{
            $pull: {
                students: user._id
            }
        });

        console.info("REMOVING STUDENT");
        console.log(result);

        return result;
    },
    changeLecturer: async (course, lecturer) => {
        const result = await Course.updateOne(course,{
            lecturer: lecturer
        });

        console.info('CHANGE LECTURER');
        console.log(result);

        return result;
    },
    removeLecturer: async (course) => {
        const result = await Course.updateOne(course,{
            lecturer: undefined
        });

        return result;
    }
}