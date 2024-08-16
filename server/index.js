const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const studentModel = require("./model/Student.js");
const schoolRouter = require("./routes/schoolRoutes.js");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("db connected");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}

connectDB();

app.get("/", (req, res) => {
  res.send("welcome");
});

app.use("/api", schoolRouter);

app.listen(port, () => {
  console.log("server is running");
});
