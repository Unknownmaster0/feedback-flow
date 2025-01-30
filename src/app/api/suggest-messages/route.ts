import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 10;

export async function POST(req: Request) {
  const prompt =
    "Generate a list of three open-ended and engaging questions suitable for a diverse audience on an anonymous social messaging platform. Each question should be formatted as a single string and separated by '||'. The questions should avoid personal or sensitive topics and instead focus on universal themes that encourage friendly interaction. Aim for questions that are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment. For example, you might consider themes like hobbies, aspirations, or simple joys in life. Your output should look like this: 'What's a hobby you've recently started? || If you could have dinner with any historical figure, who would it be? || What's a simple thing that makes you happy?'.";

  const result = streamText({
    model: openai("gpt-4o"),
    prompt,
  });

  const finalMessage = result.toDataStreamResponse();
  console.log(finalMessage);
  return Response.json(
    {
      success: true,
      message: finalMessage,
    },
    { status: 200 }
  );
}
