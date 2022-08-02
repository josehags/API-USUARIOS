// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer');
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const { HOST, PORT, EMAIL, PASSWORD } = process.env;

export const transporter = nodemailer.createTransport({
  HOST,
  PORT,
  auth: {
    user: EMAIL,
    PASSWORD,
  },
});

module.exports = {
  transporter,
};
