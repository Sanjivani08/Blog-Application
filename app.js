const express = require("express"); 
const path= require("path"); 
const router = require("./routes/user"); 
const mongoose = require("mongoose"); 
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require("./middleware/authentication.js");
const blogRouter = require("./routes/blog");
const Blog = require("./models/blogs");
// require('dotenv').config();
 
const app= express(); 
const port= 8000; 

mongoose.connect('mongodb://localhost:27017/blog-app').then(()=> console.log("Mongodb Connected")); 

app.set("view engine", "ejs"); 
app.set("views", path.resolve("./views")); 

app.use(cookieParser()); 
app.use(express.urlencoded({extended: false}));
app.use(checkForAuthenticationCookie("Token"));  
app.use(express.static(path.resolve("./public"))); 

app.get("/", async (req,res)=>{
    const allBlogs = await Blog.find({}); 
    res.render("home", {
        user: req.user,
        blogs: allBlogs,
    });
});


app.use("/user", router); 
app.use("/blog", blogRouter); 

app.listen(port, ()=> console.log(`Server running at port: ${port}`)); 