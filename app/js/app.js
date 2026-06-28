/* ============================================================
   Navi Beauty App  —  アプリ本体
   ルーター / データ管理 / 診断エンジン / 画面描画
   フレームワーク非依存（Vanilla JS）
   ============================================================ */
(function () {
  'use strict';

  // ---------- ユーティリティ ----------
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  // Unicode対応 base64url
  function encodeState(obj) {
    var json = JSON.stringify(obj);
    var b64 = btoa(unescape(encodeURIComponent(json)));
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function decodeState(str) {
    try {
      var b64 = str.replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      return JSON.parse(decodeURIComponent(escape(atob(b64))));
    } catch (e) { console.error('[decodeState]', e); return null; }
  }

  // ---------- データストア ----------
  var DB = { diagnoses: null, menus: null, products: null, tips: null };
  var quizState = null; // { id, answers: [] }

  function loadData() {
    var base = 'data/';
    return Promise.all([
      fetch(base + 'diagnoses.json').then(function (r) { return r.json(); }),
      fetch(base + 'menus.json').then(function (r) { return r.json(); }),
      fetch(base + 'products.json').then(function (r) { return r.json(); }),
      fetch(base + 'tips.json').then(function (r) { return r.json(); })
    ]).then(function (res) {
      DB.diagnoses = res[0].diagnoses;
      DB.menus = res[1];
      DB.products = res[2].products;
      DB.tips = res[3];
    });
  }
  function getDiagnosis(id) { return DB.diagnoses.filter(function (d) { return d.id === id; })[0]; }
  function getMenu(id) { return DB.menus.menus.filter(function (m) { return m.id === id; })[0]; }
  function getProduct(id) { return DB.products.filter(function (p) { return p.id === id; })[0]; }
  function getColumn(id) { return DB.tips.columns.filter(function (c) { return c.id === id; })[0]; }

  // ---------- 描画ヘルパー ----------
  var main = function () { return $('#main'); };
  function setView(html, opts) {
    opts = opts || {};
    main().innerHTML = html;
    document.body.setAttribute('data-subpage', opts.sub ? '1' : '0');
    window.scrollTo(0, 0);
    setActiveTab(opts.tab || '');
  }
  function setActiveTab(name) {
    var items = document.querySelectorAll('.tabbar__item');
    for (var i = 0; i < items.length; i++) {
      items[i].classList.toggle('active', items[i].getAttribute('data-tab') === name);
    }
  }

  // ============================================================
  //  各画面
  // ============================================================

  // ---- ホーム ----
  function viewHome() {
    var html = ''
      + '<section class="hero">'
      +   '<p class="hero__brand">NAVI BEAUTY</p>'
      +   '<h1 class="hero__title">Change Your Life.<br><em>診断から、</em>あなたに<br>ぴったりの美しさへ。</h1>'
      +   '<p class="hero__lead">かんたんな質問に答えるだけ。今のあなたに最適な眉デザイン・お肌のケア・おすすめアイテムをご提案します。</p>'
      +   '<div class="hero__cta">'
      +     '<a class="btn btn--primary btn--lg btn--block" href="#/diagnosis">✦ 無料で診断をはじめる</a>'
      +   '</div>'
      + '</section>'
      + '<section class="section">'
      +   '<p class="eyebrow">Menu</p>'
      +   '<h2 class="section-title">できること</h2>'
      +   '<div class="home-grid">'
      +     tile('#/diagnosis', '🔮', '美容診断', '悩み別に多数', false)
      +     tile('#/menu', '💎', 'メニュー', 'アートメイク/エステ', false)
      +     tile('#/products', '🧴', '商品', 'オンライン購入', false)
      +     tile('#/tips', '📖', '眉毛の豆知識', 'コラム＆Tips', false)
      +     tile('#/diagnosis', '✨', '診断はこちら', 'まずは1分でチェック', true)
      +   '</div>'
      + '</section>'
      + '<section class="section">'
      +   '<p class="eyebrow">Concept</p>'
      +   '<h2 class="section-title">美と健康を通じて、<br>すべての人に自信と輝きを。</h2>'
      +   '<p class="muted mt-s">株式会社Naviは、大阪・梅田のアートメイク・エステ専門クリニック。一人ひとりに寄り添い、なりたい印象へと導きます。</p>'
      +   '<a class="btn btn--line btn--block mt-m" href="#" onclick="return false">LINEで相談する</a>'
      +   '<p class="placeholder-note">※ LINE連携・予約は本番環境で接続予定（デザイン確認用）</p>'
      + '</section>';
    setView(html, { tab: 'home' });
  }
  function tile(href, ic, name, desc, accent) {
    return '<a class="tile' + (accent ? ' tile--accent' : '') + '" href="' + href + '">'
      + '<div class="tile__ic">' + ic + '</div>'
      + '<div><div class="tile__name">' + esc(name) + '</div><div class="tile__desc">' + esc(desc) + '</div></div>'
      + '</a>';
  }

  // ---- 診断一覧 ----
  function viewDiagnosisList() {
    var cards = DB.diagnoses.map(function (d) {
      var emoji = { brow: '🪶', skin: '💧', impression: '🎀' }[d.id] || '🔮';
      return '<a class="card diag-card" href="#/diagnosis/' + d.id + '">'
        + '<div class="diag-card__badge">' + emoji + '</div>'
        + '<div class="diag-card__body">'
        +   '<div class="diag-card__title">' + esc(d.title) + '</div>'
        +   '<div class="diag-card__sub">' + esc(d.subtitle) + '</div>'
        +   '<div class="diag-card__meta">' + (d.tag ? '<span class="chip">' + esc(d.tag) + '</span> ' : '')
        +     '全' + d.questions.length + '問・約' + d.minutes + '分</div>'
        + '</div>'
        + '<div style="color:var(--ink-3);font-size:1.4rem">›</div>'
        + '</a>';
    }).join('');
    var html = '<section class="section">'
      + '<p class="eyebrow">Diagnosis</p>'
      + '<h2 class="section-title">美容診断</h2>'
      + '<p class="section-sub">気になるテーマを選んでください。結果はQRコードでスマホに保存できます。</p>'
      + cards
      + '</section>';
    setView(html, { tab: 'diagnosis' });
  }

  // ---- 診断 進行 ----
  function startQuiz(id) {
    var d = getDiagnosis(id);
    if (!d) { go('#/diagnosis'); return; }
    quizState = { id: id, answers: [] };
    renderQuiz();
  }
  function renderQuiz() {
    var d = getDiagnosis(quizState.id);
    var idx = quizState.answers.length;          // 次に答える問題
    if (idx >= d.questions.length) { finishQuiz(); return; }
    var q = d.questions[idx];
    var pct = Math.round((idx) / d.questions.length * 100);
    var opts = q.options.map(function (o, i) {
      return '<button class="opt" data-i="' + i + '">' + esc(o.label) + '</button>';
    }).join('');
    var html = '<section class="quiz">'
      + '<div class="quiz__progress"><span style="width:' + pct + '%"></span></div>'
      + '<div class="quiz__count">' + (idx + 1) + ' / ' + d.questions.length + '</div>'
      + '<h2 class="quiz__q">' + esc(q.q) + '</h2>'
      + '<div class="quiz__opts">' + opts + '</div>'
      + '<div class="quiz__nav">'
      +   (idx > 0 ? '<button class="btn btn--ghost" id="quizBack">戻る</button>' : '')
      + '</div>'
      + '</section>';
    setView(html, { sub: true, tab: 'diagnosis' });

    var btns = document.querySelectorAll('.opt');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () {
        quizState.answers.push(parseInt(this.getAttribute('data-i'), 10));
        renderQuiz();
      });
    }
    var back = $('#quizBack');
    if (back) back.addEventListener('click', function () { quizState.answers.pop(); renderQuiz(); });
  }
  function computeResult(d, answers) {
    var scores = {};
    d.results.forEach(function (r) { scores[r.id] = 0; });
    answers.forEach(function (ai, qi) {
      var opt = d.questions[qi].options[ai];
      if (!opt || !opt.scores) return;
      Object.keys(opt.scores).forEach(function (k) {
        if (scores[k] == null) scores[k] = 0;
        scores[k] += opt.scores[k];
      });
    });
    var best = d.results[0].id, bestVal = -Infinity;
    d.results.forEach(function (r) { if ((scores[r.id] || 0) > bestVal) { bestVal = scores[r.id] || 0; best = r.id; } });
    return best;
  }
  function finishQuiz() {
    var d = getDiagnosis(quizState.id);
    var resultId = computeResult(d, quizState.answers);
    go('#/r/' + encodeState({ d: d.id, r: resultId }));
  }

  // ---- 診断結果（共有可能） ----
  function viewResult(enc) {
    var state = decodeState(enc);
    if (!state) { go('#/diagnosis'); return; }
    var d = getDiagnosis(state.d);
    var result = d && d.results.filter(function (r) { return r.id === state.r; })[0];
    if (!d || !result) { go('#/diagnosis'); return; }

    var menus = (result.menus || []).map(getMenu).filter(Boolean);
    var products = (result.products || []).map(getProduct).filter(Boolean);

    var recMenus = menus.map(function (m) {
      return '<a class="card rec-card" href="#/menu">'
        + '<div class="rec-card__top">' + (m.emoji || '💎') + '</div>'
        + '<div class="rec-card__name">' + esc(m.name) + '</div>'
        + '<div class="rec-card__meta">' + esc(m.duration) + '</div>'
        + '<div class="rec-card__price">' + esc(m.price) + '</div>'
        + '</a>';
    }).join('');
    var recProducts = products.map(function (p) {
      return '<a class="card rec-card" href="#/products">'
        + '<div class="rec-card__top">' + (p.emoji || '🧴') + '</div>'
        + '<div class="rec-card__name">' + esc(p.name) + '</div>'
        + '<div class="rec-card__meta">' + esc(p.tag) + '</div>'
        + '<div class="rec-card__price">' + esc(p.price) + '</div>'
        + '</a>';
    }).join('');
    var advice = (result.advice || []).map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('');

    var html = ''
      + '<section class="result-hero">'
      +   '<p class="result-hero__label">' + esc(d.title) + ' の結果</p>'
      +   '<h1 class="result-hero__title">' + esc(result.title) + '</h1>'
      +   '<p class="result-hero__catch">' + esc(result.catch) + '</p>'
      +   '<p class="result-hero__summary">' + esc(result.summary) + '</p>'
      + '</section>'
      + '<section class="section">'
      +   '<p class="eyebrow">Advice</p>'
      +   '<h2 class="section-title">あなたへのアドバイス</h2>'
      +   '<ul class="advice mt-s">' + advice + '</ul>'
      + '</section>';

    if (menus.length) {
      html += '<section class="section"><p class="eyebrow">Recommended Menu</p>'
        + '<h2 class="section-title">おすすめメニュー</h2></section>'
        + '<div class="hscroll">' + recMenus + '</div>';
    }
    if (products.length) {
      html += '<section class="section"><p class="eyebrow">Recommended Item</p>'
        + '<h2 class="section-title">おすすめアイテム</h2></section>'
        + '<div class="hscroll">' + recProducts + '</div>';
    }

    var shareUrl = location.origin + location.pathname + '#/r/' + enc;
    html += '<section class="section qr-block">'
      + '<p class="eyebrow">Save</p>'
      + '<h2 class="section-title">結果をスマホに保存</h2>'
      + '<p class="section-sub">このQRコードをお客様のスマホで読み込むと、いつでも結果を見返せます。</p>'
      + '<div class="qr-frame"><div id="qrTarget"></div></div>'
      + '<p class="qr-note">読み込み後はブックマーク推奨。<br>結果ページURLが開きます。</p>'
      + '<div class="stack mt-l">'
      +   '<a class="btn btn--line btn--block" href="#" onclick="return false">この内容でLINE相談・予約</a>'
      +   '<a class="btn btn--ghost btn--block" href="#/diagnosis">他の診断をする</a>'
      + '</div>'
      + '<p class="placeholder-note">※ 予約・LINE連携は本番環境で接続予定（デザイン確認用）</p>'
      + '</section>';

    setView(html, { sub: true, tab: 'diagnosis' });
    if (window.NaviQR) window.NaviQR.render($('#qrTarget'), shareUrl, 200);
  }

  // ---- メニュー一覧 ----
  function viewMenu(cat) {
    cat = cat || 'all';
    var cats = DB.menus.categories;
    var seg = '<div class="seg">'
      + '<button class="seg__btn' + (cat === 'all' ? ' active' : '') + '" data-cat="all">すべて</button>'
      + cats.map(function (c) {
          return '<button class="seg__btn' + (cat === c.id ? ' active' : '') + '" data-cat="' + c.id + '">' + esc(c.label) + '</button>';
        }).join('')
      + '</div>';
    var list = DB.menus.menus.filter(function (m) { return cat === 'all' || m.category === cat; }).map(function (m) {
      var tags = (m.points || []).map(function (p) { return '<span class="tag-sm">' + esc(p) + '</span>'; }).join('');
      return '<div class="card menu-item" style="display:flex">'
        + '<div class="menu-item__ic">' + (m.emoji || '💎') + '</div>'
        + '<div class="menu-item__body">'
        +   '<div class="menu-item__name">' + esc(m.name) + '</div>'
        +   '<div class="menu-item__sum">' + esc(m.summary) + '</div>'
        +   '<div class="menu-item__foot"><span class="menu-item__price">' + esc(m.price) + '</span><span class="menu-item__dur">' + esc(m.duration) + '</span></div>'
        +   '<div class="tags">' + tags + '</div>'
        + '</div></div>';
    }).join('');
    var html = '<section class="section">'
      + '<p class="eyebrow">Menu</p>'
      + '<h2 class="section-title">メニュー</h2>'
      + '<p class="section-sub">アートメイク・エステの施術メニュー一覧です。</p>'
      + seg + list
      + '<p class="placeholder-note">※ 料金・内容はサンプルです（デザイン確認用）。予約導線は本番接続予定。</p>'
      + '</section>';
    setView(html, { tab: 'menu' });
    var segBtns = document.querySelectorAll('.seg__btn');
    for (var i = 0; i < segBtns.length; i++) {
      segBtns[i].addEventListener('click', function () { viewMenu(this.getAttribute('data-cat')); });
    }
  }

  // ---- 商品一覧 ----
  function viewProducts() {
    var grid = DB.products.map(function (p) {
      return '<div class="card prod-card">'
        + '<div class="prod-card__top">' + (p.emoji || '🧴') + '</div>'
        + '<div class="prod-card__tag">' + esc(p.tag) + '</div>'
        + '<div class="prod-card__name">' + esc(p.name) + '</div>'
        + '<div class="prod-card__sum">' + esc(p.summary) + '</div>'
        + '<div class="prod-card__price">' + esc(p.price) + '</div>'
        + '</div>';
    }).join('');
    var html = '<section class="section">'
      + '<p class="eyebrow">Online Shop</p>'
      + '<h2 class="section-title">商品紹介</h2>'
      + '<p class="section-sub">Naviおすすめの美容アイテム。施術後のホームケアにも。</p>'
      + '<div class="prod-grid">' + grid + '</div>'
      + '<p class="placeholder-note">※ 商品・価格はサンプルです（デザイン確認用）。カート/決済は本番接続予定。</p>'
      + '</section>';
    setView(html, { tab: 'products' });
  }

  // ---- 豆知識一覧 ----
  function viewTips() {
    var facts = DB.tips.facts.map(function (f) {
      return '<div class="fact"><span class="fact__ic">✦</span><span>' + esc(f) + '</span></div>';
    }).join('');
    var cols = DB.tips.columns.map(function (c) {
      return '<a class="card col-card" href="#/tips/' + c.id + '">'
        + '<div class="col-card__tag">' + esc(c.tag) + '</div>'
        + '<div class="col-card__title">' + esc(c.title) + '</div>'
        + '<div class="col-card__sub">' + esc(c.subtitle) + '</div>'
        + '<div class="col-card__meta">📖 約' + c.minutes + '分で読めます</div>'
        + '</a>';
    }).join('');
    var html = '<section class="section">'
      + '<p class="eyebrow">Tips</p>'
      + '<h2 class="section-title">眉毛の豆知識</h2>'
      + '<p class="section-sub">知っておくと役立つ、眉とアートメイクのミニ知識。</p>'
      + facts
      + '</section>'
      + '<section class="section"><p class="eyebrow">Column</p><h2 class="section-title">読みもの</h2>' + cols + '</section>';
    setView(html, { tab: 'tips' });
  }

  // ---- 豆知識 記事 ----
  function viewColumn(id) {
    var c = getColumn(id);
    if (!c) { go('#/tips'); return; }
    var body = c.body.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
    var html = '<section class="section article">'
      + '<div class="col-card__tag">' + esc(c.tag) + '</div>'
      + '<h1 class="section-title" style="font-size:1.5rem;margin:6px 0 4px">' + esc(c.title) + '</h1>'
      + '<p class="section-sub">' + esc(c.subtitle) + '</p>'
      + '<div class="divider" style="margin:14px 0"></div>'
      + '<p class="article__lead">' + esc(c.lead) + '</p>'
      + body
      + '<a class="btn btn--primary btn--block mt-l" href="#/diagnosis">✦ 自分に合う施術を診断する</a>'
      + '</section>';
    setView(html, { sub: true, tab: 'tips' });
  }

  // ============================================================
  //  ルーター
  // ============================================================
  function go(hash) { if (location.hash === hash) route(); else location.hash = hash; }

  function route() {
    var h = location.hash.replace(/^#/, '') || '/';
    var parts = h.split('/').filter(Boolean); // 例: ['diagnosis','brow']
    var head = parts[0] || '';

    if (head === '' ) return viewHome();
    if (head === 'diagnosis') {
      if (parts[1]) return startQuiz(parts[1]);
      return viewDiagnosisList();
    }
    if (head === 'r') return viewResult(parts.slice(1).join('/'));
    if (head === 'menu') return viewMenu(parts[1]);
    if (head === 'products') return viewProducts();
    if (head === 'tips') {
      if (parts[1]) return viewColumn(parts[1]);
      return viewTips();
    }
    return viewHome();
  }

  // ============================================================
  //  初期化
  // ============================================================
  function bindShell() {
    var back = $('#backBtn');
    if (back) back.addEventListener('click', function () {
      if (history.length > 1) history.back(); else go('#/');
    });
  }

  window.addEventListener('hashchange', route);
  document.addEventListener('DOMContentLoaded', function () {
    bindShell();
    loadData().then(function () {
      route();
    }).catch(function (e) {
      console.error('[init] データ読み込み失敗:', e);
      main().innerHTML = '<section class="section center"><p class="muted">データの読み込みに失敗しました。<br>ローカルサーバー経由で開いてください。</p></section>';
    });
  });

  // PWA: Service Worker 登録（任意・失敗しても無視）
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }
})();
