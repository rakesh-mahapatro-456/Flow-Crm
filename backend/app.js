import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import userRouter from "./src/routes/user.routes.js";
import leadRouter from "./src/routes/lead.routes.js";

dotenv.config();

const app = express(); 
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true
};
app.use( cors(corsOptions) );
app.use(express.json());
app.use(cookieParser());


//routes
app.use("/api/user",userRouter);
app.use("/api/leads",leadRouter);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Page Not Found" });
});

// ⛔️ Global error handler 
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const start = async()=>{
    const connectDB = await mongoose.connect(process.env.MONGO_URI);

    app.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
        console.log("Connected to MongoDB:", connectDB.connection.host);
    })
}

start();
