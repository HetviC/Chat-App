import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const protectRoute = async(req, res, next)=>{ //async funtion imports await 
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({error: "Unauthorized -No Token provided"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({error: "Unauthorized -No Token provided"});
        }  
        const user = await User.findById(decoded.userId).select(-"password"); //userId is used because we have that in generateToken.js
        if(!user){
            return res.status(404).json({error: "User not found"});
        }  
        req.user = user;
        next();     //this calls the next function which is sendMessage in our case from message.routes
    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        res.status(500).json({error:"Internal server error"});
    }
}

export default protectRoute;
