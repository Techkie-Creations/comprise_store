import mongoose, { Schema } from "mongoose";

const reqString = {
  type: String,
  required: true,
};

const importedbag = Schema({
  status: { type: Boolean, required: true },
  importId: Schema.Types.Mixed,
});

const wishbagItem = Schema({
  name: reqString,
  price: reqString,
  image_link: reqString,
  rating: { type: Number, required: true },
  url: reqString,
  section: reqString,
});

const wishbagSchema = new Schema(
  {
    userId: reqString,
    wishbagId: {
      type: String,
      required: true,
      unique: true,
    },
    products: [wishbagItem],
    imported: [importedbag],
  },
  { timestamps: true }
);

const wishbagDB = mongoose.connection.useDb("wishbag");
const Wishbag = wishbagDB.model("WishBag", wishbagSchema);

export default Wishbag;
