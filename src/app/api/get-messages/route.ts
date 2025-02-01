import connectDb from "@/lib/db";
import User from "@/models/models";
import mongoose from "mongoose";
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
  // ** information: as the session.user.id is in string format, then it will create error while getting the user based on id. At the time of aggregation the id expected was of objectId.
  // * making the object id from string session.user.id
  const userId = new mongoose.Types.ObjectId(session.user.id);
  try {
    // * AGGREGATION : getting user having the aggregated messages in different object.
    const user = await User.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    // log("user from db in get-messages: ", user);

    if (!user) {
      return sendResponse(
        {
          success: false,
          message: "User not found",
        },
        404
      );
    }

    return sendResponse(
      {
        success: true,
        message:
          user.length === 0
            ? "no messages to show"
            : "Message send successfully 🎉",
        messages: user.length === 0 ? [] : user[0].messages, //todo: solve the type error later.
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
