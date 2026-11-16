/**
 * California Sketch の手描きのラインアート (docs/UI_CALIFORNIA_SKETCH.md)。
 * 波線・太陽・葉と小枝・ゆるやかな曲線を、線幅 1.5〜2px・わずかに不均一な線 (一部は少しずらして2回なぞる) で描く。
 * 画像ファイル・ライブラリを使わないインラインの SVG。色は --color-lineart (セージ) と --color-terracotta (太陽)。
 * 装飾なので読み上げない (aria-hidden)。業務データの背後には置かない
 */
type LineProps = { w?: number; o?: number; c?: string };
const line = ({ w = 1.6, o = 1, c = 'var(--color-lineart)' }: LineProps = {}) => ({
  fill: 'none',
  stroke: c,
  strokeWidth: w,
  strokeOpacity: o,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  vectorEffect: 'non-scaling-stroke' as const,
});
const SUN = 'var(--color-terracotta)';

/** ロゴの印: 太陽と2本の波 */
export function SketchLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden focusable="false" data-testid="sketch-logo">
      <path {...line({ w: 1.7, c: SUN })} d="M21.6 11.2C21.7 13.5 19.9 15.3 17.7 15.3C15.4 15.2 13.8 13.4 13.9 11.2C14 9 15.8 7.3 18 7.4C20.1 7.5 21.8 9.3 21.5 11.6" />
      <path {...line({ w: 1.8 })} d="M4.6 19.4C7.4 17.3 9.9 17.4 12.4 19.3C14.9 21.2 17.3 21.3 19.9 19.3C22.4 17.4 24.9 17.5 27.4 19.2" />
      <path {...line({ w: 1.6, o: 0.75 })} d="M7.8 24.6C10.2 22.9 12.4 23 14.6 24.5C16.8 26 18.9 26.1 21.2 24.6C22.9 23.5 24.4 23.4 25.9 24.1" />
    </svg>
  );
}

/** ダッシュボードの見出しの右: 波線・太陽・葉の小枝 */
export function SketchHorizon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 360 72" className={className} aria-hidden focusable="false" data-testid="lineart-horizon">
      {/* 太陽 (テラコッタ。少しずらして2回なぞる) */}
      <path {...line({ w: 1.6, c: SUN })} d="M287.4 26.6C287.6 32.4 282.9 37 277.2 36.8C271.4 36.6 267 31.9 267.3 26.2C267.6 20.5 272.3 16.1 278 16.4C283.7 16.7 288 21.6 287.2 27.4" />
      <path {...line({ w: 1.2, c: SUN, o: 0.55 })} d="M285.8 30.8C284.2 34 281 36.1 277.4 36.2" />
      {/* 葉の小枝 */}
      <path {...line({ w: 1.6 })} d="M318 52.4C322.5 44.6 328.6 37.2 337.2 31.6" />
      <path {...line({ w: 1.5 })} d="M324.4 43.4C320.6 41.1 318.9 37.2 319.8 33.4C323.6 34.8 325.6 38.6 324.6 43.2" />
      <path {...line({ w: 1.5 })} d="M330.6 36.6C330.1 32.2 332.3 28.4 336 26.9C337 30.8 335 34.6 330.9 36.4" />
      <path {...line({ w: 1.5, o: 0.85 })} d="M327.6 40.2C331.8 41.6 336.2 40.6 338.8 37.4C335.1 36 330.7 37 327.8 39.9" />
      {/* 波線 (上の線は少しずらしてなぞる) */}
      <path {...line({ w: 1.7 })} d="M24 50.6C38 44.9 50.5 45.2 64.5 50.3C78.5 55.4 91 55.6 105 50.2C119 44.9 131.5 45.1 145.5 50.4C159.5 55.7 172 55.8 186 50.5C200 45.3 212.5 45.4 226.5 50.6C240.5 55.8 253 55.9 266.5 50.9C278 46.7 289 46.4 300.5 49.6" />
      <path {...line({ w: 1.1, o: 0.4 })} d="M66 51.4C80 56.2 92 56.1 105.6 51.1" />
      <path {...line({ w: 1.5, o: 0.75 })} d="M78 61.8C90 57.4 101 57.6 113 61.6C125 65.6 136 65.7 148 61.5C160 57.4 171 57.6 183 61.7C195 65.8 206 65.8 218 61.6" />
      <path {...line({ w: 1.4, o: 0.55 })} d="M236 62.4C244 59.6 252 59.7 260 62.3C268 64.9 276 64.9 284 62.4" />
    </svg>
  );
}

/** サイドバーの下: 小さな波線と葉 */
export function SidebarWaves({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 30" className={className} aria-hidden focusable="false" data-testid="lineart-sidebar">
      <path {...line({ w: 1.5 })} d="M4 17.4C13.5 13.2 21.5 13.3 31 17.2C40.5 21.1 48.5 21.1 58 17.3C67.5 13.5 75.5 13.6 85 17.4" />
      <path {...line({ w: 1.4, o: 0.7 })} d="M30 25.2C39 22 47 22.1 56 25.1C65 28.1 73 28.1 82 25.2" />
      <path {...line({ w: 1.5 })} d="M104 24.6C107.4 18.6 112 13.4 118.6 9.6" />
      <path {...line({ w: 1.4 })} d="M109.4 17.4C106.4 15.8 105.2 12.8 106 10C108.9 11.2 110.4 14.1 109.5 17.2" />
      <path {...line({ w: 1.4, o: 0.85 })} d="M113.4 13.6C116.7 14.6 120 13.8 122 11.4C119.2 10.4 115.9 11.2 113.6 13.4" />
    </svg>
  );
}

/** 空の状態: アイコンを囲む手描きの円 (2回なぞった不均一な輪) */
export function SketchRing({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden focusable="false" data-testid="sketch-ring">
      <path {...line({ w: 1.6 })} d="M55.6 31.2C56.2 44.4 45.6 55 32.4 55.2C19.2 55.4 8.6 45.2 8.4 32.2C8.2 19 18.6 8.6 31.6 8.4C44.6 8.2 55.4 18.4 55.8 30.6C55.9 34.6 55.2 37.6 53.6 40.6" />
      <path {...line({ w: 1.1, o: 0.45 })} d="M49.4 13.6C54.2 18 57 24.4 56.6 31.4" />
      <path {...line({ w: 1.4, o: 0.6 })} d="M18 58.4C24.6 56.4 30.6 56.6 37 58.6C40.8 59.8 44.2 59.8 47.6 58.8" />
    </svg>
  );
}

/** ウェルカム (使い方ガイド) の印: 太陽と葉の小枝 */
export function SketchWelcome({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden focusable="false" data-testid="sketch-welcome">
      <path {...line({ w: 1.6, c: SUN })} d="M30.6 15.4C30.8 19.6 27.4 23 23.2 22.9C19 22.8 15.8 19.4 16 15.2C16.2 11.1 19.6 8 23.7 8.2C27.8 8.4 30.9 11.9 30.4 16.1" />
      <path {...line({ w: 1.7 })} d="M6 31.4C10.6 28.2 14.8 28.3 19.2 31.2C23.6 34.1 27.8 34.2 32.4 31.2C36.4 28.6 39.6 28.6 42.6 30.4" />
      <path {...line({ w: 1.5 })} d="M14.4 40.6C17.4 36.2 21.2 32.8 26 30.6" />
      <path {...line({ w: 1.4 })} d="M18.4 36.6C16 35.2 15 32.8 15.8 30.6C18.2 31.6 19.3 34 18.5 36.4" />
      <path {...line({ w: 1.4, o: 0.85 })} d="M21.6 34.2C24.2 35 26.8 34.4 28.4 32.4C26.2 31.6 23.6 32.2 21.8 34" />
    </svg>
  );
}
