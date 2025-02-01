import connectDb from "@/lib/db";
import User from "@/models/models";
import sendResponse from "@/utils/Response";
import { userNameZodSchema } from "@/validationSchema/signUpSchema";
import { log } from "console";

export async function GET(req: Request) {
  await connectDb();
  // get the username from the url query params.
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
  const userName = decodeURIComponent(queryUserName);
  console.log("username: ", userName);
  const userValidate = userNameZodSchema.safeParse(userName);
  if (!userValidate.success) {
    return sendResponse(
      {
        success: false,
        message: userValidate.error.format()._errors.join(" | "),
      },
      404
    );
  }

  //   if userName is valid schema, then check does any user exist or not with this userName
  const validateUserName = userValidate.data;
  try {
    const existingUser = await User.findOne({
      $and: [{ userName: validateUserName }, { isVerified: true }],
    });

    if (existingUser) {
      return sendResponse(
        {
          success: false,
          message: "User already exist with this userName",
        },
        403
      );
    }

    return sendResponse(
      {
        success: true,
        message: "Valid userName",
      },
      200
    );
  } catch (error) {
    log("error while getting userName from db ", error);
    return sendResponse(
      {
        success: false,
        message: "error while getting userName from db",
      },
      500
    );
  }
}
