const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const talkSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : "users"
    },
    title : {
        type : String,
        isRequired : true
    },
    elevatorPitch : {
        type : String,
        isRequired : true
    },
    talkDuration : {
        type : Number,
        isRequired : true
    },
    audienceLevel : {
        type : String,
        enum : ['All','Intermediate','Beginner','Expert']
    },
    description : {
        type : String,
    },
    additionalDescription : {
        type : String
    },
    outcome : {
        type : String
    }

});

module.exports = Talk = mongoose.model("talks", talkSchema);