import "./Shop.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_API_URL || ""}/api/products`;

const categories = [
  "All",
  "Isdal",
  "Abayas",
  "Sets",
  "Accessories",
];

function Shop({ language, setLanguage }) {
  const [activeCategory, setActiveCategory] =
    useState("All");

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [sortOption, setSortOption] =
    useState("default");

  const isArabic = language === "ar";

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      let response;
      let lastError;

      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          response = await fetch(API_URL);
          if (response.ok) {
            break;
          }
          lastError = new Error(`Products API returned ${response.status}.`);
        } catch (requestError) {
          lastError = requestError;
        }

        if (attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 700));
        }
      }

      if (!response) {
        throw lastError || new Error("Products API is unavailable.");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch products."
        );
      }

      setProducts(data.products || []);
    } catch (error) {
      console.error(
        "Shop products error:",
        error
      );

      setError(
        isArabic
          ? "حدث خطأ أثناء تحميل المنتجات."
          : "Something went wrong while loading products."
      );
    } finally {
      setLoading(false);
    }
  };

  const getProductName = (product) => {
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

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter(
          (product) =>
            product.category ===
            activeCategory
        );

  const sortedProducts = [
    ...filteredProducts,
  ].sort((a, b) => {
    if (sortOption === "low") {
      return a.price - b.price;
    }

    if (sortOption === "high") {
      return b.price - a.price;
    }

    return 0;
  });

  const isComingSoon =
    activeCategory !== "All" &&
    activeCategory !== "Isdal";

  return (
    <div
      className={`shop-page ${
        isArabic ? "arabic" : "english"
      }`}
    >
      {/* NAVBAR */}

      <header className="shop-navbar">
        <nav className="shop-nav-links">
          <Link to="/">
            {isArabic ? "الرئيسية" : "Home"}
          </Link>

          <Link to="/shop">
            {isArabic ? "المتجر" : "Shop"}
          </Link>

          <a href="/#collections">
            {isArabic
              ? "المجموعات"
              : "Collections"}
          </a>

          <Link to="/about">
            {isArabic ? "من نحن" : "About"}
          </Link>
        </nav>

        <Link
          to="/"
          className="shop-logo"
        >
          <span>MARAM</span>

          <small>local brand</small>
        </Link>

        <div className="shop-nav-actions">
          <button
            className="language-btn"
            onClick={() =>
              setLanguage(
                isArabic ? "en" : "ar"
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
            aria-label="Shopping bag"
          >
            🛍️
          </Link>
        </div>
      </header>

      {/* SHOP HEADER */}

      <div className="shop-header">
        <p className="shop-brand">
          MARAM
        </p>

        <h1>
          {isArabic
            ? "اكتشفي مجموعتنا"
            : "Shop Our Collection"}
        </h1>

        <p className="shop-description">
          {isArabic
            ? "اكتشفي مجموعتنا من الأزياء المحتشمة والأنيقة المصممة بعناية."
            : "Discover our carefully selected modest pieces, designed with elegance and comfort in mind."}
        </p>
      </div>

      {/* SHOP CONTENT */}

      <div className="shop-content">
        {/* FILTERS */}

        <aside className="filters">
          <h3>
            {isArabic
              ? "التصنيفات"
              : "Categories"}
          </h3>

          {categories.map((category) => (
            <button
              key={category}
              className={
                activeCategory === category
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveCategory(category)
              }
            >
              {isArabic
                ? category === "All"
                  ? "كل المنتجات"
                  : category === "Isdal"
                  ? "إسدالات"
                  : category === "Abayas"
                  ? "عبايات"
                  : category === "Sets"
                  ? "أطقم"
                  : "إكسسوارات"
                : category === "All"
                ? "All Products"
                : category}
            </button>
          ))}
        </aside>

        {/* PRODUCTS */}

        <div className="products-area">
          {loading ? (
            <div className="coming-soon-card">
              <div className="coming-soon-content">
                <span className="coming-soon-brand">
                  MARAM
                </span>

                <h2>
                  {isArabic
                    ? "جاري التحميل"
                    : "Loading"}
                </h2>

                <p>
                  {isArabic
                    ? "جاري تحميل المنتجات..."
                    : "Loading our collection..."}
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="coming-soon-card">
              <div className="coming-soon-content">
                <span className="coming-soon-brand">
                  MARAM
                </span>

                <h2>
                  {isArabic
                    ? "حدث خطأ"
                    : "Something went wrong"}
                </h2>

                <p>{error}</p>

                <button
                  className="secondary-btn"
                  onClick={fetchProducts}
                >
                  {isArabic
                    ? "حاول مرة أخرى"
                    : "Try Again"}
                </button>
              </div>
            </div>
          ) : isComingSoon ? (
            <div className="coming-soon-card">
              <div className="coming-soon-content">
                <span className="coming-soon-brand">
                  MARAM
                </span>

                <h2>
                  {isArabic
                    ? "قريبًا"
                    : "Coming Soon"}
                </h2>

                <p>
                  {isArabic
                    ? "نعمل حاليًا على تجهيز هذه المجموعة."
                    : "We are currently preparing this collection for you."}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="products-top">
                <span>
                  {sortedProducts.length}{" "}
                  {isArabic
                    ? "منتجات"
                    : "Products"}
                </span>

                <select
                  value={sortOption}
                  onChange={(event) =>
                    setSortOption(
                      event.target.value
                    )
                  }
                >
                  <option value="default">
                    {isArabic
                      ? "ترتيب حسب"
                      : "Sort by"}
                  </option>

                  <option value="low">
                    {isArabic
                      ? "السعر: من الأقل للأعلى"
                      : "Price: Low to High"}
                  </option>

                  <option value="high">
                    {isArabic
                      ? "السعر: من الأعلى للأقل"
                      : "Price: High to Low"}
                  </option>
                </select>
              </div>

              {sortedProducts.length ===
              0 ? (
                <div className="coming-soon-card">
                  <div className="coming-soon-content">
                    <span className="coming-soon-brand">
                      MARAM
                    </span>

                    <h2>
                      {isArabic
                        ? "لا توجد منتجات"
                        : "No Products"}
                    </h2>

                    <p>
                      {isArabic
                        ? "لا توجد منتجات متاحة حاليًا في هذه الفئة."
                        : "There are currently no products available in this category."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="products-grid">
                  {sortedProducts.map(
                    (product) => (
                      <Link
                        to={`/product/${product._id}`}
                        className="product-card"
                        key={product._id}
                      >
                        <div className="product-image">
                          <img
                            src={
                              product.image
                            }
                            alt={getProductName(
                              product
                            )}
                          />

                          <button
                            className="wishlist-btn"
                            aria-label="Add to wishlist"
                            onClick={(
                              event
                            ) =>
                              event.preventDefault()
                            }
                          >
                            ♡
                          </button>
                        </div>

                        <div className="product-info">
                          <p>
                            {isArabic
                              ? "إسدال"
                              : "ISDAL"}
                          </p>

                          <h3>
                            {getProductName(
                              product
                            )}
                          </h3>

                          <span>
                            {product.price}{" "}
                            EGP
                          </span>
                        </div>
                      </Link>
                    )
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Shop;