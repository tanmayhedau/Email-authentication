const express = require("express")
const app = express()
const PORT = process.env.PORT || 3000
const dotenv = require("dotenv").config()
const mongoose = require("mongoose")
const hbs = require("hbs")
const {urlencoded} = require("express")
const userRoute = require("./routes/user")
const homeRoute = require("./routes/home")
const cookieparser = require("cookie-parser")


//middlewares
app.use(urlencoded({extended:false}))
app.use(cookieparser())
app.use(express.json())

//template engine
app.set("view engine" , "hbs")

//db connect 
mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser:true, useUnifiedTopology:true})
.then(() => console.log("MongoDb is connected"))
.catch((err) => console.log(err));


//routes
app.use("/", homeRoute)
app.use("/", userRoute)

//listening PORT
app.listen(PORT, ()=>{
    console.log(`Express app running on port ${PORT}...`)
})