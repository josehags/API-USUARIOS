"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const datesource_1 = require("./database/datesource");
datesource_1.APPDataSource.initialize().then(() => {
    app_1.app.listen(3001, () => console.log('Server is running! 🏆 Open http://localhost:3001/usuarios to see results'));
});
