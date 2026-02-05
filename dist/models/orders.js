"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderWithProducts = exports.addProductToOrder = exports.create = exports.show = exports.index = void 0;
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
// OrderProducts-Funktionen
const addProductToOrder = async (orderProduct) => {
    try {
        const conn = await database_1.default.connect();
        const sql = "INSERT INTO order_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *";
        const result = await conn.query(sql, [
            orderProduct.order_id,
            orderProduct.product_id,
            orderProduct.quantity,
        ]);
        conn.release();
        return result.rows[0];
    }
    catch (err) {
        throw new Error(`Fehler beim Hinzufügen des Produkts zur Bestellung: ${err}`);
    }
};
exports.addProductToOrder = addProductToOrder;
const getOrderWithProducts = async (orderId) => {
    try {
        const conn = await database_1.default.connect();
        // Hole die Bestellung
        const orderSql = "SELECT * FROM orders WHERE id=$1";
        const orderResult = await conn.query(orderSql, [orderId]);
        if (orderResult.rows.length === 0) {
            conn.release();
            return null;
        }
        const order = orderResult.rows[0];
        // Hole die Produkte für diese Bestellung
        const productsSql = `
      SELECT 
        op.product_id,
        p.name as product_name,
        op.quantity,
        p.price
      FROM order_products op
      INNER JOIN products p ON op.product_id = p.id
      WHERE op.order_id=$1
    `;
        const productsResult = await conn.query(productsSql, [orderId]);
        conn.release();
        return {
            ...order,
            products: productsResult.rows,
        };
    }
    catch (err) {
        throw new Error(`Fehler beim Laden der Bestellung mit Produkten: ${err}`);
    }
};
exports.getOrderWithProducts = getOrderWithProducts;
