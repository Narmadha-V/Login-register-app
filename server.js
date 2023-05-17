const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const User = require("./model/userModel");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const JWT_SECRET = "my-very-secure-and-ultra-long-secret-token-login";
const JWT_EXPIRES_IN = "90d";
const JWT_COOKIE_EXPIRES_IN = 90 * 24 * 60 * 60 * 1000;
const cookieParser = require("cookie-parser");

// uncaught error handling
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

// Database connection
dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful!"));

app.use("/", express.static(path.join(__dirname, "static")));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

const signToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

app.post("/api/register", async (req, res) => {
  const { username, password: plainTextPassword } = req.body;
  const token = signToken({ id: req.body._id });
  // res.cookie("jwt", token, {
  //   expires: new Date(Date.now() + JWT_COOKIE_EXPIRES_IN * 10 * 1000),
  //   httpOnly: true,
  // });
  if (!username || typeof username !== "string") {
    return res.json({
      status: "error",
      message: " Invalid username",
    });
  }
  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.json({
      status: "error",
      message: " Invalid password ",
    });
  }
  if (plainTextPassword.length < 4) {
    return res.json({
      status: "error",
      message: " Password too small.Should be atleast 8 characters ",
    });
  }
  const password = await bcrypt.hash(plainTextPassword, 10);
  try {
    const response = await User.create({
      username,
      password,
    });
    console.log("user created successfully:", response);

    res.json({
      status: "ok",
      token,
      data: {
        user: response,
      },
    });
  } catch (error) {
    console.log(error);
    // duplicate key error collection
    if (error.code === 11000) {
      return res.json({
        status: "error",
        message: "Username already in use.",
      });
    }
    throw error;
  }
  // res.json({status:'ok'});
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const newUser = await User.findOne({ username });

  if (!newUser) {
    return res
      .status(401)
      .json({ status: "error", message: "Invalid username/password" });
  }
  console.log(newUser);

  if (await bcrypt.compare(password, newUser.password)) {
    const token = signToken(newUser._id);
    console.log("Generated token:", token);
    req.user = newUser.username;
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + JWT_COOKIE_EXPIRES_IN * 10 * 1000),
      httpOnly: true,
    });
    return res
      .status(200)
      .json({ status: "success", username: username, data: token });
  }
  result.json({ status: "error", message: "Invalid username/password" });
});
// app.post("/api/changePassword", async (req, res) => {
//   const { token, newpassword: plainTextPassword } = req.body;
//   console.log(plainTextPassword);
//   console.log(token);
//   // password verification
//   if (!plainTextPassword || typeof plainTextPassword !== "string") {
//     return res.json({
//       status: "error",
//       message: " Invalid password ",
//     });
//   }
//   if (plainTextPassword.length < 4) {
//     return res.json({
//       status: "error",
//       message: " Password too small.Should be atleast 8 characters ",
//     });
//   }
//   try {
//     const user = jwt.verify(token, JWT_SECRET);
//     const _id = user.id;
//     const password = await bcrypt.hash(plainTextPassword, 10);
//     await User.updateOne({ _id }, { $set: { password } });
//     res.json({ status: "ok" });
//   } catch (err) {
//     res.json({ status: "error", message: "error..." });
//   }
// });

app.get("/api/logout", async (req, res) => {
  res.clearCookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 60 * 60 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
    message: "successfully cleared",
  });
});

app.listen(4000, () => {
  console.log(`App running on port 4000...`);
});
