/* eslint-disable no-else-return */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
/* eslint-disable no-console */
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const { celebrate, Joi, errors } = require("celebrate");
const cookieParser = require("cookie-parser");
// eslint-disable-next-line no-unused-vars
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const { DB_CONNECT, PORT = 3000 } = process.env;

const corsOptions = {
  origin: "*",
  // credentials: true,
  optionSuccessStatus: 200,
};

app.use(express.json(), cors(corsOptions));
app.use((req, res, next) => {
  res.header({ "Access-Control-Allow-Origin": "*" });
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());

const { requestLog, errorLog } = require("./middleware/log/logger");
const auth = require("./middleware/auth");
const Error404 = require("./middleware/errors/Error400");

// const uri =
//  "mongodb+srv://isa:XEPhas731@@isabelledb.mltad.mongodb.net/arounddb?retryWrites=true&w=majority";

mongoose
  .connect(DB_CONNECT, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => console.log(err));

const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");

const { signin, createUser } = require("./controllers/users");

app.use(requestLog);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  signin
);

app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser
);

app.use("/users", auth, usersRouter);
app.use("/cards", auth, cardsRouter);

app.get("*", () => {
  throw new Error404("requested resources not found");
});

// Error log
app.use(errorLog);

// Error handler from Celebrate
app.use(errors());

app.use((err, req, res, next) => {
  // if an error has no status, display 500
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message,
  });
});

app.listen(PORT, () => console.log(`Application listening on port ${PORT}!`));
