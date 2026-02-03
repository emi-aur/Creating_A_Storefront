import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const tokenSecret = process.env.TOKEN_SECRET as string;

export const verifyAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
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

    jwt.verify(token, tokenSecret);
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token." });
  }
};
