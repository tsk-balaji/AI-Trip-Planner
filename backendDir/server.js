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

// Use a single CORS configuration
const corsOptions = {
  origin:
    "https://ai-trip-planner-pwa6-tskbalaji-134829cc.vercel.app/" ||
    "https://ai-trip-planner-pwa6-git-main-tskbalaji-134829cc.vercel.app/",
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
