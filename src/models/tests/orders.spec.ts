import { Order } from "../orders";
import * as OrderModel from "../orders";
import { User } from "../user";
import * as UserModel from "../user";

describe("Order Model", () => {
  let createdUserId: number;
  let orderId: number;

  // Create a test user first
  beforeAll(async () => {
    const testUser = await UserModel.create({
      firstname: "Test",
      lastname: "User",
      password_digest: "password123",
    });
    createdUserId = testUser.id as number;

    // Create a test order
    const order = await OrderModel.create({
      user_id: createdUserId,
      order_status: true, 
      order_id: 0,
      quantity: 1,
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
      order_id: 1,
      quantity: 2,
      order_status: true,
    };
    const result = await OrderModel.create(order);
    expect(result).toBeDefined();
    expect(result.user_id).toBe(order.user_id);
  });
});
