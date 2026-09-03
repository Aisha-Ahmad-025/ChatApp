import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/dbConnect.js";
import bodyParser, { urlencoded } from 'body-parser'
import authRoute from './routes/authRoute.js'

dotenv.config();

const PORT = process.env.PORT;
const app = express();

//middleware
app.use(express.json()) // parse body data
app.use(cookieParser()) // it parse token on every req
app.use(bodyParser.urlencoded({ extended: true }))


//database connection
connectDB();

// Routes
app.use('/api/auth',authRoute)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});