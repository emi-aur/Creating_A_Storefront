"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const OrderModel = __importStar(require("../../models/orders"));
const auth_1 = require("../../middleware/auth");
const orders = express_1.default.Router();
orders.get("/", auth_1.verifyAuthToken, async (req, res) => {
    try {
        const allOrdes = await OrderModel.index();
        res.status(200).json(allOrdes);
    }
    catch (err) {
        res.status(500).json({ error: "Fehler beim Laden der Bestellliste." });
    }
});
orders.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const orderData = await OrderModel.show(id);
        if (!orderData) {
            return res.status(404).json({ error: "Bestellung nicht gefunden." });
        }
        res.status(200).json(orderData);
    }
    catch (err) {
        res.status(500).json({ error: "Fehler beim Abrufen der Bestellung." });
    }
});
orders.post("/", async (req, res) => {
    const { user_id, order_id, quantity, order_status } = req.body;
    try {
        const newOrder = await OrderModel.create({
            user_id,
            order_id,
            quantity,
            order_status,
        });
        res.status(201).json(newOrder);
    }
    catch (err) {
        res
            .status(500)
            .json({ error: "Bestellung konnte nicht erstellt werden." });
    }
});
exports.default = orders;
