import connectDb from "@/lib/db";
import User from "@/models/models";
import sendResponse from "@/utils/Response";
import sendEmail from "@/utils/sendEmail.utility";
import bcrypt from "bcryptjs";
import { log } from "console";

export async function POST(req: Request) {
  await connectDb();
  try {
    const { userName, email, password } = await req.json();
    const otp = Math.floor(Math.random() * 900000 + 100000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationCodeExpiration = new Date();
    verificationCodeExpiration.setHours(
      verificationCodeExpiration.getHours() + 1
    ); // 1 Hr EXPIRY FROM THE TIME TO CREATING THE OTP

    const userExistAndVerified = await User.findOne({
      $and: [{ $or: [{ email }, { userName }] }, { isVerified: true }],
    });

    if (userExistAndVerified) {
      // IF USER EXIST AS WELL AS VERIFIED THEN RETURN THAT ALREADY EXIST
      return sendResponse(
        {
          success: false,
          message: "User Already exist with this email or userName",
        },
        403
      );
    }

    // USER EXIST BUT NOT VERIFIED.
    const userExistUpdated = await User.findOneAndUpdate(
      {
        $and: [{ $or: [{ email }, { userName }] }, { isVerified: false }],
      },
      {
        $set: {
          email,
          password: hashedPassword,
          userName,
          verificationCode: otp,
          verificationCodeExpiration,
        },
      },
      { new: true } // FOR RETURNING THE UPDATED USER);
    );

    // IF THE USER not exist
    if (!userExistUpdated) {
      await User.create({
        email,
        userName,
        password: hashedPassword,
        verificationCode: otp,
        verificationCodeExpiration,
      });
    }

    try {
      await sendEmail({
        to: email,
        subject: "Verify your mail",
        message: `
            <html lang="en">
              <head>
                <title>Hii ${userName}</title>
                <br />
              </head>
              <body style="backgroundColor: "#BAC4C8" ">
                <div style="
                    fontWeight: "500";
                    fontSize: "small""
        >
                    <div>
                      Thank you <strong>${userName}</strong> for joining our waitlist and
                      for your patience. We will send you a note when we have something
                      new to share.
                      <div>
                        Your verification code to signup:
                        <h1 style={{ backgroundColor: "red", display: "inline" }}>
                          ${otp}
                        </h1>
                      </div>
                    </div>
                  </div>
              </body>
            </html>
        `,
      });
      log("mail is send to user");
      return sendResponse(
        {
          success: true,
          message: "user registered and otp is send to respective email",
        },
        200
      );
    } catch (error: any) {
      return sendResponse(
        {
          success: false,
          message: "error while sending email " + error?.message,
        },
        503
      );
    }
  } catch (error) {
    console.error("error while user sign-up", error);
    return sendResponse(
      {
        success: false,
        message: "error while registering user",
      },
      500
    );
  }
}
