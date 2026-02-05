import { Order } from "../orders";
import * as OrderModel from "../orders";
import * as UserModel from "../user";
import * as ProductModel from "../products";
import request from "supertest";
import app from "../../server";
import jwt from "jsonwebtoken";

describe("Order Handler", () => {
  let authToken: string;
  let testUserId: number;
  let testOrderId: number;
  let testProductId: number;

  // Token vor allen Tests generieren
  beforeAll(async () => {
    // Erstelle Test-User
    const testUser = await UserModel.create({
      firstname: "Test",
      lastname: "Handler",
      password_digest: "test123",
    });
    testUserId = testUser.id as number;

    // Generiere echten JWT-Token
    authToken = jwt.sign(
      { user: testUser },
      process.env.TOKEN_SECRET as string
    );

    // Erstelle Test-Produkt
    const testProduct = await ProductModel.create({
      name: "Test Product",
      price: 19.99,
    });
    testProductId = testProduct.id as number;

    // Erstelle Test-Order
    const testOrder = await OrderModel.create({
      user_id: testUserId,
      order_status: true,
    });
    testOrderId = testOrder.id as number;
  });

  describe("GET /api/orders", () => {
    it("sollte eine Liste von Bestellungen zurückgeben, wenn ein Token vorhanden ist", async () => {
      const response = await request(app)
        .get("/api/orders")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("sollte 401 zurückgeben, wenn der Token fehlt", async () => {
      const response = await request(app).get("/api/orders");

      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/orders/:id", () => {
    it("sollte eine spezifische Bestellung mit Produkten zurückgeben", async () => {
      const response = await request(app).get(`/api/orders/${testOrderId}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(testOrderId);
      expect(response.body.products).toBeDefined();
    });

    it("sollte 404 zurückgeben für nicht existierende Order", async () => {
      const response = await request(app).get("/api/orders/99999");

      expect(response.status).toBe(404);
    });
  });

  describe("POST /api/orders", () => {
    it("sollte eine neue Bestellung erstellen, wenn ein Token vorhanden ist", async () => {
      const response = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          user_id: testUserId,
          order_status: true,
        });

      expect(response.status).toBe(201);
      expect(response.body.user_id).toBe(testUserId);
      expect(response.body.id).toBeDefined();
    });

    it("sollte 401 zurückgeben, wenn der Token fehlt", async () => {
      const response = await request(app)
        .post("/api/orders")
        .send({ user_id: testUserId, order_status: false });

      expect(response.status).toBe(401);
    });
  });

  describe("POST /api/orders/:id/products", () => {
    it("sollte ein Produkt zu einer Order hinzufügen mit Token", async () => {
      const response = await request(app)
        .post(`/api/orders/${testOrderId}/products`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          product_id: testProductId,
          quantity: 3,
        });

      expect(response.status).toBe(201);
      expect(response.body.order_id).toBe(testOrderId);
      expect(response.body.product_id).toBe(testProductId);
      expect(response.body.quantity).toBe(3);
    });

    it("sollte 401 zurückgeben ohne Token", async () => {
      const response = await request(app)
        .post(`/api/orders/${testOrderId}/products`)
        .send({
          product_id: testProductId,
          quantity: 1,
        });

      expect(response.status).toBe(401);
    });
  });
});

describe("Order Model", () => {
  let createdUserId: number;
  let orderId: number;
  let productId: number;

  // Create a test user and product first
  beforeAll(async () => {
    const testUser = await UserModel.create({
      firstname: "Test",
      lastname: "User",
      password_digest: "password123",
    });
    createdUserId = testUser.id as number;

    // Create a test product
    const testProduct = await ProductModel.create({
      name: "Test Product",
      price: 29.99,
    });
    productId = testProduct.id as number;

    // Create a test order
    const order = await OrderModel.create({
      user_id: createdUserId,
      order_status: true,
    });
    orderId = order.id as number;

    // Add product to order for testing
    await OrderModel.addProductToOrder({
      order_id: orderId,
      product_id: productId,
      quantity: 2,
    });
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
    const order: Order = {
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
