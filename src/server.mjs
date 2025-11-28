import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import indexRouter from "./routes/index.mjs";
import { mockUsers } from "./utils/constants.mjs";
const app = express();
app.use(express.json());
app.use(cookieParser("helloworld"));
app.use(
  session({
    secret: "anson the dev",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60 * 2,
    },
  })
);
app.use(indexRouter); // tất cả router trong index Router

app.post("/api/auth", (req, res) => {
  const {
    body: { username, password },
  } = req;
  // gọi dữ liệu từ mockUsers.
  const findUser = mockUsers.find((user) => user.username === username);
  // console.log(findUser);
  if (!findUser || findUser.password !== password)
    return res.status(401).send({ msg: "Bad credentials" });

  req.session.user = findUser;
  return res.status(200).send(findUser);
});
app.get("/api/auth/status", (req, res) => {
  req.sessionStore.get(req.sessionID, (err, session) => {
    console.log(session);
  });
  return req.session.user
    ? res.status(200).send(req.session.user)
    : res.status(401).send({ msg: "Not Authenticated" });
});
app.post("/api/cart", (req, res) => {
  if (!req.session.user) return res.sendStatus(401);
  const { body: item } = req;

  const { cart } = req.session;

  if (cart) {
    cart.push(item);
  } else {
    req.session.cart = [item];
  }
  return res.status(201).send(item);
});
app.get("/api/cart", (req, res) => {
  if (!req.session.user || !req.session.cart) return res.sendStatus(401);
  return res.status(200).send(req.session.cart ?? []);
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

//localhost:8080/api/products
