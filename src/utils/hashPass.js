"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const bcrypt_1 = __importDefault(require("bcrypt"));
const hashPass = async (password, saltRounds = 10) => {
    const salt = await bcrypt_1.default.genSalt(saltRounds);
    return bcrypt_1.default.hash(password, salt);
};
module.exports = { hashPass };
