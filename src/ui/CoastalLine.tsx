/**
 * Coastal Line のラインアート (docs/UI_COASTAL_LINE.md)。
 * 海岸線・波・遠くの山並み・太陽を、手描きのように少し揺らした細い線 (約 1.25px・塗りなし) で描く。
 * 画像ファイルを使わないインラインの SVG。色は --color-lineart (グレーブルー・控えめな透明度)。
 * 装飾なので読み上げない (aria-hidden)。置く場所はダッシュボードの見出しの右とサイドバーの下だけ
 */
const LINE = {
  fill: 'none',
  stroke: 'var(--color-lineart)',
  strokeWidth: 1.25,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  vectorEffect: 'non-scaling-stroke' as const,
};

/** ダッシュボードの見出しの右: 横長の海岸線と波、遠くの山並み、太陽 */
export function CoastalHorizon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 72" className={className} aria-hidden focusable="false" data-testid="lineart-horizon">
      {/* 太陽: 少しはみ出して閉じる手描きの円 */}
      <path {...LINE} d="M381 20.4C381.2 25.4 377 29.4 372 29.2C366.9 29 363 24.9 363.2 19.9C363.5 14.9 367.5 11 372.4 11.2C377.5 11.4 381.4 15.6 380.8 20.9" />
      {/* 遠くの山並み */}
      <path {...LINE} d="M166 40.5C178 35 187 29.5 196.5 31C204 32.3 208.5 37.2 214.5 36.4C222.5 35 229.5 24.6 240.5 23.2C250.5 22.1 256.5 30.4 265.5 32.1C272.5 33.5 279.5 29.2 287.5 30C296.5 31 303 36.2 313 38.6" />
      <path {...LINE} strokeOpacity={0.6} d="M232 39C241 35.6 248.5 33.4 256 34.6C263 35.8 268 38.6 276 38" />
      {/* 左の岬 (海岸線へなだらかに下りる) */}
      <path {...LINE} d="M12 52.2C19.5 46.4 27.5 40.6 38.5 37.6C47 35.4 55.5 36.6 63 40.6C70.5 44.6 78.5 47.3 91 48" />
      {/* 太陽の映り込み */}
      <path {...LINE} strokeOpacity={0.6} d="M361.5 55.4C367.5 55.1 375.5 55.2 382 55.6" />
      <path {...LINE} strokeOpacity={0.45} d="M366 58.9C369.5 58.7 373.5 58.8 377.5 59" />
      {/* 海岸線 */}
      <path {...LINE} d="M8 52.4C38 50.6 66 47.2 92.5 48.1C118 49 133.5 44.3 152.5 45.1C170.5 45.9 186 50.3 206.5 49.3C232 48 252.5 45.2 280 46.2C311.5 47.3 338 51.2 371.5 50.1C391 49.5 403.5 48.2 413 48.4" />
      {/* 波 (途切れた線で手描きの調子を出す) */}
      <path {...LINE} d="M30 60.2C41.5 57.1 51.5 57.3 62 60.1C72.5 62.9 82 63.2 94 60.2C105.5 57.3 116 57.4 127.5 60.3" />
      <path {...LINE} strokeOpacity={0.7} d="M150 62.3C160 59.7 168.5 59.9 178 62.2C187.5 64.5 196 64.6 206 62.1" />
      <path {...LINE} d="M236 59.1C247.5 56.2 258 56.4 270 59.2C282 62 292 62.1 304 59.1C315.5 56.3 326 56.4 337.5 59.2C345.5 61.1 352 61.2 358.5 60.1" />
      <path {...LINE} strokeOpacity={0.55} d="M300 66.4C309 64.4 316 64.5 324 66.2C332 67.9 339 67.9 347 66.3" />
    </svg>
  );
}

/** サイドバーの下: 小さな波と水平線の太陽 */
export function SidebarWaves({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 30" className={className} aria-hidden focusable="false" data-testid="lineart-sidebar">
      <path {...LINE} d="M106 11.6C106.3 8 109.2 5.4 112.6 5.5C116.1 5.6 118.8 8.4 118.6 11.9" />
      <path {...LINE} strokeOpacity={0.7} d="M98 12.1C106 11.8 120 11.9 130 12.3" />
      <path {...LINE} d="M4 17.2C13.5 13.1 21.5 13.2 31 17.1C40.5 21 48.5 21 58 17.2C67.5 13.4 75.5 13.4 85 17.3" />
      <path {...LINE} strokeOpacity={0.7} d="M38 25.1C47 21.9 55 22 64 25C73 28 81 28 90 25.2C99 22.4 107 22.5 116 24.9" />
    </svg>
  );
}
