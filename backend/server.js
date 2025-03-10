// // const express = require("express");  // Import Express.js
// // const mongoose = require("mongoose"); // Import Mongoose for database connection
// // const dotenv = require("dotenv");  // Load environment variables
// // const cors = require("cors");  // Allow frontend to communicate with backend

// // // Load environment variables from .env file
// // dotenv.config();

// // // Initialize Express App
// // const app = express();

// // // Middleware
// // app.use(express.json()); // Allows app to read JSON data
// // app.use(cors()); // Enables CORS (Allows frontend to make requests to backend)

// // // Connect to MongoDB
// // mongoose
// //   .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// //   .then(() => console.log("✅ MongoDB Connected"))
// //   .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// // // Test Route
// // app.get("/", (req, res) => {
// //   res.send("API is running...");
// // });

// // // Start Server
// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


// const express = require("express");  // Import Express.js
// const mongoose = require("mongoose"); // Import Mongoose for database connection
// const dotenv = require("dotenv");  // Load environment variables
// const cors = require("cors");  // Allow frontend to communicate with backend

// // Load environment variables from .env file
// dotenv.config();

// // Import Authentication Routes
// const authRoutes = require("./routes/authRoutes"); // ✅ Add this line

// // Initialize Express App
// const app = express();

// // Middleware
// app.use(express.json()); // Allows app to read JSON data
// app.use(cors()); // Enables CORS (Allows frontend to make requests to backend)

// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// // Routes
// app.use("/api/auth", authRoutes); // ✅ This line adds authentication routes

// // Test Route
// app.get("/", (req, res) => {
//   res.send("API is running...");
// });

// // Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db"); // ✅ Import DB connection function
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB(); // ✅ Now calling the function instead of writing connection code here

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));