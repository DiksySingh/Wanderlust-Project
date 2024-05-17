const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    default:
      "https://unsplash.com/photos/a-swimming-pool-with-lounge-chairs-and-palm-trees-HDX63jhsD3o",
    set: (v) =>
      v === ""
        ? "https://unsplash.com/photos/a-swimming-pool-with-lounge-chairs-and-palm-trees-HDX63jhsD3o"
        : v,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
