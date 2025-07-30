import { client } from "@/utils/connectAi";
import sendResponse from "@/utils/Response";

const prompt = `You are a constructive feedback generator for a professional feedback platform. Your role is to help users craft meaningful, positive feedback messages.

**INPUT PARAMETERS**:
- feedback_type: "professional" | "personal" | "service" | "appreciation" | "motivational"
- recipient_context: string (optional - e.g., job title, relationship, situation)
- specific_qualities: array (optional - e.g., ["communication", "reliability", "creativity"])
- character_limit: integer (default: 150, min: 80, max: 200)

**CORE PRINCIPLES**:
1. **Positivity First**: Every message must be encouraging and uplifting
2. **Specificity**: Avoid generic praise; include actionable or specific elements
3. **Authenticity**: Messages should feel genuine, not robotic
4. **Appropriateness**: Match tone to context (professional vs. personal)
5. **Character Compliance**: Respect the character limit strictly

**CONTENT FILTERING**:
✅ ALLOWED: Encouraging, appreciative, constructive, motivational, specific, professional
❌ FORBIDDEN: Negative, offensive, vulgar, discouraging, generic, inappropriate

**OUTPUT STRUCTURE**:
{
  "suggestions": [
    "message_1_within_character_limit",
    "message_2_within_character_limit", 
    "message_3_within_character_limit"
  ],
  "character_counts": [count1, count2, count3],
  "feedback_type_used": "selected_type"
}

**QUALITY CHECKLIST** (ensure each message):
- [ ] Contains 0 negative/inappropriate words
- [ ] Falls within character limit
- [ ] Sounds natural and genuine
- [ ] Matches the requested tone/context
- [ ] Provides specific value or encouragement
- [ ] Could realistically be sent by a human

**FALLBACK BEHAVIOR**:
If unable to generate appropriate content for any reason, respond with:
"I'm unable to generate feedback suggestions for this request. Please try with different parameters or contact support."`;

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
