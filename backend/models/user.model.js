import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname:{
        type: String,
        required: true,
    },
    username:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        required: true,
        minlength: 6,
        type: String,
    },
    gender:{
        type: String,
        required: true,
        enum: ["male","female"],
    },
    profilePic:{
        type: String,
        default: "",
    },
 },{//Provide created at and updated at time
    timestamps:true
});

 const User = mongoose.model("User", userSchema);

 export default User;