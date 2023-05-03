import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { Configuration, OpenAIApi } from "openai";
import mongoose from "mongoose";

import schema from "./schema";
import { GPTPrompt } from "./constants";
import MessageSchema from "src/schema/MessageSchema";

const getSentiment: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  mongoose.connect(process.env.MONGO_URL);

  let conversation = null;
  let prompt = null;

  if (event.body.context) {
    conversation = await MessageSchema.find()
      .sort({
        timestamp: "desc",
      })
      .limit(event.body.context)
      .then((data) => {
        const conversation = data.map((msgRecord) => {
          return `${msgRecord.type}: ${msgRecord.message}\n`;
        });
        return conversation;
      });
  }

  if (conversation) {
    prompt = `${GPTPrompt.SENTIMENT_CUSTOMER} "${conversation}",  ${GPTPrompt.SENTIMENT} ${GPTPrompt.RANKING} ${event.body.message} ${GPTPrompt.RESPONSE}`;
  } else {
    prompt = `${GPTPrompt.SENTIMENT} ${GPTPrompt.RANKING} ${event.body.message} ${GPTPrompt.RESPONSE}`;
  }

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  const answer = completion.data.choices[0].text;

  const sentiment = answer.trim().split(".")[0];
  const score = Number(answer.trim().split(".")[1]);

  const savedMessage = await MessageSchema.create({
    user: 1,
    message: event.body.message,
    sentiment: sentiment,
    score: score,
    type: event.body.type,
    timestamp: new Date(),
  });

  const [avarageCustomerSentiment] = await MessageSchema.aggregate([
    {
      $match: {
        type: "CUSTOMER",
      },
    },
    {
      $group: {
        _id: null,
        avgScore: {
          $avg: "$score",
        },
      },
    },
  ]);

  const cutomerScoreArr = await MessageSchema.find({})
    .sort({
      timestamp: "desc",
    })
    .limit(10)
    .then((data) => {
      return data.map((msgRecord) => {
        return { score: msgRecord.score, sentiment: msgRecord.sentiment };
      });
    });

  await MessageSchema.findOneAndUpdate(
    { _id: savedMessage._id },
    {
      $set: {
        avgCustomerSentiment: avarageCustomerSentiment.avgScore,
        customerSentimentScores: cutomerScoreArr,
      },
    }
  );

  const responseData = {
    sentiment,
    score,
    avgCustomerSentiment: avarageCustomerSentiment.avgScore,
    customerSentimentScores: cutomerScoreArr,
  };

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({
      messages: responseData,
    }),
  };

  return response;
};

export const main = middyfy(getSentiment);
