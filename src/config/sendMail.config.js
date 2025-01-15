import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import environmentConfig from "./environment.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: environmentConfig.SMTP_HOST,
    port: 587,
    secure: false, // true for 587, false for other ports
    requireTLS: true,
    auth: {
      user: environmentConfig.SMTP_MAIL,
      pass: environmentConfig.SMTP_PASSWORD,
    },
  });

  const { email, subject, template, data } = options;

  // get the dpath to the email template file
  const templatePath = path.join(__dirname, "../mails", template);

  // reder the email template with ejs
  const html = await ejs.renderFile(templatePath, data);

  const mailOptions = {
    from: environmentConfig.SMTP_MAIL,
    to: email,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
  });
};

export default sendMail;
