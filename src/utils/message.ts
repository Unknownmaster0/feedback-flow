export const subjectOtp = "Verify your mail";

export const messageOtp = (userName: string, otp: string) => {
  return `
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
        `;
};
