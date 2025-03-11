import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
import cors  from "cors";
import path from "path";
const Port = process.env.PORT || 5000;


dotenv.config();

mongoose
  .connect(`${process.env.MONGO}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();

const app = express();

app.use(cors({
  origin: "https://property-management-new.vercel.app/",
  methods: ["GET", "POST", "PUT", "DELETE" , "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));


app.use(express.json());
//allow JSON data

app.use(cookieParser());

app.listen(Port, () => {
  console.log(`Server is running on Port ${Port}!`);
});

app.use("/api/user", userRouter); //api/user
app.use("/api/auth", authRouter); //api/auth
app.use("/api/listing", listingRouter); //api/listing

app.use(express.static(path.join(__dirname, "/client/dist")));

//Errors Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
