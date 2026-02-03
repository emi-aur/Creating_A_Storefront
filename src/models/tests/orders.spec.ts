
import { Order } from '../orders';
import * as OrderModel from "../orders"
import { User } from '../user'
import * as UserModel from "../user"


describe("Order Model", () => {
    let createdUserId: number;
    let orderId: number;

    // Vor allen Tests erstellen wir einen User, damit wir eine gültige ID haben
    beforeAll(async () => {
        const testUser = await UserModel.create({
            firstname: 'Test',
            lastname: 'User',
            password_digest: 'password123'
        });
        createdUserId = testUser.id as number;
    });

    it('should have an index method', () => {
        expect(OrderModel.index).toBeDefined();
    });

    it('should have a show method', () => {
        expect(OrderModel.show).toBeDefined();
    });

    it('should have a create method', () => {
        expect(OrderModel.create).toBeDefined();
    });

    it('create method should add a order', async () => {
        const result = await OrderModel.create({
            user_id: createdUserId,
            order_id: 1,
            quantity: 2,
            order_status: true
        });
        orderId = result.id as number;
        expect(result).toBeDefined();
        expect(result.user_id).toBe(createdUserId);
        expect(result.order_status).toBe(true);
    });

    it('show method should return the correct order', async () => {
        const result = await OrderModel.show(orderId.toString());
        expect(result).toBeDefined();
        expect(result.id).toEqual(orderId);
        expect(result.order_status).toEqual(true);
    });

    it('index method should return a list of orders', async () => {
        const result = await OrderModel.index();
        expect(result.length).toBeGreaterThanOrEqual(1);
    });
});