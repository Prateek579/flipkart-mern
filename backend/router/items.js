const express = require("express");
const Item = require("../models/itemsSchema");

const itemsRouter = express.Router();

itemsRouter.get("/getallitems", async (req, res) => {
  const allItems = await Item.find({});
  res.status(200).json(allItems);
});

itemsRouter.get("/getitems/:category", async (req, res) => {
  const category = req.params.category;
  try {
    const items = await Item.find({ category });
    if (items.length === 0) {
      res.status(404).json({ message: "requested category is not available" });
    } else {
      res.status(200).json({ items });
    }
  } catch (error) {
    res.status(400).json({ message: "getitems internal server error" });
  }
});

itemsRouter.get("/ratingrange/:rating", async (req, res) => {
  const rating = req.params.rating;
  try {
    const items = await Item.find(
      {},
      { price: 1 }
      // {
      //   $or: [{ rating: { $gte: 1 } }, { rate: { $gte: 1 } }],
      // }
    );
    if (items.length === 0) {
      res.status(404).json({ message: "requested rating is not available" });
    } else {
      res.status(200).json({ items });
    }
  } catch (error) {
    res.status(400).json({ message: "rangeitems internal server error" });
  }
});

module.exports = itemsRouter;
