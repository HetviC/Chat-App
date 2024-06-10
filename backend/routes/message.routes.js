import express from "express";
import {sendMessage,getMessages} from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";
const router= express.Router();
router.post("/send/:id",protectRoute,sendMessage) //protect Route checks whether the user is logged in or not
router.get("/:id", protectRoute, getMessages)
export default router;