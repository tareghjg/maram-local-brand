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

        <footer className="about-credit">
          <span className="about-credit-label">
            {isArabic ? "خدمات التصميم والتطوير" : "Modern design & development"}
          </span>
          <h3>{isArabic ? "خلّي فكرتك تظهر بشكل مختلف" : "Bring your idea to life"}</h3>
          <p>
            {isArabic
              ? "لو عندك مشروع أو فكرة، هنصمملك موقع عصري وسريع بتفاصيل مميزة وحركات تخلي شغلك يلفت الانتباه."
              : "Have a project or idea? We create modern, fast websites with standout details and motion that make your work get noticed."}
          </p>
          <a
            className="about-credit-link"
            href="https://www.instagram.com/tarekhus72?stkn=dWJlZjB6MHd3Z2Zx&utm_source=qr"
            target="_blank"
            rel="noreferrer"
          >
            <span>{isArabic ? "بواسطة" : "Created by"}</span>
            <strong>RIOT.OSI</strong>
          </a>
          <div className="about-credit-contact">
            <a
              href="https://wa.me/201065870208"
              target="_blank"
              rel="noreferrer"
              aria-label="Contact RIOT.OSI on WhatsApp"
              title="WhatsApp"
            >
              <svg className="contact-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.1A8 8 0 1 1 20 11.5Z" />
                <path d="M8.7 8.2c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.6 1.5c.1.3.1.5-.1.7l-.5.6c.6 1.1 1.5 1.9 2.6 2.4l.5-.6c.2-.2.4-.3.7-.2l1.5.7c.3.1.4.3.4.6v.5c0 .3-.1.5-.4.7-.4.3-1 .4-1.5.3-2.8-.6-5.2-2.9-5.8-5.7-.1-.5 0-1.1.3-1.5Z" />
              </svg>
            </a>
            <a
              href="tel:01065870208"
              aria-label="Call RIOT.OSI"
              title="Call"
            >
              <svg className="contact-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6.6 3.5 9 3l2 4.5-1.7 1.6a14.4 14.4 0 0 0 5.6 5.6l1.6-1.7 4.5 2-.5 2.4c-.2.8-.9 1.4-1.7 1.4C11.2 18.8 5.2 12.8 5.2 5.2c0-.8.6-1.5 1.4-1.7Z" />
                <path d="M15.5 3.5a5 5 0 0 1 5 5M15.5 6.5a2 2 0 0 1 2 2" />
              </svg>
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default About;
