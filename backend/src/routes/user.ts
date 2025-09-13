import { signup , login , updateProfile , getProfileById , getWatchList , removeFromWatchList , addtoWatchList } from "../controller/user.js";
import { Router } from "express";
import { isAuthorized } from "../middleware/auth.js";

const UserRouter = Router();

//@ts-ignore
UserRouter.post("/signup" , signup);
//@ts-ignore
UserRouter.post("/login" , login);
//@ts-ignore
UserRouter.post("/updateProfile" , isAuthorized , updateProfile);
//@ts-ignore
UserRouter.get("/:id/watchlist" ,  isAuthorized, getWatchList);
//@ts-ignore
UserRouter.get("/:id" , getProfileById);
//@ts-ignore

//@ts-ignore
UserRouter.post("/removeFromWatchList" , isAuthorized ,removeFromWatchList);
//@ts-ignore
UserRouter.post("/addtoWatchList" , isAuthorized , addtoWatchList);


export default UserRouter;