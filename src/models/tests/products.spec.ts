import { Product } from "../products";
import * as ProductModel from "../products";
import * as UserModel from "../user";
import request from "supertest";
import app from "../../server";
import pool from "../../database";
import jwt from "jsonwebtoken";

describe("Product Handler", () => {
  let authToken: string;

  // Token vor allen Tests generieren
  beforeAll(async () => {
    // Erstelle Test-User
    const testUser = await UserModel.create({
      firstname: "Test",
      lastname: "Handler",
      password_digest: "test123",
    });

    // Generiere echten JWT-Token
    authToken = jwt.sign(
      { user: testUser },
      process.env.TOKEN_SECRET as string
    );
  });

  describe("GET /products", () => {
    it("sollte eine Liste von Produkten zurückgeben", async () => {
      const response = await request(app).get("/api/products");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("POST /products", () => {
    it("sollte ein neues Produkt erstellen, wenn ein Token vorhanden ist", async () => {
      const response = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Test Kaffee",
          price: 4.5,
        });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe("Test Kaffee");
    });

    it("sollte 401 zurückgeben, wenn der Token fehlt", async () => {
      const response = await request(app)
        .post("/api/products")
        .send({ name: "Illegaler Kaffee", price: 10 });

      expect(response.status).toBe(401);
    });
  });
});

describe("Product Model", () => {
  let createdProductId: number;
  let createdUserId: number;

  // Create a test user first
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

// Wichtig: DB-Verbindung schließen, damit Jest beendet werden kann
afterAll(async () => {
  await pool.end();
});
