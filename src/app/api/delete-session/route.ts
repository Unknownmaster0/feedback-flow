import sendResponse from "@/utils/Response";

export async function DELETE() {
  return sendResponse(
    { success: true, message: "Logged out successfully" },
    200,
    {
      "Set-cookie": `next-auth.session-token=; HttpOnly; Secure; Path=/; SameSite=lax Max-Age=0`,
    }
  );
}
