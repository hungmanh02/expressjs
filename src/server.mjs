import express from "express";
import cookieParser from "cookie-parser";
import indexRouter from "./routes/index.mjs";

const app = express();
app.use(express.json());
app.use(cookieParser("helloworld"));
app.use(indexRouter); // tất cả router trong index Router

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

//localhost:8080/api/products
