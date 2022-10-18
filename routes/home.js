const express = require("express");
const router = express.Router();
const { loginRequired } = require("../config/jWT");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/homepage", (req, res) => {
  res.render("homepage");
});

router.get("/logout", (req,res)=>{
    res.cookie("access-token", "", {maxAge:1})
    res.redirect("/login")
})


module.exports = router;
