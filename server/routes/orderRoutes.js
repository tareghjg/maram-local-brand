const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      customer,
      cart,
      subtotal,
      shipping,
      total,
    } = req.body;

    if (
      !customer ||
      !customer.fullName ||
      !customer.phone ||
      !customer.governorate ||
      !customer.city ||
      !customer.address
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required customer information.",
      });
    }

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty.",
      });
    }

    const products = cart.map((item) => ({
      id: String(item.id),

      name: item.name || "",

      image: item.image || "",

      price: Number(item.price) || 0,

      quantity: Number(item.quantity) || 1,

      size: item.size || "",

      color: item.color || "",

      colorValue: item.colorValue || "",
    }));

    const order = await Order.create({
      customer,

      products,

      subtotal: Number(subtotal) || 0,

      shipping: Number(shipping) || 0,

      total: Number(total) || 0,
    });

    res.status(201).json({
      success: true,

      message: "Order created successfully.",

      orderId: order._id,
    });
  } catch (error) {
    console.error(
      "Create order error:",
      error.message
    );

    res.status(500).json({
      success: false,

      message:
        "Something went wrong while creating the order.",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,

      orders,
    });
  } catch (error) {
    console.error(
      "Get orders error:",
      error.message
    );

    res.status(500).json({
      success: false,

      message:
        "Something went wrong while fetching orders.",
    });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,

        message: "Invalid order status.",
      });
    }

    const order =
      await Order.findByIdAndUpdate(
        req.params.id,

        {
          status,
        },

        {
          new: true,
          runValidators: true,
        }
      );

    if (!order) {
      return res.status(404).json({
        success: false,

        message: "Order not found.",
      });
    }

    res.status(200).json({
      success: true,

      message:
        "Order status updated successfully.",

      order,
    });
  } catch (error) {
    console.error(
      "Update order status error:",
      error.message
    );

    res.status(500).json({
      success: false,

      message:
        "Something went wrong while updating the order status.",
    });
  }
});

module.exports = router;