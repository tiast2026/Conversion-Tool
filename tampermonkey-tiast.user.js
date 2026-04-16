// ==UserScript==
// @name         TIAST → 楽天変換ツール連携
// @namespace    https://tiast2026.github.io/
// @version      1.0
// @description  TIAST管理画面から変換ツールへExcelを自動送信
// @match        https://tiast.rakusuru.space/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @connect      tiast.rakusuru.space
// ==/UserScript==

(function() {
  'use strict';

  // 変換ツールのURL
  const TOOL_URL = 'https://tiast2026.github.io/Conversion-Tool/index.html';

  // ダウンロードボタンの近くに「楽天変換」ボタンを追加
  function addButton() {
    // 既にボタンがあれば追加しない
    if (document.getElementById('tiast-rakuten-btn')) return;

    // ダウンロードボタンを探す
    const downloadBtns = document.querySelectorAll('button, a, .btn');
    let targetArea = null;
    for (const btn of downloadBtns) {
      if (btn.textContent.includes('ダウンロード')) {
        targetArea = btn.parentElement;
        break;
      }
    }

    // 見つからなければページ上部に固定表示
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

  // 「商品登録用」ダウンロードのURLを検出
  function detectDownloadUrl() {
    // ドロップダウン内のリンクを探す
    const links = document.querySelectorAll('a[href], button[data-url], [onclick]');
    for (const el of links) {
      const text = el.textContent.trim();
      if (text === '商品登録用') {
        // hrefがあればそのURL
        if (el.href) return el.href;
        // data-url属性
        if (el.dataset.url) return el.dataset.url;
        // onclick属性から抽出
        const onclick = el.getAttribute('onclick') || '';
        const urlMatch = onclick.match(/['"]([^'"]*download[^'"]*)['"]/i);
        if (urlMatch) return urlMatch[1];
      }
    }
    return null;
  }

  // ダウンロード→変換ツールに送信
  async function handleRakutenConvert() {
    const btn = document.getElementById('tiast-rakuten-btn');
    const origText = btn.textContent;
    btn.textContent = '⏳ ダウンロード中...';
    btn.disabled = true;

    try {
      // Step 1: ダウンロードURLを検出
      // まず「ダウンロード」ドロップダウンを開いて「商品登録用」リンクを探す
      let downloadUrl = detectDownloadUrl();

      if (!downloadUrl) {
        // ドロップダウンを開いてみる
        const dropdowns = document.querySelectorAll('[data-toggle="dropdown"], .dropdown-toggle, button');
        for (const dd of dropdowns) {
          if (dd.textContent.includes('ダウンロード')) {
            dd.click();
            await new Promise(r => setTimeout(r, 300));
            break;
          }
        }
        downloadUrl = detectDownloadUrl();
      }

      if (!downloadUrl) {
        // 検出できなかった場合はユーザーに入力してもらう
        downloadUrl = prompt(
          '「商品登録用」のダウンロードURLを入力してください。\n\n' +
          '確認方法: ブラウザのDevTools(F12)を開き、\n' +
          '「商品登録用」をクリックしてNetworkタブでURLを確認してください。'
        );
        if (!downloadUrl) {
          btn.textContent = origText;
          btn.disabled = false;
          return;
        }
        // 次回のためにlocalStorageに保存
        localStorage.setItem('tiast_download_url', downloadUrl);
      }

      // Step 2: Excelをダウンロード
      btn.textContent = '⏳ Excelを取得中...';
      const response = await fetch(downloadUrl, { credentials: 'include' });
      if (!response.ok) throw new Error('ダウンロード失敗: HTTP ' + response.status);
      const arrayBuffer = await response.arrayBuffer();

      // Step 3: 変換ツールを開いてファイルを送信
      btn.textContent = '⏳ 変換ツールに送信中...';
      const toolWindow = window.open(TOOL_URL, 'conversion-tool');

      // 変換ツールの読み込みを待ってからpostMessage
      const sendFile = () => {
        toolWindow.postMessage({
          type: 'loadExcelFile',
          arrayBuffer: arrayBuffer,
          fileName: 'tiast_download.xlsx'
        }, '*');
      };

      // ページ読み込み完了を待つ（最大10秒）
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        try {
          sendFile();
        } catch(e) { /* cross-origin, retry */ }
        if (attempts > 20) {
          clearInterval(interval);
          alert('変換ツールへの送信に失敗しました。手動でファイルをアップロードしてください。');
        }
      }, 500);

      // 変換ツール側で受信したら通知
      window.addEventListener('message', function onAck(e) {
        if (e.data && e.data.type === 'fileReceived') {
          clearInterval(interval);
          window.removeEventListener('message', onAck);
          btn.textContent = '✅ 送信完了';
          setTimeout(() => { btn.textContent = origText; btn.disabled = false; }, 2000);
        }
      });

      // タイムアウト後にボタンリセット
      setTimeout(() => {
        btn.textContent = origText;
        btn.disabled = false;
      }, 12000);

    } catch(e) {
      alert('エラー: ' + e.message);
      btn.textContent = origText;
      btn.disabled = false;
    }
  }

  // ページ読み込み後にボタンを追加（DOMの変更にも対応）
  const observer = new MutationObserver(() => addButton());
  observer.observe(document.body, { childList: true, subtree: true });
  addButton();
})();
