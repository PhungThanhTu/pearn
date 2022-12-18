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
        const deleteResult = await Course.deleteOne({_id:courseId});
        return deleteResult;
    },
    // additional function for optimization
    addStudentToCourse: async (course,student) => {

        course.students.push(student)

        const result = await course.save()

        return result;
    },
    addStudentsToCourse: async (course,students) => {

        const result = await Course.updateOne(
        {
            _id:course._id
        },
        {
            $push:{
                students: {
                    $each:[...students]
                }
            }
        });

        console.log(result);

        return result;
    },
    removeStudentsFromCourse: async (course,students) => {
        
            const result = await Course.updateOne(
            {
                _id:course._id
            },
            {
                $pullAll:{
                    students: [...students]
                    
                }
            });
    
            console.log(result);
    
            return result;
        },
    checkStudentInCourse: async (course,user) => {
        const query = await Course.find({
            _id: course._id,
            students: user
        });

        console.info("Check student in course");

        console.log(query);

        const result = query.length;

        return result;
    },
    getStudentsInCourse: async (course) => {
        const query = await Course.findOne({
            _id: course._id
        });
        return query.students;
    }
    ,
    removeStudent: async (course, student) => {

        course.students.pull(student);
        const result = await course.save();

        console.info("REMOVING STUDENT");
        console.log(result);

        return result;
    },
    changeLecturer: async (course, lecturer) => {
        course.lecturer = lecturer;

        const result = await course.save();
        console.log(result);
        return result;
    },
    removeLecturer: async (course) => {
        course.lecturer = undefined;

        const result = course.save();

        return result;
    }
}