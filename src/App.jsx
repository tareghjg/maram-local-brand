import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";

import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";

const ADMIN_CREDENTIALS = [
  {
    phone: "01065870208",
    password: "0000",
    name: "طارق",
  },
  {
    phone: "01062046658",
    password: "1111",
    name: "بسنت",
  },
];

const getAdminAccountByPhone = (phone) => {
  if (!phone) return null;

  return (
    ADMIN_CREDENTIALS.find(
      (account) =>
        account.phone === phone.trim()
    ) || null
  );
};

function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const redirectPath =
    location.state?.from?.pathname ||
    "/admin/orders";

  const welcomeName =
    getAdminAccountByPhone(phone)?.name || "";

  const handleSubmit = (event) => {
    event.preventDefault();

    const matchedAccount =
      ADMIN_CREDENTIALS.find(
        (account) =>
          account.phone === phone.trim() &&
          account.password === password
      );

    if (!matchedAccount) {
      setError(
        "رقم الهاتف أو كلمة المرور غير صحيحة."
      );
      return;
    }

    sessionStorage.setItem(
      "maram-admin-authenticated",
      "true"
    );
    sessionStorage.setItem(
      "maram-admin-name",
      matchedAccount.name
    );
    navigate(redirectPath, { replace: true });
  };

  return (
    <main className="admin-login-page" dir="rtl">
      <div className="admin-login-panel">
        <div className="admin-login-brand">
          <span>MARAM</span>
          <small>ADMIN ACCESS</small>
        </div>

        <div className="admin-login-heading">
          {welcomeName && (
            <p className="admin-login-welcome">
              اهلا {welcomeName}
            </p>
          )}
          <p>لوحة التحكم</p>
          <h1>تسجيل الدخول</h1>
          <span>
            أدخل بياناتك للوصول إلى لوحة الإدارة
          </span>
        </div>

        <form
          className="admin-login-form"
          onSubmit={handleSubmit}
        >
          <label htmlFor="admin-phone">
            رقم الهاتف
          </label>
          <input
            id="admin-phone"
            type="tel"
            inputMode="numeric"
            autoComplete="username"
            placeholder="01000000000"
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
              setError("");
            }}
            required
          />

          <label htmlFor="admin-password">
            كلمة المرور
          </label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            placeholder="••••"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError("");
            }}
            required
          />

          {error && (
            <p className="admin-login-error">
              {error}
            </p>
          )}

          <button type="submit">
            دخول إلى لوحة التحكم
          </button>
        </form>
      </div>

      <div className="admin-login-visual" />
    </main>
  );
}

function ProtectedAdminRoute({ children }) {
  const location = useLocation();
  const isAuthenticated =
    sessionStorage.getItem(
      "maram-admin-authenticated"
    ) === "true";

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}

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

          <Link to="/shop">
            {isArabic
              ? "المجموعات"
              : "Collections"}
          </Link>

          <Link to="/about">
            {isArabic ? "من نحن" : "About"}
          </Link>
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

            <Link to="/about" className="secondary-btn">
              {isArabic
                ? "اكتشفي المزيد"
                : "DISCOVER US"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function PromoNotification({ language }) {
  const [isVisible, setIsVisible] = useState(true);
  const isArabic = language === "ar";

  if (!isVisible) {
    return null;
  }

  return (
    <div className="promo-notification" role="status">
      <a
        href="https://wa.me/201556465171"
        target="_blank"
        rel="noreferrer"
        className="promo-notification-link"
      >
        <span className="promo-notification-dot" />
        <span>
          <strong>
            {isArabic ? "هل لديك سؤال؟" : "Need help?"}
          </strong>
          <small>
            {isArabic ? "تواصل معنا على واتساب" : "Message us on WhatsApp"}
          </small>
        </span>
      </a>
      <button
        type="button"
        className="promo-notification-close"
        onClick={() => setIsVisible(false)}
        aria-label={isArabic ? "إغلاق الإعلان" : "Close notification"}
      >
        ×
      </button>
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
      <PromoNotification language={language} />
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
          path="/about"
          element={
            <About
              language={language}
              setLanguage={setLanguage}
            />
          }
        />

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedAdminRoute>
              <AdminOrders />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <ProtectedAdminRoute>
              <AdminProducts />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;