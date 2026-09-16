import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import { useState } from "react";

import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";

function Home({ language, setLanguage }) {
  const isArabic = language === "ar";

  return (
    <div
      className={`app ${
        isArabic ? "arabic" : "english"
      }`}
    >
      <header className="navbar">
        <nav className="nav-links">
          <Link to="/">
            {isArabic ? "الرئيسية" : "Home"}
          </Link>

          <Link to="/shop">
            {isArabic ? "المتجر" : "Shop"}
          </Link>

          <a href="#collections">
            {isArabic
              ? "المجموعات"
              : "Collections"}
          </a>

          <a href="#about">
            {isArabic ? "من نحن" : "About"}
          </a>
        </nav>

        <Link to="/" className="logo">
          <h1>MARAM</h1>

          <span>local brand</span>
        </Link>

        <div className="nav-actions">
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
            className="cart-nav-button"
            aria-label="Shopping bag"
          >
            🛍️
          </Link>
        </div>
      </header>

      <section className="hero">
        <div className="hero-image"></div>

        <div className="hero-content">
          <p className="subtitle">
            {isArabic
              ? "المجموعة الجديدة"
              : "THE NEW COLLECTION"}
          </p>

          <h2>
            {isArabic ? (
              <>
                أناقة،
                <br />
                <span>مرام</span>
              </>
            ) : (
              <>
                Elegance,
                <br />
                <span>MARAM</span>
              </>
            )}
          </h2>

          <p className="description">
            {isArabic
              ? "اكتشفي مجموعتنا المختارة بعناية من الأزياء المحتشمة والأنيقة، المصممة للمرأة التي تحب البساطة والجمال الخالد."
              : "Discover our carefully crafted collection of elegant modest wear, designed for women who love simplicity and timeless beauty."}
          </p>

          <div className="hero-buttons">
            <Link
              to="/shop"
              className="primary-btn"
            >
              {isArabic
                ? "تسوقي المجموعة"
                : "SHOP COLLECTION"}
            </Link>

            <button className="secondary-btn">
              {isArabic
                ? "اكتشفي المزيد"
                : "DISCOVER US"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function App() {
  const [language, setLanguage] =
    useState("en");

  const [cart, setCart] =
    useState([]);

  const getCartItemKey = (product) => {
    return [
      product.id,
      product.size || "",
      product.color || "",
    ].join("__");
  };

  const addToCart = (
    product,
    quantity
  ) => {
    setCart((currentCart) => {
      const productKey =
        getCartItemKey(product);

      const existingProduct =
        currentCart.find(
          (item) =>
            getCartItemKey(item) ===
            productKey
        );

      if (existingProduct) {
        return currentCart.map(
          (item) =>
            getCartItemKey(item) ===
            productKey
              ? {
                  ...item,
                  quantity:
                    item.quantity +
                    quantity,
                }
              : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity,
        },
      ];
    });
  };

  const updateCartQuantity = (
    productId,
    quantity,
    size = "",
    color = ""
  ) => {
    setCart((currentCart) => {
      const productKey = [
        productId,
        size,
        color,
      ].join("__");

      if (quantity <= 0) {
        return currentCart.filter(
          (item) =>
            getCartItemKey(item) !==
            productKey
        );
      }

      return currentCart.map(
        (item) =>
          getCartItemKey(item) ===
          productKey
            ? {
                ...item,
                quantity,
              }
            : item
      );
    });
  };

  const removeFromCart = (
    productId,
    size = "",
    color = ""
  ) => {
    setCart((currentCart) => {
      const productKey = [
        productId,
        size,
        color,
      ].join("__");

      return currentCart.filter(
        (item) =>
          getCartItemKey(item) !==
          productKey
      );
    });
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              language={language}
              setLanguage={setLanguage}
            />
          }
        />

        <Route
          path="/shop"
          element={
            <Shop
              language={language}
              setLanguage={setLanguage}
            />
          }
        />

        <Route
          path="/product/:id"
          element={
            <ProductDetails
              language={language}
              setLanguage={setLanguage}
              addToCart={addToCart}
            />
          }
        />

        <Route
          path="/cart"
          element={
            <Cart
              language={language}
              setLanguage={setLanguage}
              cart={cart}
              updateCartQuantity={
                updateCartQuantity
              }
              removeFromCart={
                removeFromCart
              }
            />
          }
        />

        <Route
          path="/checkout"
          element={
            <Checkout
              language={language}
              setLanguage={setLanguage}
              cart={cart}
            />
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminOrders />
          }
        />

        <Route
          path="/admin/products"
          element={
            <AdminProducts />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;