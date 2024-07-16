const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAysnc.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const {isLoggedIn, isOwner} = require("../middleware.js");
const {validateListing} = require("../middleware.js");

router.get("/",wrapAsync(async (req, res) =>{
    let allListings = await Listing.find();
    res.render("listings/index.ejs",{allListings});
}));

//New Route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

//Show Route
router.get("/:id", wrapAsync(async(req, res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id).populate({path: "reviews", populate:{path: "author"}}).populate("owner");
  if(!listing) {
    req.flash("error","Listing Does Not Exist!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs",{listing});
}));

//Create Route
router.post("/", isLoggedIn, validateListing, wrapAsync( async(req, res, next) => {
  if(!req.body.listing){
    throw new ExpressError(400,"Send valid data for listing");
  }
  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
}));


//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  let {id} = req.params;
  const listing = await Listing.findById(id);
  if(!listing) {
    req.flash("error","Listing Does Not Exist!");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs",{listing});
}));

//Update Route
router.put("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) =>{
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  let {id} = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
}));

module.exports = router;