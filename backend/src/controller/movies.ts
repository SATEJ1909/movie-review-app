import MovieModel from "../models/movieModel.js";
import ReviewModel from "../models/reviewModel.js";
import type { Request, Response } from "express";
//@ts-ignore
export const getMovies = async (req, res) => {
    try {
        const { page = 1, limit = 10, genre, year } = req.query;

        const filter: { [key: string]: any } = {};
        if (genre) filter.genre = genre;
        if (year) filter.releaseYear = Number(year);

        const movies = await MovieModel.find(filter)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await MovieModel.countDocuments(filter);

        res.json({
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            movies
        });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
}


//@ts-ignore
export const getMoviebyId = async (req, res) => {
    try {
        const movie = await MovieModel.findById(req.params.id).populate('reviews.userId');

        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        const review = await MovieModel.findById(req.params.id).populate('reviews.userId');
        return res.status(200).json({ success: true, message: "Movie found successfully", movie, review });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}



export const addMovie = async (req: Request, res: Response) => {
    try {
        const { title, genre, releaseYear, director, cast, synopsis, posterUrl } = req.body;

        if (!title || !genre || !releaseYear || !director || !cast) {
            return res.status(400).json({ error: "Missing required fields" });
        }


        const newMovie = new MovieModel({
            title,
            genre,
            releaseYear,
            director,
            cast,
            synopsis,
            posterUrl
        });

        await newMovie.save();
        return res.status(201).json({ message: "Movie added successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
}


export const getReviewOfMovie = async (req: Request, res: Response) => {
    try {
        const review = await ReviewModel.find({ movieId: req.params.id }).populate('userId');
        return res.status(200).json({ success: true, message: "Review found successfully", review });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}


export const addNewRewiew = async (req: Request, res: Response) => {
    try {
        const { rating, reviewText } = req.body;
        const review = new ReviewModel({
            userId: req.userId, 
            movieId: req.params.id,
            rating,
            reviewText
        });

        await review.save();

        // Update average rating in Movie model
        const reviews = await ReviewModel.find({ movieId: req.params.id });
        const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0)

        await MovieModel.findByIdAndUpdate(req.params.id, { averageRating: avgRating });

        return res.status(200).json({ success: true, message: "Review added successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
}
