import * as nodemailer from 'nodemailer';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: Number(process.env.PORT),
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});
