// 商品縮圖 — SVG-based 抽象插畫風 (取代真實圖片)
// 每個商品根據 color/accent/icon 生成獨特的視覺
// Polite, modern abstract product cards

const ProductImage = ({ product, size = "default", showPrice = false }) => {
  const { color, accent, icon, name } = product;
  const isLarge = size === "large";
  const isHero = size === "hero";

  // 根據 catKey 用不同的抽象構圖
  const renderShape = () => {
    if (product.catKey === "appliance") {
      return (
        <>
          <circle cx="50%" cy="55%" r={isHero ? "120" : "70"} fill={accent} opacity="0.18" />
          <rect x="30%" y="35%" width="40%" height="45%" rx="14" fill={accent} opacity="0.85" />
          <rect x="36%" y="42%" width="28%" height="22%" rx="8" fill="white" opacity="0.45" />
          <circle cx="50%" cy="72%" r="6" fill="white" opacity="0.7" />
        </>
      );
    }
    if (product.catKey === "lifestyle") {
      return (
        <>
          <circle cx="50%" cy="50%" r={isHero ? "140" : "80"} fill={accent} opacity="0.14" />
          <circle cx="50%" cy="50%" r={isHero ? "90" : "52"} fill={accent} opacity="0.85" />
          <path d="M 35% 55% Q 50% 35% 65% 55%" stroke="white" strokeWidth="3" fill="none" opacity="0.6" />
        </>
      );
    }
    // home
    return (
      <>
        <rect x="25%" y="30%" width="50%" height="50%" rx="10" fill={accent} opacity="0.18" />
        <rect x="32%" y="36%" width="36%" height="38%" rx="6" fill={accent} opacity="0.85" />
        <line x1="32%" y1="50%" x2="68%" y2="50%" stroke="white" strokeWidth="2" opacity="0.5" />
      </>
    );
  };

  return (
    <div style={{
      position: "relative",
      width: "100%",
      aspectRatio: isHero ? "16/10" : "1",
      background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
      overflow: "hidden",
      borderRadius: "inherit",
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
        fontSize: isHero ? "96px" : isLarge ? "64px" : "44px",
        filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))",
      }}>{icon}</div>
    </div>
  );
};

window.ProductImage = ProductImage;
