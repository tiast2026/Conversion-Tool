# プロジェクト構造レビュー

## 現状の概要

| ファイル | 行数 | サイズ | 役割 |
|---------|------|--------|------|
| `app.js` | 5,248行 | 281KB | 全ビジネスロジック・UI処理 |
| `index.html` | 1,085行 | 78KB | 全UI構造・マスタ設定モーダル |
| `style.css` | 161行 | 15KB | スタイルシート |
| `master-config.json` | 193行 | 11KB | マスタデータ設定 |
| `cloudflare-worker-proxy.js` | 101行 | 4KB | CORSプロキシ |

**ツール概要:** 楽天CSV / 自社Excel → 各モール別CSV（FutureShop, TikTok, ZOZO, Yahoo, Amazon, Qoo10等）に変換するWebアプリケーション（v2.2）

---

## 問題点

### 1. モノリシックな構造（最重要）

`app.js` に全機能が1ファイルに集約されており、保守性・可読性が低い状態です。

**主要セクション:**
| セクション | 行範囲 | 内容 |
|-----------|--------|------|
| グローバル変数 & ジャンルマップ | 1-223 | 静的データ・状態変数 |
| ジャンル・カラー処理 | 106-436 | ジャンル推定、カラー判定 |
| マスタデータ管理 | 440-1250 | GitHub連携、プロファイル、モーダルUI |
| ファイルパース | 1319-1488 | CSV/Excel読み込み |
| データ構造化 | 1492-1779 | 楽天・自社データの正規化 |
| 画像URL生成 | 1669-1782 | 楽天画像パス構築 |
| Step2/3 プレビュー描画 | 1824-3122 | RMS風UI、タブ切替 |
| Step4 ダウンロード & 変換 | 3389-4622 | モール別CSV生成（**最重要ロジック**） |
| API連携 | 4710-5142 | 楽天API、NextEngine API |
| ユーティリティ | 5201-5248 | CSV構築、日付、通知 |

### 2. コード重複

#### タブ切替ロジック（5箇所で重複）
```
switchMasterTab()    → 行 901
switchRakutenTab()   → 行 909
switchS3RmsTab()     → 行 2193
switchRmsTab()       → 行 2297
switchS2RmsTab()     → 行 2883
```
全て同じパターン: 全タブ非アクティブ化 → 対象タブをアクティブ化

#### 変換関数（7つの類似関数）
```
convertToRakuten()      → 行 3623（最大・最複雑）
convertToFutureshop()   → 行 4001（4シート出力）
convertToTiktok()       → 行 4284
convertToZozo()         → 行 4313（スタブ状態）
convertToRakufashion()  → 行 4340（スタブ状態）
convertToYahoo()        → 行 4428
convertToAmazon()       → 行 4476
convertToQoo10()        → 行 4522
```
全て同じパターン: ヘッダー定義 → 商品ループ → 行データ構築

#### フィールド編集ハンドラ（3箇所で重複）
```
onRmsEdit()    → 行 2336（40行のswitch文）
onFieldEdit()  → 行 3296
onSkuEdit()    → 行 3301
```

### 3. グローバル状態管理

```javascript
let sourceType = 'rakuten';  // グローバル
let rawRows = [];            // グローバル
let headers = [];            // グローバル
let products = [];           // グローバル
let editedFields = {};       // グローバル
let CI = {};                 // グローバル
```

状態管理の仕組みがなく、全てグローバル変数に依存しています。

### 4. インラインスタイルの多用

`index.html` 内に大量のインラインスタイルが存在し、`style.css`（161行）とスタイルが分散しています。

### 5. テスト・ビルドツールの不在

- テストコードなし
- モジュールバンドラーなし
- リンター/フォーマッター設定なし

---

## 改善提案

### Phase 1: ファイル分割（影響小・効果大）

現在の `app.js` を機能単位で分割し、`<script>` タグで順番に読み込む方法。ビルドツール不要。

```
js/
├── config.js          # GENRE_MAP、定数、グローバル設定
├── master.js          # マスタデータ管理、GitHub連携、プロファイル
├── parser.js          # CSV/Excelパース、データ構造化
├── images.js          # 画像URL生成ロジック
├── ui-preview.js      # Step2/3 プレビュー描画
├── ui-common.js       # タブ切替、ナビゲーション、通知
├── convert-rakuten.js # 楽天CSV変換
├── convert-fs.js      # FutureShop変換
├── convert-others.js  # TikTok, Yahoo, Amazon, Qoo10等
├── api.js             # 楽天API、NextEngine API連携
└── utils.js           # ユーティリティ関数
```

**メリット:** 現在のコードをほぼそのまま分割可能。段階的に実行できる。

### Phase 2: 重複コードの共通化

#### タブ切替の共通関数化
```javascript
function switchTab(containerId, tabId, activeClass = 'active') {
  const container = document.getElementById(containerId);
  container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove(activeClass));
  container.querySelectorAll('.tab-pane').forEach(p => p.classList.remove(activeClass));
  // ... activate target
}
```

#### 変換関数のテンプレート化
```javascript
// モール設定を宣言的に定義
const MALL_FORMATS = {
  tiktok:  { headers: [...], rowBuilder: (prod) => [...] },
  yahoo:   { headers: [...], rowBuilder: (prod) => [...] },
  amazon:  { headers: [...], rowBuilder: (prod) => [...] },
};

function convertToMall(mallKey) {
  const fmt = MALL_FORMATS[mallKey];
  return products.map(prod => fmt.rowBuilder(prod));
}
```

### Phase 3: 状態管理の改善（将来的）

```javascript
// 簡易ストア
const AppState = {
  sourceType: 'rakuten',
  rawRows: [],
  headers: [],
  products: [],
  editedFields: {},
  CI: {},

  update(key, value) {
    this[key] = value;
    this.notify(key);
  },
  // ...
};
```

### Phase 4: インラインスタイルの整理

`index.html` 内のインラインスタイルを `style.css` に統合。コンポーネント単位でCSSクラスを定義。

---

## 優先度マトリクス

| 改善項目 | 効果 | 工数 | 優先度 |
|---------|------|------|--------|
| ファイル分割（Phase 1） | 高 | 中 | **最優先** |
| タブ切替の共通化 | 中 | 小 | 高 |
| 変換関数のテンプレート化 | 高 | 中 | 高 |
| インラインスタイル整理 | 中 | 中 | 中 |
| 状態管理の改善 | 高 | 大 | 低（将来） |
| テスト導入 | 高 | 大 | 低（将来） |

---

## まとめ

現在のプロジェクトは機能的には十分動作していますが、`app.js` の5,248行一枚岩構造が最大の課題です。**Phase 1のファイル分割**から着手することで、ビルドツールの導入なしに保守性を大幅に改善できます。変換関数の共通化（Phase 2）は、新しいモール対応時の開発効率を向上させます。
