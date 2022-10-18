const jwt = require("jsonwebtoken")
const cookie = require("cookie-parser")
const User =require("../models/userModel")

const loginRequired = async(req,res,next)=>{
    const token = req.cookies["access-token"]
    if(token){
        const validatetoken = await jwt.verify(token , process.env.JWT_SECRET)
        if(validatetoken){
            res.user = validatetoken.id
            next()
        }else{
            console.log("token expires")
            res.redirect("/login")
        }
    }else{
        console.log("token not found ")
        res.redirect("/login")
    }
}


const verifyEmail = async(req,res,next)=>{
    try {
        const user = await User.findOne({email: req.body.email})
        if(user.isVerified){
            next()
        }else{
            console.log("please check your email to verify your account")
        }
    } catch (error) {
        
    }
}


module.exports ={loginRequired, verifyEmail}