const express = require("express");
const Order = require("../models/orderSchema");
const authUser = require("../middleware/authUser");
const asyncHandler = require("express-async-handler");

const orderRouter = express.Router();

//adding items to user card using POST method /api/user/order/additem/:id
orderRouter.post("/additem", authUser, async (req, res) => {
  const { itemid, title, price, description, image, rate, count } = req.body;
  if (
    !itemid ||
    !title ||
    !price ||
    !description ||
    !image ||
    !rate ||
    !count
  ) {
    res
      .status(400)
      .json({ message: "Please provide all fields", success: false });
  } else {
    try {
      const itemAdded = await Order.create({
        user: req.user.id,
        itemid,
        title,
        price,
        description,
        image,
        rating: {
          rate,
          count,
        },
      });
      res.status(200).json({
        message: "item added to card successfully",
        itemAdded,
        success: true,
      });
    } catch (error) {
      console.log("internal server error", error);
      res
        .status(400)
        .json({ message: "internal server error", success: false });
    }
  }
});

orderRouter.post("/deleteitem", authUser, async (req, res) => {
  const userId = req.user.id;
  const { itemid } = req.body;
  if (!itemid) {
    res.status(400).json({ message: "Please provide item id", success: false });
  } else {
    const allItem = await Order.find({ itemid });
    let _id;
    for (let i = 0; i < allItem.length; i++) {
      let item = allItem[i];
      const dataUserId = item.user.toString().split('"');
      const data_id = item._id.toString().split('"');
      if (dataUserId[0] === userId) {
        _id = data_id[0];
        break;
      }
    }
    if (_id) {
      try {
        const itemDeleted = await Order.deleteOne({
          _id,
        });
        res.status(200).json({
          message: "One item deleted from cart",
          itemDeleted,
          success: true,
        });
      } catch (error) {
        res
          .status(400)
          .json({ message: "internal server error", success: false });
      }
    } else {
      res.status(400).json({ message: "User dont have item in cart" });
    }
  }
});

//getting user order list using GET method /api/order/orderlist
orderRouter.get("/orderlist", authUser, async (req, res) => {
  const user = req.user.id;
  try {
    const allOrder = await Order.find({ user });
    res.status(200).json({ allOrder });
  } catch (error) {
    console.log("error in displaying all order list", error);
    res.status(200).json({ message: "internal server error" });
  }
});


module.exports = orderRouter;

// let isItem;
// try {
//   isItem = await Order.findOne({ itemid });
//   const itemUserId = isItem.user.toString();
//   console.log("items user id is", itemUserId);
// } catch (error) {
//   console.log("internal server error", error);
//   res.status(400).json({ message: "internal server error" });
// }

// if (userId !== itemUserId) {
//   res.status(400).json({ message: "user dont have item" });
// }
// try {
//   const itemDeleted = await Order.deleteOne({ itemid });
//   res
//     .status(200)
//     .json({ message: "item removed from card successfully", itemDeleted });
// } catch (error) {
//   console.log("internal server error", error);
//   res.status(400).json({ message: "internal server error" });
// }


//deleting a order using DELETE method /api/order/orderitem/:id find product -> verify user -> delete
// orderRouter.delete("/deleteitem/:id", authUser, async (req, res) => {
//   const user = req.user.id;
//   const itemid = req.params.id;
//   let userOrderList = await Order.find({ user });
//   let itemExist;
//   for (let i = 0; i < userOrderList.length; i++) {
//     const saveItemId = userOrderList[i].itemid;
//     itemExist = false;
//     if (saveItemId === itemid) {
//       itemExist = true;
//       break;
//     }
//   }
//   if (itemExist.toString() === "false") {
//     res.status(404).json({ message: "item is not exist in card" });
//   } else {
//     try {
//       const itemDeleted = await Order.deleteOne({ itemid });
//       res
//         .status(200)
//         .json({ message: "item removed from card successfully", itemDeleted });
//     } catch (error) {
//       console.log("internal server error", error);
//       res.status(400).json({ message: "internal server error" });
//     }
//   }
// });