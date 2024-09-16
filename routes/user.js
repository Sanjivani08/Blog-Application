const express = require("express"); 
const router = express.Router(); 
const User = require("../models/user"); 

router.get("/signin", (req,res)=>{
    return res.render("signin"); 
});

router.get("/signup", (req,res)=>{
    return res.render("signup"); 
}); 

router.post("/signin", async(req,res)=>{
    const{email, password} = req.body; 
    try{
      const token=await User.matchPassword(email, password); 

    return res.cookie("Token", token).redirect("/");
    } catch(error){
      return res.render("signin" , {
        error: "Incorrect Email or Password", 
      });
    }
}); 

router.post("/signup", async (req, res)=>{
  const {fullname, email, password} = req.body; 

  await User.create({
    fullname, 
    email, 
    password, 
  }); 

  return res.redirect("/"); 
}); 

router.get("/logout", (req, res)=>{
  res.clearCookie("Token").redirect("/"); 
})
module.exports = router; 