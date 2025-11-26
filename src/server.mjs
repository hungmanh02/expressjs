import express from "express";

const app = express();
app.use(express.json());

// Middleware
const loggingMiddleware = (request, response, next) => {
  console.log(`${request.method} - ${request.url}`);
  next();
};
const resolveIndexByUserId = (req, res, next) => {
  const {
    params: { id },
  } = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.sendStatus(400);
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return res.sendStatus(404);
  req.findUserIndex = findUserIndex;
  next();
};
app.use(loggingMiddleware, (req, res, next) => {
  console.log("Finished Logging ...");
  next();
});

// tạo dữ liệu giả,
const mockUsers = [
  { id: 1, username: "hung_manh", displayName: "Hùng Mạnh" },
  { id: 2, username: "manh", displayName: "Hùng Mạnh 01" },
  { id: 3, username: "do", displayName: "Hùng Mạnh 02" },
];
const PORT = process.env.PORT || 8080;
//localhost:8080
app.get("/", (req, res) => {
  res.status(201).send({ msg: "Hello" });
});
//localhost:8080/api/users
// query params
//localhost:8080/api/users?key=value1&key2=value2 // 2 giá trị query
app.get("/api/users", (req, res) => {
  const {
    query: { filter, value },
  } = req;
  // khi filter và value giá trị thì sẻ trả về
  if (filter && value)
    return res.send(mockUsers.filter((user) => user[filter].includes(value)));
  // khi filter và value giá trị là undefined. thì sẻ trả về users list
  return res.send(mockUsers);
});
// route param user by id
app.get("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;
  const findUser = mockUsers[findUserIndex];
  if (!findUser) return res.sendStatus(404);
  return res.send(findUser);
});
//Post requests, post request user

app.post("/api/users", (req, res) => {
  const { body } = req; // lấy tất cả cái trường trong body khi được gửi từ request lên.
  const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body }; // ...body lầy copy toàn bộ dữ liệu request gửi lên body.
  mockUsers.push(newUser);
  return res
    .status(201)
    .send({ data: newUser, msg: "Thêm mới thành công một tài khoản" });
});
//Put requests  , put request user
app.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return res.status(200).send({ msg: "Cập nhật thành công !" });
});
//Patch requests, patch request user
app.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return res.send({ msg: "Cập nhật thành công !" });
});
//Delete requests, delete request user
app.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;

  mockUsers.splice(findUserIndex, 1);
  return res.status(200).send({ msg: "Xóa thành công !" });
  // console.log(findUserIndex);
});
//localhost:8080/api/products
app.get("/api/products", (req, res) => {
  res.send([
    { id: 123, name: "Product name 01", price: 30000 },
    { id: 124, name: "Product name 02", price: 31000 },
    { id: 125, name: "Product name 03", price: 32000 },
    { id: 126, name: "Product name 04", price: 33000 },
  ]);
});

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

//localhost:8080/api/products
