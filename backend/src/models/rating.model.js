const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema({
    course: {
        required: true,
        type: mongoose.Types.ObjectId,
        ref:'course'
    },
    user: {
        required: true,
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    stars: {
        required: true,
        type: Number
    }
})

const Rating = mongoose.model('rating',ratingSchema,'rating');

module.exports = {
    rateCourse: async (courseId,userId,stars) => {
        const query = {
            course: courseId,
            user: userId
        };

        const updatingData = {
            course: courseId,
            user: userId,
            stars:stars
        }

        const foundRating = await Rating.findOne(query);

        if(foundRating)
        {
            const result = await Rating.findOneAndUpdate(query,updatingData,{
                new:true
            });
            return result;
        }

        const newRating = new Rating(updatingData);
        const result = newRating.save();
        return result;

    },
    getAverageStar: async (courseId) => {
        const matchingAggregation = {
            $match: {
                "course": mongoose.Types.ObjectId(courseId)
            }
        };

        const groupingAggregation = {
            $group: {
                _id:"$course",
                "stars":{
                    "$avg":"$stars"
                }
            }
        };

        return await Rating.aggregate([matchingAggregation,groupingAggregation]);
    }
}