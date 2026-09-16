import "./Cart.css";
import { Link, useNavigate } from "react-router-dom";

function Cart({
  language,
  setLanguage,
  cart,
  updateCartQuantity,
  removeFromCart,
}) {
  const isArabic = language === "ar";
  const navigate = useNavigate();

  const subtotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const totalItems = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const getCartItemKey = (item) => {
    return [
      item.id,
      item.size || "",
      item.color || "",
    ].join("__");
  };

  return (
    <div
      className={`cart-page ${
        isArabic ? "arabic" : "english"
      }`}
    >
      <header className="cart-navbar">
        <nav className="cart-nav-links">
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

          <a href="/#about">
            {isArabic ? "من نحن" : "About"}
          </a>
        </nav>

        <Link
          to="/"
          className="cart-logo"
        >
          <span>MARAM</span>

          <small>
            local brand
          </small>
        </Link>

        <div className="cart-nav-actions">
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

          <button>
            ♡
          </button>

          <Link
            to="/cart"
            className="cart-nav-bag"
          >
            🛍️
          </Link>
        </div>
      </header>

      <div className="cart-header">
        <p className="cart-brand">
          MARAM
        </p>

        <h1>
          {isArabic
            ? "سلة التسوق"
            : "Shopping Bag"}
        </h1>

        <p>
          {totalItems}{" "}
          {isArabic
            ? "منتجات"
            : totalItems === 1
            ? "item"
            : "items"}
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">
            🛍️
          </div>

          <h2>
            {isArabic
              ? "السلة فارغة"
              : "Your bag is empty"}
          </h2>

          <p>
            {isArabic
              ? "لم تقم بإضافة أي منتجات إلى السلة بعد."
              : "You haven't added any products to your bag yet."}
          </p>

          <Link
            to="/shop"
            className="continue-shopping-btn"
          >
            {isArabic
              ? "ابدأ التسوق"
              : "START SHOPPING"}
          </Link>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items">
            {cart.map((item) => (
              <div
                className="cart-item"
                key={getCartItemKey(item)}
              >
                <div className="cart-item-image">
                  <img
                    src={item.image}
                    alt={item.name}
                  />
                </div>

                <div className="cart-item-info">
                  <p className="cart-item-category">
                    {isArabic
                      ? "إسدال"
                      : "ISDAL"}
                  </p>

                  <h2>
                    {isArabic
                      ? item.arabicName ||
                        item.name
                      : item.name}
                  </h2>

                  <p className="cart-item-price">
                    {item.price} EGP
                  </p>

                  <div className="cart-item-options">
                    {item.size && (
                      <div className="cart-item-option">
                        <span>
                          {isArabic
                            ? "المقاس:"
                            : "Size:"}
                        </span>

                        <strong>
                          {item.size}
                        </strong>
                      </div>
                    )}

                    {item.color && (
                      <div className="cart-item-option">
                        <span>
                          {isArabic
                            ? "اللون:"
                            : "Color:"}
                        </span>

                        <strong>
                          {item.color}
                        </strong>

                        {item.colorValue && (
                          <span
                            className="cart-color-dot"
                            style={{
                              backgroundColor:
                                item.colorValue,
                            }}
                          ></span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="cart-item-bottom">
                    <div className="cart-quantity">
                      <button
                        onClick={() =>
                          updateCartQuantity(
                            item.id,
                            item.quantity - 1,
                            item.size,
                            item.color
                          )
                        }
                      >
                        −
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateCartQuantity(
                            item.id,
                            item.quantity + 1,
                            item.size,
                            item.color
                          )
                        }
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="remove-item"
                      onClick={() =>
                        removeFromCart(
                          item.id,
                          item.size,
                          item.color
                        )
                      }
                    >
                      {isArabic
                        ? "حذف"
                        : "Remove"}
                    </button>
                  </div>
                </div>

                <div className="cart-item-total">
                  {item.price *
                    item.quantity}{" "}
                  EGP
                </div>
              </div>
            ))}
          </div>

          <aside className="cart-summary">
            <h2>
              {isArabic
                ? "ملخص الطلب"
                : "Order Summary"}
            </h2>

            <div className="summary-row">
              <span>
                {isArabic
                  ? "الإجمالي الفرعي"
                  : "Subtotal"}
              </span>

              <span>
                {subtotal} EGP
              </span>
            </div>

            <div className="summary-row">
              <span>
                {isArabic
                  ? "الشحن"
                  : "Shipping"}
              </span>

              <span>
                {isArabic
                  ? "سيتم حسابه لاحقًا"
                  : "Calculated at checkout"}
              </span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>
                {isArabic
                  ? "الإجمالي"
                  : "Total"}
              </span>

              <strong>
                {subtotal} EGP
              </strong>
            </div>

            <button
              type="button"
              className="checkout-btn"
              onClick={handleCheckout}
            >
              {isArabic
                ? "إتمام الطلب"
                : "PROCEED TO CHECKOUT"}
            </button>

            <Link
              to="/shop"
              className="continue-shopping"
            >
              {isArabic
                ? "← متابعة التسوق"
                : "← Continue Shopping"}
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}

export default Cart;