const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const talkSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "speakerAuth"
  },
  title: {
    type: String,
    isRequired: true
  },
  elevatorPitch: {
    type: String,
    isRequired: true
  },
  talkDuration: {
    type: String,
    isRequired: true
  },
  audienceLevel: {
    type: String,
    enum: ["All", "Intermediate", "Beginner", "Expert"]
  },
  description: {
    type: String
  },
  additionalDetails: {
    type: String
  },
  outcome: {
    type: String
  },
  shortlisted: {
    type: String,
    default: "false"
  },
  talkTags: {
    type: String
  }
});

module.exports = Talk = mongoose.model("talks", talkSchema);
