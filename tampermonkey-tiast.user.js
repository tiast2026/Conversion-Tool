// ==UserScript==
// @name         TIAST → 楽天変換ツール連携
// @namespace    https://tiast2026.github.io/
// @version      2.0
// @description  TIAST管理画面の詳細ページから商品情報を読み取り変換ツールへ送信
// @match        *://tiast.rakusuru.space/*
// @grant        GM_openInTab
// ==/UserScript==

(function() {
  'use strict';

  const TOOL_URL = 'https://tiast2026.github.io/Conversion-Tool/index.html';
  const TOOL_ORIGIN = 'https://tiast2026.github.io';

  // ============================
  // ボタン追加
  // ============================
  function addButton() {
    if (document.getElementById('tiast-rakuten-btn')) return;
    // 詳細ページでなければスキップ
    if (!isDetailPage()) return;

    const btn = document.createElement('button');
    btn.id = 'tiast-rakuten-btn';
    btn.textContent = '🔄 楽天変換ツールで開く';
    btn.style.cssText = 'background:#bf0000; color:white; border:none; padding:10px 20px; border-radius:6px; font-size:14px; font-weight:600; cursor:pointer; position:fixed; top:10px; right:10px; z-index:99999; box-shadow:0 2px 8px rgba(0,0,0,0.3);';
    btn.addEventListener('click', handleConvert);
    document.body.appendChild(btn);
  }

  function isDetailPage() {
    return location.pathname.includes('/detail');
  }

  // ============================
  // 詳細ページからデータを読み取る
  // ============================
  function scrapeDetailPage() {
    const data = {};

    // テーブル内のラベル→値をすべて取得
    // th/td または ラベル要素を探す
    const allCells = document.querySelectorAll('th, td, dt, dd, label, .label, .field-label, .field-value');

    // 方法1: th→td ペアを探す
    const rows = document.querySelectorAll('tr');
    for (const row of rows) {
      const th = row.querySelector('th');
      const td = row.querySelector('td');
      if (th && td) {
        const label = th.textContent.trim();
        if (label) data[label] = td;
      }
    }

    // 方法2: テーブルがない場合、連続するラベル-値ペアを探す
    if (Object.keys(data).length === 0) {
      // div/span ベースのレイアウトを探す
      const allElements = document.querySelectorAll('[class*="label"], [class*="field"], [class*="key"], [class*="value"], [class*="item"]');
      // フォールバック: ページ内のすべてのテキストからキーワードで値を抽出
    }

    return parseScrapedData(data);
  }

  function parseScrapedData(domMap) {
    const product = {
      taskId: getTextValue(domMap, 'タスクID'),
      productNo: getTextValue(domMap, '商品番号'),
      productName: getTextValue(domMap, '商品名'),
      category: getTextValue(domMap, 'カテゴリ'),
      saleDate: getTextValue(domMap, '販売日'),
      endDate: getTextValue(domMap, '終了日'),
      material: getTextValue(domMap, '素材'),
      costPrice: getTextValue(domMap, '仕入金額(円)') || getTextValue(domMap, '仕入金額'),
      sellPrice: getTextValue(domMap, '販売金額(税込)') || getTextValue(domMap, '販売金額'),
      measureSize: getTextValue(domMap, '採寸サイズ'),
      productPoint: getTextValue(domMap, '商品ポイント'),
      spec: getTextValue(domMap, '仕様'),
      modelShootDate: getTextValue(domMap, 'モデル撮影予定日'),
      productionStaff: getTextValue(domMap, '制作担当者'),
      laundryLabel: getTextValue(domMap, '洗濯表記') || getLaundryText(domMap),
      shippingMethod: getShippingMethod(domMap),
      referenceUrl: getTextValue(domMap, '参考URL'),
      assignee: getTextValue(domMap, '依頼担当者'),
      skus: []
    };

    // カラーバリエーションを解析
    product.skus = parseColorVariations(domMap);

    return product;
  }

  function getTextValue(domMap, label) {
    // 完全一致
    if (domMap[label]) return domMap[label].textContent.trim();
    // 部分一致
    for (const key of Object.keys(domMap)) {
      if (key.includes(label)) return domMap[key].textContent.trim();
    }
    return '';
  }

  // 洗濯表記のテキストコードを取得（アイコンの前のテキスト部分）
  function getLaundryText(domMap) {
    const el = domMap['洗濯表記'];
    if (!el) return '';
    // 最初のテキストノードまたはinput/spanの値を取得
    const input = el.querySelector('input, textarea');
    if (input) return input.value || '';
    // テキストノードだけ取得（アイコンを除く）
    let text = '';
    for (const node of el.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) text += node.textContent;
      else if (node.tagName === 'SPAN' || node.tagName === 'DIV') text += node.textContent;
    }
    return text.trim();
  }

  // 配送方法（選択されているラジオボタンの値）
  function getShippingMethod(domMap) {
    const el = domMap['配送方法'];
    if (!el) return '';
    const checked = el.querySelector('input[type="radio"]:checked');
    if (checked) {
      const label = checked.parentElement;
      return label ? label.textContent.trim() : checked.value;
    }
    return el.textContent.trim();
  }

  // カラーバリエーションのDOM解析
  function parseColorVariations(domMap) {
    const skus = [];
    const colorEl = domMap['カラー'];
    if (!colorEl) return skus;

    // カラー欄内の各バリエーション項目を探す
    // 画像の横にカラー名・SKU番号・JANコードが並んでいる構造
    // まず、テキスト全体を取得して解析
    const colorHTML = colorEl.innerHTML;
    const colorText = colorEl.textContent;

    // 方法1: 個別の要素（div, span, img）から解析
    const colorBlocks = colorEl.querySelectorAll('div, span, li, a, p');
    const blockTexts = [];
    for (const block of colorBlocks) {
      const t = block.textContent.trim();
      if (t && !blockTexts.includes(t)) blockTexts.push(t);
    }

    // 方法2: テキスト全体からパターン抽出
    // SKU番号パターン: xxxx-YYMM-CC-S (例: ndpt3957-2604-WH-F)
    const skuPattern = /([a-zA-Z]+\d+[-]\d{4}[-][A-Za-z]+-[A-Za-z0-9]+)/g;
    const skuMatches = colorText.match(skuPattern) || [];

    // JANコードパターン: 大文字英数字のみ (例: NDPT3957WHF00)
    const janPattern = /\b([A-Z]{2,}[A-Z0-9]{6,})\b/g;
    const janMatches = colorText.match(janPattern) || [];

    // カラー名パターン: SKUでもJANでもないテキストブロック
    // カラー名を抽出するため、SKUとJANを除いたテキストを解析

    if (skuMatches.length > 0) {
      for (let i = 0; i < skuMatches.length; i++) {
        const skuNo = skuMatches[i];
        const jan = janMatches[i] || '';

        // SKU番号を分解: ndpt3957-2604-WH-F → colorCode=WH, sizeCode=F
        const parts = skuNo.split('-');
        const colorCode = parts.length >= 3 ? parts[2] : '';
        const sizeCode = parts.length >= 4 ? parts[3] : '';

        // カラー名を探す（SKU番号の前にあるテキスト）
        const colorName = findColorName(colorEl, skuNo, i);

        skus.push({
          skuNo: skuNo,
          color: colorName,
          colorCode: colorCode,
          size: sizeCode,
          jan: jan
        });
      }
    }

    return skus;
  }

  // カラー名をDOM内から探す
  function findColorName(containerEl, skuNo, index) {
    // コンテナ内のテキストノードを走査
    const walker = document.createTreeWalker(containerEl, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      const t = node.textContent.trim();
      if (t && t.length > 0) textNodes.push(t);
    }

    // SKU番号・JANコード以外のテキストをカラー名候補とする
    const skuPattern = /^[a-zA-Z]+\d+[-]\d{4}[-]/;
    const janPattern = /^[A-Z]{2,}[A-Z0-9]{6,}$/;
    const colorNames = textNodes.filter(t =>
      !skuPattern.test(t) &&
      !janPattern.test(t) &&
      t.length < 30 &&
      t !== 'カラー'
    );

    return colorNames[index] || '';
  }

  // ============================
  // データをExcel互換の配列形式に変換
  // ============================
  function buildTableData(product) {
    const headers = [
      'タスクID', '商品番号', '商品名', 'カテゴリ', '販売日', '終了日',
      '素材', 'カラー', 'サイズ', 'JAN',
      '仕入金額(円)', '販売金額(税込)', '採寸サイズ',
      '商品ポイント', '仕様', 'モデル撮影予定日', '制作担当者',
      '洗濯表記', '配送方法', '参考URL', '依頼担当'
    ];

    const rows = [];

    // 商品行（親行）
    const productRow = new Array(headers.length).fill('');
    productRow[0] = product.taskId;
    productRow[1] = product.productNo;
    productRow[2] = product.productName;
    productRow[3] = product.category;
    productRow[4] = product.saleDate;
    productRow[5] = product.endDate;
    productRow[6] = product.material;
    // カラー・サイズ・JANは空（SKU行で設定）
    productRow[10] = product.costPrice;
    productRow[11] = product.sellPrice;
    productRow[12] = product.measureSize;
    productRow[13] = product.productPoint;
    productRow[14] = product.spec;
    productRow[15] = product.modelShootDate;
    productRow[16] = product.productionStaff;
    productRow[17] = product.laundryLabel;
    productRow[18] = product.shippingMethod;
    productRow[19] = product.referenceUrl;
    productRow[20] = product.assignee;
    rows.push(productRow);

    // SKU行（各カラー・サイズ）
    for (const sku of product.skus) {
      const skuRow = new Array(headers.length).fill('');
      skuRow[1] = sku.skuNo;     // 商品番号 = SKU番号
      skuRow[7] = sku.color;      // カラー
      skuRow[8] = sku.size;       // サイズ
      skuRow[9] = sku.jan;        // JAN
      rows.push(skuRow);
    }

    return { headers, rows };
  }

  // ============================
  // メイン処理: DOM読み取り → 変換ツールに送信
  // ============================
  async function handleConvert() {
    const btn = document.getElementById('tiast-rakuten-btn');
    const origText = btn.textContent;
    btn.textContent = '⏳ 読み取り中...';
    btn.disabled = true;

    try {
      // Step 1: ページからデータを読み取る
      const product = scrapeDetailPage();

      if (!product.productNo && !product.productName) {
        alert('商品情報を読み取れませんでした。\n詳細ページで実行してください。');
        btn.textContent = origText;
        btn.disabled = false;
        return;
      }

      // Step 2: Excel互換の配列形式に変換
      const tableData = buildTableData(product);

      console.log('[TIAST→変換ツール] 読み取りデータ:', product);
      console.log('[TIAST→変換ツール] テーブルデータ:', tableData);

      // Step 3: 変換ツールを開く
      btn.textContent = '⏳ 変換ツールに送信中...';
      const toolWindow = window.open(TOOL_URL, 'conversion-tool');

      if (!toolWindow) {
        alert('ポップアップがブロックされました。\nブラウザの設定でポップアップを許可してください。');
        btn.textContent = origText;
        btn.disabled = false;
        return;
      }

      // Step 4: 変換ツールにデータを送信
      let sent = false;
      let timeoutId;

      function onMessage(e) {
        if (e.origin !== TOOL_ORIGIN) return;
        if (e.data && e.data.type === 'ready' && !sent) {
          sent = true;
          toolWindow.postMessage({
            type: 'loadTableData',
            headers: tableData.headers,
            rows: tableData.rows,
            source: 'tiast-detail'
          }, TOOL_ORIGIN);
        }
        if (e.data && e.data.type === 'fileReceived') {
          window.removeEventListener('message', onMessage);
          clearTimeout(timeoutId);
          btn.textContent = '✅ 送信完了';
          setTimeout(() => { btn.textContent = origText; btn.disabled = false; }, 2000);
        }
      }
      window.addEventListener('message', onMessage);

      // フォールバック
      let attempts = 0;
      const fallbackInterval = setInterval(() => {
        if (sent) { clearInterval(fallbackInterval); return; }
        attempts++;
        try {
          toolWindow.postMessage({
            type: 'loadTableData',
            headers: tableData.headers,
            rows: tableData.rows,
            source: 'tiast-detail'
          }, TOOL_ORIGIN);
        } catch(e) {}
        if (attempts > 20) clearInterval(fallbackInterval);
      }, 500);

      timeoutId = setTimeout(() => {
        clearInterval(fallbackInterval);
        window.removeEventListener('message', onMessage);
        if (!sent) alert('変換ツールへの送信がタイムアウトしました。');
        btn.textContent = origText;
        btn.disabled = false;
      }, 15000);

    } catch(e) {
      console.error('[TIAST→変換ツール] エラー:', e);
      alert('エラー: ' + e.message);
      btn.textContent = origText;
      btn.disabled = false;
    }
  }

  // ============================
  // 初期化
  // ============================
  const observer = new MutationObserver(() => addButton());
  observer.observe(document.body, { childList: true, subtree: true });
  addButton();
})();
