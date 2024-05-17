const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("../Wanderlust-Project/models/listing.js");
const path = require("path");

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

app.get("/", (req, res) => {
  res.send("Working");
});

app.get("/listings", async (req, res) =>{
    let allListings = await Listing.find();
    res.render("listings/index.ejs",{allListings});
});

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

app.listen(8080, () => {
  console.log("Server running at 8080!");
});
