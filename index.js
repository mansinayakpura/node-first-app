const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParsar = require("cookie-parser");
const mongoose = require("mongoose");
const app = express();

const authRouter = require("./routes/authRouter");

app.use(cors()); // For cors policy
app.use(helmet());
app.use(express.json()); // For JSON response
app.use(cookieParsar());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) =>{
    console.log("Failed to connect to MongoDB", err);
});

app.use("/api/auth", authRouter);
app.get("/", (req, res) => {
    res.json({ message: "Hello from server" });
});

app.listen(process.env.PORT, (req, res) => {
    console.log("Port is running on 8000");
})