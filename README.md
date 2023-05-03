# Serverless Lambda Function for Sentiment Analysis using ChatGPT API and MongoDB
This repository contains a serverless Lambda function that performs sentiment analysis using the ChatGPT API and stores the results in a MongoDB database. The function is built using the Serverless Framework and can be deployed to any compatible serverless platform, such as AWS Lambda.

<p align="center">
  <img src="https://dulaj-protfilio.s3.us-west-1.amazonaws.com/projects/Screenshot+2023-05-03+at+6.41.29+PM.png"/>
</p>

## Functionality
The Lambda function takes a text input as a parameter and uses the ChatGPT API to perform sentiment analysis on the text. It then stores the analyzed text along with its sentiment score in a MongoDB database for further analysis and retrieval. The sentiment score indicates the sentiment of the text, ranging from negative to positive.

### OpenAI configuration
```
openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
});
```

### Request Body
```
{
  "headers": {
    "Content-Type": "application/json"
  },
  "message": "htis is cool",
  "type": "CUSTOMER",
  "context": 3
}

```

### Response
```
{
  "messages": {
    "sentiment": "Positive",
    "score": 10,
    "avgCustomerSentiment": 4.75,
    "customerSentimentScores": [
      {
        "score": 5,
        "sentiment": "Neutral"
      },
      {
        "score": 10,
        "sentiment": "Positive"
      },
    ]
  }
}
```
