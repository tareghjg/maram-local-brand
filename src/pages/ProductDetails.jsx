import "./ProductDetails.css";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL = "/api/products";

function ProductDetails({
  language,
  setLanguage,
  addToCart,
}) {
  const { id } = useParams();

  const isArabic = language === "ar";

  const [product, setProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  const [isFavorite, setIsFavorite] =
    useState(false);

  const [added, setAdded] =
    useState(false);

  const [selectedImage, setSelectedImage] =
    useState(0);

  const [selectedSize, setSelectedSize] =
    useState("");

  const [selectedColor, setSelectedColor] =
    useState("");

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    setSelectedImage(0);
    setSelectedSize("");
    setSelectedColor("");
    setQuantity(1);
    setAdded(false);
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");
      setProduct(null);

      const response = await fetch(
        `${API_URL}/${id}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Product not found."
        );
      }

      setProduct(data.product);
    } catch (error) {
      console.error(
        "Product details error:",
        error
      );

      setError(
        isArabic
          ? "المنتج غير موجود"
          : "Product Not Found"
      );
    } finally {
      setLoading(false);
    }
  };

  const getProductName = () => {
    if (!product) {
      return "";
    }

    if (isArabic) {
      return (
        product.name?.ar ||
        product.name?.en ||
        ""
      );
    }

    return (
      product.name?.en ||
      product.name?.ar ||
      ""
    );
  };

  const getProductDescription = () => {
    if (!product) {
      return "";
    }

    if (isArabic) {
      return (
        product.description?.ar ||
        product.description?.en ||
        ""
      );
    }

    return (
      product.description?.en ||
      product.description?.ar ||
      ""
    );
  };

  const getCategoryName = () => {
    if (!product) {
      return "";
    }

    const categoryTranslations = {
      Isdal: "إسدالات",
      Abayas: "عبايات",
      Sets: "أطقم",
      Accessories: "إكسسوارات",
    };

    if (isArabic) {
      return (
        categoryTranslations[
          product.category
        ] || product.category
      );
    }

    return product.category;
  };

  const productImages = useMemo(() => {
    if (!product) {
      return [];
    }

    const images = Array.isArray(
      product.images
    )
      ? product.images.filter(Boolean)
      : [];

    if (
      product.image &&
      !images.includes(product.image)
    ) {
      images.unshift(product.image);
    }

    if (
      images.length === 0 &&
      product.image
    ) {
      return [product.image];
    }

    return images;
  }, [product]);

  const productSizes = useMemo(() => {
    if (
      !product ||
      !Array.isArray(product.sizes)
    ) {
      return [];
    }

    return product.sizes
      .map((size) =>
        String(size).trim()
      )
      .filter(Boolean);
  }, [product]);

  const productColors = useMemo(() => {
    if (
      !product ||
      !Array.isArray(product.colors)
    ) {
      return [];
    }

    return product.colors.filter(
      (color) =>
        color &&
        color.name &&
        color.value
    );
  }, [product]);

  const selectedImageUrl =
    productImages[selectedImage] ||
    product?.image ||
    "";

  const selectedColorObject =
    productColors.find(
      (color) =>
        String(color.name) ===
        selectedColor
    );

  const handlePreviousImage = () => {
    if (productImages.length <= 1) {
      return;
    }

    setSelectedImage((current) =>
      current === 0
        ? productImages.length - 1
        : current - 1
    );
  };

  const handleNextImage = () => {
    if (productImages.length <= 1) {
      return;
    }

    setSelectedImage((current) =>
      current ===
      productImages.length - 1
        ? 0
        : current + 1
    );
  };

  const handleAddToCart = () => {
    if (!product) {
      return;
    }

    if (
      productSizes.length > 0 &&
      !selectedSize
    ) {
      alert(
        isArabic
          ? "من فضلك اختر المقاس"
          : "Please select a size."
      );

      return;
    }

    if (
      productColors.length > 0 &&
      !selectedColor
    ) {
      alert(
        isArabic
          ? "من فضلك اختر اللون"
          : "Please select a color."
      );

      return;
    }

    const cartProduct = {
      id: product._id,
      name: getProductName(),
      price: product.price,
      category: product.category,
      image:
        selectedImageUrl ||
        product.image,
      size: selectedSize,
      color: selectedColor,
      colorValue:
        selectedColorObject?.value ||
        "",
    };

    addToCart(
      cartProduct,
      quantity
    );

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  const getColorName = (color) => {
    if (!color) {
      return "";
    }

    if (typeof color === "string") {
      return color;
    }

    return color.name || "";
  };

  const getColorValue = (color) => {
    if (!color) {
      return "";
    }

    if (typeof color === "string") {
      return "";
    }

    return color.value || "";
  };

  if (loading) {
    return (
      <div
        className={`product-details-page ${
          isArabic
            ? "arabic"
            : "english"
        }`}
      >
        <header className="product-navbar">
          <nav className="product-nav-links">
            <Link to="/">
              {isArabic
                ? "الرئيسية"
                : "Home"}
            </Link>

            <Link to="/shop">
              {isArabic
                ? "المتجر"
                : "Shop"}
            </Link>

            <a href="/#collections">
              {isArabic
                ? "المجموعات"
                : "Collections"}
            </a>

            <a href="/#about">
              {isArabic
                ? "من نحن"
                : "About"}
            </a>
          </nav>

          <Link
            to="/"
            className="product-logo"
          >
            <span>MARAM</span>

            <small>
              local brand
            </small>
          </Link>

          <div className="product-nav-actions">
            <button
              className="language-btn"
              onClick={() =>
                setLanguage(
                  isArabic
                    ? "en"
                    : "ar"
                )
              }
            >
              {isArabic ? "EN" : "AR"}
            </button>

            <button aria-label="Wishlist">
              ♡
            </button>

            <Link
              to="/cart"
              className="cart-link"
              aria-label="Shopping bag"
            >
              🛍️
            </Link>
          </div>
        </header>

        <div className="product-not-found">
          <h1>
            {isArabic
              ? "جاري تحميل المنتج..."
              : "Loading Product..."}
          </h1>
        </div>
      </div>
    );
  }

  if (!product || error) {
    return (
      <div
        className={`product-details-page ${
          isArabic
            ? "arabic"
            : "english"
        }`}
      >
        <header className="product-navbar">
          <nav className="product-nav-links">
            <Link to="/">
              {isArabic
                ? "الرئيسية"
                : "Home"}
            </Link>

            <Link to="/shop">
              {isArabic
                ? "المتجر"
                : "Shop"}
            </Link>

            <a href="/#collections">
              {isArabic
                ? "المجموعات"
                : "Collections"}
            </a>

            <a href="/#about">
              {isArabic
                ? "من نحن"
                : "About"}
            </a>
          </nav>

          <Link
            to="/"
            className="product-logo"
          >
            <span>MARAM</span>

            <small>
              local brand
            </small>
          </Link>

          <div className="product-nav-actions">
            <button
              className="language-btn"
              onClick={() =>
                setLanguage(
                  isArabic
                    ? "en"
                    : "ar"
                )
              }
            >
              {isArabic ? "EN" : "AR"}
            </button>

            <button aria-label="Wishlist">
              ♡
            </button>

            <Link
              to="/cart"
              className="cart-link"
              aria-label="Shopping bag"
            >
              🛍️
            </Link>
          </div>
        </header>

        <div className="product-not-found">
          <h1>
            {isArabic
              ? "المنتج غير موجود"
              : "Product Not Found"}
          </h1>

          <Link to="/shop">
            {isArabic
              ? "العودة للمتجر"
              : "Back to Shop"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`product-details-page ${
        isArabic
          ? "arabic"
          : "english"
      }`}
    >
      <header className="product-navbar">
        <nav className="product-nav-links">
          <Link to="/">
            {isArabic
              ? "الرئيسية"
              : "Home"}
          </Link>

          <Link to="/shop">
            {isArabic
              ? "المتجر"
              : "Shop"}
          </Link>

          <a href="/#collections">
            {isArabic
              ? "المجموعات"
              : "Collections"}
          </a>

          <a href="/#about">
            {isArabic
              ? "من نحن"
              : "About"}
          </a>
        </nav>

        <Link
          to="/"
          className="product-logo"
        >
          <span>MARAM</span>

          <small>
            local brand
          </small>
        </Link>

        <div className="product-nav-actions">
          <button
            className="language-btn"
            onClick={() =>
              setLanguage(
                isArabic
                  ? "en"
                  : "ar"
              )
            }
          >
            {isArabic ? "EN" : "AR"}
          </button>

          <button
            aria-label="Wishlist"
            onClick={() =>
              setIsFavorite(
                !isFavorite
              )
            }
          >
            {isFavorite
              ? "♥"
              : "♡"}
          </button>

          <Link
            to="/cart"
            className="cart-link"
            aria-label="Shopping bag"
          >
            🛍️
          </Link>
        </div>
      </header>

      <main className="product-details-container">
        <Link
          to="/shop"
          className="back-to-shop"
        >
          ←{" "}
          {isArabic
            ? "العودة للمتجر"
            : "Back to Shop"}
        </Link>

        <div className="product-details-grid">
          {/* PRODUCT GALLERY */}

          <div className="product-gallery">
            <div className="product-main-image">
              <img
                src={selectedImageUrl}
                alt={getProductName()}
              />

              {productImages.length > 1 && (
                <>
                  <button
                    className="gallery-arrow gallery-arrow-left"
                    onClick={
                      handlePreviousImage
                    }
                    aria-label="Previous image"
                  >
                    ‹
                  </button>

                  <button
                    className="gallery-arrow gallery-arrow-right"
                    onClick={
                      handleNextImage
                    }
                    aria-label="Next image"
                  >
                    ›
                  </button>

                  <div className="gallery-counter">
                    {selectedImage + 1} /{" "}
                    {productImages.length}
                  </div>
                </>
              )}
            </div>

            {productImages.length > 1 && (
              <div className="product-thumbnails">
                {productImages.map(
                  (image, index) => (
                    <button
                      key={`${image}-${index}`}
                      className={`product-thumbnail ${
                        selectedImage ===
                        index
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedImage(
                          index
                        )
                      }
                      aria-label={`View image ${
                        index + 1
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${getProductName()} ${
                          index + 1
                        }`}
                      />
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* INFO */}

          <div className="product-details-info">
            <p className="product-details-category">
              {getCategoryName()}
            </p>

            <h1>
              {getProductName()}
            </h1>

            <p className="product-details-price">
              {product.price} EGP
            </p>

            <div className="product-divider"></div>

            <p className="product-details-description">
              {getProductDescription()}
            </p>

            {/* FEATURES */}

            <div className="product-features">
              <div className="feature">
                <span>✦</span>

                <p>
                  {isArabic
                    ? "خامة مريحة وعالية الجودة"
                    : "Premium comfortable fabric"}
                </p>
              </div>

              <div className="feature">
                <span>✦</span>

                <p>
                  {isArabic
                    ? "تصميم أنيق ومحتشم"
                    : "Elegant modest design"}
                </p>
              </div>

              <div className="feature">
                <span>✦</span>

                <p>
                  {isArabic
                    ? "مناسب للاستخدام اليومي"
                    : "Perfect for everyday wear"}
                </p>
              </div>
            </div>

            {/* SIZE */}

            {productSizes.length > 0 && (
              <div className="product-option-section">
                <div className="product-option-header">
                  <p>
                    {isArabic
                      ? "المقاس"
                      : "Size"}
                  </p>

                  {selectedSize && (
                    <span>
                      {selectedSize}
                    </span>
                  )}
                </div>

                <div className="size-options">
                  {productSizes.map(
                    (size) => (
                      <button
                        key={size}
                        className={`size-option ${
                          selectedSize ===
                          size
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedSize(
                            size
                          )
                        }
                      >
                        {size}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* COLOR */}

            {productColors.length > 0 && (
              <div className="product-option-section color-section">
                <div className="product-option-header">
                  <p>
                    {isArabic
                      ? "اللون"
                      : "Color"}
                  </p>

                  {selectedColor && (
                    <span>
                      {getColorName(
                        selectedColorObject
                      )}
                    </span>
                  )}
                </div>

                <div className="color-options">
                  {productColors.map(
                    (color, index) => {
                      const colorName =
                        getColorName(
                          color
                        );

                      const colorValue =
                        getColorValue(
                          color
                        );

                      return (
                        <button
                          key={`${colorName}-${index}`}
                          className={`color-option ${
                            selectedColor ===
                            colorName
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            setSelectedColor(
                              colorName
                            )
                          }
                          title={getColorName(
                            color
                          )}
                          aria-label={getColorName(
                            color
                          )}
                        >
                          <span
                            className="color-swatch"
                            style={
                              colorValue
                                ? {
                                    backgroundColor:
                                      colorValue,
                                  }
                                : undefined
                            }
                          >
                            {!colorValue &&
                              colorName
                                ?.charAt(
                                  0
                                )
                                .toUpperCase()}
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            )}

            {/* QUANTITY */}

            <div className="quantity-section">
              <p>
                {isArabic
                  ? "الكمية"
                  : "Quantity"}
              </p>

              <div className="quantity-control">
                <button
                  onClick={() =>
                    setQuantity(
                      Math.max(
                        1,
                        quantity - 1
                      )
                    )
                  }
                >
                  −
                </button>

                <span>
                  {quantity}
                </span>

                <button
                  onClick={() =>
                    setQuantity(
                      quantity + 1
                    )
                  }
                >
                  +
                </button>
              </div>
            </div>

            {/* ADD TO CART */}

            <button
              className={`add-to-cart-btn ${
                added ? "added" : ""
              }`}
              onClick={
                handleAddToCart
              }
            >
              {added
                ? isArabic
                  ? "تمت الإضافة ✓"
                  : "ADDED ✓"
                : isArabic
                ? "أضيفي إلى السلة"
                : "ADD TO CART"}
            </button>

            {added && (
              <Link
                to="/cart"
                className="view-cart-after-add"
              >
                {isArabic
                  ? "عرض السلة"
                  : "View Cart"}
              </Link>
            )}

            {/* NOTES */}

            <div className="product-notes">
              <div className="note">
                <span>✦</span>

                <p>
                  {isArabic
                    ? "شحن سريع وآمن"
                    : "Fast & secure shipping"}
                </p>
              </div>

              <div className="note">
                <span>✦</span>

                <p>
                  {isArabic
                    ? "دفع آمن"
                    : "Secure payment"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProductDetails;