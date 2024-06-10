import express from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";
const  router = express.Router();

//if we write the code for login here, it looks messy, hence use controllers
/*router.get("/login",(req,res)=>{
    res.send("Login Route");
});*/

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);


export default router;