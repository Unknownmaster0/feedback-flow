import { client } from "@/utils/connectAi";
import sendResponse from "@/utils/Response";

export async function GET() {
  const prompt = process.env.FEEDBACK_PROMPT;
  // console.log('prompt: ', prompt);

  if (!prompt) {
    console.error("ERROR: PROMPT environment variable not set.");
    return sendResponse(
      {
        success: false,
        message: "Server configuration error",
      },
      500
    );
  }

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
              console.log("text: ", text);
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
    // console.log("error while getting the message from ai", error);
    return sendResponse(
      {
        success: false,
        message: "error while getting the message from ai",
      },
      500
    );
  }
}
