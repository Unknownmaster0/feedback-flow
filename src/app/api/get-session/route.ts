import { decrypt } from "@/lib/session";
import sendResponse from "@/utils/Response";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const cookieStore = cookies();
  const sessionCookie = (await cookieStore).get("session")?.value;

  if (!sessionCookie) {
    return sendResponse(
      { success: false, message: "You are not logged in" },
      200
    );
  }

  try {
    const session = await decrypt(sessionCookie);

    return sendResponse(
      {
        success: true,
        message: "Session send successfully 🎉🎉",
        data: { session }, //todo: think of the actual type has to give.
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
