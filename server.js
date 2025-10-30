const express = require("express");

const cors = require("cors");

const { errors } = require("celebrate");

const errorHandler = require("./middleware/error-handler");

const { errorLogger, requestLogger } = require("./middleware/Logger");

const dotenv = require("dotenv");

const mongoose = require("mongoose");

dotenv.config();

const mainRouter = require("./routes/index");

const app = express();

const { PORT = 3002 } = process.env;

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/stepworkdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(requestLogger);
app.use("/api", mainRouter);
app.use(errors());
app.use(errorHandler);
app.use(errorLogger);

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
