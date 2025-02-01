import connectDb from "@/lib/db";
import User from "@/models/models";
import sendResponse from "@/utils/Response";
import { getSession } from "@/utils/getSession";

// get request to know the current "isAcceptingMessages" status
export async function GET() {
  await connectDb();
  // * learning = How to get the session in the next-auth
  const session = await getSession();
  if (!session || !session.user) {
    return sendResponse(
      {
        success: false,
        message: "User not logged in",
      },
      400
    );
  }
  const user = session.user; // this is the next-auth "User"

  // get the user from db having id = user.id
  try {
    const foundUser = await User.findById({ _id: user.id });
    if (!foundUser) {
      return sendResponse(
        {
          success: false,
          message: "User doesn't exist",
        },
        403
      );
    }

    return sendResponse(
      {
        success: true,
        message: "successfully got the response",
        isAcceptingMessage: foundUser.isAcceptingMessage,
      },
      200
    );
  } catch (error) {
    console.log("error while getting user from db", error);
    return sendResponse(
      {
        success: false,
        message: "error while getting user from db",
      },
      500
    );
  }
}

// post request to toggle "isAcceptingMessages" status
export async function POST(req: Request) {
  await connectDb();
  const { isAcceptingMessage } = await req.json();
  // * learning = How to get the session in the next-auth
  const session = await getSession();
  if (!session || !session.user) {
    return sendResponse(
      {
        success: false,
        message: "User not logged in",
      },
      400
    );
  }

  const user = session.user; // this is the next-auth "User"
  // get the user from db having id = user.id
  try {
    const foundUser = await User.findByIdAndUpdate(
      { _id: user.id },
      {
        isAcceptingMessage,
      }
    );
    if (!foundUser) {
      return sendResponse(
        {
          success: false,
          message: "User doesn't exist",
        },
        403
      );
    }
    return sendResponse(
      {
        success: true,
        message: "toggle the accept-messaging field successfully 🎉",
      },
      200
    );
  } catch (error) {
    console.log("error while getting user from db in accepting-msg", error);
    return sendResponse(
      {
        success: false,
        message: "error while getting user from db",
      },
      500
    );
  }
}
