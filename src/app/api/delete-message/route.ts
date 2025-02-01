import connectDb from "@/lib/db";
import sendResponse from "@/utils/Response";
import User from "@/models/models";
import mongoose from "mongoose";
import { getSession } from "@/utils/getSession";

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session || !session.user) {
    return sendResponse(
      { success: false, message: "You are not logged in" },
      404
    );
  }

  const { searchParams } = new URL(req.url);
  const msgId = searchParams.get("msgId"); //* should get the msgId in this format only and name.
  if (!msgId) {
    return sendResponse(
      { success: false, message: "Provide msgId in queryParams" },
      401
    );
  }

  const messageObjectId = new mongoose.Types.ObjectId(msgId);

  try {
    await connectDb();
    const user = await User.findByIdAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(session.user.id as string),
      },
      {
        $pull: {
          messages: { _id: messageObjectId },
        },
      },
      { new: true }
    );

    if (!user) {
      return sendResponse(
        { success: false, message: "User not found with given session" },
        401
      );
    }

    // now delete that message from Message-model.
    return sendResponse(
      { success: true, message: "message deleted successfully 🎉🎉" },
      200
    );
  } catch (error) {
    console.log("internal sever error in delete msg: ", error);
    return sendResponse(
      {
        success: false,
        message: "internal server error",
      },
      500
    );
  }
}
