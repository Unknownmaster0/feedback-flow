import { CohereClient } from "cohere-ai";

export const client = new CohereClient({
  token: process.env.COHORE_AI_API_KEY,
});
