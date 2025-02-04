import { getData } from "./OnceCode.js";

export const tester = async () => {
  let results = await getData();
  results = results.filter(
    (data) =>
      data.brand &&
      data.name.length > 0 &&
      data.description &&
      data.description.length > 0 &&
      data.category &&
      data["product_type"].length > 0
  );
  let info = results.map((data) => ({
    name: data.name,
    brand: data.brand,
    price: data.price,
    image_link: data.image_link,
    description: data.description,
    rating: data.rating,
    category: data.category,
    product_type: data.product_type,
    tag_list: data.tag_list,
    api_featured_image: data.api_featured_image,
    product_colors: data.product_colors,
  }));
  const info2 = info
    .filter((d) => d.price === "0.0")
    .map((d) => ({ ...d, price: `${Math.floor(Math.random() * 30)}.0` }));
  const names = info2.map((d) => d.name);
  const rest = info.filter((d) => names.indexOf(d.name) < 0);
  const completed = rest
    .concat(info2)
    .map((d) => ({ ...d, price: Number(d.price) }));
  // fs.writeFile("beauty.json", JSON.stringify(completed), function (err) {
  //   if (err) {
  //     console.log(err);
  //   }
  // });
  console.log(completed);
};

// app.post("/api/me", (req, res) => {
//   const { accessToken, refreshToken } = req.cookies;

//   if (accessToken === "undefined") return res.status(403);
//   jwt.verify(accessToken, process.env.ACCESS_JWT_SECRET, async (err, user) => {
//     if (err)
//       return res.status(403).json({ success: false, message: "Invalid token" });
//     const userDetails = jwt.decode(accessToken);
//     const validUser = await User.findById(
//       userDetails.id,
//       "firstName lastName avatar"
//     );
//     if (!validUser) return res.json({ success: false, message: "UNKNOWN!!" });
//     const name = fullName(validUser.firstName, validUser.lastName);
//     res.status(200).json({
//       userId: validUser._id,
//       success: true,
//       message: "Valid refresh token!!",
//       avatarUrl: validUser.avatar,
//       name: name,
//     });
//   });
// });
