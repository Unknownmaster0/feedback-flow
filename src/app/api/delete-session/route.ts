import sendResponse from "@/utils/Response";

/* import { NextResponse } from "next/server";
import sendResponse from "@/utils/Response";

export async function DELETE(req: Request) {
  const response = NextResponse.json(
    { success: true, message: "Logged out successfully" },
    { status: 200 }
  );

//   Set the 'session' cookie with an expiration date in the past
  response.cookies.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: -1, // Expire immediately
  });

  return response;
}
*/
export async function DELETE(req: Request) {
  // Set-Cookie": `session=${session}; HttpOnly; Secure; Path=/; SameSite=Lax;`,
  return sendResponse(
    { success: true, message: "Logged out successfully" },
    200,
    {
      "Set-cookie": `session=; HttpOnly; Secure; Path=/; SameSite=lax Max-Age=0`,
    }
  );
}
