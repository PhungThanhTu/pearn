const mongoose = require('mongoose');

const scoreMetadataSchema = mongoose.Schema({

    block: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'block'
    },
    course: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course'
    },
    scoreWeight:{
        required: true,
        type: Number,
        default: 0
    }
})

let ScoreMetadata = mongoose.model('scoreMeta',scoreMetadataSchema,'scoreMeta');

module.exports = {
    createScoreMeta: async (blockId, courseId, initialWeight) => {

        // execute on creating exercise block
        // TODO: Create a score meta model using blockId, courseId, and initialWeight
        // actually courseId isn't needed, but it's easier to query when apply courseId
        const newScoreMeta = new ScoreMetadata({
            block: blockId,
            course: courseId,
            scoreWeight: initialWeight
        });
        const result = await newScoreMeta.save();
        return result;
    },
    setWeightForBlock: async (blockId, weight) => {
        // only need blockId to set weight
        // applied on block API
        const result = await ScoreMetadata.findOneAndUpdate({block:blockId},{
            scoreWeight:weight
        },{
            new: true
        });
        return result;
    },
    getWeightOfBlock: async (blockId) => {
       const query = {
        block: blockId
       };
       const result = await ScoreMetadata.findOne(query);
       return result.scoreWeight;
    },
    getSumWeight: async (courseId) => {
        const matchingAggregation = {
            $match: {
                "course": mongoose.Types.ObjectId(courseId)
            }
        };

        const groupingAggregation = {
            $group: {
                _id: null,
                sumWeight: {$sum: "$scoreWeight"}
            }
        };

        const aggregation = [matchingAggregation,groupingAggregation];

        const result = await ScoreMetadata.aggregate(aggregation);
        return result[0].sumWeight;
    }
}