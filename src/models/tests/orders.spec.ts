import { Order } from "../orders";
import * as OrderModel from "../orders";
import { User } from "../user";
import * as UserModel from "../user";
import { Product } from "../products";
import * as ProductModel from "../products";

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
