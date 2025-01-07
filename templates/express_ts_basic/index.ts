import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  return res.send("Hello from Express Typescript!!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
