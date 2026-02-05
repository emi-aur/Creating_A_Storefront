"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
describe("JWT AUTHENTICATION", () => {
  it("should generate and verify a JWT token for a user", () => {
    const user = { id: 1, firstname: "Max", lastname: "Mustermann" };
    const token = jsonwebtoken_1.default.sign(
      { user },
      process.env.TOKEN_SECRET
    );
    const verified = jsonwebtoken_1.default.verify(
      token,
      process.env.TOKEN_SECRET
    );
    expect(verified.user.id).toBe(user.id);
    expect(verified.user.firstname).toBe(user.firstname);
    expect(verified.user.lastname).toBe(user.lastname);
  });
});
