const express=require("express");
const app=express();
app.set("view engine","ejs");
const mongoose=require("mongoose");
const user=require("./model/user");
const bodyparser=require("body-parser");
const passport = require("passport");
const loaclstrategy=require("passport-local");
const passportlocalmongoose=require("passport-local-mongoose");
//mongoose.connect("mongodb://localhost/auth_demo",{ useUnifiedTopology: true ,useNewUrlParser: true } );


app.use(require("express-session")({
    secret:"Abhishek jaiswal is abhiedward001",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyparser.urlencoded({extended:true}));
passport.use(new loaclstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());   //for encoding session
passport.deserializeUser(user.deserializeUser());  // for decoding session


// db config
mongoose.connect("mongodb+srv://abhiedward001:abhi@123@cluster0.akhwn.mongodb.net/authdata?retryWrites=true&w=majority",{ useNewUrlParser: true,useUnifiedTopology: true }).then(()=>{
    console.log("connected to dbi");
}).catch((err)=>{
    console.log("error",err);
});
// ============ROUTES==============


app.get("/",(req,res)=>{
    res.render("home");
});
app.get("/home",(req,res)=>{
    res.render("home")
})

app.get("/secret",isloggedin,(req,res)=>{
    res.render("secret");
});

//------------------------------------------------ Auth ROutes--------------------------------------
app.get("/signup",(req,res)=>{
    res.render("signup");
});
// sign up route

app.post("/signup",(req,res)=>{
    req.body.username
    req.body.password
   user.register(new user({username:req.body.username}),req.body.password,function(err,user){
       if(err){
           console.log(err);
           return res.render("/signup");
       }
       passport.authenticate("local")(req,res,function(){
           res.redirect("/secret");
       });
   });

});

// login route,
app.get("/login",(req,res)=>{
    res.render("login");
});
// login logic
app.post("/login",passport.authenticate("local",{
    successRedirect:"/secret",
    failureRedirect:"/login"
}),function(req,res){

});
// logout
app.get("/logout",(req,res)=>{
    req.logOut();
    res.redirect("/home");
});

// middleware
 function isloggedin(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
app.listen(5000,(req,res)=>{
    console.log("connected to auth server");
});
