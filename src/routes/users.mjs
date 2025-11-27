import { Router } from "express";
import {
  body,
  query,
  validationResult,
  matchedData,
  checkSchema,
} from "express-validator";
import { mockUsers } from "../utils/constants.mjs";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { resolveIndexByUserId } from "../middleware/middlewares.mjs";
const router = Router();

// query params
router.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be at least 3-10 characters"),
  (req, res) => {
    const result = validationResult(req);
    console.log(result);
    const {
      query: { filter, value },
    } = req;
    // khi filter và value giá trị thì sẻ trả về
    if (filter && value)
      return res.send(mockUsers.filter((user) => user[filter].includes(value)));
    // khi filter và value giá trị là undefined. thì sẻ trả về users list
    return res.send(mockUsers);
  }
);
router.get("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;
  const findUser = mockUsers[findUserIndex];
  if (!findUser) return res.sendStatus(404);
  return res.send(findUser);
});
router.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  (req, res) => {
    const result = validationResult(req);
    // console.log(result);

    if (!result.isEmpty())
      return res.status(400).send({ errors: result.array() });
    const data = matchedData(req); // lấy tất cả cái trường trong body khi được gửi từ request lên. sử dụng express validator
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data }; // ...body lầy copy toàn bộ dữ liệu request gửi lên body.
    mockUsers.push(newUser);
    return res
      .status(201)
      .send({ data: newUser, msg: "Thêm mới thành công một tài khoản" });
  }
);
router.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return res.status(200).send({ msg: "Cập nhật thành công !" });
});
router.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return res.send({ msg: "Cập nhật thành công !" });
});
router.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;

  mockUsers.splice(findUserIndex, 1);
  return res.status(200).send({ msg: "Xóa thành công !" });
  // console.log(findUserIndex);
});
export default router;
