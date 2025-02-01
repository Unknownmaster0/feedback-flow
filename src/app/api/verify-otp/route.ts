import connectDb from "@/lib/db";
import { createSession } from "@/lib/session";
import User from "@/models/models";
import sendResponse from "@/utils/Response";
import { log } from "console";

export async function POST(req: Request) {
  // userName from query-params and otp from body
  await connectDb();
  const { searchParams } = new URL(req.url);
  const queryUserName = searchParams.get("userName");
  if (!queryUserName) {
    return sendResponse(
      {
        success: false,
        message: "userName expected from query params",
      },
      404
    );
  }
  const userName = queryUserName;

  const { otp } = await req.json();
  if (!otp) {
    return sendResponse(
      {
        success: false,
        message: "otp expected from body",
      },
      404
    );
  }

  // now we get both userName and otp, then need to verify does the otp is valid and within expiry time.
  try {
    const user = await User.findOne({ userName });
    if (!user) {
      return sendResponse(
        {
          success: false,
          message: "no user exist with this userName",
        },
        404
      );
    }

    if (user.isVerified) {
      return sendResponse(
        { success: false, message: "Account already verified" },
        404
      );
    }

    const verificationExpiryDate = new Date(
      `${user?.verificationCodeExpiration}`
    );
    if (verificationExpiryDate < new Date()) {
      // YOU HAVE COME LATE FOR THE VERIFICATION PROCESS, OTP EXPIRE
      return sendResponse(
        {
          success: false,
          message: "older verification code expire",
        },
        404
      );
    }

    // within the bound of the expiry time
    if (user?.verificationCode !== otp) {
      return sendResponse(
        {
          success: false,
          message: "wrong entered verification code",
        },
        404
      );
    }
    // finally when user reach before expiry time and correct otp, then verify the user
    user.isVerified = true;
    await user.save();

    const session = await createSession(
      user._id as string,
      user.userName,
      user.isAcceptingMessage,
      user.isVerified
    );

    return sendResponse(
      {
        success: true,
        message: "Account verified successfully",
      },
      200,
      {
        "Set-Cookie": `session-token=${session}; Path=/; HttpOnly; Max-Age=86400; SameSite=Strict`,
      }
    );
  } catch (error) {
    log("error while verifying otp from database ", error);
    return sendResponse(
      {
        success: false,
        message: "userName expected from query params",
      },
      500
    );
  }
}
