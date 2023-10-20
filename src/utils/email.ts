import nodemailer from "nodemailer";

interface EmailInterface {
  from: string;
  to: string;
  subject: string;
  text: string;
}

const sendEmail = async (options: Record<string, string>) => {
  const transporter = nodemailer.createTransport({
    service: "stmp",
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //EMAL OPTIONS
  const emailOptions: EmailInterface = {
    from: "alaa@hosting-egypt.com",
    to: options.to,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(emailOptions);
};
export default sendEmail;
