import { middyfy } from "@libs/lambda";
import MessageSchema from "src/schema/MessageSchema";
import mongoose from "mongoose";

const getMessages = async () => {
  mongoose.connect(process.env.MONGO_URL);

  const messages = await MessageSchema.find().sort({
    timestamp: "desc",
  });

  const formattedMessages = messages.map((msgRecord) => {
    return {
      type: msgRecord.type,
      message: msgRecord.message,
      timestamp: msgRecord.timestamp,
      score: msgRecord.score,
      sentiment: msgRecord.sentiment,
      avgCustomerSentiment: msgRecord.avgCustomerSentiment,
      customerSentimentScores: msgRecord.customerSentimentScores,
    };
  });

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({
      messages: formattedMessages,
    }),
  };

  return response;
};

export const main = middyfy(getMessages);
