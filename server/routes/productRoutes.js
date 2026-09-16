const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

const normalizeSizes = (sizes) => {
  if (!Array.isArray(sizes)) {
    return ["2X", "3X"];
  }

  return sizes
    .map((size) => String(size).trim())
    .filter(Boolean);
};

const normalizeColors = (colors) => {
  if (!Array.isArray(colors)) {
    return [];
  }

  return colors
    .filter(
      (color) =>
        color &&
        color.name &&
        color.value
    )
    .map((color) => ({
      name: String(color.name).trim(),
      value: String(color.value).trim(),
    }));
};


/* =========================
   GET ALL PRODUCTS
========================= */

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(
      "Get products error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Something went wrong while fetching products.",
    });
  }
});


/* =========================
   GET SINGLE PRODUCT
========================= */

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(
      "Get product error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Something went wrong while fetching the product.",
    });
  }
});


/* =========================
   CREATE PRODUCT
========================= */

router.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      images,
      sizes,
      colors,
      category,
      available,
    } = req.body;

    const productImages =
      Array.isArray(images)
        ? images.filter(Boolean)
        : [];

    const mainImage =
      image ||
      productImages[0] ||
      "";

    const productSizes =
      normalizeSizes(sizes);

    const productColors =
      normalizeColors(colors);

    if (
      !name ||
      !name.en ||
      !name.ar ||
      price === undefined ||
      !mainImage ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required product information.",
      });
    }

    const product =
      await Product.create({
        name,

        description: description || {
          en: "",
          ar: "",
        },

        price,

        image: mainImage,

        images:
          productImages.length > 0
            ? productImages
            : [mainImage],

        sizes: productSizes,

        colors: productColors,

        category,

        available:
          available === undefined
            ? true
            : available,
      });

    res.status(201).json({
      success: true,

      message:
        "Product created successfully.",

      product,
    });
  } catch (error) {
    console.error(
      "Create product error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Something went wrong while creating the product.",
    });
  }
});


/* =========================
   UPDATE PRODUCT
========================= */

router.patch("/:id", async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      images,
      sizes,
      colors,
      category,
      available,
    } = req.body;

    const updateData = {
      name,
      description,
      price,
      category,
      available,
    };

    if (image !== undefined) {
      updateData.image = image;
    }

    if (images !== undefined) {
      const productImages =
        Array.isArray(images)
          ? images.filter(Boolean)
          : [];

      updateData.images =
        productImages;

      if (
        productImages.length > 0 &&
        image === undefined
      ) {
        updateData.image =
          productImages[0];
      }
    }

    if (sizes !== undefined) {
      updateData.sizes =
        normalizeSizes(sizes);
    }

    if (colors !== undefined) {
      updateData.colors =
        normalizeColors(colors);
    }

    const product =
      await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Product updated successfully.",
      product,
    });
  } catch (error) {
    console.error(
      "Update product error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Something went wrong while updating the product.",
    });
  }
});


/* =========================
   DELETE PRODUCT
========================= */

router.delete("/:id", async (req, res) => {
  try {
    const product =
      await Product.findByIdAndDelete(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Product deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete product error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Something went wrong while deleting the product.",
    });
  }
});


module.exports = router;