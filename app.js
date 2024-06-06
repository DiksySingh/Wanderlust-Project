const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("../Wanderlust-Project/models/listing.js");
const path = require("path");
const methodOverride = require("method-override");

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

app.get("/", (req, res) => {
  res.send("Working");
});

app.get("/listings", async (req, res) =>{
    let allListings = await Listing.find();
    res.render("listings/index.ejs",{allListings});
});

//New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id", async(req, res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs",{listing});
});

//Create Route
app.post("/listings", (req,res) => {
  let newListing = new Listing(req.body.listing);
  newListing.save();
  res.redirect("/listings");
});


//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
  let {id} = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs",{listing});
});

//Update Route
app.put("/listings/:id", async (req, res) =>{
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete("/listings/:id", async (req, res) => {
  let {id} = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
})
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

app.listen(3000, () => {
  console.log("Server running at 8080!");
});
