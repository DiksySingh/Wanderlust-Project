const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

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
  reviews: [
    {
    type: Schema.Types.ObjectId,
    ref: "Review"
    }
  ]
});

listingSchema.post("findOneAndDelete", async(listing)=>{
  if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}});
  }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
