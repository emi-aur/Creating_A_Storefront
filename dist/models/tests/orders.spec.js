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
Object.defineProperty(exports, "__esModule", { value: true });
const OrderModel = __importStar(require("../orders"));
const UserModel = __importStar(require("../user"));
const ProductModel = __importStar(require("../products"));
describe("Order Model", () => {
    let createdUserId;
    let orderId;
    let productId;
    // Create a test user and product first
    beforeAll(async () => {
        const testUser = await UserModel.create({
            firstname: "Test",
            lastname: "User",
            password_digest: "password123",
        });
        createdUserId = testUser.id;
        // Create a test product
        const testProduct = await ProductModel.create({
            name: "Test Product",
            price: 29.99,
        });
        productId = testProduct.id;
        // Create a test order
        const order = await OrderModel.create({
            user_id: createdUserId,
            order_status: true,
        });
        orderId = order.id;
    });
    it("should have an index method", () => {
        expect(OrderModel.index).toBeDefined();
    });
    it("should have a show method", () => {
        expect(OrderModel.show).toBeDefined();
    });
    it("should have a create method", () => {
        expect(OrderModel.create).toBeDefined();
    });
    it("should have an addProductToOrder method", () => {
        expect(OrderModel.addProductToOrder).toBeDefined();
    });
    it("should have a getOrderWithProducts method", () => {
        expect(OrderModel.getOrderWithProducts).toBeDefined();
    });
    it("index method should return a list of orders", async () => {
        const result = await OrderModel.index();
        expect(result.length).toBeGreaterThan(0);
    });
    it("show method should return the correct order", async () => {
        const result = await OrderModel.show(orderId.toString());
        expect(result?.id).toEqual(orderId);
    });
    it("create method should add an order", async () => {
        const order = {
            user_id: createdUserId,
            order_status: true,
        };
        const result = await OrderModel.create(order);
        expect(result).toBeDefined();
        expect(result.user_id).toBe(order.user_id);
    });
    it("addProductToOrder should add a product to an order", async () => {
        const result = await OrderModel.addProductToOrder({
            order_id: orderId,
            product_id: productId,
            quantity: 2,
        });
        expect(result).toBeDefined();
        expect(result.order_id).toBe(orderId);
        expect(result.product_id).toBe(productId);
        expect(result.quantity).toBe(2);
    });
    it("getOrderWithProducts should return order with products", async () => {
        const result = await OrderModel.getOrderWithProducts(orderId.toString());
        expect(result).toBeDefined();
        expect(result?.id).toBe(orderId);
        expect(result?.products).toBeDefined();
        expect(result?.products?.length).toBeGreaterThan(0);
    });
});
