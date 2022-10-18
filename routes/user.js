const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
const nodemailer = require("nodemailer");
const userModel = require("../models/userModel");
const { verifyEmail } = require("../config/jWT");

router.get("/register", (req, res) => {
  res.render("register");
});

//mail sender details
var transporter = nodemailer.createTransport({
  service: "outlook",
  auth: {
    user: "merndeveloper@outlook.com",
    pass: "tanmay007",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({
      name,
      email,
      password,
      emailToken: crypto.randomBytes(64).toString("hex"),
      isVerified: false,
    });
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(user.password, salt);
    user.password = hashPassword;
    const newUser = await user.save();

    //send verification mail to user
    var mailOptions = {
      from: '"Verify your email" <merndeveloper@outlook.com>',
      to: user.email,
      subject: "merndeveloper -verify your email",
      html: `<h2> ${user.name}! Thanks for registering on our site </h2>
            <h4> Please verify your mail to continue...</h4>
            <a href="http://${req.headers.host}/verify-email?token=${user.emailToken}">Verify your Email</a>)`,
    };

    //sending mail
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Verification email is sent to your gmail account");
      }
    });

    res.redirect("/login");
  } catch (error) {
    console.log(error);
  }
});

router.get("/verify-email", async (req, res) => {
  try {
    const token = req.query.token;
    const user = await User.findOne({ emailToken: token });
    if (user) {
      user.emailToken = null;
      user.isVerified = true;
      await user.save();
      res.redirect("/login");
    } else {
      res.redirect("/register");
      console.log("email is not verified");
    }
  } catch (error) {}
});

router.get("/login", (req, res) => {
  res.render("login");
});

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

router.post("/login", verifyEmail, async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email: email });
    if (findUser) {
      const match = await bcrypt.compare(password, findUser.password);
      if (match) {
        //create token
        const token = createToken(findUser.id);
        console.log(token);
        //store token in cookie
        res.cookie("access-token", token);
        res.redirect("/homepage");
      } else {
        console.log("Invalid password");
      }
    } else {
      console.log("User not registered");
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
