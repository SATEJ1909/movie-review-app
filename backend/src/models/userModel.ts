import mongoose from "mongoose";
import { boolean } from "zod";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  profilePicture: { type: String },
  joinDate: { type: Date, default: Date.now }
}, { timestamps: true });


const UserModel = mongoose.model('User', userSchema);
export default UserModel;
