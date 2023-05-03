import mongoose from "mongoose";
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  user: { type: String, required: true },
  message: { type: String, required: true },
  sentiment: { type: String, required: true },
  score: { type: Number, required: true },
  timestamp: { type: Date, required: true },
  type: { type: String, required: true },
  avgCustomerSentiment: { type: Number, required: false },
  customerSentimentScores: { type: Array, required: false },
});

export default mongoose.model("MessageSchema", MessageSchema);
