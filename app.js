const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listingsRoute = require("./routes/listing.js");
const reviewsRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./model/user.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOption = {
    secret: "ThisisMySecretCode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now()*7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    },
}
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=> {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.CurrUser = req.user;
    next();
})

main().then(()=>{
    console.log("mongo connected");
}).catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.get("/",(req,res)=>{
    res.send("hi iam AIRBNB")
})



app.listen(8080,()=> {
    console.log("Server is listening");
})

app.use("/listings",listingsRoute);
app.use("/listings/:id/review",reviewsRoute);
app.use("/",userRoute);

app.use((err, req, res, next)=> {
    let {statusCode=500,message="Something Went Wrong!"} = err;
    res.status(statusCode).render("listings/error.ejs",{message});
})
// app.use((req,res)=> {
//     res.status(404).render("listings/notfound.ejs");
// });

// app.get("/testlisting", async (req,res)=> {
//     let sampleListing = new Listing({
//         title: "My new Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "california",
//         country: "india",
//     });
//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Succesfull testing");
// })

