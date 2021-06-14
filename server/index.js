require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { errorHandler } = require("./middlewares/errorHandler");
const cookieParser = require('cookie-parser')

const app = express();
const router = require('./router')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(router)


const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentails: true,
  },
});

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.xqoae.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
  {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.error("Can not to mongodb!");
      console.error(err);
    } else {
      console.log("Connected to MongoDB!");
    }
  }
);

app.all("*", (req, res, next) => {
  const err = new Error("The route can not be found");
  err.statusCode = 404;
  next(err);
});
app.use(errorHandler);

const PORT = process.env.PORT || 9000;

http.listen(PORT, () => {
  
  console.log(`Sever is running port at`, PORT);
});
