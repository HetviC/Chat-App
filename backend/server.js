//const express= require("express");   default way
//const dotenv = require("dotenv");
import express from "express"; //changed type:module in package.json
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"
import userRoutes from "./routes/user.routes.js"
import connectToMongoDB from "./db/connectToMongoDB.js";
import cookieParser from "cookie-parser";

const app =express();
const PORT = process.env.PORT || 5000;

dotenv.config();
//test route
/*app.get("/",(req,res)=>{
    res.send("Hello Hetvi-Welcome to ChatApp")
});*/

// middlewares
app.use(express.json()); // to parse the incoming requests with JSON payloads from req.body present in auth.controller.js
app.use(cookieParser()); //before running any of the below routes we would call this middleware to access cookie
app.use("/api/auth", authRoutes) // instead of writing all the routes here we use this approach to make it clean 
app.use("/api/messages", messageRoutes)
app.use("/api/users", userRoutes)

app.listen(PORT,() =>{
    connectToMongoDB();
    console.log(`Server is running on port ${PORT}`)
    });