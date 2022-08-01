"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
const typeorm_1 = require("typeorm");
const uuid_1 = require("uuid"); // Importando o uuid v4 e renomeando pra uuid
let Usuario = class Usuario {
    /*
        A geração do uuID automático não será por meio do SGBD, e sim aqui pelo código
        Utilizando a bilioteca: yarn add uuid
        Tipos da biblioteca uuid: yarn add @types/uuid -D
    */
    constructor() {
        // Se esse ID não existir, gerar um id
        if (!this.id) {
            this.id = (0, uuid_1.v4)();
        }
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Usuario.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)() // Poderia passar o nome da coluna: @Column("name"), mas o atributo já está com mesmo nome
    ,
    __metadata("design:type", String)
], Usuario.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Usuario.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Usuario.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Usuario.prototype, "sector", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Usuario.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Usuario.prototype, "temporaryPassword", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Usuario.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], Usuario.prototype, "deleted_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)() // Para já capturar a data e fazer a formatação
    ,
    __metadata("design:type", Date)
], Usuario.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)() // Para já capturar a data e fazer a formatação
    ,
    __metadata("design:type", Date)
], Usuario.prototype, "update_at", void 0);
Usuario = __decorate([
    (0, typeorm_1.Entity)('usuarios') // Do TypeORM, pois será uma entidade do banco de dados, utilizada no controller
    ,
    __metadata("design:paramtypes", [])
], Usuario);
exports.Usuario = Usuario;
