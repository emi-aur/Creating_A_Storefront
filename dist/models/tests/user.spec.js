"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  (function () {
    var ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          var ar = [];
          for (var k in o)
            if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
          return ar;
        };
      return ownKeys(o);
    };
    return function (mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null)
        for (var k = ownKeys(mod), i = 0; i < k.length; i++)
          if (k[i] !== "default") __createBinding(result, mod, k[i]);
      __setModuleDefault(result, mod);
      return result;
    };
  })();
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel = __importStar(require("../user"));
describe("User Model", () => {
  let createdUserId;
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
    const user = {
      firstname: "Max",
      lastname: "Musterman",
      password_digest: "password123",
    };
    const result = await UserModel.create(user);
    createdUserId = result.id;
    expect(result).toBeDefined();
    expect(result.firstname).toBe(user.firstname);
  });
  it("show method should return the correct user", async () => {
    const result = await UserModel.show(createdUserId.toString());
    expect(result?.id).toEqual(createdUserId);
  });
});
