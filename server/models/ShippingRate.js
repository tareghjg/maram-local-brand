const mongoose = require("mongoose");

const shippingRateSchema = new mongoose.Schema(
  {
    rates: {
      type: Object,
      required: true,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ShippingRate",
  shippingRateSchema
);
