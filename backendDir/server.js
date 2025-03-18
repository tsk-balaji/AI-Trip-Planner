const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const initialise_Mongo_Connectivity = require("./config/connectDB.js");
const userRoutes = require("./routes/userRoutes.js");

// Load environment variables
dotenv.config();

// Connect to MongoDB
initialise_Mongo_Connectivity();

const app = express();

// ✅ Allow requests from frontend (Replace with your frontend URL in production)
app.use(
  cors({ origin: "https://tsk-ai-trip-planner.vercel.app/", credentials: true })
);

// OR allow all origins (Not recommended for production)
app.use(cors());

// Middleware
app.use(express.json());
app.use(cors({ credentials: true, origin: process.env.FRONTEND_URL }));
app.use(cookieParser());

// Routes
app.use("/api", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
