import connectDb from "@/lib/db";
import User, { MessageInterface } from "@/models/models";
import messageZodSchema from "@/validationSchema/messageSchema";
import { userNameZodSchema } from "@/validationSchema/signUpSchema";
import sendResponse from "@/utils/Response";
import sendEmail from "@/utils/sendEmail.utility";
import mongoose from "mongoose";

export async function POST(req: Request) {
  await connectDb();

  // user will send: {userName, content/message} in req.json().
  const { userName, message } = await req.json();
  if (!userName) {
    return sendResponse(
      {
        success: false,
        message: "userName is required",
      },
      404
    );
  }
  if (!message) {
    return sendResponse(
      {
        success: false,
        message: "message is required",
      },
      404
    );
  }

  const validateMessage = messageZodSchema.safeParse({ content: message });
  if (!validateMessage.success) {
    return sendResponse(
      {
        success: false,
        message: validateMessage.error.format()._errors.join(" | "),
      },
      404
    );
  }

  const validateUserName = userNameZodSchema.safeParse(userName);
  if (!validateUserName.success) {
    return sendResponse(
      {
        success: false,
        message: validateUserName.error.format()._errors.join(" | "),
      },
      404
    );
  }

  try {
    const user = await User.findOne({ userName: validateUserName.data });
    if (!user) {
      return sendResponse(
        {
          success: false,
          message: "username not found | wrong username",
        },
        404
      );
    }

    if (!user.isAcceptingMessage) {
      return sendResponse(
        { success: true, message: "User is busy | Not accepting your msg" },
        200
      );
    }

    //* important: type of message should be same as "MessageInterface" then only it will accept else not.
    const msg = {
      content: validateMessage.data.content,
      createdAt: new Date(),
    };

    //* started the session and transaction with mongodb, if the email is fails to send then no message should be pushed into the db.
    const session = await mongoose.startSession();
    session.startTransaction();

    user.messages.push(msg as MessageInterface);
    (await user.save()).$session(session);
    try {
      await sendEmail({
        to: user.email,
        subject: `You have a message waiting`,
        message: `<html lang="en">
                <head>
                  <title>Hii ${user.userName}</title>
                  <br />
                </head>
                <body style="backgroundColor: "#BAC4C8" ">
                  <div style="
                      fontWeight: "500";
                      fontSize: "small" ">
                      <div>
                      Don't miss out! A new message is waiting for you in <strong>
                      ${process.env.SMTP_COMPANY}
                      </strong>. Login and read your feeback.
                      </div>
                    </div>
                </body>
              </html>`,
      });

      await session.commitTransaction();
    } catch (error) {
      if (session.inTransaction()) await session.abortTransaction();
      sendResponse({ success: false, message: error as string }, 500);
    } finally {
      session.endSession();
    }

    return sendResponse(
      {
        success: true,
        message: "Message sent successfully 🎉",
      },
      200
    );
  } catch (error) {
    console.log("error while sending message in catch: ", error);
    return sendResponse(
      {
        success: false,
        message: "internal server error",
      },
      500
    );
  }
}
