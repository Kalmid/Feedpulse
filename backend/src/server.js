import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import feedbackRoutes from "./routes/feedbackRoutes.js";

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.use("/api/feedback", feedbackRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
    app.listen(4000, () => console.log("Server running on port 4000"));
  })
  .catch(err => console.log(err));