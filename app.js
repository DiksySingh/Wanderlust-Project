const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("../Wanderlust-Project/models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAysnc.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("../Wanderlust-Project/models/review.js");
const {listingSchema, reviewSchema} = require("./schema.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

app.get("/", (req, res) => {
  res.send("Working");
});

app.get("/listings",wrapAsync(async (req, res) =>{
    let allListings = await Listing.find();
    res.render("listings/index.ejs",{allListings});
}));


const validateListing = (req, res, next) =>{
  let {error} = listingSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }else{
    next();
  }
}

const validateReview = (req, res, next) =>{
  let {error} = reviewSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }else{
    next();
  }
}

//New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id", wrapAsync(async(req, res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  res.render("listings/show.ejs",{listing});
}));

//Create Route
app.post("/listings",validateListing, wrapAsync( async(req, res, next) => {
  if(!req.body.listing){
    throw new ExpressError(400,"Send valid data for listing");
  }
  let newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));


//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  let {id} = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs",{listing});
}));

//Update Route
app.put("/listings/:id", wrapAsync(async (req, res) =>{
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let {id} = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));

//Review
//Post Review Route
app.post("/listings/:id/reviews",validateReview, wrapAsync(async(req, res) =>{
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  res.redirect(`/listings/${listing.id}`);
}));

//Delete Review Route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req, res)=>{
  let {id, reviewId} = req.params;
  await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/listings/${id}`);
}))

// app.get("/testListing", (req, res) => {
//   let newListing = new Listing({
//     title: "Villa Da Vasta",
//     description: "3-BHK Villa in Ludhiana",
//     price: 45000,
//     location: "Ludhiana, Punjab",
//     country: "India",
//   });
//   newListing.save();
//   res.send("Successful");
// });


app.all("*", (req, res, next) =>{
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let {status = 500, message = "Something went wrong!"} = err;
  res.status(status).render("error.ejs",{message});
});

app.listen(8080, () => {
  console.log("Server running at 8080!");
});
