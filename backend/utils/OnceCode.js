import axios from "axios";

export const getData = async () => {
  const results = await axios
    .get("http://makeup-api.herokuapp.com/api/v1/products.json")
    .then((response) => response.data)
    .catch((err) => err.response.data);
  return results;
};

// app.get("/api/products", async (req, res) => {
//   // const { data } = req.body;
//   // console.log(data);
//   const data = await tester();
//   res.status(200).json({ success: true, message: "completed!", data });
//   // fs.writeFile("beauty.json", JSON.stringify(data), function (err) {
//   //   if (err) {
//   //     console.log(err);
//   //   }
//   // });
// });
