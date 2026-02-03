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
        const sql = "SELECT * FROM orders";
        const result = await conn.query(sql);
        conn.release();
        return result.rows;
    }
    catch (err) {
        throw new Error(`Fehler beim Laden der Bestellungen: ${err}`);
    }
};
exports.index = index;
const show = async (id) => {
    try {
        const conn = await database_1.default.connect();
        const sql = "SELECT * FROM orders WHERE id=($1)";
        const result = await conn.query(sql, [id]);
        conn.release();
        return result.rows[0];
    }
    catch (err) {
        throw new Error(`Fehler beim Finden der Bestellung: ${err}`);
    }
};
exports.show = show;
const create = async (o) => {
    try {
        const conn = await database_1.default.connect();
        const sql = "INSERT INTO orders (user_id, order_status) VALUES($1,$2) RETURNING *";
        const result = await conn.query(sql, [o.user_id, o.order_status]);
        const order = result.rows[0];
        conn.release();
        return order;
    }
    catch (err) {
        throw new Error(`Fehler beim Erstellen der Bestellung: ${err}`);
    }
};
exports.create = create;
