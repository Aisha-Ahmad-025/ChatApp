import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/dbConnect.js";

dotenv.config();

const PORT = process.env.PORT;
const app = express();

//database connection
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});