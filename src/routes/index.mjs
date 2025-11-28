import { Router } from "express";
import usersRouter from "./users.mjs";
import productsRouter from "./products.mjs";
const router = Router();

router.use(usersRouter); // sử dụng router users riêng.
router.use(productsRouter); // sử dụng router products riêng.
router.get("/", (req, res) => {
  console.log(req.session);
  console.log(req.session.id);
  req.session.visited = true;
  res.cookie("hello", "world", { maxAge: 6000 * 60 * 2, signed: true });
  res.status(201).send({ msg: "Hello" });
});
export default router;
