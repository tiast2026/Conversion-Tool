// ==UserScript==
// @name         TIAST → 楽天変換ツール連携
// @namespace    https://tiast2026.github.io/
// @version      4.0
// @description  一覧ページからExcel＋全商品SKU情報を自動取得して変換ツールに送信
// @match        *://tiast.rakusuru.space/*
// @grant        GM_xmlhttpRequest
// @connect      tiast.rakusuru.space
// ==/UserScript==

(function() {
  'use strict';

  const TOOL_URL = 'https://tiast2026.github.io/Conversion-Tool/index.html';
  const TOOL_ORIGIN = 'https://tiast2026.github.io';
  const LS_KEY = 'tiast_rakuten_download_url';

  // ============================
  // ボタン追加（一覧ページ）
  // ============================
  function addButton() {
    if (document.getElementById('tiast-rakuten-btn')) return;
    if (!isListPage()) return;

    const allBtns = document.querySelectorAll('button, a, .btn');
    let targetArea = null;
    for (const b of allBtns) {
      if (b.textContent.includes('ダウンロード')) {
        targetArea = b.parentElement;
        break;
      }
    }

    const btn = document.createElement('button');
    btn.id = 'tiast-rakuten-btn';
    btn.textContent = '🔄 楽天変換ツールで開く';
    btn.style.cssText = 'background:#bf0000; color:white; border:none; padding:8px 16px; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer; margin-left:8px;';
    btn.addEventListener('click', handleFullExport);

    if (targetArea) {
      targetArea.appendChild(btn);
    } else {
      btn.style.position = 'fixed';
      btn.style.top = '10px';
      btn.style.right = '10px';
      btn.style.zIndex = '99999';
      btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      document.body.appendChild(btn);
    }
  }

  function isListPage() {
    return location.pathname.includes('/task/');
  }

  // ============================
  // 一覧ページから全商品の詳細ページURLを取得
  // ============================
  function getDetailPageUrls() {
    const urls = [];
    // テーブル内のリンクから詳細ページURLを探す
    const links = document.querySelectorAll('a[href]');
    for (const link of links) {
      const href = link.getAttribute('href') || '';
      // /task/cameras/1234/detail パターン
      if (/\/task\/[^/]+\/\d+\/detail/.test(href)) {
        const fullUrl = new URL(href, location.origin).href;
        if (!urls.includes(fullUrl)) urls.push(fullUrl);
      }
    }

    // リンクが見つからない場合、行の編集ボタンからIDを推測
    if (urls.length === 0) {
      const editLinks = document.querySelectorAll('a[href*="/edit"], a[href*="/detail"]');
      for (const link of editLinks) {
        const href = link.getAttribute('href') || '';
        const match = href.match(/\/task\/([^/]+)\/(\d+)/);
        if (match) {
          const detailUrl = `${location.origin}/task/${match[1]}/${match[2]}/detail`;
          if (!urls.includes(detailUrl)) urls.push(detailUrl);
        }
      }
    }

    // それでも見つからない場合、テーブルの行からリンクを探す
    if (urls.length === 0) {
      const tableRows = document.querySelectorAll('table tbody tr, .table-row, tr');
      for (const row of tableRows) {
        const rowLinks = row.querySelectorAll('a[href]');
        for (const link of rowLinks) {
          const href = link.getAttribute('href') || '';
          const match = href.match(/\/task\/([^/]+)\/(\d+)/);
          if (match) {
            const detailUrl = `${location.origin}/task/${match[1]}/${match[2]}/detail`;
            if (!urls.includes(detailUrl)) urls.push(detailUrl);
          }
        }
      }
    }

    console.log('[TIAST] 詳細ページURL:', urls);
    return urls;
  }

  // ============================
  // 詳細ページHTMLからSKU情報を抽出
  // ============================
  function fetchDetailPage(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: function(res) {
          if (res.status >= 200 && res.status < 300) {
            resolve(res.responseText);
          } else {
            reject(new Error('HTTP ' + res.status));
          }
        },
        onerror: function() { reject(new Error('通信エラー')); }
      });
    });
  }

  function parseSkuFromHtml(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');

    // th→td ペアを取得
    const fieldMap = {};
    const rows = doc.querySelectorAll('tr');
    for (const row of rows) {
      const ths = row.querySelectorAll('th');
      const tds = row.querySelectorAll('td');
      for (let i = 0; i < ths.length && i < tds.length; i++) {
        const label = ths[i].textContent.trim();
        if (label) fieldMap[label] = tds[i];
      }
    }

    const productNo = getTextValue(fieldMap, '商品番号');
    const skus = parseColorVariations(fieldMap);

    return { productNo, skus };
  }

  function getTextValue(map, label) {
    if (map[label]) return map[label].textContent.trim();
    for (const key of Object.keys(map)) {
      if (key.includes(label)) return map[key].textContent.trim();
    }
    return '';
  }

  function parseColorVariations(fieldMap) {
    const skus = [];
    const colorEl = fieldMap['カラー'];
    if (!colorEl) return skus;

    // 各カラーブロック: div.col-3.d-flex > div.flex-fill > span.d-block × 3
    const colorBlocks = colorEl.querySelectorAll('.col-3.d-flex, .col-3');
    for (const block of colorBlocks) {
      const spans = block.querySelectorAll('.d-block');
      if (spans.length < 2) continue; // 最低でもカラー名+SKU番号が必要

      const colorName = spans[0] ? spans[0].textContent.trim() : '';
      const skuNo = spans[1] ? spans[1].textContent.trim() : '';
      const jan = spans[2] ? spans[2].textContent.trim() : '';

      if (!skuNo) continue;

      // SKU番号を分解: ndpt3957-2604-WH-F → colorCode=WH, size=F
      const parts = skuNo.split('-');
      skus.push({
        skuNo: skuNo,
        color: colorName,
        colorCode: parts.length >= 3 ? parts[2] : '',
        size: parts.length >= 4 ? parts[3] : '',
        jan: jan
      });
    }

    return skus;
  }

  // ============================
  // Excel ダウンロード
  // ============================
  function detectDownloadUrl() {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) return saved;

    const links = document.querySelectorAll('a[href], button[data-url], [onclick]');
    for (const el of links) {
      const text = el.textContent.trim();
      if (text === '商品登録用') {
        if (el.href && el.href !== '#' && el.href !== location.href) return el.href;
        if (el.dataset && el.dataset.url) return el.dataset.url;
        const onclick = el.getAttribute('onclick') || '';
        const m = onclick.match(/['"]([^'"]*download[^'"]*)['"]/i);
        if (m) return m[1];
      }
    }
    return null;
  }

  function interceptDownloadUrl() {
    const origFetch = window.fetch;
    window.fetch = function(...args) {
      const url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url);
      if (url && (url.includes('download') || url.includes('export') || url.includes('excel'))) {
        localStorage.setItem(LS_KEY, url);
      }
      return origFetch.apply(this, args);
    };
    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
      if (url && (url.includes('download') || url.includes('export') || url.includes('excel'))) {
        localStorage.setItem(LS_KEY, url);
      }
      return origOpen.apply(this, arguments);
    };
  }

  function downloadExcel(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        responseType: 'arraybuffer',
        onload: function(res) {
          if (res.status >= 200 && res.status < 300) {
            resolve(res.response);
          } else {
            reject(new Error('ダウンロード失敗: HTTP ' + res.status));
          }
        },
        onerror: function() { reject(new Error('ダウンロード通信エラー')); }
      });
    });
  }

  // ============================
  // メイン処理: Excel DL + 全詳細ページSKU取得 → 変換ツール送信
  // ============================
  async function handleFullExport() {
    const btn = document.getElementById('tiast-rakuten-btn');
    const origText = btn.textContent;
    btn.disabled = true;

    try {
      // --- Step 1: Excel DL URL取得 ---
      btn.textContent = '⏳ 準備中...';
      let downloadUrl = detectDownloadUrl();

      if (!downloadUrl) {
        const dropdowns = document.querySelectorAll('[data-toggle="dropdown"], .dropdown-toggle, button');
        for (const dd of dropdowns) {
          if (dd.textContent.includes('ダウンロード')) {
            dd.click();
            await new Promise(r => setTimeout(r, 500));
            break;
          }
        }
        downloadUrl = detectDownloadUrl();
      }

      if (!downloadUrl) {
        downloadUrl = prompt(
          '「商品登録用」のダウンロードURLを入力してください。\n\n' +
          '確認方法:\n' +
          '1. F12 → Networkタブ\n' +
          '2.「ダウンロード」→「商品登録用」をクリック\n' +
          '3. URLをコピー'
        );
        if (!downloadUrl) {
          btn.textContent = origText;
          btn.disabled = false;
          return;
        }
        localStorage.setItem(LS_KEY, downloadUrl);
      }

      // --- Step 2: Excelダウンロード ---
      btn.textContent = '⏳ Excel取得中...';
      const arrayBuffer = await downloadExcel(downloadUrl);
      console.log('[TIAST] Excel取得完了:', arrayBuffer.byteLength, 'bytes');

      // --- Step 3: 全商品の詳細ページからSKU取得 ---
      const detailUrls = getDetailPageUrls();
      const skuMap = {}; // { productNo: [sku, ...] }
      let fetched = 0;

      for (const url of detailUrls) {
        fetched++;
        btn.textContent = `⏳ SKU取得中... (${fetched}/${detailUrls.length})`;
        try {
          const html = await fetchDetailPage(url);
          const { productNo, skus } = parseSkuFromHtml(html);
          if (productNo && skus.length > 0) {
            skuMap[productNo] = skus;
            console.log(`[TIAST] ${productNo}: ${skus.length}件のSKU取得`);
          }
        } catch(e) {
          console.warn('[TIAST] 詳細ページ取得失敗:', url, e.message);
        }
      }

      console.log('[TIAST] SKU取得完了:', Object.keys(skuMap).length, '商品');

      // --- Step 4: 変換ツールに送信 ---
      btn.textContent = '⏳ 変換ツールに送信中...';
      const toolWindow = window.open(TOOL_URL, 'conversion-tool');

      if (!toolWindow) {
        alert('ポップアップがブロックされました。');
        btn.textContent = origText;
        btn.disabled = false;
        return;
      }

      const uint8 = new Uint8Array(arrayBuffer);
      const dataArray = Array.from(uint8);

      const message = {
        type: 'loadExcelWithSkus',
        data: dataArray,
        fileName: 'tiast_download.xlsx',
        skuMap: skuMap
      };

      // 送信
      let done = false;
      let timeoutId;
      function onMessage(e) {
        if (e.origin !== TOOL_ORIGIN) return;
        if (e.data && e.data.type === 'ready' && !done) {
          done = true;
          toolWindow.postMessage(message, TOOL_ORIGIN);
        }
        if (e.data && e.data.type === 'fileReceived') {
          window.removeEventListener('message', onMessage);
          clearTimeout(timeoutId);
          clearInterval(fallback);
          const skuCount = Object.values(skuMap).reduce((sum, arr) => sum + arr.length, 0);
          btn.textContent = `✅ 送信完了（SKU ${skuCount}件）`;
          setTimeout(() => { btn.textContent = origText; btn.disabled = false; }, 3000);
        }
      }
      window.addEventListener('message', onMessage);

      let attempts = 0;
      const fallback = setInterval(() => {
        if (done) { clearInterval(fallback); return; }
        attempts++;
        try { toolWindow.postMessage(message, TOOL_ORIGIN); } catch(e) {}
        if (attempts > 20) clearInterval(fallback);
      }, 500);

      timeoutId = setTimeout(() => {
        clearInterval(fallback);
        window.removeEventListener('message', onMessage);
        btn.textContent = origText;
        btn.disabled = false;
      }, 30000);

    } catch(e) {
      console.error('[TIAST] エラー:', e);
      alert('エラー: ' + e.message);
      btn.textContent = origText;
      btn.disabled = false;
    }
  }

  // ============================
  // 初期化
  // ============================
  interceptDownloadUrl();
  const observer = new MutationObserver(() => addButton());
  observer.observe(document.body, { childList: true, subtree: true });
  addButton();
})();
