// テーマを描画前に適用してちらつきを防ぐ (CSP で インラインのスクリプトを禁止しているため別ファイル)
(function () {
  try {
    var t = localStorage.getItem('workcore-theme');
    // 既定 (未設定) はダーク
    var dark = !t || t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
