import nodemailer from "nodemailer";

const sendEmail = async ({
  to,
  subject,
  message,
}: {
  to: string;
  subject: string;
  message: string;
}) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_APP_PASS,
    },
  });

  console.log(process.env.SMPT_MAIL);
  console.log(process.env.SMPT_APP_PASS);
  console.log(process.env.SMTP_APP_COMPANY);

  const mailOptions = {
    from: `${process.env.SMTP_COMPANY} <${process.env.SMPT_MAIL}>`, // sender address
    to: to,
    subject: subject,
    html: message,
  };
  // console.log("mailOptions: ", mailOptions);
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(info);
  } catch (error) {
    console.log('error while sending mail to user: ',error);
    throw new Error(`got error while sending mail to user`);
  }
};

export default sendEmail;
