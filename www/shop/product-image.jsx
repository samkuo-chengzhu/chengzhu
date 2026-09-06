// 商品縮圖 — 優先用真實照片 (product.image),沒有時退回 emoji + 細線幾何 fallback

const ProductImage = ({ product, size = "default", showPrice = false }) => {
  const { image, imageFull, icon } = product;
  const isLarge = size === "large";
  const isHero = size === "hero";

  // 真實圖片優先 (大圖用 imageFull,有的話)
  const src = isHero && imageFull ? imageFull : image;

  if (src) {
    return (
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: isHero ? "16/10" : "1",
        background: "var(--ink-50)",
        overflow: "hidden",
      }}>
        <img
          src={src}
          alt={product.name}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            padding: isHero ? "32px" : "12px",
          }}
        />
      </div>
    );
  }

  // === Fallback: 沒有圖片時用 emoji + 細線幾何 ===
  const strokeTone = "var(--ink-300)";
  const renderShape = () => {
    if (product.catKey === "appliance") {
      return (
        <>
          <rect x="28%" y="28%" width="44%" height="48%" rx="3" fill="none" stroke={strokeTone} strokeWidth="1.2" />
          <rect x="34%" y="36%" width="32%" height="20%" rx="2" fill="none" stroke={strokeTone} strokeWidth="1" opacity="0.65" />
          <circle cx="50%" cy="68%" r="2.5" fill={strokeTone} opacity="0.55" />
        </>
      );
    }
    if (product.catKey === "lifestyle") {
      return (
        <>
          <circle cx="50%" cy="50%" r="30" fill="none" stroke={strokeTone} strokeWidth="1.2" />
          <circle cx="50%" cy="50%" r="18" fill="none" stroke={strokeTone} strokeWidth="1" opacity="0.5" />
        </>
      );
    }
    return (
      <>
        <rect x="22%" y="32%" width="56%" height="48%" rx="2" fill="none" stroke={strokeTone} strokeWidth="1.2" />
        <line x1="22%" y1="50%" x2="78%" y2="50%" stroke={strokeTone} strokeWidth="1" opacity="0.5" />
      </>
    );
  };

  return (
    <div style={{
      position: "relative",
      width: "100%",
      aspectRatio: isHero ? "16/10" : "1",
      background: "var(--ink-50)",
      overflow: "hidden",
    }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ position: "absolute", inset: 0 }}>
        {renderShape()}
      </svg>
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: isHero ? "84px" : isLarge ? "56px" : "44px",
        opacity: 0.92,
      }}>{icon}</div>
    </div>
  );
};

window.ProductImage = ProductImage;
