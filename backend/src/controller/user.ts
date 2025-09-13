import type{ Request , Response } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from "../models/userModel.js";
import WatchlistModel from "../models/watchlistModel.js";
import zod from "zod";
import { JWT_SECRET } from "../config.js";

const RequiredSchema = zod.object({
    username: zod.string().min(3),
    email: zod.string().email(),
    password: zod.string().min(4)
})

export const signup = async(req : Request , res : Response) =>{
    
    if(!RequiredSchema.safeParse(req.body).success){
        return res.status(400).json({message : "Invalid Input"});
    }

    try {
        const {username , email , password} = req.body;
        const existingUser = await UserModel.findOne({email});
        if(existingUser){
            return res.status(400).json({message : "User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password , 10);
        const userData = {
            username , email , password : hashedPassword
        }

        const newUser =  new UserModel(userData);
        const user = await newUser.save();

        

        const token = jwt.sign({
            id : user._id,
        }, JWT_SECRET);

        return res.status(200).json({ success : true ,message : "User created successfully" , token , user });
    } catch (error : any) {
        return res.status(500).json({message : error.message});
        
    }
}

export const login = async(req : Request , res : Response) => {
    try {
        const {email , password} = req.body;
        const user = await UserModel.findOne({email});
        if(!user){
            return res.status(400).json({message : "User not found"});
        }
        const isMatch = await bcrypt.compare(password , user.password);
        if(!isMatch){
            return res.status(400).json({message : "Invalid password"});
        }

        

        const token = jwt.sign({
            id : user._id,
        }, JWT_SECRET);

        return res.status(200).json({ success : true ,message : "User logged in successfully" , token , user });
    } catch (error : any) {
        console.log(error);
        return res.status(500).json({message : error.message});
    }
}


export const getProfileById = async(req : Request , res : Response) => {
    try {
        const {id} = req.params;
        const user = await UserModel.findById(id);
        if(!user){
            return res.status(400).json({message : "User not found"});
        }
        return res.status(200).json({ success : true , message : "User found successfully" , user });
    } catch (error : any) {
        return res.status(500).json({message : error.message});
    }
}

export const updateProfile = async (req : Request , res : Response) => {
    try {
        const {id} = req.params;
        const {username , email , profilePicture} = req.body;
        const user = await UserModel.findById(id);
        if(!user){
            return res.status(400).json({message : "User not found"});
        }
        user.username = username;
        user.email = email;
        user.profilePicture = profilePicture;
        const updatedUser = await user.save();
        return res.status(200).json({ success : true , message : "User updated successfully" , user : updatedUser });
    } catch (error : any) {
        return res.status(500).json({message : error.message});
    }
}

export const getWatchList = async (req: Request, res: Response) => {
    try {
        const list = await WatchlistModel.find({ userId: req.userId }).populate('movieId');
        return res.status(200).json({ success : true , message : "Watchlist found successfully" , list });
    } catch (error : any) {
        return res.status(500).json({message : error.message});
    }
}

export const addtoWatchList = async(req: Request , res : Response) => {
    try {
        const watchList = new WatchlistModel({movieId :req.body.movieId , userId : req.userId});
        await watchList.save();
        return res.status(200).json({ success : true , message : "Movie added to watchlist successfully" });
    } catch (error: any) {
        return res.status(500).json({message : error.message});
    }
}


export const removeFromWatchList = async(req: Request , res : Response) => {
    try {
        await WatchlistModel.deleteOne({movieId : req.body.movieId , userId : req.userId});
        return res.status(200).json({ success : true , message : "Movie removed from watchlist successfully" });
    } catch (error: any) {
        return res.status(500).json({message : error.message});
    }
}
