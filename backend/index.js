// Backend Server Entry Point
import express from 'express';
import dotenv from "dotenv";
import connectDB from './db.js';
import cors from "cors";
import userroute from "./routes/userroute.js";
import questionroute from "./routes/questionRoutes.js";
import cookieParser from 'cookie-parser';
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(
    {
        origin: "http://localhost:5174", // Your frontend URL
        credentials: true,
    }
));
app.use(cookieParser());

// Serve static files (uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/api/v1/user', userroute);
app.use('/api/v1/question', questionroute);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port : ${PORT}`);
});
