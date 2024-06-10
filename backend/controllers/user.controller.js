import User from "../models/user.model.js";

export const getUsersForSidebar = async(req, res) =>{
    try {
        const loogedInUserId = req.user._id
        const filteredUser = await User.find({_id: {$ne: loogedInUserId}}).select("-password")
        
        res.status(200).json(filteredUser)
    } catch (error) {
        console.log("Error in getUser for Sidebar Contoller", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}