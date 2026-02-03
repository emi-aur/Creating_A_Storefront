"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.show = exports.index = void 0;
const database_1 = __importDefault(require("../database"));
const index = async () => {
    try {
        const conn = await database_1.default.connect();
        const sql = 'SELECT * FROM products';
        const result = await conn.query(sql);
        conn.release();
        return result.rows;
    }
    catch (err) {
        throw new Error(`Fehler beim Laden der Produkte: ${err}`);
    }
};
exports.index = index;
const show = async (id) => {
    try {
        const conn = await database_1.default.connect();
        const sql = 'SELECT * FROM products WHERE id=($1)';
        const result = await conn.query(sql, [id]);
        conn.release();
        return result.rows[0];
    }
    catch (err) {
        throw new Error(`Fehler beim Finden des Produkts: ${err}`);
    }
};
exports.show = show;
const create = async (p) => {
    try {
        const conn = await database_1.default.connect();
        const sql = 'INSERT INTO product (name, price) VALUES($1,$2) RETURNING *';
        const result = await conn.query(sql, [p.name, p.price]);
        const product = result.rows[0];
        conn.release();
        return product;
    }
    catch (err) {
        throw new Error(`Fehler beim Erstellen des Produkts: ${err}`);
    }
};
exports.create = create;
