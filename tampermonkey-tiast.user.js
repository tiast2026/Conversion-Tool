// ==UserScript==
// @name         TIAST → 楽天変換ツール連携
// @namespace    https://tiast2026.github.io/
// @version      1.1
// @description  TIAST管理画面から変換ツールへExcelを自動送信
// @match        https://tiast.rakusuru.space/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @connect      tiast.rakusuru.space
// ==/UserScript==

(function() {
  'use strict';

  const TOOL_URL = 'https://tiast2026.github.io/Conversion-Tool/index.html';
  const TOOL_ORIGIN = 'https://tiast2026.github.io';
  const LS_KEY = 'tiast_rakuten_download_url';

  // ダウンロードボタンの近くに「楽天変換」ボタンを追加
  function addButton() {
    if (document.getElementById('tiast-rakuten-btn')) return;

    // ダウンロードボタンを探す
    const allBtns = document.querySelectorAll('button, a, .btn');
    let targetArea = null;
    for (const btn of allBtns) {
      if (btn.textContent.includes('ダウンロード')) {
        targetArea = btn.parentElement;
        break;
      }
    }

    const btn = document.createElement('button');
    btn.id = 'tiast-rakuten-btn';
    btn.textContent = '🔄 楽天変換ツールで開く';
    btn.style.cssText = 'background:#bf0000; color:white; border:none; padding:8px 16px; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer; margin-left:8px;';
    btn.addEventListener('click', handleRakutenConvert);

    if (targetArea) {
      targetArea.appendChild(btn);
    } else {
      btn.style.position = 'fixed';
      btn.style.top = '10px';
      btn.style.right = '10px';
      btn.style.zIndex = '99999';
      document.body.appendChild(btn);
    }
  }

  // 「商品登録用」ダウンロードURLを検出
  function detectDownloadUrl() {
    // 1. localStorageに保存済みのURLを確認
    const saved = localStorage.getItem(LS_KEY);
    if (saved) return saved;

    // 2. ページ内のリンク/ボタンから探す
    const links = document.querySelectorAll('a[href], button[data-url], [onclick]');
    for (const el of links) {
      const text = el.textContent.trim();
      if (text === '商品登録用') {
        if (el.href && el.href !== '#' && el.href !== window.location.href) return el.href;
        if (el.dataset && el.dataset.url) return el.dataset.url;
        const onclick = el.getAttribute('onclick') || '';
        const urlMatch = onclick.match(/['"]([^'"]*download[^'"]*)['"]/i);
        if (urlMatch) return urlMatch[1];
      }
    }
    return null;
  }

  // Networkリクエストを監視してダウンロードURLをキャプチャ
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

  // GM_xmlhttpRequestでExcelをダウンロード（Cookie付き）
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
        onerror: function(err) {
          reject(new Error('ダウンロード通信エラー'));
        }
      });
    });
  }

  // メイン処理: ダウンロード → 変換ツールに送信
  async function handleRakutenConvert() {
    const btn = document.getElementById('tiast-rakuten-btn');
    const origText = btn.textContent;
    btn.textContent = '⏳ 準備中...';
    btn.disabled = true;

    try {
      // Step 1: ダウンロードURLを取得
      let downloadUrl = detectDownloadUrl();

      if (!downloadUrl) {
        // ドロップダウンを開いてリンクを探す
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
          '1. F12でDevToolsを開く\n' +
          '2. Networkタブを選択\n' +
          '3. 「商品登録用」をクリック\n' +
          '4. 表示されたリクエストのURLをコピー'
        );
        if (!downloadUrl) {
          btn.textContent = origText;
          btn.disabled = false;
          return;
        }
        localStorage.setItem(LS_KEY, downloadUrl);
      }

      // Step 2: Excelダウンロード
      btn.textContent = '⏳ Excelを取得中...';
      const arrayBuffer = await downloadExcel(downloadUrl);

      // Step 3: 変換ツールを開く
      btn.textContent = '⏳ 変換ツールを起動中...';
      const toolWindow = window.open(TOOL_URL, 'conversion-tool');

      if (!toolWindow) {
        alert('ポップアップがブロックされました。\nブラウザの設定でポップアップを許可してください。');
        btn.textContent = origText;
        btn.disabled = false;
        return;
      }

      // Step 4: 変換ツールの準備完了を待ってからファイルを送信
      btn.textContent = '⏳ 変換ツールに送信中...';

      // ArrayBufferをUint8Arrayに変換（postMessageで確実に転送するため）
      const uint8 = new Uint8Array(arrayBuffer);
      const dataArray = Array.from(uint8);

      let sent = false;
      let timeoutId;

      // 変換ツールからの「準備完了」メッセージを待つ
      function onMessage(e) {
        if (e.origin !== TOOL_ORIGIN) return;

        if (e.data && e.data.type === 'ready' && !sent) {
          // ツールが準備完了 → ファイルを送信
          sent = true;
          toolWindow.postMessage({
            type: 'loadExcelFile',
            data: dataArray,
            fileName: 'tiast_download.xlsx'
          }, TOOL_ORIGIN);
        }

        if (e.data && e.data.type === 'fileReceived') {
          // 受信確認 → 完了
          window.removeEventListener('message', onMessage);
          clearTimeout(timeoutId);
          btn.textContent = '✅ 送信完了';
          setTimeout(() => { btn.textContent = origText; btn.disabled = false; }, 2000);
        }
      }

      window.addEventListener('message', onMessage);

      // フォールバック: readyメッセージが来ない場合は定期的にファイルを送信
      let attempts = 0;
      const fallbackInterval = setInterval(() => {
        if (sent) { clearInterval(fallbackInterval); return; }
        attempts++;
        try {
          toolWindow.postMessage({
            type: 'loadExcelFile',
            data: dataArray,
            fileName: 'tiast_download.xlsx'
          }, TOOL_ORIGIN);
        } catch(e) { /* ignore */ }
        if (attempts > 20) {
          clearInterval(fallbackInterval);
        }
      }, 500);

      // タイムアウト: 15秒
      timeoutId = setTimeout(() => {
        clearInterval(fallbackInterval);
        window.removeEventListener('message', onMessage);
        if (!sent) {
          alert('変換ツールへの送信がタイムアウトしました。\n手動でファイルをアップロードしてください。');
        }
        btn.textContent = origText;
        btn.disabled = false;
      }, 15000);

    } catch(e) {
      alert('エラー: ' + e.message);
      btn.textContent = origText;
      btn.disabled = false;
    }
  }

  // 初期化
  interceptDownloadUrl();
  const observer = new MutationObserver(() => addButton());
  observer.observe(document.body, { childList: true, subtree: true });
  addButton();
})();
