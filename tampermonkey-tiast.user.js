// ==UserScript==
// @name         TIAST → 楽天変換ツール連携
// @namespace    https://tiast2026.github.io/
// @version      5.0
// @description  一覧ページからExcelをダウンロードして変換ツールに送信
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
  // ボタン追加
  // ============================
  function addButton() {
    if (document.getElementById('tiast-rakuten-btn')) return;

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
    btn.addEventListener('click', handleExcelSend);

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

  // ============================
  // ダウンロードURL検出
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

  // ============================
  // Excel ダウンロード
  // ============================
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
  // メイン処理
  // ============================
  async function handleExcelSend() {
    const btn = document.getElementById('tiast-rakuten-btn');
    const origText = btn.textContent;
    btn.disabled = true;

    try {
      // URL取得
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

      // ダウンロード
      btn.textContent = '⏳ Excel取得中...';
      const arrayBuffer = await downloadExcel(downloadUrl);

      // 変換ツールを開く
      btn.textContent = '⏳ 変換ツールに送信中...';
      const toolWindow = window.open(TOOL_URL, 'conversion-tool');

      if (!toolWindow) {
        alert('ポップアップがブロックされました。');
        btn.textContent = origText;
        btn.disabled = false;
        return;
      }

      // 送信
      const dataArray = Array.from(new Uint8Array(arrayBuffer));
      const message = {
        type: 'loadExcelFile',
        data: dataArray,
        fileName: 'tiast_download.xlsx'
      };

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
          btn.textContent = '✅ 送信完了';
          setTimeout(() => { btn.textContent = origText; btn.disabled = false; }, 2000);
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
      }, 15000);

    } catch(e) {
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
