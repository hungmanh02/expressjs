import { Router } from "express";
import { mockProducts } from "../utils/constants.mjs";
const router = Router();

router.get("/api/products", (req, res) => {
  console.log(req.signedCookies);
  if (req.cookies.hello && req.cookies.hello === "world")
    return res.send(mockProducts);
  if (req.signedCookies.hello && req.signedCookies.hello === "world")
    return res.send(mockProducts);

  return res.status(403).send({ msg: "Sorry. You need the correct cookie" });
});
export default router;
