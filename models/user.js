const {Schema, model, mongo} = require("mongoose"); 
const crypto = require('crypto');
const { createTokenForUser, validateToken } = require("../services/authentication");

const userSchema = new Schema({
    fullname:{
        type: String, 
        required: true,
    },
    email: {
        type:String, 
        required: true, 
        unique: true, 
    },
    salt:{
        type:String, 
    },
    password: {
        type:String, 
        required: true, 
    },
    profilephoto:{
        type: String,
        default: "/images/images.png",
    },
    role:{
        type: String, 
        enum: ["USER", "ADMIN"], 
        default: "USER",
    },
},{timestamps:true});

userSchema.pre("save", function (next){
    //this=== the user to be saved 
    const user = this; 
    if(!user.isModified("password")) return;
    
    const salt = crypto.randomBytes(16).toString('hex');
    // const salt= "somerandomuse"; 
    const hashedPassword = crypto.createHmac("sha256", salt).update(user.password).digest('hex');
    
    this.salt= salt; 
    this.password = hashedPassword ; 

    next(); 
});

userSchema.static("matchPassword" , async function(email, password){
    const user = await this.findOne({email}); 
    if(!user) throw new Error("User not found!"); 
     
    const hashpass = user.password; 
    const salt = user.salt; 
    if (!salt) throw new Error("Salt is undefined for the user!");
    const hashuserPassword = crypto.createHmac("sha256", salt).update(password).digest("hex"); 

    if(hashpass!==hashuserPassword) throw new Error("Incorrect Password"); 

    const token = createTokenForUser(user); 
    return token; 
}); 


const User = model("user", userSchema);

module.exports = User; 