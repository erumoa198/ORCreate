/* ============================================================
   Navi Beauty App — アプリ本体（エディトリアル版）
   ルーター / データ / 診断エンジン / 画面描画 / SVGアイコン
   Vanilla JS（ビルド不要）
   ============================================================ */
(function () {
  'use strict';

  // ---------- ユーティリティ ----------
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function encodeState(o) {
    return btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function decodeState(s) {
    try { var b = s.replace(/-/g, '+').replace(/_/g, '/'); while (b.length % 4) b += '='; return JSON.parse(decodeURIComponent(escape(atob(b)))); }
    catch (e) { console.error('[decodeState]', e); return null; }
  }

  // ---------- SVGアイコン（stroke / currentColor） ----------
  var I = (function () {
    function w(p) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>'; }
    return {
      home: w('<path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v9.5h12V10"/>'),
      scan: w('<path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8"/><path d="M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8"/><path d="M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16"/><path d="M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16"/><path d="M7.5 12h9"/>'),
      menu: w('<path d="M12 3 4 7l8 4 8-4-8-4Z"/><path d="m4 12 8 4 8-4"/><path d="m4 17 8 4 8-4"/>'),
      bag: w('<path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'),
      book: w('<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v15H5.5A1.5 1.5 0 0 0 4 20.5V5.5Z"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v15h5.5a1.5 1.5 0 0 1 1.5 1.5V5.5Z"/>'),
      arrow: w('<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>'),
      chev: w('<path d="m9 6 6 6-6 6"/>'),
      back: w('<path d="M19 12H5"/><path d="m11 18-6-6 6-6"/>'),
      share: w('<circle cx="18" cy="5" r="2.4"/><circle cx="6" cy="12" r="2.4"/><circle cx="18" cy="19" r="2.4"/><path d="m8.2 10.8 7.6-4.2M8.2 13.2l7.6 4.2"/>'),
      search: w('<circle cx="11" cy="11" r="6.5"/><path d="m20 20-3.8-3.8"/>'),
      rank: w('<path d="M6 20v-7"/><path d="M12 20V4"/><path d="M18 20v-10"/>'),
      pin: w('<path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/>'),
      ticket: w('<path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2H6a2 2 0 0 1-2-2 2 2 0 0 0 0-4Z"/><path d="M14 6v12"/>')
    };
  })();

  // 装飾モチーフ（ラインアート・カバー右下用）
  var MOTIF = {
    face: '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M70 14c-14-6-34-2-42 14-7 14-4 34 6 46 9 11 26 14 36 4"/><path d="M44 40c4-3 11-3 15 0"/><path d="M48 52c-2 6-7 9-7 9s4 4 9 3"/><path d="M44 70c5 4 13 4 19 0"/></svg>',
    brow: '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M16 56c14-12 34-14 50-4"/><path d="M20 50c2-3 6-4 9-2M30 46c3-3 7-3 10-1M42 44c3-2 8-2 11 0M54 45c3-1 8 0 10 2"/></svg>',
    drop: '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M50 18c10 16 20 27 20 40a20 20 0 1 1-40 0c0-13 10-24 20-40Z"/><path d="M40 60a10 10 0 0 0 8 9"/></svg>',
    leaf: '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M24 76C24 44 48 24 78 22c2 30-18 54-50 54Z"/><path d="M30 70C44 54 58 42 74 30"/></svg>',
    bottle: '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M42 22h16v8l6 10v34a6 6 0 0 1-6 6H42a6 6 0 0 1-6-6V40l6-10v-8Z"/><path d="M36 50h28"/><path d="M46 16h8"/></svg>'
  };
  var COVERS = ['cover--rose', 'cover--clay', 'cover--sage', 'cover--plum', 'cover--sand'];
  function coverOf(i) { return COVERS[i % COVERS.length]; }
  var DIAG_MOTIF = { brow: 'brow', skin: 'drop', impression: 'face' };

  // ---------- データ ----------
  var DB = { diagnoses: null, menus: null, products: null, tips: null, news: null };
  var quizState = null;

  function loadData() {
    // 単一HTML版：埋め込みデータがあればfetch不要（file://でも動作）
    if (window.NAVI_DATA) {
      var D = window.NAVI_DATA;
      DB.diagnoses = D.diagnoses; DB.menus = D.menus; DB.products = D.products; DB.tips = D.tips; DB.news = D.news;
      return Promise.resolve();
    }
    return Promise.all(['diagnoses', 'menus', 'products', 'tips', 'news'].map(function (n) {
      return fetch('data/' + n + '.json').then(function (r) { return r.json(); });
    })).then(function (r) {
      DB.diagnoses = r[0].diagnoses; DB.menus = r[1]; DB.products = r[2].products; DB.tips = r[3]; DB.news = r[4].news;
    });
  }
  function getDiag(id) { return DB.diagnoses.filter(function (d) { return d.id === id; })[0]; }
  function diagIndex(id) { for (var i = 0; i < DB.diagnoses.length; i++) if (DB.diagnoses[i].id === id) return i; return 0; }
  function getMenu(id) { return DB.menus.menus.filter(function (m) { return m.id === id; })[0]; }
  function menuIndex(id) { for (var i = 0; i < DB.menus.menus.length; i++) if (DB.menus.menus[i].id === id) return i; return 0; }
  function getProduct(id) { return DB.products.filter(function (p) { return p.id === id; })[0]; }
  function productIndex(id) { for (var i = 0; i < DB.products.length; i++) if (DB.products[i].id === id) return i; return 0; }
  function getColumn(id) { return DB.tips.columns.filter(function (c) { return c.id === id; })[0]; }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  // ---------- 描画ヘルパー ----------
  var main = function () { return $('#main'); };
  function setView(html, o) {
    o = o || {};
    var m = main();
    m.className = 'app-main';
    m.innerHTML = html;
    // reflow → enter animation
    void m.offsetWidth; m.classList.add('view-enter');
    document.body.setAttribute('data-subpage', o.sub ? '1' : '0');
    document.body.setAttribute('data-immersive', o.immersive ? '1' : '0');
    window.scrollTo(0, 0);
    setTab(o.tab || '');
    onScroll();
  }
  function setTab(name) {
    $$('.tabbar__item').forEach(function (el) { el.classList.toggle('active', el.getAttribute('data-tab') === name); });
  }

  // ============================================================
  //  HOME
  // ============================================================
  function modHead(jp, en, href) {
    return '<div class="mod"><div class="mod__l"><span class="mod__t">' + jp + '</span><span class="mod__en">' + en + '</span></div>'
      + (href ? '<a class="mod__more" href="' + href + '">もっと見る' + I.chev + '</a>' : '') + '</div>';
  }

  function viewHome() {
    // クイックアクセス
    var quick = [
      ['診断', I.scan, '#/diagnosis'],
      ['メニュー', I.menu, '#/menu'],
      ['商品', I.bag, '#/products'],
      ['コラム', I.book, '#/tips'],
      ['店舗', I.pin, '#']
    ].map(function (q) {
      return '<a class="quick__i" href="' + q[2] + '"' + (q[2] === '#' ? ' onclick="return false"' : '') + '>'
        + '<span class="quick__c">' + q[1] + '</span><span class="quick__l">' + q[0] + '</span></a>';
    }).join('');

    // バナー（お知らせ/キャンペーン）
    var banners = DB.news.map(function (n) {
      return '<a class="banner cover cover--' + esc(n.cover) + '" href="#/news">'
        + '<span class="banner__cat">' + esc(n.cat) + '</span>'
        + '<span class="banner__title">' + esc(n.title) + '</span>'
        + '<span class="banner__date">' + esc(n.date) + '</span></a>';
    }).join('');

    // 人気の診断 ランキング
    var diagRank = DB.diagnoses.map(function (d, i) {
      return '<a class="rk" href="#/diagnosis/' + d.id + '">'
        + '<span class="rk__n' + (i < 3 ? ' rk__n--top' : '') + '">' + (i + 1) + '</span>'
        + '<span class="rk__img cover ' + coverOf(diagIndex(d.id)) + '"><span class="cover__motif" style="width:40px;height:40px;right:0;bottom:0">' + (MOTIF[DIAG_MOTIF[d.id]] || MOTIF.face) + '</span></span>'
        + '<span class="rk__b"><span class="rk__name">' + esc(d.title) + '</span>'
        +   '<span class="rk__meta">' + (d.tag ? '<b>' + esc(d.tag) + '</b> · ' : '') + '全' + d.questions.length + '問 · 約' + d.minutes + '分</span></span>'
        + '<span class="rk__ar">' + I.chev + '</span></a>';
    }).join('');

    // 新着コラム
    var cols = DB.tips.columns.slice(0, 3).map(function (c, i) {
      return '<a class="jrow" href="#/tips/' + c.id + '">'
        + '<div class="jrow__img cover ' + coverOf(i + 1) + '"><span class="cover__motif" style="width:50px;height:50px;right:2px;bottom:2px">' + MOTIF.brow + '</span></div>'
        + '<div class="jrow__b"><div class="jrow__tag">' + esc(c.tag) + (i === 0 ? ' &nbsp;<span class="badge badge--new">New</span>' : '') + '</div>'
        +   '<div class="jrow__title">' + esc(c.title) + '</div>'
        +   '<div class="jrow__meta">Read · 約' + c.minutes + ' min</div></div></a>';
    }).join('');

    // 人気アイテム（横スクロール・ランキング）
    var items = DB.products.slice(0, 6).map(function (p, i) {
      return '<a class="mini" href="#/products/' + p.id + '">'
        + '<div class="mini__img cover ' + coverOf(productIndex(p.id)) + '"><span class="mini__rank">' + (i + 1) + '</span><span class="cover__motif" style="width:60px;height:60px">' + MOTIF.bottle + '</span></div>'
        + '<div class="mini__cat">' + esc(p.tag) + '</div>'
        + '<div class="mini__name">' + esc(p.name) + '</div>'
        + '<div class="mini__price">' + esc(p.price) + '</div></a>';
    }).join('');

    // お知らせ
    var news = DB.news.map(function (n) {
      return '<a class="nrow" href="#/news"><span class="nrow__date">' + esc(n.date) + '</span>'
        + '<span class="nrow__cat">' + esc(n.cat) + '</span>'
        + '<span class="nrow__t">' + esc(n.title) + '</span></a>';
    }).join('');

    var html = ''
      + '<div class="htop"><span class="htop__brand" style="font-size:0.82rem;color:var(--ink-2)">大阪・梅田 ｜ アートメイク・エステ</span><span class="htop__loc">Beauty Navi</span></div>'

      + '<a class="hbig" href="#/diagnosis/persona"><div class="hbig__c"><span class="hbig__kick">Beauty Type Diagnosis</span>'
      +   '<span class="hbig__t">あなたの美容タイプを<br>診断する</span>'
      +   '<span class="hbig__s">8つの質問でわかる・約2分</span>'
      +   '<span class="hbig__btn">診断スタート ' + I.arrow + '</span></div>'
      +   '<span class="hbig__ic">' + I.scan + '</span></a>'

      + '<a class="search" href="#" onclick="return false">' + I.search + '<span>気になる悩み・メニューを検索</span></a>'
      + '<nav class="quick">' + quick + '</nav>'

      + modHead('ほかの診断', 'Ranking', '#/diagnosis')
      + '<div class="feed">' + diagRank + '</div>'

      + modHead('人気アイテム', 'Ranking', '#/products')
      + '<div class="rail">' + items + '</div>'

      + modHead('ピックアップ', 'Pickup', '#/news')
      + '<div class="rail">' + banners + '</div>'

      + modHead('新着コラム', 'Journal', '#/tips')
      + '<div class="jlist" style="padding-top:0">' + cols + '</div>'

      + modHead('お知らせ', 'News', '#/news')
      + '<div class="feed" style="margin-bottom:18px">' + news + '</div>'

      + '<p class="note">大阪・梅田 ｜ アートメイク・エステ専門クリニック 株式会社Navi</p>'
      + '<p class="note" style="padding-top:0">※ 検索・LINE・予約・購入は本番環境で接続予定（デザイン確認用）</p>';
    setView(html, { tab: 'home' });
  }

  // ============================================================
  //  診断一覧
  // ============================================================
  function viewDiagList() {
    var cards = DB.diagnoses.map(function (d, i) {
      return '<a class="dbig" href="#/diagnosis/' + d.id + '">'
        + '<div class="dbig__img cover ' + coverOf(i) + '">'
        +   '<div class="dbig__top"><span class="dbig__no">' + pad2(i + 1) + '</span>'
        +     (d.tag ? '<span class="dbig__tag">' + esc(d.tag) + '</span>' : '') + '</div>'
        +   '<span class="cover__motif" style="width:120px;height:120px;right:6px;bottom:6px">' + (MOTIF[DIAG_MOTIF[d.id]] || MOTIF.face) + '</span>'
        +   '<div class="dbig__name">' + esc(d.title) + '</div>'
        + '</div>'
        + '<div class="dbig__sub"><span>' + esc(d.subtitle) + '</span></div>'
        + '<div class="dbig__sub"><span class="kicker kicker--muted">全' + d.questions.length + '問 · 約' + d.minutes + '分</span><span class="dbig__go">Start ' + I.arrow + '</span></div>'
        + '</a>';
    }).join('');
    var html = '<div class="page-head">'
      + '<div class="kicker">Diagnosis</div>'
      + '<h1 class="page-head__title">美容診断</h1>'
      + '<p class="page-head__sub">気になるテーマを選んでください。結果はQRコードでスマホに保存できます。</p>'
      + '</div>'
      + '<div class="dlist">' + cards + '</div>';
    setView(html, { tab: 'diagnosis' });
  }

  // ============================================================
  //  QUIZ（没入）
  // ============================================================
  function startQuiz(id) {
    var d = getDiag(id); if (!d) { go('#/diagnosis'); return; }
    quizState = { id: id, answers: [] };
    renderQuiz();
  }
  function renderQuiz() {
    var d = getDiag(quizState.id);
    var idx = quizState.answers.length;
    if (idx >= d.questions.length) { finishQuiz(); return; }
    var q = d.questions[idx];
    var pct = Math.round(idx / d.questions.length * 100);
    var marks = ['A', 'B', 'C', 'D', 'E'];
    var opts = q.options.map(function (o, i) {
      return '<button class="qopt" data-i="' + i + '"><span class="qopt__mk">' + marks[i] + '</span><span>' + esc(o.label) + '</span><span class="qopt__ar">' + I.arrow + '</span></button>';
    }).join('');
    var html = '<div class="quiz__bar"><span style="width:' + pct + '%"></span></div>'
      + '<section class="quiz quiz-anim">'
      +   (q.section ? '<div class="quiz__sec">' + esc(q.section) + '</div>' : '')
      +   '<div class="quiz__count"><b>' + pad2(idx + 1) + '</b> / ' + pad2(d.questions.length) + '</div>'
      +   '<h2 class="quiz__q">' + esc(q.q) + '</h2>'
      +   '<div class="quiz__opts">' + opts + '</div>'
      +   (idx > 0 ? '<button class="quiz__back" id="qBack">' + I.back + ' Back</button>' : '')
      + '</section>';
    setView(html, { sub: true, immersive: true, tab: 'diagnosis' });
    $$('.qopt').forEach(function (b) {
      b.addEventListener('click', function () { quizState.answers.push(parseInt(this.getAttribute('data-i'), 10)); renderQuiz(); });
    });
    var bk = $('#qBack'); if (bk) bk.addEventListener('click', function () { quizState.answers.pop(); renderQuiz(); });
  }
  function computeResult(d, answers) {
    var sc = {}; d.results.forEach(function (r) { sc[r.id] = 0; });
    answers.forEach(function (ai, qi) {
      var o = d.questions[qi].options[ai]; if (!o || !o.scores) return;
      Object.keys(o.scores).forEach(function (k) { sc[k] = (sc[k] || 0) + o.scores[k]; });
    });
    var best = d.results[0].id, bv = -Infinity;
    d.results.forEach(function (r) { if ((sc[r.id] || 0) > bv) { bv = sc[r.id] || 0; best = r.id; } });
    return best;
  }
  function computePersona(d, answers) {
    // 軸ごとのポール集計
    var tally = {};
    answers.forEach(function (ai, qi) {
      var o = d.questions[qi].options[ai]; if (!o || !o.axis) return;
      Object.keys(o.axis).forEach(function (k) { tally[k] = (tally[k] || 0) + o.axis[k]; });
    });
    var code = '', pcts = [];
    d.axes.forEach(function (ax) {
      var av = tally[ax.a.letter] || 0, bv = tally[ax.b.letter] || 0;
      var total = av + bv || 1;
      if (av >= bv) { code += ax.a.letter; pcts.push(Math.round(av / total * 100)); }
      else { code += ax.b.letter; pcts.push(Math.round(bv / total * 100)); }
    });
    // 軸1（眉）×軸3（印象）で基本タイプを決定
    var key = code.charAt(0) + code.charAt(2);
    return { code: code, p: pcts, r: key };
  }

  function finishQuiz() {
    var d = getDiag(quizState.id);
    if (d.mode === 'persona') {
      var pr = computePersona(d, quizState.answers);
      go('#/r/' + encodeState({ d: d.id, r: pr.r, c: pr.code, p: pr.p }));
      return;
    }
    go('#/r/' + encodeState({ d: d.id, r: computeResult(d, quizState.answers) }));
  }

  // ============================================================
  //  RESULT（共有可能）
  // ============================================================
  function viewResult(enc) {
    var st = decodeState(enc); if (!st) { go('#/diagnosis'); return; }
    var d = getDiag(st.d);
    var result = d && d.results.filter(function (r) { return r.id === st.r; })[0];
    if (!d || !result) { go('#/diagnosis'); return; }

    var advice = (result.advice || []).map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('');

    // 解決する商品（主役）：理由・効果つき
    var picks = (result.picks || []).map(function (pk) {
      var p = getProduct(pk.id); if (!p) return '';
      return '<a class="sol" href="#/products/' + p.id + '">'
        + '<div class="sol__head">'
        +   '<div class="sol__img cover ' + coverOf(productIndex(p.id)) + '"><span class="cover__motif" style="width:54px;height:54px;right:2px;bottom:2px">' + MOTIF.bottle + '</span></div>'
        +   '<div class="sol__hb"><div class="sol__cat">' + esc(p.tag) + '</div><div class="sol__name">' + esc(p.name) + '</div><div class="sol__price">' + esc(p.price) + '</div></div>'
        + '</div>'
        + '<div class="sol__rows">'
        +   '<div class="sol__row"><span class="sol__lb">理由</span><span class="sol__tx">' + esc(pk.reason) + '</span></div>'
        +   '<div class="sol__row"><span class="sol__lb">効果</span><span class="sol__tx">' + esc(pk.effect) + '</span></div>'
        + '</div>'
        + '<span class="sol__more">商品を見る ' + I.arrow + '</span>'
        + '</a>';
    }).join('');

    // 関連メニュー（補助）
    var menus = (result.menus || []).map(getMenu).filter(Boolean);
    var relMenu = menus.map(function (m) {
      return '<a class="relmenu" href="#/menu" style="margin-bottom:10px">'
        + '<div class="relmenu__sw cover ' + coverOf(menuIndex(m.id)) + '"></div>'
        + '<div class="relmenu__b"><div class="relmenu__lb">' + (m.category === 'esthe' ? 'Esthe Menu' : 'Artmake Menu') + '</div><div class="relmenu__name">' + esc(m.name) + '</div></div>'
        + '<div class="relmenu__price">' + esc(m.price) + '</div></a>';
    }).join('');

    // MBTI風：タイプコード＋4軸バー
    var isPersona = d.mode === 'persona' && st.c && st.p;
    var codeHtml = isPersona ? '<div class="typecode">' + st.c.split('').join('<span class="typecode__d">·</span>') + '</div>' : '';
    var axesHtml = '';
    if (isPersona) {
      axesHtml = '<section class="sec sec--tight"><div class="mod" style="padding:0 0 14px"><div class="mod__l"><span class="mod__t">あなたの4軸</span><span class="mod__en">Axes</span></div></div>';
      d.axes.forEach(function (ax, i) {
        var letter = st.c.charAt(i), pct = st.p[i];
        var aOn = letter === ax.a.letter;
        var winLabel = aOn ? ax.a.label : ax.b.label;
        var fillStyle = (aOn ? 'left:0;' : 'right:0;') + 'width:' + pct + '%';
        axesHtml += '<div class="axis">'
          + '<div class="axis__top"><span class="axis__t">' + esc(ax.title) + '</span><span class="axis__pct">' + esc(winLabel) + ' ' + pct + '%</span></div>'
          + '<div class="axis__track"><span class="axis__fill" style="' + fillStyle + '"></span></div>'
          + '<div class="axis__poles"><span class="' + (aOn ? 'on' : '') + '">' + esc(ax.a.label) + '</span><span class="' + (!aOn ? 'on' : '') + '">' + esc(ax.b.label) + '</span></div>'
          + '</div>';
      });
      axesHtml += '</section>';
    }

    var html = ''
      + '<section class="r-hero">'
      +   '<div class="kicker r-hero__kick">' + esc(d.title) + ' — Result</div>'
      +   codeHtml
      +   '<h1 class="r-hero__title">' + esc(result.title) + '</h1>'
      +   '<p class="r-hero__catch">' + esc(result.catch) + '</p>'
      +   '<p class="r-hero__sum">' + esc(result.feature || result.summary || '') + '</p>'
      + '</section>'
      + axesHtml
      + '<section class="sec sec--tight"><div class="mod" style="padding:0 0 12px"><div class="mod__l"><span class="mod__t">対策・アドバイス</span><span class="mod__en">Advice</span></div></div>'
      +   '<ol class="adv">' + advice + '</ol></section>';

    if (picks) {
      html += '<section class="sec sec--tight"><div class="mod" style="padding:8px 0 14px"><div class="mod__l"><span class="mod__t">悩みを解決するアイテム</span><span class="mod__en">For You</span></div></div>'
        + picks + '</section>';
    }
    if (relMenu) {
      html += '<section class="sec sec--tight"><div class="mod" style="padding:8px 0 14px"><div class="mod__l"><span class="mod__t">あわせて検討</span><span class="mod__en">Menu</span></div></div></section>'
        + relMenu;
    }

    var shareUrl = location.origin + location.pathname + '#/r/' + enc;
    html += '<div class="qr-panel" style="margin-top:22px">'
      + '<div class="qr-panel__kick">Scan to Save</div>'
      + '<p class="qr-panel__t">結果をスマホに保存</p>'
      + '<p class="qr-panel__s">お客様のスマホで読み込むと、<br>いつでも結果と商品を見返せます。</p>'
      + '<div class="qr-frame"><div id="qrTarget"></div></div>'
      + '<p class="qr-panel__note">読み込み後はブックマーク推奨。<br>結果ページのURLが開きます。</p>'
      + '</div>'
      + '<section class="sec" style="display:flex;flex-direction:column;gap:12px">'
      +   '<a class="btn btn--line btn--block" href="#" onclick="return false">' + I.share + ' この内容でLINE相談・予約</a>'
      +   '<a class="btn btn--ghost btn--block" href="#/diagnosis">他の診断をする</a>'
      +   '<p class="note">※ 予約・LINE連携・購入は本番環境で接続予定（デザイン確認用）</p>'
      + '</section>';

    setView(html, { sub: true, tab: 'diagnosis' });
    if (window.NaviQR) window.NaviQR.render($('#qrTarget'), shareUrl, 196);
  }

  // ============================================================
  //  MENU
  // ============================================================
  function viewMenu(cat) {
    cat = cat || 'all';
    var seg = '<div class="seg"><button class="seg__b' + (cat === 'all' ? ' active' : '') + '" data-cat="all">すべて</button>'
      + DB.menus.categories.map(function (c) { return '<button class="seg__b' + (cat === c.id ? ' active' : '') + '" data-cat="' + c.id + '">' + esc(c.label) + '</button>'; }).join('')
      + '</div>';
    var rows = DB.menus.menus.filter(function (m) { return cat === 'all' || m.category === cat; }).map(function (m) {
      var tags = (m.points || []).map(function (p) { return '<span class="mtag">' + esc(p) + '</span>'; }).join('');
      return '<a class="mrow" href="#/menu">'
        + '<div class="mrow__sw cover ' + coverOf(menuIndex(m.id)) + '"><span class="cover__motif" style="width:54px;height:54px;right:2px;bottom:2px">' + (m.category === 'esthe' ? MOTIF.drop : MOTIF.brow) + '</span></div>'
        + '<div class="mrow__b"><div class="mrow__name">' + esc(m.name) + '</div>'
        +   '<div class="mrow__sum">' + esc(m.summary) + '</div>'
        +   '<div class="mrow__foot"><span class="mrow__price">' + esc(m.price) + '</span><span class="mrow__dur">' + esc(m.duration) + '</span></div>'
        +   '<div class="mtags">' + tags + '</div>'
        + '</div></a>';
    }).join('');
    var html = '<div class="page-head"><div class="kicker">Treatment</div><h1 class="page-head__title">メニュー</h1>'
      + '<p class="page-head__sub">アートメイク・エステの施術メニュー一覧です。</p></div>'
      + seg + '<div>' + rows + '</div>'
      + '<p class="note">※ 料金・内容はサンプルです（デザイン確認用）。予約導線は本番接続予定。</p>';
    setView(html, { tab: 'menu' });
    $$('.seg__b').forEach(function (b) { b.addEventListener('click', function () { viewMenu(this.getAttribute('data-cat')); }); });
  }

  // ============================================================
  //  PRODUCTS
  // ============================================================
  function viewProduct(id) {
    var p = getProduct(id); if (!p) { go('#/products'); return; }
    var rel = p.related ? getDiag(p.related) : null;
    var html = '<article class="pd">'
      + '<div class="pd__cover cover ' + coverOf(productIndex(p.id)) + '"><span class="cover__motif" style="width:140px;height:140px">' + MOTIF.bottle + '</span></div>'
      + '<div class="pd__head"><div class="pd__cat">' + esc(p.tag) + '</div>'
      +   '<h1 class="pd__name">' + esc(p.name) + '</h1>'
      +   '<div class="pd__price">' + esc(p.price) + '<span class="pd__tax">税込</span></div></div>'
      + '<p class="pd__detail">' + esc(p.detail || p.summary) + '</p>'
      + '<div class="pd__rows">'
      +   (p.effect ? '<div class="pd__row"><span class="pd__lb">効果</span><span class="pd__tx">' + esc(p.effect) + '</span></div>' : '')
      +   (p.howto ? '<div class="pd__row"><span class="pd__lb">使い方</span><span class="pd__tx">' + esc(p.howto) + '</span></div>' : '')
      + '</div>';
    if (rel) {
      html += '<a class="pd__rel" href="#/diagnosis/' + rel.id + '">'
        + '<div class="pd__rel-b"><span class="pd__rel-lb">関連する診断</span><span class="pd__rel-t">' + esc(rel.title) + '</span></div>'
        + '<span class="pd__rel-go">' + I.arrow + '</span></a>';
    }
    html += '<div class="pd__cta">'
      + '<a class="btn btn--fill btn--block" href="#" onclick="return false">' + I.bag + ' カートに入れる</a>'
      + '<a class="btn btn--line btn--block" href="#" onclick="return false">LINEで相談</a>'
      + '</div>'
      + '<p class="note">※ 価格はサンプルです。カート/決済は本番環境で接続予定（デザイン確認用）</p>'
      + '</article>';
    setView(html, { sub: true, tab: 'products' });
  }

  function viewProducts() {
    var grid = DB.products.map(function (p, i) {
      return '<a class="pcard" href="#/products/' + p.id + '"><div class="pcard__img cover ' + coverOf(i) + '"><span class="cover__motif">' + MOTIF.bottle + '</span></div>'
        + '<div class="pcard__cat">' + esc(p.tag) + '</div>'
        + '<div class="pcard__name">' + esc(p.name) + '</div>'
        + '<div class="pcard__sum">' + esc(p.summary) + '</div>'
        + '<div class="pcard__price">' + esc(p.price) + '</div></a>';
    }).join('');
    var html = '<div class="page-head"><div class="kicker">Online Shop</div><h1 class="page-head__title">商品</h1>'
      + '<p class="page-head__sub">Naviおすすめの美容アイテム。施術後のホームケアにも。</p></div>'
      + '<div class="pgrid">' + grid + '</div>'
      + '<p class="note">※ 商品・価格はサンプルです（デザイン確認用）。カート/決済は本番接続予定。</p>';
    setView(html, { tab: 'products' });
  }

  // ============================================================
  //  TIPS / JOURNAL
  // ============================================================
  function viewTips() {
    var facts = DB.tips.facts.map(function (f, i) {
      return '<div class="fact"><span class="fact__no">' + pad2(i + 1) + '</span><span class="fact__t">' + esc(f) + '</span></div>';
    }).join('');
    var rows = DB.tips.columns.map(function (c, i) {
      return '<a class="jrow" href="#/tips/' + c.id + '">'
        + '<div class="jrow__img cover ' + coverOf(i + 1) + '"><span class="cover__motif" style="width:56px;height:56px;right:2px;bottom:2px">' + MOTIF.brow + '</span></div>'
        + '<div class="jrow__b"><div class="jrow__tag">' + esc(c.tag) + '</div>'
        +   '<div class="jrow__title">' + esc(c.title) + '</div>'
        +   '<div class="jrow__meta">Read · 約' + c.minutes + ' min</div></div></a>';
    }).join('');
    var html = '<div class="page-head"><div class="kicker">Journal</div><h1 class="page-head__title">読みもの</h1>'
      + '<p class="page-head__sub">知っておくと役立つ、眉とアートメイクのこと。</p></div>'
      + '<section class="sec sec--tight"><div class="kicker" style="margin-bottom:6px">Mini Knowledge</div><h2 class="sec-title" style="font-size:1.25rem">眉毛の豆知識</h2></section>'
      + '<div class="facts">' + facts + '</div>'
      + '<section class="sec"><div class="kicker" style="margin-bottom:6px">Column</div><h2 class="sec-title" style="font-size:1.25rem">コラム</h2></section>'
      + '<div class="jlist">' + rows + '</div>';
    setView(html, { tab: 'tips' });
  }

  function viewNews() {
    var rows = DB.news.map(function (n) {
      return '<a class="jrow" href="#" onclick="return false">'
        + '<div class="jrow__img cover cover--' + esc(n.cover) + '"></div>'
        + '<div class="jrow__b"><div class="jrow__tag">' + esc(n.cat) + ' · ' + esc(n.date) + '</div>'
        +   '<div class="jrow__title">' + esc(n.title) + '</div>'
        +   '<div class="jrow__meta" style="text-transform:none;letter-spacing:0">' + esc(n.lead) + '</div></div></a>';
    }).join('');
    var html = '<div class="page-head"><div class="kicker">News</div><h1 class="page-head__title">お知らせ</h1>'
      + '<p class="page-head__sub">Naviからの最新情報・キャンペーン。</p></div>'
      + '<div class="jlist">' + rows + '</div>'
      + '<p class="note">※ お知らせ詳細は本番環境で接続予定（デザイン確認用）</p>';
    setView(html, { sub: true, tab: 'home' });
  }

  function viewColumn(id) {
    var c = getColumn(id); if (!c) { go('#/tips'); return; }
    var idx = 0; DB.tips.columns.forEach(function (x, i) { if (x.id === id) idx = i; });
    var body = c.body.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
    var html = '<article class="article">'
      + '<div class="article__cover cover ' + coverOf(idx + 1) + '"><span class="cover__motif" style="width:120px;height:120px">' + MOTIF.brow + '</span></div>'
      + '<div class="article__tag">' + esc(c.tag) + '</div>'
      + '<h1 class="article__title">' + esc(c.title) + '</h1>'
      + '<p class="article__sub">' + esc(c.subtitle) + '</p>'
      + '<div class="article__meta">Navi Journal · 約' + c.minutes + ' min read</div>'
      + '<hr class="hairline">'
      + '<p class="article__lead">' + esc(c.lead) + '</p>'
      + body
      + '<a class="btn btn--fill btn--block" style="margin-top:14px" href="#/diagnosis">' + I.scan + ' 自分に合う施術を診断する</a>'
      + '</article>';
    setView(html, { sub: true, tab: 'tips' });
  }

  // ============================================================
  //  ルーター
  // ============================================================
  function go(hash) { if (location.hash === hash) route(); else location.hash = hash; }
  function route() {
    var h = location.hash.replace(/^#/, '') || '/';
    var p = h.split('/').filter(Boolean);
    var head = p[0] || '';
    if (head === '') return viewHome();
    if (head === 'diagnosis') return p[1] ? startQuiz(p[1]) : viewDiagList();
    if (head === 'r') return viewResult(p.slice(1).join('/'));
    if (head === 'menu') return viewMenu(p[1]);
    if (head === 'products') return p[1] ? viewProduct(p[1]) : viewProducts();
    if (head === 'news') return viewNews();
    if (head === 'tips') return p[1] ? viewColumn(p[1]) : viewTips();
    return viewHome();
  }

  // ============================================================
  //  シェル / 初期化
  // ============================================================
  function onScroll() {
    var hd = $('.app-header'); if (hd) hd.classList.toggle('solid', window.scrollY > 8);
  }
  function bindShell() {
    var b = $('#backBtn'); if (b) b.addEventListener('click', function () { if (history.length > 1) history.back(); else go('#/'); });
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  window.addEventListener('hashchange', route);
  document.addEventListener('DOMContentLoaded', function () {
    bindShell();
    loadData().then(route).catch(function (e) {
      console.error('[init]', e);
      main().innerHTML = '<section class="sec" style="text-align:center"><p class="hero__lead">データの読み込みに失敗しました。ローカルサーバー経由で開いてください。</p></section>';
    });
  });
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }
})();
