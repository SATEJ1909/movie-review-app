import type{ Request , Response , NextFunction } from "express";
import jwt from 'jsonwebtoken';
import UserModel from "../models/userModel.js";
import { JWT_SECRET } from "../config.js";


export const isAdmin = async(req : Request , res : Response , next : NextFunction) => {
    const token = req.headers.token;

     if(!token){
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        //@ts-ignore
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        const user = await UserModel.findById(decoded.id);
        if(!user?.role || user.role !== 'admin'){
            return res.status(401).json({ error: "Unauthorized" });
        }
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
}