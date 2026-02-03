import { Product } from "../products";
import * as ProductModel from "../products";
import * as UserModel from "../user";

describe("Product Model", () => {
  let createdProductId: number;
  let createdUserId: number;

  // Create a test product first
    beforeAll(async () => {
      const testUser = await UserModel.create({
        firstname: "Test",
        lastname: "User",
        password_digest: "password123",
      });
      createdUserId = testUser.id as number;
  
      // Create a test product
      const product = await ProductModel.create({
        name: "Test Product", 
        price: 80,
      });
      createdProductId = product.id as number;
    });
    
  it("should have an index method", () => {
    expect(ProductModel.index).toBeDefined();
  });

    it("should have a show method", () => {
        expect(ProductModel.show).toBeDefined();
    });

    it("should have a create method", () => {
        expect(ProductModel.create).toBeDefined();
    });
    
    it("index method should return a list of products", async () => {
        const result = await ProductModel.index();
        expect(result.length).toBeGreaterThan(0);
    });

    it("show method should return the correct product", async () => {
        const result = await ProductModel.show(createdProductId.toString());
        expect(result?.id).toEqual(createdProductId);
    });
    
    it("create method should add a product", async () => {
        const product: Product = {
            name: "Another Test Product",
            price: 50,
        };
        const result = await ProductModel.create(product);
        expect(result).toBeDefined();
        expect(result.name).toBe(product.name);
    });
});
