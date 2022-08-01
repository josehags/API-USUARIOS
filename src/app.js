"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const typeorm_pagination_1 = require("typeorm-pagination");
const AppError_1 = require("./errors/AppError");
const routes_1 = require("./routes/routes");
const app = (0, express_1.default)();
exports.app = app;
/*app.use((req, res, next) => {
  //Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "*");
  //Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors());
    next();
});*/
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(typeorm_pagination_1.pagination);
app.use(routes_1.router);
app.use((err, request, response, _next) => {
    if (err instanceof AppError_1.AppError) {
        return response.status(err.statusCode).json({
            message: err.message,
        });
    }
    return response.status(500).json({
        status: 'Error',
        message: `Internal server error ${err.message}`,
    });
});
