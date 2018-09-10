'use strict';
require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bp = require("body-parser");

app.use(bp.json());
app.use(bp.urlencoded({extended:false}));
app.use(express.static("static"));
app.set("view engine","ejs");

// MONGODB
mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser:true});
mongoose.connection
.once("open",()=>console.log("connected to DB"))
.on("err",()=>console.log("error connecting to DB"));


app.use(require("./routes/main"));

app.get("/docs",(req,res,next)=>{
    res.render("docs");
});

app.use((err,req,res,next)=>{
    res.json({
        error:`An error occured \n ${err}`
    });
});

app.listen(process.env.PORT || 3000,()=>console.log("listening..."));