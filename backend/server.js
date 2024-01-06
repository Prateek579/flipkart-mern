const express = require("express");
const cors = require("cors");

const connectDb = require("./connection/db");

const itemsRouter = require("./router/items");
const authRouter = require("./router/auth");
const orderRouter = require("./router/order");

const app = express();

const port = 8017;
connectDb();

app.use(cors());
app.use(express.json());

app.use("/api/items", itemsRouter);
app.use("/api/auth", authRouter);
app.use("/api/order", orderRouter);

app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
