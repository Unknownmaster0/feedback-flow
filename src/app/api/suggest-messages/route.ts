import { client } from "@/utils/connectAi";
import sendResponse from "@/utils/Response";

const prompt = `Generate three positive feedback messages for a user, ensuring that each message is encouraging and uplifting. The messages should not contain any abusive, demotivating, self-down, or negative words. Each message should include positive language and may include motivational sentiments. Separate each message with a pipe (|)."

Example Output: "Your contributions are truly valuable and make a difference! | Keep up the great work; your efforts are inspiring! | You have a wonderful ability to uplift those around you; continue shining bright!`;

export async function GET() {
  try {
    const stream = await client.v2.chatStream({
      model: "command-r-plus-08-2024",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chatEvent of stream) {
          if (chatEvent.type === "content-delta") {
            const text = chatEvent.delta?.message?.content?.text;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        }
        controller.close();
      },
    });

    return sendResponse(
      { success: true, message: "Generated text" },
      200,
      new Headers({
        "Content-Type": "text/plain",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      }),
      readableStream
    );
  } catch (error) {
    console.log("error while getting the message from ai", error);
    return sendResponse(
      {
        success: false,
        message: "error while getting the message from ai",
      },
      500
    );
  }
}
