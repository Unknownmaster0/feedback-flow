import connectDb from "@/lib/db";
import User from "@/models/models";
import sendResponse from "@/utils/Response";

export async function GET() {
  await connectDb();

  try {
    const allUsersFromDb = await User.find();
    const userWithSomePrameters = allUsersFromDb.map((user) => ({
      id: user._id,
      email: user.email,
      userName: user.userName,
    }));
    return sendResponse(
      {
        success: true,
        message: "user Send successfully",
        data: { users: userWithSomePrameters },
      },
      200
    );
  } catch (error) {
    console.log("internal sever error in get-all-users: ", error);
    return sendResponse(
      {
        success: false,
        message: "internal server error",
      },
      500
    );
  }
}
