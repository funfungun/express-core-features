import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();

app.use(express.json());
app.use(cors());

const validate = (req, res, next) => {
  const { id, password } = req.body;
  if (id.length < 3 || id.length > 20) {
    return res
      .status(400)
      .json({ message: "id는 3글자 이상, 20글자 이하여야 합니다." });
  }

  if (password.length < 6 || password.length > 20) {
    return res
      .status(400)
      .json({ message: "password는 3글자 이상, 20글자 이하여야 합니다." });
  }

  res.locals.validatedAt = new Date().toISOString();
  next();
};

app.post("/users", validate, (req, res) => {
  const { validatedAt } = res.locals;
  res.status(201).json({ message: "안녕, 코드잇 (;", validatedAt });
});

const products = [
  {
    id: 1,
    name: "MacBook Pro",
    price: 2500000,
    reviews: [
      { id: 1, user: "민준", rating: 5 },
      { id: 2, user: "서연", rating: 4 },
    ],
  },
  {
    id: 2,
    name: "Logitech MX Keys",
    price: 120000,
    reviews: [
      { id: 3, user: "지후", rating: 5 },
      { id: 4, user: "하윤", rating: 3 },
    ],
  },
];

const getProduct = (req, res, next) => {
  const { id: productId } = req.params;
  const product = products.find(
    (product) => product.id === parseInt(productId)
  );
  if (!product) {
    // return res.status(404).json({ error: "Invalid productId" });
    next({ name: "NotFoundProduct" });
  }
  res.locals.product = product;
  next();
};

app.get("/products/:id", getProduct, (req, res) => {
  res.json(res.locals.product);
});

app.get("/products/:id/reviews", getProduct, (req, res) => {
  res.json(res.locals.product.reviews);
});

app.use((err, req, res, next) => {
  if (err.name === "NotFoundProduct") {
    res.status(404).json({ message: err.name });
  } else {
    res.status(500).json({ message: "server error" });
  }
});

//
const upload = multer({ dest: "./uploads" });
app.use("/files", express.static("uploads"));

app.post("/files", upload.single("attachment"), (req, res) => {
  console.log(req.file);
  const path = `/files/${req.file.filename}`;
  res.json({ path });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
