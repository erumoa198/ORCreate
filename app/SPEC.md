# Navi Beauty App — 設計ドキュメント（PC実装者向け）

このセッションで作成した「土台」を、PCで実装・本番接続するためのリファレンス。

---

## 1. これは何か
- **診断チャートを主役にした、商品紹介アプリ**（待ち時間にSNS感覚で見る軽いアプリ）。
- 体験の背骨：**診断 → タイプの特徴・対策 → 解決する商品（理由・効果）→ QRで保存**。
- フレームワーク非依存の静的Web（Vanilla JS）。ビルド不要。`app/` だけで完結し、削除すれば跡形なく消える。

## 2. 技術スタック / 方針
- HTML + CSS + Vanilla JS（依存はQR生成ライブラリのみ：`js/vendor/qrcode.js`, MIT）。
- ハッシュルーティングの単一ページ（SPA）。バックエンド不要。
- フォントは `app/fonts/` に自己ホスト（外部CDN非依存）。
- PWA対応（`manifest.webmanifest` + `sw.js`）。
- データ駆動：画面の中身はすべて `data/*.json`。

## 3. 画面 / ルーティング（`js/app.js` の `route()`）
| ハッシュ | 画面 | 関数 |
|---|---|---|
| `#/` | ホーム（診断スタート＋情報フィード） | `viewHome` |
| `#/diagnosis` | 診断一覧 | `viewDiagList` |
| `#/diagnosis/<id>` | 診断（1問1画面・没入） | `startQuiz`→`renderQuiz` |
| `#/r/<encoded>` | 診断結果（共有可・QR） | `viewResult` |
| `#/menu` `#/menu/<cat>` | メニュー | `viewMenu` |
| `#/products` | 商品一覧 | `viewProducts` |
| `#/products/<id>` | 商品詳細（効果・使い方・関連診断） | `viewProduct` |
| `#/tips` `#/tips/<id>` | 読みもの一覧 / 記事 | `viewTips` / `viewColumn` |
| `#/news` | お知らせ | `viewNews` |

## 4. 診断エンジン（2モード）
`data/diagnoses.json` の各診断は2種類。

### (a) 通常モード（スコア式）
- 各選択肢 `scores: { 結果ID: 重み }` を合計し、最高得点の結果を表示。
- 結果：`title / catch / feature(特徴) / advice[](対策) / picks[](解決商品) / menus[](関連メニュー)`。
- `picks[]` = `{ id(商品ID), reason(理由), effect(効果) }` … 結果画面の主役。

### (b) パーソナルモード（MBTI風）`"mode": "persona"`
- `axes[]`（4軸）と、各選択肢 `axis: { 文字: 1 }` を集計。
- 軸ごとに優勢な極の文字でタイプコード（例 `NMSE`）と各軸の割合(%)を算出。
- **軸1×軸3**で基本タイプ（例 `NS`）を決め、`results[]` から該当を表示。
- 結果画面はタイプコード＋4軸バー＋特徴/対策/解決商品。
- 質問に `section`（項目名）を付けると、診断中に項目見出しを表示（項目別進行）。

> 診断を増やす：`diagnoses` 配列にブロックを追加するだけ（既存6種が参考）。商品/メニューは `products.json` / `menus.json` のIDで紐付け。

## 5. 結果の共有・QRの仕組み
- 結果は `#/r/<base64>` に内包（通常: `{d,r}` / persona: `{d,r,c,p}`）。
- QRはこの結果URLを指す → **バックエンドなしで再表示**。
- `viewResult` 内 `shareUrl = location.origin + location.pathname + '#/r/'+enc`。

## 6. データファイル（`app/data/`）
| ファイル | 役割 |
|---|---|
| `diagnoses.json` | 診断（質問・スコア/軸・結果・picks） |
| `products.json` | 商品（`detail/effect/howto/related`＝関連診断ID） |
| `menus.json` | 施術メニュー（`categories` + `menus`） |
| `tips.json` | 豆知識（`facts`）＋コラム（`columns`） |
| `news.json` | お知らせ/バナー（`cover`＝デュオトーン種別） |

## 7. デザインシステム（`css/app.css`）
- カラートークンは `:root`（`--bg / --ink / --accent(=ダスティクレイローズ) / --line(=LINE緑)` 等）。
- フォント：`--serif-en`(Cormorant) / `--serif-jp`(Shippori Mincho) / `--sans`(Zen Kaku) / `--sans-en`(Inter)。
- 写真の代替＝`.cover.cover--{rose|clay|sage|plum|sand}`（デュオトーン＋グレイン）。**本番は `background-image` に実写を入れるだけ**で画像主導に。
- 絵文字は不使用。アイコンは `js/app.js` の `I`（SVG）と `MOTIF`（ラインアート）。

## 8. 本番接続するポイント（現在はプレースホルダ／画面に「デザイン確認用」注記）
- **検索**：ホームの `.search`（現状ダミー）→ 実検索（診断/メニュー/商品/コラム横断）。
- **LINE**：各 `LINEで相談` ボタン → LINE公式アカウント / LIFF。
- **予約**：結果・メニューの予約導線 → 予約システム。
- **EC**：商品詳細 `カートに入れる` → カート/決済（Shopify等）。`products.json` を実データへ。
- **お知らせ/詳細**：`news.json` → CMSや詳細ページ。
- **解析**：診断完了・結果・商品クリックを計測（どの悩み/タイプ/商品が人気か）。

## 9. ローカル実行 / 単一HTML
- ローカル：`cd app && python3 -m http.server 8123`（または VS Code「Live Server」）。
- 単一HTML：`python3 app/build-standalone.py` → `app/navi-beauty-standalone.html`（サーバー不要・`file://`可）。

## 10. 今後の拡張アイデア
- 会員/マイページ（診断履歴・お気に入り・リタッチ時期通知）。
- クーポンQR発行、Before/Afterギャラリー、多言語（インバウンド）、AIカウンセリング、顔写真シミュレーション。
- ネイティブアプリ化（Capacitor等でラップ → ストア配信、プッシュ通知）。
