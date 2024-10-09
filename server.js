const express = require('express');
const routes = require('./routes/v1/route');
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

let corsOptions = {
    origin: ['https://vigneshtodoapp.netlify.app', 'http://localhost:5173']
}

app.use(cors(corsOptions));
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", corsOptions.origin);
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});
app.use(express.json());
app.set("etag", false);
app.use('/v1', routes);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Database has been Connected!");
  })
  .catch((err) => {
    console.log(err);
    console.log("DB Connection Error!");
  }
);