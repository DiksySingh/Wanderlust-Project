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

const listing = require("../Wanderlust-Project/routes/listing.js");
const review = require("../Wanderlust-Project/routes/review.js");

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


app.use("/listings", listing);
app.use("/listings/:id/reviews",review);

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
