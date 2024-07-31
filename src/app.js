import express from "express";
import authRouter from "./routers/auth";
import productRouter from "./routers/product";
import categoryRouter from "./routers/category";
import cartRouter from "./routers/cart";
import cors from "cors";
import { connectDB } from "./config/db";
import dotenv from "dotenv";
import morgan from "morgan";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

connectDB(process.env.DB_URI);

app.use(`/api/v1/`, authRouter);
app.use(`/api/v1/`, productRouter);
app.use(`/api/v1/`, categoryRouter);
app.use(`/api/v1/`, categoryRouter);
app.use(`/api/v1/`, cartRouter);

export const viteNodeApp = app;
