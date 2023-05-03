export enum SentimentTypes {
  POSITIVE = "POSITIVE",
  NEGATIVE = "NEGATIVE",
  NEUTRAL = "NEUTRAL",
}

enum SentimentPrompt {
  SENTIMENT = "SENTIMENT",
  SENTIMENT_CUSTOMER = "SENTIMENT_CUSTOMER",
  RANKING = "RANKING",
  OVERALL = "OVERALL",
  RESPONSE = "RESPONSE",
}

export const GPTPrompt = {
  [SentimentPrompt.SENTIMENT]: `What is the sentiment of this statement (Negative/Positive/Neutral)?`,
  [SentimentPrompt.SENTIMENT_CUSTOMER]: `Based on CUSTOMER responses in this conversation?`,
  [SentimentPrompt.RANKING]: `On a scale of 1 to 10, how positive or negative is this statement (1-10)?`,
  [SentimentPrompt.RESPONSE]: `Response Format: "sentiment.score"`,
};
