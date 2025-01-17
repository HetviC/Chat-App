import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import generateTokenAndSetCookies from "../utils/generateToken.js";

export const signup = async(req,res)=>{
    try {
        const {fullname, username, password, confirmPassword, gender}= req.body;
        
        if(password !== confirmPassword){
            return res.status(400).json({error:"Passwords don't match"})
        }

        const user =await User.findOne({username});
        if(user){
            return res.status(400).json({error:"UserName already exist"})
        }
        
        // Hash Password here
        const salt = await bcryptjs.genSalt(10); //by default 10 value is kept, higher the value more security but it would take more time to hash as well
        const hashedPassword = await bcryptjs.hash(password,salt);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullname,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === "male"? boyProfilePic : girlProfilePic
        })
        if(newUser){
        //Generate JWT Token here
        generateTokenAndSetCookies(newUser._id, res);
        await newUser.save();
        res.status(201).json({
            _id: newUser._id,
            fullname:newUser.fullname,
            username: newUser.username,
            profilePic: newUser.profilePic
        })
    }
    else{
        res.status(400).json({error:"Invalid user data"});
    }
    
    
    } catch (error) {
        console.log("Error in Signup Contoller", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}
export const login = async (req,res)=>{
try {
    const {username, password} = req.body; 
    const user =await User.findOne({username});
    const isPasswordCorrect = await bcryptjs.compare(password, user?.password||"");
    if(!user || !isPasswordCorrect){
        return res.status(400).json({error:"Invalid credentials"});
    }
    generateTokenAndSetCookies(user._id, res);
    res.status(200).json({
        _id: user._id,
        fullname:user.fullname,
        username: user.username,
        profilePic: user.profilePic
    });

} catch (error) {
    console.log("Error in Login Contoller", error.message);
    res.status(500).json({error:"Internal Server Error"});
}

    // res.send("Login User");
    // console.log("Login User");
}

//async not required here
export const logout =  (req,res)=>{
    try {
        //deleting the cookies here
        res.cookie("jwt","", {maxAge:0});
        res.status(200).json({message: "Logged out successfully"});
        
    } catch (error) {
        console.log("Error in Logout Contoller", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
    // res.send("Logout user");
    // console.log("Logout User");
}