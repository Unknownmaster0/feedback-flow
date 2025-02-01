import { decrypt } from "@/lib/session";
import { SessionPayload } from "@/types/definitions";
import sendResponse from "@/utils/Response";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const sessionCookie = (await cookieStore).get("session-token")?.value;

  if (!sessionCookie || sessionCookie == "") {
    return sendResponse(
      { success: false, message: "Not having custom cookie" },
      200
    );
  }
  console.log("session cookie in get session: " + sessionCookie);

  try {
    const session: SessionPayload | null = await decrypt(sessionCookie);
    if (!session || session == null) {
      return sendResponse(
        {
          success: false,
          message: "Don't have custom cookie",
        },
        204
      );
    }
    return sendResponse(
      {
        success: true,
        message: "Session send successfully 🎉🎉",
        data: { session },
      },
      200
    );
  } catch (error) {
    console.log(`error while decrypting the session in get-session `, error);
    return sendResponse(
      { success: false, message: "server error while decryting the session" },
      500
    );
  }
}
