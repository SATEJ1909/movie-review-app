const JWT_SECRET= process.env.JWT_SECRET || "secret";
const DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost:27017/movies";
export  {JWT_SECRET , DATABASE_URL};
