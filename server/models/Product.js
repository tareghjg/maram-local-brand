const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      en: {
        type: String,
        required: true,
        trim: true,
      },
      ar: {
        type: String,
        required: true,
        trim: true,
      },
    },

    description: {
      en: {
        type: String,
        default: "",
      },
      ar: {
        type: String,
        default: "",
      },
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    image: {
      type: String,
      default: "",
      trim: true,
    },

    images: {
      type: [String],
      default: [],
    },

    sizes: {
      type: [String],
      default: ["2X", "3X"],
    },

    colors: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },

        value: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],

    category: {
      type: String,
      required: true,
      enum: [
        "Isdal",
        "Abayas",
        "Sets",
        "Accessories",
      ],
    },

    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Product",
  productSchema
);