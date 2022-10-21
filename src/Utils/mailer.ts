import * as nodemailer from 'nodemailer';
require('dotenv').config();

export const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: Number(process.env.PORT),
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});
