"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuthToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const tokenSecret = process.env.TOKEN_SECRET;
const verifyAuthToken = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      res.status(401).json({ error: "Access denied. No token provided." });
      return;
    }
    const token = authorizationHeader.split(" ")[1]; // Bearer TOKEN
    if (!token) {
      res.status(401).json({ error: "Access denied. Invalid token format." });
      return;
    }
    jsonwebtoken_1.default.verify(token, tokenSecret);
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token." });
  }
};
exports.verifyAuthToken = verifyAuthToken;
