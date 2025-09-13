import type{ Request , Response , NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";


// Extend Request type to include userId
interface AuthRequest extends Request {
  userId?: string;
}

export const isAuthorized = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers["token"] as string | undefined;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    req.userId = decoded.id; 
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
