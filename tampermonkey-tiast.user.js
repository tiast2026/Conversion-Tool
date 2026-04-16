// ==UserScript==
// @name         TIAST → 楽天変換ツール連携
// @namespace    https://tiast2026.github.io/
// @version      3.0
// @description  TIAST管理画面から変換ツールへ連携（Excel基本＋詳細ページSKU読み取り）
// @match        *://tiast.rakusuru.space/*
// @grant        none
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

    if (isDetailPage()) {
      addDetailPageButton();
    }
  }

  function isDetailPage() {
    return location.pathname.includes('/detail');
  }

  // 詳細ページ: SKU情報を読み取って送信するボタン
  function addDetailPageButton() {
    const btn = document.createElement('button');
    btn.id = 'tiast-rakuten-btn';
    btn.textContent = '🔄 SKU情報を変換ツールに送信';
    btn.style.cssText = 'background:#bf0000; color:white; border:none; padding:10px 20px; border-radius:6px; font-size:14px; font-weight:600; cursor:pointer; position:fixed; top:10px; right:10px; z-index:99999; box-shadow:0 2px 8px rgba(0,0,0,0.3);';
    btn.addEventListener('click', handleSendSku);
    document.body.appendChild(btn);
  }

  // ============================
  // 詳細ページからSKU情報を読み取る
  // ============================
  function scrapeSkuFromDetail() {
    // th→td ペアからフィールドを取得
    const fieldMap = {};
    const rows = document.querySelectorAll('tr');
    for (const row of rows) {
      const ths = row.querySelectorAll('th');
      const tds = row.querySelectorAll('td');
      // 1行に複数のth-tdペアがある場合も対応
      for (let i = 0; i < ths.length && i < tds.length; i++) {
        const label = ths[i].textContent.trim();
        if (label) fieldMap[label] = tds[i];
      }
    }

    // 商品番号を取得
    const productNo = getTextValue(fieldMap, '商品番号');

    // カラーバリエーションを解析
    const skus = parseColorVariations(fieldMap);

    console.log('[TIAST] fieldMap keys:', Object.keys(fieldMap));
    console.log('[TIAST] 商品番号:', productNo);
    console.log('[TIAST] SKUs:', skus);

    return { productNo, skus };
  }

  function getTextValue(map, label) {
    if (map[label]) return map[label].textContent.trim();
    for (const key of Object.keys(map)) {
      if (key.includes(label)) return map[key].textContent.trim();
    }
    return '';
  }

  // カラーバリエーションのDOM解析
  function parseColorVariations(fieldMap) {
    const skus = [];
    const colorEl = fieldMap['カラー'];
    if (!colorEl) {
      console.log('[TIAST] カラー欄が見つかりません');
      return skus;
    }

    const colorText = colorEl.textContent;
    console.log('[TIAST] カラー欄テキスト:', colorText);
    console.log('[TIAST] カラー欄HTML:', colorEl.innerHTML);

    // SKU番号パターン: 英字+数字-4桁-英字-英数字 (例: ndpt3957-2604-WH-F)
    const skuPattern = /([a-zA-Z]+\d+[-]\d{4}[-][A-Za-z]+-[A-Za-z0-9]+)/g;
    const skuMatches = colorText.match(skuPattern) || [];

    // JANコードパターン: 大文字英数字 6文字以上 (例: NDPT3957WHF00)
    const janPattern = /\b([A-Z]{2,}[A-Z0-9]{6,})\b/g;
    const janMatches = colorText.match(janPattern) || [];

    // カラー名を抽出
    const colorNames = findColorNames(colorEl);

    console.log('[TIAST] SKUマッチ:', skuMatches);
    console.log('[TIAST] JANマッチ:', janMatches);
    console.log('[TIAST] カラー名:', colorNames);

    for (let i = 0; i < skuMatches.length; i++) {
      const skuNo = skuMatches[i];
      const jan = janMatches[i] || '';

      // SKU分解: ndpt3957-2604-WH-F → colorCode=WH, size=F
      const parts = skuNo.split('-');
      const colorCode = parts.length >= 3 ? parts[2] : '';
      const sizeCode = parts.length >= 4 ? parts[3] : '';

      skus.push({
        skuNo: skuNo,
        color: colorNames[i] || '',
        colorCode: colorCode,
        size: sizeCode,
        jan: jan
      });
    }

    return skus;
  }

  // カラー名をDOMから抽出（SKU番号・JANコード以外のテキスト）
  function findColorNames(containerEl) {
    const walker = document.createTreeWalker(containerEl, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      const t = node.textContent.trim();
      if (t && t.length > 0) textNodes.push(t);
    }

    const skuPat = /^[a-zA-Z]+\d+[-]\d{4}[-]/;
    const janPat = /^[A-Z]{2,}[A-Z0-9]{6,}$/;
    const names = textNodes.filter(t =>
      !skuPat.test(t) &&
      !janPat.test(t) &&
      t.length < 30 &&
      t !== 'カラー' &&
      !/^\d+$/.test(t)
    );

    return names;
  }

  // ============================
  // SKU情報を変換ツールに送信
  // ============================
  async function handleSendSku() {
    const btn = document.getElementById('tiast-rakuten-btn');
    const origText = btn.textContent;
    btn.textContent = '⏳ 読み取り中...';
    btn.disabled = true;

    try {
      const { productNo, skus } = scrapeSkuFromDetail();

      if (!productNo) {
        alert('商品番号を読み取れませんでした。');
        btn.textContent = origText;
        btn.disabled = false;
        return;
      }

      if (skus.length === 0) {
        alert('SKU情報（カラー・サイズ）を読み取れませんでした。\nF12 → Console でログを確認してください。');
        btn.textContent = origText;
        btn.disabled = false;
        return;
      }

      console.log('[TIAST→変換ツール] 送信データ:', { productNo, skus });

      // 変換ツールに送信
      btn.textContent = '⏳ 送信中...';

      // 既に開いている変換ツールのウィンドウを探す、なければ開く
      const toolWindow = window.open(TOOL_URL, 'conversion-tool');

      if (!toolWindow) {
        alert('ポップアップがブロックされました。\nブラウザの設定でポップアップを許可してください。');
        btn.textContent = origText;
        btn.disabled = false;
        return;
      }

      let done = false;
      let timeoutId;

      function onMessage(e) {
        if (e.origin !== TOOL_ORIGIN) return;

        if (e.data && (e.data.type === 'ready' || e.data.type === 'pong') && !done) {
          done = true;
          toolWindow.postMessage({
            type: 'addSkuData',
            productNo: productNo,
            skus: skus
          }, TOOL_ORIGIN);
        }

        if (e.data && e.data.type === 'skuReceived') {
          window.removeEventListener('message', onMessage);
          clearTimeout(timeoutId);
          const msg = e.data.matched
            ? `✅ ${productNo} にSKU ${skus.length}件を追加`
            : `⚠️ ${productNo} が見つかりません（先にExcelを読み込んでください）`;
          btn.textContent = msg;
          setTimeout(() => { btn.textContent = origText; btn.disabled = false; }, 3000);
        }
      }

      window.addEventListener('message', onMessage);

      // フォールバック: 0.5秒ごとに送信試行
      let attempts = 0;
      const fallback = setInterval(() => {
        if (done) { clearInterval(fallback); return; }
        attempts++;
        try {
          toolWindow.postMessage({
            type: 'addSkuData',
            productNo: productNo,
            skus: skus
          }, TOOL_ORIGIN);
        } catch(e) {}
        if (attempts > 20) clearInterval(fallback);
      }, 500);

      timeoutId = setTimeout(() => {
        clearInterval(fallback);
        window.removeEventListener('message', onMessage);
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
