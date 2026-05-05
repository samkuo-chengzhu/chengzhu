// 商品縮圖 — 簡約幾何插畫,單色淡背景 + 細節線條
// 商品依 catKey 用不同抽象構圖,色調統一往溫潤精品方向走

const ProductImage = ({ product, size = "default", showPrice = false }) => {
  const { color, accent, icon, name } = product;
  const isLarge = size === "large";
  const isHero = size === "hero";

  // 用很淡的暖色背景作為「展示底」,主要視覺是 emoji + 細線描繪幾何
  const bgTone = "var(--ink-50)";
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
          <circle cx="50%" cy="50%" r={isHero ? "30" : "30"} fill="none" stroke={strokeTone} strokeWidth="1.2" />
          <circle cx="50%" cy="50%" r={isHero ? "20" : "18"} fill="none" stroke={strokeTone} strokeWidth="1" opacity="0.5" />
        </>
      );
    }
    // home
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
      background: bgTone,
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
