"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APPDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Usuario_1 = require("../models/Usuario");
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
exports.APPDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: false,
    entities: [Usuario_1.Usuario],
    migrations: [],
    subscribers: [],
});
