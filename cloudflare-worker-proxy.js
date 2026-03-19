// Cloudflare Workers - API プロキシ（楽天RMS / ネクストエンジン対応）
//
// 使い方:
// 1. https://workers.cloudflare.com でアカウント作成（無料）
// 2. ダッシュボード → Workers & Pages → Create → Create Worker
// 3. このコードを貼り付けて「Deploy」
// 4. 発行されたURL（例: https://rms-proxy.your-name.workers.dev/）を
//    ツールのマスタ設定 > RMS API認証情報 > CORSプロキシURL に入力
//
// セキュリティ:
// - ALLOWED_ORIGINS にあなたのGitHub PagesのURLを設定してください
// - 許可されたAPI以外へのリクエストは拒否します

const ALLOWED_ORIGINS = [
  'https://tiast2026.github.io',  // ← あなたのGitHub PagesのURLに変更
  'http://localhost:3000',         // ローカル開発用
  'http://127.0.0.1:5500'         // VS Code Live Server用
];

// 許可するAPIホスト
const ALLOWED_HOSTS = {
  'api.rms.rakuten.co.jp': 'https://api.rms.rakuten.co.jp',
  'api.next-engine.org': 'https://api.next-engine.org'
};

export default {
  async fetch(request) {
    // プリフライトリクエスト（OPTIONS）の処理
    if (request.method === 'OPTIONS') {
      return handleCORS(request, new Response(null, { status: 204 }));
    }

    const origin = request.headers.get('Origin') || '';

    // オリジンチェック
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return new Response('Forbidden: Origin not allowed', { status: 403 });
    }

    // リクエストURLからパスを取得
    const url = new URL(request.url);

    // X-Target-Host ヘッダーでターゲットを指定（デフォルト: 楽天RMS）
    const targetHost = request.headers.get('X-Target-Host') || 'api.rms.rakuten.co.jp';
    const targetBase = ALLOWED_HOSTS[targetHost];

    if (!targetBase) {
      return handleCORS(request, new Response(
        JSON.stringify({ error: 'Target host not allowed: ' + targetHost }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      ));
    }

    const targetUrl = targetBase + url.pathname + url.search;

    // リクエストヘッダーをコピー（不要なヘッダーは除外）
    const headers = new Headers();
    for (const [key, value] of request.headers.entries()) {
      if (['host', 'origin', 'referer', 'x-target-host'].includes(key.toLowerCase())) continue;
      headers.set(key, value);
    }

    try {
      // APIにリクエストを転送
      const response = await fetch(targetUrl, {
        method: request.method,
        headers: headers,
        body: ['GET', 'HEAD'].includes(request.method) ? null : request.body
      });

      // レスポンスにCORSヘッダーを追加
      return handleCORS(request, new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      }));
    } catch (e) {
      return handleCORS(request, new Response(JSON.stringify({ error: e.message }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      }));
    }
  }
};

function handleCORS(request, response) {
  const origin = request.headers.get('Origin') || '';
  const resp = new Response(response.body, response);

  if (ALLOWED_ORIGINS.includes(origin)) {
    resp.headers.set('Access-Control-Allow-Origin', origin);
  } else {
    resp.headers.set('Access-Control-Allow-Origin', ALLOWED_ORIGINS[0]);
  }

  resp.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  resp.headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Target-Host');
  resp.headers.set('Access-Control-Max-Age', '86400');

  return resp;
}
