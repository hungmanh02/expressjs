import express from "express";

import usersRouter from "./routes/users.mjs";
import productsRouter from "./routes/products.mjs";
const app = express();
app.use(express.json());
app.use(usersRouter); // sử dụng router users riêng.
app.use(productsRouter); // sử dụng router products riêng.

const PORT = process.env.PORT || 8080;
//localhost:8080
app.get("/", (req, res) => {
  res.status(201).send({ msg: "Hello" });
});

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

//localhost:8080/api/products
