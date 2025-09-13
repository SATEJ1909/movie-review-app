import express from 'express';
import mongoose  from 'mongoose';
import MovieRouter from "./routes/movie.js";
import UserRouter from "./routes/user.js";


const app = express();
app.use(express.json());

app.use("/api/v1/movie" , MovieRouter);
app.use("/api/v1/user" , UserRouter);


const PORT = 3000;
async function main(){
    await mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/movies' );
    app.listen(PORT, () => console.log('Server is running on port', PORT));
}

main();
