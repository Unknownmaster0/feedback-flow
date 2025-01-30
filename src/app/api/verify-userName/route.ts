import connectDb from "@/lib/db";
import User from "@/models/models";
import sendResponse from "@/utils/Response";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userName = searchParams.get("userName");
  console.log('userName:', userName);
  if (!userName) {
    return sendResponse({ success: false, message: "user Not exist" }, 404);
  }

  try {
    await connectDb();
    const user = await User.findOne({
      $and: [{ userName }, { isVerified: true }],
    });
    if (!user) {
      return sendResponse({ success: false, message: "user Not exist" }, 404);
    }

    return sendResponse(
      {
        success: true,
        message: "User exist with this userName",
        data: {
          user: {
            id: user.id,
            isAcceptingMessage: user.isAcceptingMessage,
            email: user.email,
            userName: user.userName,
          },
        },
      },
      200
    );
  } catch (error) {
    console.error("error while getting user from db", error);
    return sendResponse(
      {
        success: false,
        message: "error while getting user from db",
      },
      500
    );
  }
}
