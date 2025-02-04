import mongoose from "mongoose";

const ProductColors = new mongoose.Schema({
  hex_value: { type: String },
  color_name: { type: String },
});

const BeautySchema = new mongoose.Schema({
  name: String,
  brand: String,
  price: String,
  category: String,
  product_type: String,
  image_link: String,
  description: String,
  rating: Number,
  tag_list: {
    type: [String],
    default: [],
  },
  category: String,
  product_colors: { type: [ProductColors] },
  api_featured_image: String,
});

const Beauty = mongoose.model("Beauty", BeautySchema);

export default Beauty;
