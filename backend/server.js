import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from 'cors';
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import userRoutes from './routes/userRoutes.js';
import path from 'path'
// import adminRoutes from './routes/adminRoutes.js';
import connectDB from "./config/db.js";
const app = express();

app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(path.resolve(), 'views'));

dotenv.config();

const port = process.env.PORT || 5001;

//mongoDB connection 
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use('/', userRoutes);
// app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`server started on port ${port}`));
