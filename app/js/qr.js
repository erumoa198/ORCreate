/* QRコード生成ラッパー（vendor/qrcode.js = qrcode-generator を使用） */
window.NaviQR = (function () {
  function make(text, size) {
    size = size || 200;
    // 誤り訂正レベル M、type 0 = データ量に応じて自動
    var qr = qrcode(0, 'M');
    qr.addData(text);
    qr.make();
    // セルサイズを目標サイズから逆算
    var count = qr.getModuleCount();
    var cell = Math.max(2, Math.floor(size / (count + 2)));
    var margin = cell * 1; // 余白（quiet zone）
    return qr.createSvgTag({ cellSize: cell, margin: margin, scalable: true });
  }

  /** 指定要素にQRを描画 */
  function render(el, text, size) {
    try {
      el.innerHTML = make(text, size);
      var svg = el.querySelector('svg');
      if (svg) { svg.setAttribute('width', size || 200); svg.setAttribute('height', size || 200); }
      return true;
    } catch (e) {
      console.error('[NaviQR] 生成失敗:', e);
      el.innerHTML = '<p class="muted">QRの生成に失敗しました</p>';
      return false;
    }
  }

  return { make: make, render: render };
})();
