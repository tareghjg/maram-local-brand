import "./About.css";
import { Link } from "react-router-dom";

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    url: "https://www.instagram.com/maram_locbrand?stkn=MTdnemEwOXVrcmZ0bQ==",
    icon: "◎",
  },
  {
    label: "Facebook",
    url: "https://www.facebook.com/share/186k3VDWAZ/",
    icon: "f",
  },
  {
    label: "WhatsApp",
    url: "https://wa.me/201556465171",
    icon: "W",
  },
  {
    label: "TikTok",
    url: "https://www.tiktok.com/@maramlocbrand?_r=1&_t=ZS-99m0e37QvjA",
    icon: "♪",
  },
];

function About({ language, setLanguage }) {
  const isArabic = language === "ar";

  return (
    <div className={`about-page ${isArabic ? "arabic" : "english"}`}>
      <header className="navbar">
        <nav className="nav-links">
          <Link to="/">{isArabic ? "الرئيسية" : "Home"}</Link>
          <Link to="/shop">{isArabic ? "المتجر" : "Shop"}</Link>
          <Link to="/shop">
            {isArabic ? "المجموعات" : "Collections"}
          </Link>
          <Link to="/about">{isArabic ? "من نحن" : "About"}</Link>
        </nav>

        <Link to="/" className="logo about-logo">
          <h1>MARAM</h1>
          <span>local brand</span>
        </Link>

        <div className="nav-actions">
          <button
            className="language-btn"
            onClick={() => setLanguage(isArabic ? "en" : "ar")}
          >
            {isArabic ? "EN" : "AR"}
          </button>
          <button aria-label="Wishlist">♡</button>
          <Link to="/cart" className="cart-nav-button" aria-label="Shopping bag">
            🛍️
          </Link>
        </div>
      </header>

      <main className="about-content">
        <section className="about-hero">
          <div className="about-badge">MARAM</div>
          <h1>{isArabic ? "من نحن" : "About Us"}</h1>
          <p className="about-intro">
            {isArabic
              ? "مرام هي علامة محلية تم تصميمها لتجمع بين الأناقة والراحة، مع لمسة حديثة تتماشى مع أسلوب الحياة العصري للمرأة."
              : "MARAM is a local brand crafted to balance elegance, comfort, and a modern sense of identity for the contemporary woman."}
          </p>
        </section>

        <section className="about-gallery" aria-label={isArabic ? "إطلالات مرام" : "MARAM looks"}>
          <figure className="gallery-card gallery-card-large">
            <img
              src="/image-212-e1741873750452-975x1024.png"
              alt={isArabic ? "إطلالة أزياء أنيقة" : "Elegant fashion look"}
            />
            <figcaption>
              <span>{isArabic ? "إطلالة مرام" : "The MARAM look"}</span>
              <strong>{isArabic ? "أناقة هادئة، حضور لا يُنسى" : "Quiet elegance, unforgettable presence"}</strong>
            </figcaption>
          </figure>
          <figure className="gallery-card gallery-card-small">
            <img
              src="/3zaWgq4ZAQXlqIdaV3YKhW9yXlh5yT3W9qoSHFps.webp"
              alt={isArabic ? "تفاصيل قماش وملابس أنيقة" : "Refined fabric and clothing details"}
            />
            <figcaption>
              <span>{isArabic ? "تفاصيل تصنع الفرق" : "Details that matter"}</span>
              <strong>{isArabic ? "مصممة لتناسب يومك" : "Made for your everyday"}</strong>
            </figcaption>
          </figure>
        </section>

        <section className="about-grid">
          <article className="about-card">
            <span>{isArabic ? "رؤيتنا" : "Our Vision"}</span>
            <h2>{isArabic ? "أزياء تعبر عن الهوية" : "Style with identity"}</h2>
            <p>
              {isArabic
                ? "نريد أن تكون كل قطعة في مرام تعبيرًا عن الثقة والذوق والهوية الشخصية في كل تفاصيلها."
                : "We want every MARAM piece to express confidence, taste, and personal identity in every detail."}
            </p>
          </article>

          <article className="about-card">
            <span>{isArabic ? "رسالتنا" : "Our Mission"}</span>
            <h2>{isArabic ? "راحة + أناقة" : "Comfort and elegance"}</h2>
            <p>
              {isArabic
                ? "نصنع أزياء مناسبة للحياة اليومية مع لمسة فاخرة ومتوازنة وتجهيزات دقيقة."
                : "We create pieces that fit everyday life while keeping a polished, elegant, and thoughtfully finished look."}
            </p>
          </article>
        </section>

        <section className="about-values">
          <div className="values-header">
            <p>{isArabic ? "ما يميزنا" : "What makes us different"}</p>
            <h2>{isArabic ? "أسلوب يتماشى مع شخصيتك" : "A style that fits your personality"}</h2>
          </div>

          <div className="values-list">
            <div>
              <strong>{isArabic ? "تصميم" : "Design"}</strong>
              <span>{isArabic ? "قطع عصرية تجمع بين البساطة واللمعة." : "Modern shapes with a luxurious, minimal feel."}</span>
            </div>
            <div>
              <strong>{isArabic ? "جودة" : "Quality"}</strong>
              <span>{isArabic ? "مواد مختارة بعناية وتجهيزات متقنة." : "Carefully selected fabrics and refined finishing."}</span>
            </div>
            <div>
              <strong>{isArabic ? "هوية" : "Identity"}</strong>
              <span>{isArabic ? "أسلوب أنيق يبرز شخصية المرأة بثقة." : "A distinct identity that empowers feminine confidence."}</span>
            </div>
          </div>
        </section>

        <section className="social-section">
          <div className="social-header">
            <p>{isArabic ? "تابعنا" : "Follow us"}</p>
            <h2>{isArabic ? "كن جزءًا من عالم مرام" : "Be part of the MARAM world"}</h2>
          </div>

          <div className="social-links">
            {SOCIAL_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="social-link"
              >
                <span className="social-icon">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="about-cta">
          <p>{isArabic ? "تجربي أسلوبًا جديدًا" : "Discover a new way to dress"}</p>
          <Link to="/shop">{isArabic ? "تسوق الآن" : "Shop now"}</Link>
        </section>
      </main>
    </div>
  );
}

export default About;
