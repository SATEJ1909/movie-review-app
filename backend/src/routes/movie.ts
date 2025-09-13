import { getMovies , getMoviebyId , addMovie , getReviewOfMovie ,  addNewRewiew} from "../controller/movies.js";
import { Router } from "express";
const MovieRouter = Router();
import { isAuthorized } from "../middleware/auth.js";
import { isAdmin } from "../middleware/adminAuth.js";



MovieRouter.get("/getMovies" , getMovies);
MovieRouter.get("/getMoviebyId/:id" , getMoviebyId);
//@ts-ignore
MovieRouter.post("/addMovie" , isAdmin , addMovie);
//@ts-ignore
MovieRouter.get("/:id/reviews" , getReviewOfMovie);
//@ts-ignore
MovieRouter.post("/:id/review" , isAuthorized , addNewRewiew);


export default MovieRouter;