import { User } from "../user";
import * as UserModel from "../user";

describe("User Model", () => {
  let createdUserId: number;
  
  it("should have an index method", () => {
    expect(UserModel.index).toBeDefined();
  });

    it("should have a show method", () => {
        expect(UserModel.show).toBeDefined();
    });

    it("should have a create method", () => {
        expect(UserModel.create).toBeDefined();
    });
    
    it("index method should return a list of users", async () => {
        const result = await UserModel.index();
        expect(result.length).toBeGreaterThan(0);
    });

    it("create method should add a user", async () => {
        const user: User = {
            firstname: "Max",
            lastname: "Musterman",
            password_digest: "password123",
        };
        const result = await UserModel.create(user);
        createdUserId = result.id as number;
        expect(result).toBeDefined();
        expect(result.firstname).toBe(user.firstname);
    });

    it("show method should return the correct user", async () => {
        const result = await UserModel.show(createdUserId.toString());
        expect(result?.id).toEqual(createdUserId);
    });
});