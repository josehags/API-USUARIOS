"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
const { HOST, PORT, EMAIL, PASSWORD } = process.env;
exports.transporter = nodemailer_1.default.createTransport({
    HOST,
    PORT,
    auth: {
        user: EMAIL,
        PASSWORD,
    },
});
module.exports = {
    transporter: exports.transporter,
};
