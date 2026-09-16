import "./Checkout.css";
import { Link } from "react-router-dom";
import { useState } from "react";

const API_URL = `${import.meta.env.VITE_API_URL}/api/orders`;

const shippingRates = {
  Cairo: 60,
  Giza: 60,
  Alexandria: 70,
  Beheira: 75,
  Gharbia: 80,
  Dakahlia: 80,
  Qalyubia: 70,
  Sharqia: 80,
  Monufia: 80,
  KafrElSheikh: 85,
  Damietta: 85,
  PortSaid: 85,
  Ismailia: 85,
  Suez: 85,
  Fayoum: 90,
  BeniSuef: 90,
  Minya: 95,
  Assiut: 95,
  Sohag: 100,
  Qena: 100,
  Luxor: 105,
  Aswan: 110,
  RedSea: 110,
  Matrouh: 110,
  NewValley: 120,
  NorthSinai: 120,
  SouthSinai: 120,
};

const governorates = [
  {
    value: "Cairo",
    en: "Cairo",
    ar: "القاهرة",
  },
  {
    value: "Giza",
    en: "Giza",
    ar: "الجيزة",
  },
  {
    value: "Alexandria",
    en: "Alexandria",
    ar: "الإسكندرية",
  },
  {
    value: "Beheira",
    en: "Beheira",
    ar: "البحيرة",
  },
  {
    value: "Gharbia",
    en: "Gharbia",
    ar: "الغربية",
  },
  {
    value: "Dakahlia",
    en: "Dakahlia",
    ar: "الدقهلية",
  },
  {
    value: "Qalyubia",
    en: "Qalyubia",
    ar: "القليوبية",
  },
  {
    value: "Sharqia",
    en: "Sharqia",
    ar: "الشرقية",
  },
  {
    value: "Monufia",
    en: "Monufia",
    ar: "المنوفية",
  },
  {
    value: "KafrElSheikh",
    en: "Kafr El Sheikh",
    ar: "كفر الشيخ",
  },
  {
    value: "Damietta",
    en: "Damietta",
    ar: "دمياط",
  },
  {
    value: "PortSaid",
    en: "Port Said",
    ar: "بورسعيد",
  },
  {
    value: "Ismailia",
    en: "Ismailia",
    ar: "الإسماعيلية",
  },
  {
    value: "Suez",
    en: "Suez",
    ar: "السويس",
  },
  {
    value: "Fayoum",
    en: "Fayoum",
    ar: "الفيوم",
  },
  {
    value: "BeniSuef",
    en: "Beni Suef",
    ar: "بني سويف",
  },
  {
    value: "Minya",
    en: "Minya",
    ar: "المنيا",
  },
  {
    value: "Assiut",
    en: "Assiut",
    ar: "أسيوط",
  },
  {
    value: "Sohag",
    en: "Sohag",
    ar: "سوهاج",
  },
  {
    value: "Qena",
    en: "Qena",
    ar: "قنا",
  },
  {
    value: "Luxor",
    en: "Luxor",
    ar: "الأقصر",
  },
  {
    value: "Aswan",
    en: "Aswan",
    ar: "أسوان",
  },
  {
    value: "RedSea",
    en: "Red Sea",
    ar: "البحر الأحمر",
  },
  {
    value: "Matrouh",
    en: "Matrouh",
    ar: "مطروح",
  },
  {
    value: "NewValley",
    en: "New Valley",
    ar: "الوادي الجديد",
  },
  {
    value: "NorthSinai",
    en: "North Sinai",
    ar: "شمال سيناء",
  },
  {
    value: "SouthSinai",
    en: "South Sinai",
    ar: "جنوب سيناء",
  },
];

function Checkout({
  language,
  setLanguage,
  cart,
}) {
  const isArabic = language === "ar";

  const [formData, setFormData] =
    useState({
      fullName: "",
      phone: "",
      governorate: "",
      city: "",
      address: "",
      notes: "",
    });

  const [errors, setErrors] =
    useState({});

  const [submitted, setSubmitted] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [orderSuccess, setOrderSuccess] =
    useState(false);

  const [orderId, setOrderId] =
    useState("");

  const [submitError, setSubmitError] =
    useState("");

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      item.price * item.quantity,
    0
  );

  const shipping =
    shippingRates[
      formData.governorate
    ] || 0;

  const total =
    subtotal + shipping;

  const validateField = (
    name,
    value
  ) => {
    const cleanValue =
      value.trim();

    if (name === "fullName") {
      if (!cleanValue) {
        return isArabic
          ? "الاسم بالكامل مطلوب."
          : "Full name is required.";
      }

      if (cleanValue.length < 3) {
        return isArabic
          ? "الاسم يجب أن يكون 3 أحرف على الأقل."
          : "Name must be at least 3 characters.";
      }

      if (
        !/^[A-Za-z\u0600-\u06FF\s]+$/.test(
          cleanValue
        )
      ) {
        return isArabic
          ? "الاسم يجب أن يحتوي على حروف فقط."
          : "Name can contain letters and spaces only.";
      }

      return "";
    }

    if (name === "phone") {
      if (!cleanValue) {
        return isArabic
          ? "رقم الهاتف مطلوب."
          : "Phone number is required.";
      }

      if (!/^\d+$/.test(cleanValue)) {
        return isArabic
          ? "رقم الهاتف يجب أن يحتوي على أرقام فقط."
          : "Phone number must contain numbers only.";
      }

      if (cleanValue.length !== 11) {
        return isArabic
          ? "رقم الهاتف يجب أن يكون 11 رقمًا."
          : "Phone number must be exactly 11 digits.";
      }

      if (
        !/^01[0125]\d{8}$/.test(
          cleanValue
        )
      ) {
        return isArabic
          ? "اكتب رقم موبايل مصري صحيح يبدأ بـ 010 أو 011 أو 012 أو 015."
          : "Enter a valid Egyptian mobile number starting with 010, 011, 012, or 015.";
      }

      return "";
    }

    if (name === "governorate") {
      if (!cleanValue) {
        return isArabic
          ? "من فضلك اختر المحافظة."
          : "Please select your governorate.";
      }

      return "";
    }

    if (name === "city") {
      if (!cleanValue) {
        return isArabic
          ? "المدينة أو المنطقة مطلوبة."
          : "City or area is required.";
      }

      if (cleanValue.length < 2) {
        return isArabic
          ? "اكتب اسم المدينة أو المنطقة بشكل صحيح."
          : "Enter a valid city or area.";
      }

      return "";
    }

    if (name === "address") {
      if (!cleanValue) {
        return isArabic
          ? "العنوان بالتفصيل مطلوب."
          : "Full address is required.";
      }

      if (cleanValue.length < 10) {
        return isArabic
          ? "اكتب العنوان بالتفصيل، 10 أحرف على الأقل."
          : "Please enter a more detailed address, at least 10 characters.";
      }

      return "";
    }

    return "";
  };

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    let newValue = value;

    if (name === "phone") {
      newValue =
        value.replace(/\D/g, "");

      newValue =
        newValue.slice(0, 11);
    }

    setFormData((current) => ({
      ...current,
      [name]: newValue,
    }));

    if (
      errors[name] ||
      submitted
    ) {
      const error =
        validateField(
          name,
          newValue
        );

      setErrors((current) => ({
        ...current,
        [name]: error,
      }));
    }
  };

  const handleBlur = (event) => {
    const {
      name,
      value,
    } = event.target;

    const error =
      validateField(
        name,
        value
      );

    setErrors((current) => ({
      ...current,
      [name]: error,
    }));
  };

  const validateForm = () => {
    const fields = [
      "fullName",
      "phone",
      "governorate",
      "city",
      "address",
    ];

    const newErrors = {};

    fields.forEach((field) => {
      const error =
        validateField(
          field,
          formData[field]
        );

      if (error) {
        newErrors[field] =
          error;
      }
    });

    setErrors(newErrors);

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitted(true);
    setSubmitError("");

    const newErrors =
      validateForm();

    if (
      Object.keys(newErrors).length >
      0
    ) {
      const firstErrorField =
        Object.keys(newErrors)[0];

      const element =
        document.querySelector(
          `[name="${firstErrorField}"]`
        );

      if (element) {
        element.focus();
      }

      return;
    }

    setIsSubmitting(true);

    try {
      const response =
        await fetch(
          API_URL,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              customer: formData,
              cart,
              subtotal,
              shipping,
              total,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create order."
        );
      }

      setOrderId(
        data.orderId
      );

      setOrderSuccess(true);
    } catch (error) {
      console.error(
        "Order submission error:",
        error
      );

      setSubmitError(
        isArabic
          ? "حصلت مشكلة أثناء إرسال الطلب. حاول مرة تانية."
          : "Something went wrong while placing your order. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div
        className={`checkout-page ${
          isArabic
            ? "arabic"
            : "english"
        }`}
      >
        <header className="checkout-navbar">

          <Link
            to="/"
            className="checkout-logo"
          >
            <span>
              MARAM
            </span>

            <small>
              local brand
            </small>
          </Link>

        </header>

        <div className="checkout-empty">

          <h1>
            {isArabic
              ? "السلة فارغة"
              : "Your bag is empty"}
          </h1>

          <p>
            {isArabic
              ? "أضف منتجات إلى السلة أولًا لإتمام الطلب."
              : "Add products to your bag before checking out."}
          </p>

          <Link
            to="/shop"
            className="checkout-empty-btn"
          >
            {isArabic
              ? "العودة للمتجر"
              : "BACK TO SHOP"}
          </Link>

        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div
        className={`checkout-page ${
          isArabic
            ? "arabic"
            : "english"
        }`}
      >
        <header className="checkout-navbar">

          <Link
            to="/"
            className="checkout-logo"
          >
            <span>
              MARAM
            </span>

            <small>
              local brand
            </small>
          </Link>

        </header>

        <div className="checkout-empty">

          <h1>
            {isArabic
              ? "تم تأكيد طلبك"
              : "Your Order Is Confirmed"}
          </h1>

          <p>
            {isArabic
              ? "تم استلام طلبك بنجاح."
              : "Your order has been received successfully."}
          </p>

          <p>
            {isArabic
              ? `رقم الطلب: ${orderId}`
              : `Order ID: ${orderId}`}
          </p>

          <Link
            to="/"
            className="checkout-empty-btn"
          >
            {isArabic
              ? "العودة للرئيسية"
              : "BACK TO HOME"}
          </Link>

        </div>
      </div>
    );
  }

  return (
    <div
      className={`checkout-page ${
        isArabic
          ? "arabic"
          : "english"
      }`}
    >

      <header className="checkout-navbar">

        <nav className="checkout-nav-links">

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

          <Link to="/cart">
            {isArabic
              ? "السلة"
              : "Bag"}
          </Link>

        </nav>


        <Link
          to="/"
          className="checkout-logo"
        >
          <span>
            MARAM
          </span>

          <small>
            local brand
          </small>
        </Link>


        <div className="checkout-language">

          <button
            onClick={() =>
              setLanguage(
                isArabic
                  ? "en"
                  : "ar"
              )
            }
          >
            {isArabic
              ? "EN"
              : "AR"}
          </button>

        </div>

      </header>


      <div className="checkout-header">

        <p>
          MARAM
        </p>

        <h1>
          {isArabic
            ? "إتمام الطلب"
            : "Checkout"}
        </h1>

      </div>


      <main className="checkout-container">

        <form
          className="checkout-form"
          onSubmit={
            handleSubmit
          }
          noValidate
        >

          <section className="checkout-section">

            <div className="section-heading">

              <span>
                01
              </span>

              <h2>
                {isArabic
                  ? "بيانات العميل"
                  : "Customer Information"}
              </h2>

            </div>


            <div className="form-grid">

              <div className="form-field full-width">

                <label>
                  {isArabic
                    ? "الاسم بالكامل"
                    : "Full Name"}
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={
                    formData.fullName
                  }
                  onChange={
                    handleChange
                  }
                  onBlur={
                    handleBlur
                  }
                  placeholder={
                    isArabic
                      ? "اكتب اسمك بالكامل"
                      : "Enter your full name"
                  }
                  autoComplete="name"
                  className={
                    errors.fullName
                      ? "input-error"
                      : ""
                  }
                />

                {errors.fullName && (
                  <span className="field-error">
                    {errors.fullName}
                  </span>
                )}

              </div>


              <div className="form-field">

                <label>
                  {isArabic
                    ? "رقم الهاتف"
                    : "Phone Number"}
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={
                    formData.phone
                  }
                  onChange={
                    handleChange
                  }
                  onBlur={
                    handleBlur
                  }
                  placeholder="01xxxxxxxxx"
                  inputMode="numeric"
                  maxLength={11}
                  autoComplete="tel"
                  className={
                    errors.phone
                      ? "input-error"
                      : ""
                  }
                />

                {errors.phone && (
                  <span className="field-error">
                    {errors.phone}
                  </span>
                )}

              </div>


              <div className="form-field">

                <label>
                  {isArabic
                    ? "المحافظة"
                    : "Governorate"}
                </label>

                <select
                  name="governorate"
                  value={
                    formData.governorate
                  }
                  onChange={
                    handleChange
                  }
                  onBlur={
                    handleBlur
                  }
                  className={
                    errors.governorate
                      ? "input-error"
                      : ""
                  }
                >

                  <option value="">
                    {isArabic
                      ? "اختر المحافظة"
                      : "Select governorate"}
                  </option>

                  {governorates.map(
                    (
                      governorate
                    ) => (
                      <option
                        key={
                          governorate.value
                        }
                        value={
                          governorate.value
                        }
                      >
                        {isArabic
                          ? governorate.ar
                          : governorate.en}
                      </option>
                    )
                  )}

                </select>

                {errors.governorate && (
                  <span className="field-error">
                    {errors.governorate}
                  </span>
                )}

              </div>


              <div className="form-field">

                <label>
                  {isArabic
                    ? "المدينة / المنطقة"
                    : "City / Area"}
                </label>

                <input
                  type="text"
                  name="city"
                  value={
                    formData.city
                  }
                  onChange={
                    handleChange
                  }
                  onBlur={
                    handleBlur
                  }
                  placeholder={
                    isArabic
                      ? "مثال: سيدي بشر"
                      : "Example: Sidi Bishr"
                  }
                  autoComplete="address-level2"
                  className={
                    errors.city
                      ? "input-error"
                      : ""
                  }
                />

                {errors.city && (
                  <span className="field-error">
                    {errors.city}
                  </span>
                )}

              </div>


              <div className="form-field full-width">

                <label>
                  {isArabic
                    ? "العنوان بالتفصيل"
                    : "Full Address"}
                </label>

                <textarea
                  name="address"
                  value={
                    formData.address
                  }
                  onChange={
                    handleChange
                  }
                  onBlur={
                    handleBlur
                  }
                  placeholder={
                    isArabic
                      ? "اسم الشارع، رقم العقار، الدور، الشقة..."
                      : "Street, building number, floor, apartment..."
                  }
                  rows="4"
                  autoComplete="street-address"
                  className={
                    errors.address
                      ? "input-error"
                      : ""
                  }
                />

                {errors.address && (
                  <span className="field-error">
                    {errors.address}
                  </span>
                )}

              </div>


              <div className="form-field full-width">

                <label>
                  {isArabic
                    ? "ملاحظات الطلب"
                    : "Order Notes"}
                </label>

                <textarea
                  name="notes"
                  value={
                    formData.notes
                  }
                  onChange={
                    handleChange
                  }
                  placeholder={
                    isArabic
                      ? "أي ملاحظات إضافية..."
                      : "Any additional notes..."}
                  rows="3"
                  maxLength={500}
                />

              </div>

            </div>

          </section>


          <section className="checkout-section">

            <div className="section-heading">

              <span>
                02
              </span>

              <h2>
                {isArabic
                  ? "التوصيل"
                  : "Delivery"}
              </h2>

            </div>


            <div className="delivery-box">

              <div>

                <p className="delivery-title">
                  {isArabic
                    ? "التوصيل للمنزل"
                    : "Home Delivery"}
                </p>

                <p className="delivery-description">

                  {formData.governorate
                    ? isArabic
                      ? `سعر التوصيل: ${shipping} جنيه`
                      : `Delivery fee: ${shipping} EGP`
                    : isArabic
                    ? "اختر المحافظة لمعرفة سعر التوصيل"
                    : "Select your governorate to see the delivery fee"}

                </p>

              </div>


              <span className="delivery-price">

                {shipping > 0
                  ? `${shipping} EGP`
                  : "—"}

              </span>

            </div>

          </section>


          <section className="checkout-section">

            <div className="section-heading">

              <span>
                03
              </span>

              <h2>
                {isArabic
                  ? "طريقة الدفع"
                  : "Payment Method"}
              </h2>

            </div>


            <div className="payment-option">

              <input
                type="radio"
                checked
                readOnly
              />

              <div>

                <strong>
                  {isArabic
                    ? "الدفع عند الاستلام"
                    : "Cash on Delivery"}
                </strong>

                <p>
                  {isArabic
                    ? "ادفع عند استلام طلبك."
                    : "Pay when your order arrives."}
                </p>

              </div>

            </div>

          </section>


          {submitError && (
            <div className="field-error">
              {submitError}
            </div>
          )}


          <button
            type="submit"
            className="place-order-btn"
            disabled={
              isSubmitting
            }
          >
            {isSubmitting
              ? isArabic
                ? "جاري إرسال الطلب..."
                : "PLACING ORDER..."
              : isArabic
              ? "تأكيد الطلب"
              : "PLACE ORDER"}
          </button>

        </form>


        <aside className="checkout-summary">

          <h2>
            {isArabic
              ? "ملخص الطلب"
              : "Order Summary"}
          </h2>


          <div className="checkout-products">

            {cart.map((item) => (

              <div
                className="checkout-product"
                key={item.id}
              >

                <div className="checkout-product-image">

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  <span>
                    {item.quantity}
                  </span>

                </div>


                <div className="checkout-product-info">

                  <h3>
                    {isArabic
                      ? item.arabicName ||
                        item.name
                      : item.name}
                  </h3>

                  <p>
                    {item.price} EGP
                  </p>

                </div>


                <strong>
                  {item.price *
                    item.quantity}{" "}
                  EGP
                </strong>

              </div>

            ))}

          </div>


          <div className="summary-line">

            <span>
              {isArabic
                ? "الإجمالي الفرعي"
                : "Subtotal"}
            </span>

            <span>
              {subtotal} EGP
            </span>

          </div>


          <div className="summary-line">

            <span>
              {isArabic
                ? "التوصيل"
                : "Delivery"}
            </span>

            <span>
              {shipping > 0
                ? `${shipping} EGP`
                : "—"}
            </span>

          </div>


          <div className="checkout-summary-divider"></div>


          <div className="checkout-total">

            <span>
              {isArabic
                ? "الإجمالي"
                : "Total"}
            </span>

            <strong>
              {total} EGP
            </strong>

          </div>


          <Link
            to="/cart"
            className="back-to-cart"
          >
            {isArabic
              ? "← تعديل السلة"
              : "← Edit Bag"}
          </Link>

        </aside>

      </main>

    </div>
  );
}

export default Checkout;