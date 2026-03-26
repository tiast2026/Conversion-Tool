// ============================================================
// GLOBALS
// ============================================================
let sourceType = 'rakuten';
let rawRows = [];
let headers = [];
let products = [];
let editedFields = {};
let CI = {};

// 楽天ジャンルID → ジャンル名パス（静的マップ）
const GENRE_MAP = {
  '303656': 'レディースファッション > トップス > Tシャツ・カットソー',
  '566018': 'レディースファッション > トップス > タンクトップ',
  '206471': 'レディースファッション > トップス > シャツ・ブラウス',
  '409352': 'レディースファッション > トップス > ポロシャツ',
  '303662': 'レディースファッション > トップス > キャミソール',
  '303655': 'レディースファッション > トップス > ベアトップ・チューブトップ',
  '403871': 'レディースファッション > トップス > カーディガン・ボレロ',
  '403890': 'レディースファッション > トップス > ベスト・ジレ',
  '303699': 'レディースファッション > トップス > アンサンブル',
  '566028': 'レディースファッション > トップス > ニット・セーター > セーター',
  '566029': 'レディースファッション > トップス > ニット・セーター > ニットパーカー',
  '566030': 'レディースファッション > トップス > ニット・セーター > ニットキャミソール',
  '200343': 'レディースファッション > トップス > ニット・セーター > その他',
  '502556': 'レディースファッション > トップス > パーカー',
  '403923': 'レディースファッション > トップス > スウェット・トレーナー',
  '112719': 'レディースファッション > トップス > その他',
  '110734': 'レディースファッション > ボトムス > スカート',
  '303587': 'レディースファッション > ボトムス > キュロット',
  '206440': 'レディースファッション > ボトムス > パンツ',
  '555087': 'レディースファッション > コート・ジャケット',
  '110729': 'レディースファッション > ワンピース',
  '568650': 'レディースファッション > シャツワンピース',
  '568651': 'レディースファッション > ジャンパースカート',
  '553029': 'レディースファッション > チュニック',
  '555084': 'レディースファッション > ドレス',
  '568279': 'レディースファッション > パンツドレス',
  '110724': 'レディースファッション > スーツ・セットアップ > パンツスーツ',
  '409073': 'レディースファッション > スーツ・セットアップ > スカートスーツ',
  '409120': 'レディースファッション > スーツ・セットアップ > ワンピーススーツ',
  '409096': 'レディースファッション > スーツ・セットアップ > 3・4点セット',
  '566020': 'レディースファッション > スーツ・セットアップ > トップスのみ',
  '566021': 'レディースファッション > スーツ・セットアップ > ボトムスのみ',
  '555083': 'レディースファッション > オールインワン・サロペット',
  '553037': 'レディースファッション > レインウェア > レインコート',
  '553038': 'レディースファッション > レインウェア > レインスーツ',
  '409395': 'レディースファッション > レインウェア > その他',
  '409365': 'レディースファッション > 水着',
  '206545': 'レディースファッション > 和服 > 着物',
  '110824': 'レディースファッション > 和服 > 着物セット',
  '567437': 'レディースファッション > 和服 > 花嫁着物',
  '567438': 'レディースファッション > 和服 > 花嫁着物セット',
  '206549': 'レディースファッション > 和服 > 浴衣',
  '206585': 'レディースファッション > 和服 > 浴衣セット',
  '206546': 'レディースファッション > 和服 > 帯',
  '206547': 'レディースファッション > 和服 > 部屋着',
  '206548': 'レディースファッション > 和服 > 履物',
  '206617': 'レディースファッション > 和服 > 和装小物 > 髪飾り',
  '206618': 'レディースファッション > 和服 > 和装小物 > ショール',
  '206625': 'レディースファッション > 和服 > 和装小物 > バッグ',
  '206626': 'レディースファッション > 和服 > 和装小物 > 巾着袋',
  '206629': 'レディースファッション > 和服 > 和装小物 > 扇子',
  '206630': 'レディースファッション > 和服 > 和装小物 > うちわ',
  '206631': 'レディースファッション > 和服 > 和装小物 > 着付け小物 > 帯留',
  '206632': 'レディースファッション > 和服 > 和装小物 > 着付け小物 > 帯揚',
  '506700': 'レディースファッション > 和服 > 和装小物 > 着付け小物 > 帯締',
  '206633': 'レディースファッション > 和服 > 和装小物 > 着付け小物 > 羽織紐',
  '506701': 'レディースファッション > 和服 > 和装小物 > 着付け小物 > 根付',
  '206637': 'レディースファッション > 和服 > 和装小物 > 着付け小物 > セット',
  '206634': 'レディースファッション > 和服 > 和装小物 > 着付け小物 > その他',
  '502526': 'レディースファッション > 和服 > 和装小物 > 風呂敷',
  '206635': 'レディースファッション > 和服 > 和装小物 > セット',
  '112735': 'レディースファッション > 和服 > 和装小物 > その他',
  '409176': 'レディースファッション > 和服 > 反物',
  '567225': 'レディースファッション > 和服 > 裏物・八掛',
  '206614': 'レディースファッション > 和服 > 和装下着・足袋 > 半衿',
  '206613': 'レディースファッション > 和服 > 和装下着・足袋 > 肌襦袢',
  '566699': 'レディースファッション > 和服 > 和装下着・足袋 > 長襦袢',
  '566700': 'レディースファッション > 和服 > 和装下着・足袋 > 半襦袢',
  '566701': 'レディースファッション > 和服 > 和装下着・足袋 > 和装ブラジャー',
  '206620': 'レディースファッション > 和服 > 和装下着・足袋 > 足袋',
  '566704': 'レディースファッション > 和服 > 和装下着・足袋 > セット',
  '567771': 'レディースファッション > 和服 > 巫女用装束',
  '409166': 'レディースファッション > 事務服 > セットアップ',
  '409167': 'レディースファッション > 事務服 > ジャケット',
  '409168': 'レディースファッション > 事務服 > ベスト',
  '409169': 'レディースファッション > 事務服 > シャツ・ブラウス',
  '409170': 'レディースファッション > 事務服 > スカート',
  '409171': 'レディースファッション > 事務服 > キュロット',
  '409172': 'レディースファッション > 事務服 > パンツ',
  '409173': 'レディースファッション > 事務服 > リボン・ネクタイ・スカーフ',
  '206522': 'レディースファッション > 事務服 > その他',
  '303736': 'レディースファッション > 学生服 > セーラー服',
  '566022': 'レディースファッション > 学生服 > ジャケット',
  '568587': 'レディースファッション > 学生服 > シャツ',
  '567458': 'レディースファッション > 学生服 > スカート',
  '409164': 'レディースファッション > 学生服 > ネクタイ・リボン',
  '206521': 'レディースファッション > 学生服 > その他',
  '564338': 'レディースファッション > ウェディングドレス',
  '403911': 'レディースファッション > 福袋',
  '101801': 'レディースファッション > その他'
};
// カテゴリ名→ジャンルID自動推測
// カテゴリ名＋商品名から楽天ジャンルIDを推測
function guessGenreId(category, productName) {
  if (!category && !productName) return '';
  const cat = (category || '').trim();
  const name = (productName || '').toLowerCase();
  const nameRules = [
    { keywords: ['シャツワンピ'], gid: '568650' },
    { keywords: ['ワンピース', 'ワンピ'], gid: '110729' },
    { keywords: ['tシャツ', 'カットソー', 'ティーシャツ'], gid: '303656' },
    { keywords: ['タンクトップ'], gid: '566018' },
    { keywords: ['ブラウス'], gid: '206471' },
    { keywords: ['ポロシャツ'], gid: '409352' },
    { keywords: ['カーディガン', 'ボレロ'], gid: '403871' },
    { keywords: ['パーカー'], gid: '502556' },
    { keywords: ['スウェット', 'トレーナー'], gid: '403923' },
    { keywords: ['ニット', 'セーター'], gid: '566028' },
    { keywords: ['キャミソール', 'キャミ'], gid: '303662' },
    { keywords: ['ベスト', 'ジレ'], gid: '403890' },
    { keywords: ['キュロット'], gid: '303587' },
    { keywords: ['スカート'], gid: '110734' },
    { keywords: ['ワイドパンツ', 'イージーパンツ', 'パンツ', 'ボトムス'], gid: '206440' },
    { keywords: ['コート', 'ジャケット', 'アウター'], gid: '555087' },
    { keywords: ['チュニック'], gid: '553029' },
    { keywords: ['パンツドレス'], gid: '568279' },
    { keywords: ['ドレス'], gid: '555084' },
    { keywords: ['オールインワン', 'サロペット'], gid: '555083' },
    { keywords: ['ジャンパースカート'], gid: '568651' },
    { keywords: ['アンサンブル'], gid: '303699' },
  ];
  // 1. カテゴリ名でGENRE_MAPの末尾と完全一致（最も確実）
  if (cat) {
    for (const [gid, path] of Object.entries(GENRE_MAP)) {
      const segments = path.split(' > ');
      const last = segments[segments.length - 1];
      if (last === cat) return gid;
    }
  }
  // 2. カテゴリが中間セグメント（例:ボトムス、トップス）の場合、商品名で絞り込み
  if (cat && name) {
    const candidates = [];
    for (const [gid, path] of Object.entries(GENRE_MAP)) {
      const segments = path.split(' > ');
      if (segments.some(s => s === cat)) candidates.push([gid, path]);
    }
    if (candidates.length > 0) {
      // 商品名キーワードで候補を絞る
      for (const rule of nameRules) {
        if (rule.keywords.some(kw => name.includes(kw.toLowerCase()))) {
          const match = candidates.find(([gid]) => gid === rule.gid);
          if (match) return match[0];
        }
      }
      // 商品名で絞れなければ候補の先頭を返す
      return candidates[0][0];
    }
  }
  // 3. カテゴリ名がパスに部分一致
  if (cat) {
    const candidates = [];
    for (const [gid, path] of Object.entries(GENRE_MAP)) {
      if (path.includes(cat)) candidates.push([gid, path]);
    }
    if (candidates.length > 0) {
      for (const rule of nameRules) {
        if (rule.keywords.some(kw => name.includes(kw.toLowerCase()))) {
          const match = candidates.find(([gid]) => gid === rule.gid);
          if (match) return match[0];
        }
      }
      return candidates[0][0];
    }
  }
  // 4. 商品名からキーワードマッチのみ
  for (const rule of nameRules) {
    if (rule.keywords.some(kw => name.includes(kw.toLowerCase()))) return rule.gid;
  }
  return '';
}
let _genreCallbackId = 0;
function fetchRakutenGenrePath(genreId) {
  return new Promise(resolve => {
    if (!genreId) return resolve('');
    const gid = String(genreId).trim();
    resolve(GENRE_MAP[gid] || '');
  });
}
function resolveGenreNames() {
  const els = [...document.querySelectorAll('.genre-name-display')];
  els.forEach(el => {
    const gid = (el.dataset.genreId || '').trim();
    if (!gid) return;
    const path = GENRE_MAP[gid];
    if (path) { el.textContent = path; el.style.color = '#1565c0'; }
    else { el.textContent = '（不明なジャンルID: ' + gid + '）'; el.style.color = '#c33'; }
  });
}
let MASTER = {
  colorOrder: {}, nameCleanPatterns: [], deleteTemplates: [],
  malls: {
    rakuten:  {
      controlCol: 'n', genreId: '', catalogReason: '3', stockType: '1', restockBtn: '0',
      serviceSecret: '', licenseKey: '', corsProxy: '',
      shippingCat1: '', shippingCat2: '', shipLeadtime: '', deliveryLeadtime: '', okihai: '',
      namePrefix: 'NOAHL｜', nameSuffix: '',
      priceRate: 40, taxType: '0', pointRate: 1, pointStart: '', pointEnd: '',
      shippingFee: '1', indivShipping: 0, shippingSet: '', shippingName: '', shippingSets: [], asuraku: '', deliveryInfo: '', noshi: '0',
      pcDescTpl: '', spDescTpl: '', saleDescTpl: '',
      imgCabinet: '', imgType: '0',
      imgCabinetBase: '/shohin/', maxProductImages: 20
    },
    futureshop: { columnSettings: { ccGoods: [], vc: [], vd: [], gs: [] } },
    tiktok:     { columnMappings: [], templateData: '' },
    zozo:       { priceRate: 100, namePrefix: '', nameSuffix: '' },
    rakufashion:{ priceRate: 100, namePrefix: '', nameSuffix: '' }
  }
};
let PROFILES = {};       // { "NOAHL": {...}, "BrandB": {...} }
let ACTIVE_PROFILE = ''; // 現在選択中のプロファイル名
let GH_TOKEN_SHARED = ''; // GitHub Token（全プロファイル共通）

// ============================================================
// DEFAULT MASTER DATA
// ============================================================
const DEFAULT_COLOR_ORDER = `F(M)フリー,1
Sサイズ,1
Mサイズ,2
Lサイズ,3
ホワイト,1
オフホワイト,2
オートミール,3
アイボリー,4
クリーム,5
クリーム×イエロー,6
ライトベージュ,7
ベージュ,8
ライトブルー,9
ピンク,10
イエロー,11
バターイエロー,12
ブルー,13
ミント,14
ミントグレー,15
ベージュ×ブラック,16
グレー×ブルー,17
グレージュ,18
グレージュ×ピンク,19
ブラウン,20
ブラウンMIX,21
チャコール,22
チャコールMIX,23
ブラック,9999
スミクロ,9999
クリームイエロー,6
ダークブラウン,21`;

// 代表カラーマッピング（カラー名 → 楽天RMS代表カラー）
// RMS選択肢: ブラック,グレー,ホワイト,ブラウン,ベージュ,カーキグリーン,ピンク,ワインレッド,レッド,オレンジ,イエロー,グリーン,ブルー,ネイビー,パープル,ゴールド,シルバー,透明,マルチカラー
const REPRESENTATIVE_COLOR_MAP = {
  // ブラック系
  'ブラック': 'ブラック', 'スミクロ': 'ブラック', '黒': 'ブラック',
  // グレー系
  'グレー': 'グレー', 'チャコール': 'グレー', 'チャコールMIX': 'グレー', 'ミントグレー': 'グレー', 'グレージュ': 'グレー',
  // ホワイト系
  'ホワイト': 'ホワイト', 'オフホワイト': 'ホワイト', 'アイボリー': 'ホワイト', 'クリーム': 'ホワイト', 'エクリュ': 'ホワイト', '白': 'ホワイト',
  // ブラウン系
  'ブラウン': 'ブラウン', 'ブラウンMIX': 'ブラウン', 'ダークブラウン': 'ブラウン', 'モカ': 'ブラウン', 'キャメル': 'ブラウン', 'テラコッタ': 'ブラウン', 'コーヒー': 'ブラウン',
  // ベージュ系
  'ベージュ': 'ベージュ', 'ライトベージュ': 'ベージュ', 'サンドベージュ': 'ベージュ', 'オートミール': 'ベージュ',
  // カーキグリーン系
  'カーキ': 'カーキグリーン', 'カーキグリーン': 'カーキグリーン', 'オリーブ': 'カーキグリーン',
  // ピンク系
  'ピンク': 'ピンク', 'ライトピンク': 'ピンク', 'サーモンピンク': 'ピンク', 'グレージュ×ピンク': 'ピンク', 'ローズ': 'ピンク', 'コーラル': 'ピンク',
  // ワインレッド系
  'ワインレッド': 'ワインレッド', 'ボルドー': 'ワインレッド', 'バーガンディ': 'ワインレッド', 'えんじ': 'ワインレッド',
  // レッド系
  'レッド': 'レッド', '赤': 'レッド',
  // オレンジ系
  'オレンジ': 'オレンジ',
  // イエロー系
  'イエロー': 'イエロー', 'バターイエロー': 'イエロー', 'クリームイエロー': 'イエロー', 'クリーム×イエロー': 'イエロー', 'マスタード': 'イエロー', 'からし': 'イエロー',
  // グリーン系
  'グリーン': 'グリーン', 'ミント': 'グリーン', '緑': 'グリーン',
  // ブルー系
  'ブルー': 'ブルー', 'ライトブルー': 'ブルー', 'グレー×ブルー': 'ブルー', 'サックス': 'ブルー', 'スカイブルー': 'ブルー', '水色': 'ブルー',
  // ネイビー系
  'ネイビー': 'ネイビー', '紺': 'ネイビー',
  // パープル系
  'パープル': 'パープル', 'ラベンダー': 'パープル', 'プラム': 'パープル', '紫': 'パープル',
  // ゴールド・シルバー
  'ゴールド': 'ゴールド', '金': 'ゴールド', 'シルバー': 'シルバー', '銀': 'シルバー',
  // 透明
  'クリア': '透明', '透明': '透明',
  // マルチカラー
  'マルチカラー': 'マルチカラー', 'ベージュ×ブラック': 'マルチカラー', 'MIX': 'マルチカラー'
};
function getRepresentativeColor(colorName) {
  if (!colorName) return '';
  if (REPRESENTATIVE_COLOR_MAP[colorName]) return REPRESENTATIVE_COLOR_MAP[colorName];
  // 部分一致フォールバック
  for (const [key, rep] of Object.entries(REPRESENTATIVE_COLOR_MAP)) {
    if (colorName.includes(key)) return rep;
  }
  return '';
}

// 採寸サイズパーサー: 【M】着丈：97cm / ウエスト：32-38cm ... → サイズ別オブジェクト
// 採寸項目名 → RMS商品属性名マッピング
const MEASURE_TO_ATTR = {
  '着丈': '着丈', '総丈': '総丈', '肩幅': '肩幅', '身幅': '身幅', 'そで丈': 'そで丈', '袖丈': 'そで丈',
  'ウエスト': 'ウエスト', 'ヒップ': 'ヒップ', '股上': '股上', '股下': '股下',
  '太もも': 'もも幅', 'もも幅': 'もも幅', '裾幅': '裾幅', 'すそ幅': '裾幅',
  'スカート丈': 'スカート丈', 'ゆき丈': 'ゆき丈',
};
function parseMeasureSize(measureStr, targetSize) {
  if (!measureStr || !targetSize) return {};
  const result = {};
  // 【サイズ名】で区切ってセクション分割
  const sizePattern = /【([^】]+)】/g;
  const sections = [];
  let match;
  let lastIdx = 0;
  const matches = [];
  while ((match = sizePattern.exec(measureStr)) !== null) {
    matches.push({ label: match[1], start: match.index + match[0].length });
  }
  for (let i = 0; i < matches.length; i++) {
    const end = (i + 1 < matches.length) ? matches[i + 1].start - matches[i + 1].label.length - 2 : measureStr.length;
    sections.push({ label: matches[i].label, text: measureStr.substring(matches[i].start, end).trim() });
  }
  // ターゲットサイズに一致するセクションを検索
  const normTarget = targetSize.replace(/サイズ/g, '').trim();
  let section = sections.find(s => {
    const normLabel = s.label.replace(/サイズ/g, '').trim();
    return normLabel === normTarget;
  });
  // 完全一致がなければ部分一致
  if (!section) {
    section = sections.find(s => s.label.includes(normTarget) || normTarget.includes(s.label.replace(/サイズ/g, '').trim()));
  }
  if (!section) return result;
  // 項目：値 をパース（/ で区切り）
  const items = section.text.split(/\s*\/\s*/);
  items.forEach(item => {
    // "着丈：97cm" or "ウエスト：32-38cm" or "ヒップ(トップから25cm下)：60cm"
    const m = item.match(/^([^：:]+?)\s*(?:\([^)]*\))?\s*[：:]\s*(.+?)(?:cm)?$/);
    if (m) {
      const rawName = m[1].trim();
      const rawVal = m[2].trim().replace(/cm$/, '');
      const attrName = MEASURE_TO_ATTR[rawName];
      if (attrName) {
        result[attrName] = rawVal;
      }
    }
  });
  return result;
}

const DEFAULT_NAME_CLEAN = `《[^》]*》\n（[^）]*(?:クーポン|%OFF|P×|倍)[^）]*）\n【メール便】\n\\s*\\d{6}$`;
const DEFAULT_DELETE_TPL = `<!--配送について-->\n<!--ご注意-->\n<!--レビューを書いて-->\n<!--コンセプト-->\n<!--よくある質問-->`;

// デフォルト説明文テンプレート
const DEFAULT_PC_DESC_TPL = `<table border="0" cellpadding="0" cellspacing="0" width="100%">
<tr><td>
<img src="{画像URL1}" alt="{商品名}" width="750"><br>
<img src="{画像URL2}" alt="{商品名}" width="750"><br>
<img src="{画像URL3}" alt="{商品名}" width="750"><br>
<img src="{画像URL4}" alt="{商品名}" width="750"><br>
<img src="{画像URL5}" alt="{商品名}" width="750"><br>
<img src="{画像URL6}" alt="{商品名}" width="750"><br>
<img src="{画像URL7}" alt="{商品名}" width="750"><br>
<img src="{画像URL8}" alt="{商品名}" width="750"><br>
<img src="{画像URL9}" alt="{商品名}" width="750"><br>
<img src="{画像URL10}" alt="{商品名}" width="750"><br>
<img src="{画像URL11}" alt="{商品名}" width="750"><br>
<img src="{画像URL12}" alt="{商品名}" width="750"><br>
<img src="{画像URL13}" alt="{商品名}" width="750"><br>
<img src="{画像URL14}" alt="{商品名}" width="750"><br>
<img src="{画像URL15}" alt="{商品名}" width="750"><br>
<img src="{画像URL16}" alt="{商品名}" width="750"><br>
<img src="{画像URL17}" alt="{商品名}" width="750"><br>
<img src="{画像URL18}" alt="{商品名}" width="750"><br>
<img src="{画像URL19}" alt="{商品名}" width="750"><br>
<img src="{画像URL20}" alt="{商品名}" width="750">
</td></tr>
</table>`;

const DEFAULT_SP_DESC_TPL = `<div style="width:100%; max-width:640px; margin:0 auto;">
<img src="{画像URL1}" alt="{商品名}" width="100%"><br>
<img src="{画像URL2}" alt="{商品名}" width="100%"><br>
<img src="{画像URL3}" alt="{商品名}" width="100%"><br>
<img src="{画像URL4}" alt="{商品名}" width="100%"><br>
<img src="{画像URL5}" alt="{商品名}" width="100%"><br>
<img src="{画像URL6}" alt="{商品名}" width="100%"><br>
<img src="{画像URL7}" alt="{商品名}" width="100%"><br>
<img src="{画像URL8}" alt="{商品名}" width="100%"><br>
<img src="{画像URL9}" alt="{商品名}" width="100%"><br>
<img src="{画像URL10}" alt="{商品名}" width="100%"><br>
<img src="{画像URL11}" alt="{商品名}" width="100%"><br>
<img src="{画像URL12}" alt="{商品名}" width="100%"><br>
<img src="{画像URL13}" alt="{商品名}" width="100%"><br>
<img src="{画像URL14}" alt="{商品名}" width="100%"><br>
<img src="{画像URL15}" alt="{商品名}" width="100%"><br>
<img src="{画像URL16}" alt="{商品名}" width="100%"><br>
<img src="{画像URL17}" alt="{商品名}" width="100%"><br>
<img src="{画像URL18}" alt="{商品名}" width="100%"><br>
<img src="{画像URL19}" alt="{商品名}" width="100%"><br>
<img src="{画像URL20}" alt="{商品名}" width="100%">
</div>`;

const DEFAULT_SALE_DESC_TPL = `【商品紹介】<br>
<br>
{採寸サイズ整形}<br>
【素材】<br>
{素材}<br><br>
【カラー】<br>
{カラー一覧}<br><br>
【備考】<br>
{仕様整形}<br>
※ご利用の端末環境により、商品画像と実物では多少色合いが異なって見える場合がございます。<br>
※お洗濯、アイロンの際は内タグの品質表示を必ずご確認ください。<br>
※商品にはたたみシワ等のシワがついている場合がございます。<br>
※染料による匂いが抜けされず、特有の匂いがする場合がございます。<br>`;

function loadDefaultPcDescTpl() {
  document.getElementById('mall-rakuten-pc-desc-tpl').value = DEFAULT_PC_DESC_TPL;
}
function loadDefaultSpDescTpl() {
  document.getElementById('mall-rakuten-sp-desc-tpl').value = DEFAULT_SP_DESC_TPL;
}
function loadDefaultSaleDescTpl() {
  document.getElementById('mall-rakuten-sale-desc-tpl').value = DEFAULT_SALE_DESC_TPL;
}

// ============================================================
// INIT
// ============================================================
function applyMasterData(d) {
  if (d.colorOrder) MASTER.colorOrder = d.colorOrder;
  if (d.nameCleanPatterns) MASTER.nameCleanPatterns = d.nameCleanPatterns;
  if (d.deleteTemplates) MASTER.deleteTemplates = d.deleteTemplates;
  if (d.malls) {
    Object.keys(d.malls).forEach(mall => {
      if (MASTER.malls[mall]) Object.assign(MASTER.malls[mall], d.malls[mall]);
    });
  }
}

(async function initMaster() {
  let loaded = false;
  let configData = null;
  // 1) GitHubからmaster-config.jsonを取得
  try {
    const ghUrl = `https://raw.githubusercontent.com/${GH_REPO_OWNER}/${GH_REPO_NAME}/${GH_BRANCH}/${GH_FILE_PATH}?t=${Date.now()}`;
    const res = await fetch(ghUrl);
    if (res.ok) {
      configData = await res.json();
      loaded = true;
    }
  } catch(e) {}
  // 2) GitHub取得失敗時はlocalStorageから復元
  if (!loaded) {
    try {
      const saved = localStorage.getItem('noahl_master_profiles');
      if (saved) configData = JSON.parse(saved);
    } catch(e2) {}
    // 旧形式のlocalStorageからの移行
    if (!configData) {
      try {
        const oldSaved = localStorage.getItem('noahl_master');
        if (oldSaved) {
          const d = JSON.parse(oldSaved);
          configData = { activeProfile: 'NOAHL', ghToken: '', profiles: { 'NOAHL': d } };
        }
      } catch(e3) {}
    }
  }
  // GitHubから取得した場合、localStorageの機密情報をマージ
  if (loaded && configData) {
    const SECRET_KEYS = ['ghToken'];
    try {
      const localData = JSON.parse(localStorage.getItem('noahl_master_profiles') || '{}');
      if (localData.profiles && configData.profiles) {
        Object.entries(localData.profiles).forEach(([pName, profile]) => {
          if (profile.malls && configData.profiles[pName]?.malls) {
            Object.entries(profile.malls).forEach(([mName, mall]) => {
              if (configData.profiles[pName].malls[mName]) {
                SECRET_KEYS.forEach(key => {
                  if (mall[key]) configData.profiles[pName].malls[mName][key] = mall[key];
                });
              }
            });
          }
        });
      }
      if (localData.ghToken) configData.ghToken = localData.ghToken;
    } catch(e) {}
  }
  // プロファイル構造を適用
  if (configData && configData.profiles) {
    PROFILES = configData.profiles;
    ACTIVE_PROFILE = configData.activeProfile || Object.keys(PROFILES)[0] || '';
    GH_TOKEN_SHARED = configData.ghToken || localStorage.getItem('noahl_gh_token') || '';
    if (GH_TOKEN_SHARED) saveGitHubToken(GH_TOKEN_SHARED);
    if (ACTIVE_PROFILE && PROFILES[ACTIVE_PROFILE]) {
      applyMasterData(PROFILES[ACTIVE_PROFILE]);
    }
  } else if (configData) {
    // 旧形式（プロファイルなし）からの移行
    applyMasterData(configData);
    ACTIVE_PROFILE = 'NOAHL';
    PROFILES['NOAHL'] = JSON.parse(JSON.stringify(MASTER));
  }
  localStorage.setItem('noahl_master_profiles', JSON.stringify({ activeProfile: ACTIVE_PROFILE, ghToken: GH_TOKEN_SHARED, profiles: PROFILES }));
  // デフォルト値の補完
  if (Object.keys(MASTER.colorOrder).length === 0) {
    MASTER.colorOrder = parseColorOrderText(DEFAULT_COLOR_ORDER);
  }
  if (MASTER.nameCleanPatterns.length === 0) {
    MASTER.nameCleanPatterns = DEFAULT_NAME_CLEAN.split('\n').filter(l => l.trim());
  }
  if (MASTER.deleteTemplates.length === 0) {
    MASTER.deleteTemplates = DEFAULT_DELETE_TPL.split('\n').filter(l => l.trim());
  }
  // プロファイルセレクターを更新
  updateProfileSelector();
})();

// GitHub連携設定
const GH_REPO_OWNER = 'tiast2026';
const GH_REPO_NAME = 'Conversion-Tool';
const GH_FILE_PATH = 'master-config.json';
const GH_BRANCH = 'main';

let _masterDirty = false; // 未保存の変更があるか

function getGitHubToken() {
  return GH_TOKEN_SHARED || localStorage.getItem('noahl_gh_token') || '';
}

function saveGitHubToken(token) {
  GH_TOKEN_SHARED = token ? token.trim() : '';
  if (GH_TOKEN_SHARED) {
    localStorage.setItem('noahl_gh_token', GH_TOKEN_SHARED);
  } else {
    localStorage.removeItem('noahl_gh_token');
  }
}

function markMasterDirty() {
  _masterDirty = true;
}

// 現在のMASTERをアクティブプロファイルに反映
function syncMasterToProfile() {
  if (!ACTIVE_PROFILE) return;
  // UIからMASTERに値を取り込み（各モール）
  ['rakuten', 'futureshop', 'zozo', 'rakufashion', 'tiktok'].forEach(mall => {
    readMallFormToMaster(mall);
  });
  // 変換設定
  const coEl = document.getElementById('master-color-order');
  if (coEl && coEl.value) MASTER.colorOrder = parseColorOrderText(coEl.value);
  const ncEl = document.getElementById('master-name-clean');
  if (ncEl && ncEl.value) MASTER.nameCleanPatterns = ncEl.value.split('\n').filter(l => l.trim());
  const dtEl = document.getElementById('master-delete-tpl');
  if (dtEl && dtEl.value) MASTER.deleteTemplates = dtEl.value.split('\n').filter(l => l.trim());
  // プロファイルに保存
  PROFILES[ACTIVE_PROFILE] = JSON.parse(JSON.stringify(MASTER));
}

// 全プロファイルをGitHubに保存
async function saveToGitHub() {
  const token = getGitHubToken();
  if (!token) {
    notify('GitHub Tokenが未設定です。マスタ設定 → 共通 → GitHub連携 から設定してください。', 'warning');
    return false;
  }
  syncMasterToProfile();
  const configData = {
    activeProfile: ACTIVE_PROFILE,
    ghToken: GH_TOKEN_SHARED,
    profiles: PROFILES
  };
  localStorage.setItem('noahl_master_profiles', JSON.stringify(configData));
  // GitHub保存用: 機密情報を除外したコピーを作成
  const SECRET_KEYS = ['ghToken'];
  const safeData = JSON.parse(JSON.stringify(configData));
  delete safeData.ghToken;
  if (safeData.profiles) {
    Object.values(safeData.profiles).forEach(profile => {
      if (profile.malls) {
        Object.values(profile.malls).forEach(mall => {
          SECRET_KEYS.forEach(key => { if (key in mall) delete mall[key]; });
        });
      }
    });
  }
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(safeData, null, 2))));
  const apiUrl = `https://api.github.com/repos/${GH_REPO_OWNER}/${GH_REPO_NAME}/contents/${GH_FILE_PATH}`;
  try {
    let sha = '';
    const getRes = await fetch(`${apiUrl}?ref=${GH_BRANCH}`, {
      headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' }
    });
    if (getRes.ok) {
      const existing = await getRes.json();
      sha = existing.sha;
    }
    const body = { message: `マスタ設定を更新（${ACTIVE_PROFILE}）`, content, branch: GH_BRANCH };
    if (sha) body.sha = sha;
    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (putRes.ok) {
      _masterDirty = false;
      notify('GitHubに保存しました', 'success');
      return true;
    } else {
      const err = await putRes.json();
      notify('GitHub保存エラー: ' + (err.message || putRes.status), 'warning');
      return false;
    }
  } catch(e) {
    notify('GitHub通信エラー: ' + e.message, 'warning');
    return false;
  }
}

// GitHubからマスタ設定を取得
async function loadFromGitHub() {
  const token = getGitHubToken();
  if (!token) {
    notify('GitHub Tokenが未設定です。上のフィールドにTokenを入力してください。', 'warning');
    return false;
  }
  try {
    const apiUrl = `https://api.github.com/repos/${GH_REPO_OWNER}/${GH_REPO_NAME}/contents/${GH_FILE_PATH}?ref=${GH_BRANCH}`;
    const res = await fetch(apiUrl, {
      headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' }
    });
    if (!res.ok) {
      notify('GitHubから設定を取得できませんでした（ステータス: ' + res.status + '）。まだ保存されていない可能性があります。', 'warning');
      return false;
    }
    const fileData = await res.json();
    const configData = JSON.parse(decodeURIComponent(escape(atob(fileData.content))));
    if (configData && configData.profiles) {
      // localStorageの機密情報を保持してマージ
      const SECRET_KEYS = ['ghToken'];
      let localSecrets = {};
      try {
        const localData = JSON.parse(localStorage.getItem('noahl_master_profiles') || '{}');
        if (localData.profiles) {
          Object.entries(localData.profiles).forEach(([pName, profile]) => {
            if (profile.malls) {
              localSecrets[pName] = {};
              Object.entries(profile.malls).forEach(([mName, mall]) => {
                localSecrets[pName][mName] = {};
                SECRET_KEYS.forEach(key => { if (mall[key]) localSecrets[pName][mName][key] = mall[key]; });
              });
            }
          });
        }
      } catch(e) {}
      PROFILES = configData.profiles;
      // 機密情報をマージ
      Object.entries(localSecrets).forEach(([pName, malls]) => {
        if (PROFILES[pName]?.malls) {
          Object.entries(malls).forEach(([mName, secrets]) => {
            if (PROFILES[pName].malls[mName]) {
              Object.assign(PROFILES[pName].malls[mName], secrets);
            }
          });
        }
      });
      ACTIVE_PROFILE = configData.activeProfile || Object.keys(PROFILES)[0] || '';
      if (ACTIVE_PROFILE && PROFILES[ACTIVE_PROFILE]) {
        applyMasterData(PROFILES[ACTIVE_PROFILE]);
      }
      localStorage.setItem('noahl_master_profiles', JSON.stringify({ activeProfile: ACTIVE_PROFILE, ghToken: GH_TOKEN_SHARED, profiles: PROFILES }));
      updateProfileSelector();
      loadMallMasterUI('rakuten');
      _masterDirty = false;
      notify('GitHubからマスタ設定を取得しました', 'success');
      return true;
    } else {
      notify('設定ファイルの形式が正しくありません。', 'warning');
      return false;
    }
  } catch(e) {
    notify('GitHub通信エラー: ' + e.message, 'warning');
    return false;
  }
}

// プロファイル管理
function updateProfileSelector() {
  const sel = document.getElementById('profile-selector');
  if (!sel) return;
  sel.innerHTML = '';
  Object.keys(PROFILES).forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    if (name === ACTIVE_PROFILE) opt.selected = true;
    sel.appendChild(opt);
  });
  // メイン画面のプロファイル表示も更新
  const badge = document.getElementById('active-profile-badge');
  if (badge) badge.textContent = ACTIVE_PROFILE || '';
}

function switchProfile(name) {
  if (!PROFILES[name]) return;
  // 現在のプロファイルを保存
  syncMasterToProfile();
  // 新しいプロファイルを適用
  ACTIVE_PROFILE = name;
  applyMasterData(PROFILES[name]);
  localStorage.setItem('noahl_master_profiles', JSON.stringify({ activeProfile: ACTIVE_PROFILE, ghToken: GH_TOKEN_SHARED, profiles: PROFILES }));
  // UIを更新
  updateProfileSelector();
  openMaster();
  notify(`プロファイル「${name}」に切り替えました`, 'success');
}

function saveProfileAs() {
  const name = prompt('プロファイル名を入力してください:', '');
  if (!name || !name.trim()) return;
  const trimmed = name.trim();
  syncMasterToProfile();
  // 現在のMASTERを新しいプロファイルとしてコピー
  PROFILES[trimmed] = JSON.parse(JSON.stringify(PROFILES[ACTIVE_PROFILE] || MASTER));
  ACTIVE_PROFILE = trimmed;
  updateProfileSelector();
  _masterDirty = true;
  notify(`プロファイル「${trimmed}」を作成しました。GitHubに保存してください。`, 'info');
}

function deleteProfile() {
  const names = Object.keys(PROFILES);
  if (names.length <= 1) { notify('最後のプロファイルは削除できません', 'warning'); return; }
  if (!confirm(`プロファイル「${ACTIVE_PROFILE}」を削除しますか？`)) return;
  delete PROFILES[ACTIVE_PROFILE];
  ACTIVE_PROFILE = Object.keys(PROFILES)[0];
  applyMasterData(PROFILES[ACTIVE_PROFILE]);
  updateProfileSelector();
  openMaster();
  _masterDirty = true;
  notify(`プロファイルを削除しました。GitHubに保存してください。`, 'info');
}

function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function parseColorOrderText(text) {
  const map = {};
  text.split('\n').forEach(line => {
    const parts = line.trim().split(',');
    if (parts.length >= 2) {
      map[parts[0].trim()] = parseInt(parts[1].trim()) || 9999;
    }
  });
  return map;
}

// ============================================================
// MASTER UI
// ============================================================
function openMaster() {
  document.getElementById('master-modal').style.display = 'block';
  _masterDirty = false;
  // プロファイルセレクターを更新
  updateProfileSelector();
  // 共通 変換設定を読み込み
  const co = Object.entries(MASTER.colorOrder).map(([k,v]) => `${k},${v}`).join('\n');
  if (document.getElementById('master-color-order')) document.getElementById('master-color-order').value = co;
  renderColorOrderTable();
  if (document.getElementById('master-name-clean')) document.getElementById('master-name-clean').value = MASTER.nameCleanPatterns.join('\n');
  if (document.getElementById('master-delete-tpl')) document.getElementById('master-delete-tpl').value = MASTER.deleteTemplates.join('\n');
  // モール別設定を読み込み
  loadMallMasterUI('rakuten');
  loadMallMasterUI('futureshop');
  loadMallMasterUI('zozo');
  loadMallMasterUI('rakufashion');
  loadMallMasterUI('tiktok');
  initCorsProxyCodeDisplay();
  // GitHub Token を表示
  const ghInput = document.getElementById('gh-token-input');
  if (ghInput) ghInput.value = getGitHubToken();
}

function loadMallMasterUI(mall) {
  const m = MASTER.malls[mall] || {};
  const el = (id) => document.getElementById(id);
  // 共通フィールド
  if (el(`mall-${mall}-price-rate`)) el(`mall-${mall}-price-rate`).value = m.priceRate || 100;
  if (el(`mall-${mall}-tax`)) el(`mall-${mall}-tax`).value = String(m.taxType || 0);
  if (el(`mall-${mall}-name-prefix`)) el(`mall-${mall}-name-prefix`).value = m.namePrefix || '';
  if (el(`mall-${mall}-name-suffix`)) el(`mall-${mall}-name-suffix`).value = m.nameSuffix || '';
  if (el(`mall-${mall}-default-stock`)) el(`mall-${mall}-default-stock`).value = m.defaultStock || 0;
  if (el(`mall-${mall}-brand`)) el(`mall-${mall}-brand`).value = m.brand || '';
  // 楽天固有
  if (mall === 'rakuten') {
    if (el('mall-rakuten-control-col')) el('mall-rakuten-control-col').value = m.controlCol || 'n';
    if (el('mall-rakuten-genre-id')) el('mall-rakuten-genre-id').value = m.genreId || '';
    if (el('mall-rakuten-catalog-reason')) el('mall-rakuten-catalog-reason').value = m.catalogReason || '3';
    if (el('mall-rakuten-stock-type')) el('mall-rakuten-stock-type').value = m.stockType || '1';
    if (el('mall-rakuten-restock-btn')) el('mall-rakuten-restock-btn').value = m.restockBtn || '0';
    if (el('mall-rakuten-point-rate')) el('mall-rakuten-point-rate').value = m.pointRate || 1;
    if (el('mall-rakuten-point-start')) el('mall-rakuten-point-start').value = m.pointStart || '';
    if (el('mall-rakuten-point-end')) el('mall-rakuten-point-end').value = m.pointEnd || '';
    if (el('mall-rakuten-shipping-fee')) el('mall-rakuten-shipping-fee').value = m.shippingFee || '0';
    if (el('mall-rakuten-indiv-shipping')) el('mall-rakuten-indiv-shipping').value = m.indivShipping || 0;
    if (el('mall-rakuten-shipping-cat1')) el('mall-rakuten-shipping-cat1').value = m.shippingCat1 || '';
    if (el('mall-rakuten-shipping-cat2')) el('mall-rakuten-shipping-cat2').value = m.shippingCat2 || '';
    if (el('mall-rakuten-shipping-set')) el('mall-rakuten-shipping-set').value = m.shippingSet || '';
    if (el('mall-rakuten-shipping-name')) el('mall-rakuten-shipping-name').value = m.shippingName || '';
    loadShippingSetsUI();
    if (el('mall-rakuten-asuraku')) el('mall-rakuten-asuraku').value = m.asuraku || '';
    if (el('mall-rakuten-ship-leadtime')) el('mall-rakuten-ship-leadtime').value = m.shipLeadtime || '';
    if (el('mall-rakuten-delivery-leadtime')) el('mall-rakuten-delivery-leadtime').value = m.deliveryLeadtime || '';
    if (el('mall-rakuten-okihai')) el('mall-rakuten-okihai').value = m.okihai || '';
    if (el('mall-rakuten-delivery-info')) el('mall-rakuten-delivery-info').value = m.deliveryInfo || '';
    if (el('mall-rakuten-noshi')) el('mall-rakuten-noshi').value = m.noshi || '0';
    if (el('mall-rakuten-pc-desc-tpl')) el('mall-rakuten-pc-desc-tpl').value = m.pcDescTpl || '';
    if (el('mall-rakuten-sp-desc-tpl')) el('mall-rakuten-sp-desc-tpl').value = m.spDescTpl || '';
    if (el('mall-rakuten-sale-desc-tpl')) el('mall-rakuten-sale-desc-tpl').value = m.saleDescTpl || '';
    if (el('mall-rakuten-img-cabinet')) el('mall-rakuten-img-cabinet').value = m.imgCabinet || '';
    if (el('mall-rakuten-img-cabinet-base')) el('mall-rakuten-img-cabinet-base').value = m.imgCabinetBase || '/shohin/';
    if (el('mall-rakuten-max-images')) el('mall-rakuten-max-images').value = m.maxProductImages || 20;
    if (el('mall-rakuten-img-type')) el('mall-rakuten-img-type').value = m.imgType || '0';
    if (el('mall-rakuten-service-secret')) el('mall-rakuten-service-secret').value = m.serviceSecret || '';
    if (el('mall-rakuten-license-key')) el('mall-rakuten-license-key').value = m.licenseKey || '';
    if (el('mall-rakuten-cors-proxy')) el('mall-rakuten-cors-proxy').value = m.corsProxy || '';
    // item-cat.csv設定
    if (el('mall-rakuten-itemcat-priority')) el('mall-rakuten-itemcat-priority').value = m.itemCatPriority || '';
    if (el('mall-rakuten-itemcat-default-cat')) el('mall-rakuten-itemcat-default-cat').value = m.itemCatDefaultCat || '';
    if (el('mall-rakuten-shop-category-map')) {
      const catMap = m.shopCategoryMap || {};
      const lines = Object.entries(catMap).map(([key, val]) => {
        if (typeof val === 'object') {
          return val.priority ? `${key},${val.cat},${val.priority}` : `${key},${val.cat}`;
        }
        return `${key},${val}`;
      });
      el('mall-rakuten-shop-category-map').value = lines.join('\n');
    }
    // ネクストエンジンAPI
    if (el('mall-rakuten-ne-client-id')) el('mall-rakuten-ne-client-id').value = m.neClientId || '';
    if (el('mall-rakuten-ne-client-secret')) el('mall-rakuten-ne-client-secret').value = m.neClientSecret || '';
    if (el('mall-rakuten-ne-access-token')) el('mall-rakuten-ne-access-token').value = m.neAccessToken || '';
    if (el('mall-rakuten-ne-refresh-token')) el('mall-rakuten-ne-refresh-token').value = m.neRefreshToken || '';
    if (el('mall-rakuten-ne-uid')) el('mall-rakuten-ne-uid').value = m.neUid || '';
  }
  if (mall === 'tiktok') {
    const hasTemplate = !!(MASTER.malls.tiktok || {}).templateData;
    const statusEl = el('tiktok-template-status');
    if (statusEl) statusEl.textContent = hasTemplate ? '設定済み' : '未設定';
    _tiktokColumnMappings = ((MASTER.malls.tiktok || {}).columnMappings || []).map(e => Object.assign({}, e));
    renderTiktokColumnMappings();
  }
  if (mall === 'futureshop') {
    // レビュー投稿設定
    if (el('mall-fs-selectionOptionName')) el('mall-fs-selectionOptionName').value = m.selectionOptionName || '';
    if (el('mall-fs-selectionChoices')) el('mall-fs-selectionChoices').value = (m.selectionChoices || []).join(',');
    // 列マッピング（旧フォーマットからの移行を含む）
    const csData = migrateFsColumnSettings(m);
    ['ccGoods','vc','vd','gs'].forEach(sk => {
      _fsColumnSettings[sk] = (csData[sk] || []).map(e => Object.assign({}, e));
      // FutureShop列ドロップダウン構築
      const headers = FS_SHEET_HEADERS[sk] || [];
      const colOpts = '<option value="">-- FutureShop列 --</option>' + headers.map(h => '<option value="' + h + '">' + h + '</option>').join('');
      const colSel = document.getElementById('fs-set-col-' + sk);
      if (colSel) colSel.innerHTML = colOpts;
      // ソースドロップダウン構築
      const srcOpts = '<option value="">-- ソース --</option>' + RAKUTEN_SOURCE_FIELDS.map(f => '<option value="' + f.key + '">' + f.label + '</option>').join('');
      const srcSel = document.getElementById('fs-set-src-' + sk);
      if (srcSel) srcSel.innerHTML = srcOpts;
      renderFsColumnSettings(sk);
    });
  }
}

function closeMaster() {
  // 常にフォーム値をMASTERに同期してlocalStorageに保存
  syncMasterToProfile();
  localStorage.setItem('noahl_master_profiles', JSON.stringify({ activeProfile: ACTIVE_PROFILE, ghToken: GH_TOKEN_SHARED, profiles: PROFILES }));
  if (_masterDirty) {
    const choice = confirm('未保存の変更があります。GitHubに保存してから閉じますか？\n\n「OK」→ 保存して閉じる\n「キャンセル」→ 保存せず閉じる');
    if (choice) {
      saveToGitHub().then(() => {
        document.getElementById('master-modal').style.display = 'none';
      });
      return;
    }
  }
  document.getElementById('master-modal').style.display = 'none';
}

function switchMasterMall(mallId, el) {
  document.querySelectorAll('#master-mall-tabs .mall-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.master-mall-panel').forEach(p => { p.style.display = 'none'; p.classList.remove('active'); });
  const panel = document.getElementById('mall-' + mallId);
  if (panel) { panel.style.display = 'block'; panel.classList.add('active'); }
}

function switchMasterTab(id, el) {
  const container = el.closest('.master-mall-panel') || document;
  container.querySelectorAll('.sub-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  container.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
}

function switchRakutenTab(id, el) {
  document.querySelectorAll('#master-tabs-rakuten .rms-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.rakuten-tab-panel').forEach(p => { p.style.display = 'none'; p.classList.remove('active'); });
  const panel = document.getElementById('rtab-' + id);
  if (panel) { panel.style.display = 'block'; panel.classList.add('active'); }
}

// ============================================================
// FutureShop 列マッピング（統合版）
// ============================================================
let _fsColumnSettings = { ccGoods: [], vc: [], vd: [], gs: [] };
let _tiktokColumnMappings = [];

// ============================================================
// TikTok 列マッピング
// ============================================================
const TIKTOK_DEFAULT_SOURCE_MAP = {
  'category':              { source: 'fixed',              value: '' },
  'brand':                 { source: 'fixed',              value: '' },
  'product_name':          { source: 'cleanName',          value: '' },
  'product_description':   { source: 'tiktokDescWithImgs', value: '' },
  'main_image':            { source: 'skuImage',           value: '' },
  'image_2':               { source: 'img1',               value: '' },
  'image_3':               { source: 'img2',               value: '' },
  'image_4':               { source: 'img3',               value: '' },
  'image_5':               { source: 'img4',               value: '' },
  'image_6':               { source: 'img5',               value: '' },
  'image_7':               { source: 'img6',               value: '' },
  'image_8':               { source: 'img7',               value: '' },
  'image_9':               { source: 'img8',               value: '' },
  // SKU / バリエーション（実テンプレート列名に合わせる）
  'property_name_1':       { source: 'var1Name',           value: '' },
  'property_value_1':      { source: 'var1Value',          value: '' },
  'property_1_image':      { source: 'var1Image',          value: '' },
  'property_name_2':       { source: 'var2Name',           value: '' },
  'property_value_2':      { source: 'var2Value',          value: '' },
  'seller_sku':            { source: 'skuCode',            value: '' },
  'price':                 { source: 'skuPrice',           value: '' },
  'quantity':              { source: 'stockQty',           value: '' },
  'size_chart':            { source: 'sizeChartImg',       value: '' },
};

function getDefaultTiktokMappings(columns) {
  return columns.map(col => {
    const d = TIKTOK_DEFAULT_SOURCE_MAP[col];
    return d
      ? { ttColumn: col, source: d.source, action: 'set', value: d.value }
      : { ttColumn: col, source: 'none', action: 'set', value: '' };
  });
}

function handleTiktokTemplateUpload(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const bytes = new Uint8Array(e.target.result);
    // base64変換
    let binary = '';
    bytes.forEach(b => binary += String.fromCharCode(b));
    const b64 = btoa(binary);
    if (!MASTER.malls.tiktok) MASTER.malls.tiktok = {};
    MASTER.malls.tiktok.templateData = b64;
    // Template シート1行目から列名を取得
    const wb = XLSX.read(bytes, { type: 'array' });
    const wsName = wb.SheetNames.find(n => n === 'Template') || wb.SheetNames[0];
    const ws = wb.Sheets[wsName];
    const range = XLSX.utils.decode_range(ws['!ref']);
    const columns = [];
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = ws[XLSX.utils.encode_cell({ r: 0, c })];
      if (cell?.v) columns.push(String(cell.v));
    }
    // 既存マッピングを保持しつつ、新規列をデフォルトで補完
    const existingMap = {};
    _tiktokColumnMappings.forEach(e => { existingMap[e.ttColumn] = e; });
    const defaults = getDefaultTiktokMappings(columns);
    _tiktokColumnMappings = defaults.map(d => existingMap[d.ttColumn] || d);
    MASTER.malls.tiktok.columnMappings = _tiktokColumnMappings.map(e => Object.assign({}, e));
    const statusEl = document.getElementById('tiktok-template-status');
    if (statusEl) statusEl.textContent = file.name;
    renderTiktokColumnMappings();
    markMasterDirty();
    notify('テンプレートを読み込みました（' + columns.length + '列）。マッピングを確認して保存してください。', 'success');
  };
  reader.readAsArrayBuffer(file);
}

function clearTiktokTemplate() {
  if (!MASTER.malls.tiktok) MASTER.malls.tiktok = {};
  MASTER.malls.tiktok.templateData = '';
  const statusEl = document.getElementById('tiktok-template-status');
  if (statusEl) statusEl.textContent = '未設定';
  markMasterDirty();
  notify('テンプレートを削除しました。', 'info');
}

function renderTiktokColumnMappings() {
  const container = document.getElementById('tiktok-column-mappings');
  if (!container) return;
  const mappings = _tiktokColumnMappings;
  if (!mappings.length) {
    container.innerHTML = '<p style="font-size:13px; color:#aaa; margin:6px 0;">テンプレートをアップロードすると列マッピングが表示されます。</p>';
    return;
  }
  const srcOpts = RAKUTEN_SOURCE_FIELDS.map(f => '<option value="' + f.key + '">' + escapeHtml(f.label) + '</option>').join('');
  const actKeys = Object.keys(COLUMN_ACTION_LABELS);
  let html = '<table style="width:100%; border-collapse:collapse; font-size:13px;">';
  html += '<tr style="background:#f8f8f8;"><th style="text-align:left; padding:6px 10px; border-bottom:2px solid #ddd; font-weight:600;">TikTok列</th><th style="text-align:left; padding:6px 10px; border-bottom:2px solid #ddd; font-weight:600;">ソース</th><th style="text-align:left; padding:6px 10px; border-bottom:2px solid #ddd; font-weight:600;">操作</th><th style="text-align:left; padding:6px 10px; border-bottom:2px solid #ddd; font-weight:600;">値</th></tr>';
  mappings.forEach((entry, i) => {
    const rowBg = i % 2 === 0 ? '#fff' : '#f7f5f2';
    html += '<tr style="border-bottom:1px solid #eee; background:' + rowBg + ';">';
    html += '<td style="padding:4px 6px; font-size:13px; font-weight:500;">' + escapeHtml(entry.ttColumn) + '</td>';
    html += '<td style="padding:4px 6px;"><select onchange="updateTiktokColumnMapping(' + i + ',\'source\',this.value)" style="width:100%; padding:4px 6px; border:1px solid #ddd; border-radius:4px; font-size:13px;">';
    html += srcOpts.replace('value="' + entry.source + '"', 'value="' + entry.source + '" selected');
    html += '</select></td>';
    html += '<td style="padding:4px 6px;"><select onchange="updateTiktokColumnMapping(' + i + ',\'action\',this.value)" style="width:100%; padding:4px 6px; border:1px solid #ddd; border-radius:4px; font-size:13px;">';
    actKeys.forEach(ak => {
      html += '<option value="' + ak + '"' + (ak === entry.action ? ' selected' : '') + '>' + COLUMN_ACTION_LABELS[ak] + '</option>';
    });
    html += '</select></td>';
    html += '<td style="padding:4px 6px;"><input type="text" value="' + escapeHtml(entry.value || '') + '" onchange="updateTiktokColumnMapping(' + i + ',\'value\',this.value)" style="width:100%; padding:4px 6px; border:1px solid #ddd; border-radius:4px; font-size:13px;"></td>';
    html += '</tr>';
  });
  html += '</table>';
  container.innerHTML = html;
}

function updateTiktokColumnMapping(i, field, val) {
  if (_tiktokColumnMappings[i]) {
    _tiktokColumnMappings[i][field] = val;
    if (!MASTER.malls.tiktok) MASTER.malls.tiktok = {};
    MASTER.malls.tiktok.columnMappings = _tiktokColumnMappings.map(e => Object.assign({}, e));
    markMasterDirty();
  }
}

// 楽天商品フィールド（ソース選択肢）
const RAKUTEN_SOURCE_FIELDS = [
  { key: 'fixed', label: '固定値' },
  { key: 'none', label: '-' },
  { key: 'current', label: '変換済みの値' },
  { key: 'id', label: '楽天: 商品管理番号' },
  { key: 'number', label: '楽天: 商品番号' },
  { key: '_productNo', label: '楽天: 商品番号(元)' },
  { key: 'name', label: '楽天: 商品名' },
  { key: 'cleanName', label: '楽天: 商品名(クリーン)' },
  { key: 'catchCopy', label: '楽天: キャッチコピー' },
  { key: 'productPoint', label: '楽天: セールスポイント' },
  { key: 'price', label: '楽天: 販売価格' },
  { key: 'sellPrice', label: '楽天: 実売価格' },
  { key: '_displayPrice', label: '楽天: 表示価格' },
  { key: '_taxType', label: '楽天: 税区分' },
  { key: 'jan', label: '楽天: JANコード' },
  { key: 'genreId', label: '楽天: ジャンルID' },
  { key: '_catalogId', label: '楽天: カタログID' },
  { key: '_catalogReason', label: '楽天: カタログIDなしの理由' },
  { key: 'pcDesc', label: '楽天: PC用商品説明文' },
  { key: 'pcDescClean', label: '楽天: PC用商品説明文(クリーン)' },
  { key: 'tiktokDesc', label: '楽天: TikTok用説明文(商品紹介+素材+備考)' },
  { key: 'pcSaleDesc', label: '楽天: PC用販売説明文' },
  { key: 'spDesc', label: '楽天: SP用商品説明文' },
  { key: 'shippingMethod', label: '楽天: 配送方法' },
  { key: '_shippingFee', label: '楽天: 送料' },
  { key: '_shippingCat1', label: '楽天: 送料区分1' },
  { key: '_shippingCat2', label: '楽天: 送料区分2' },
  { key: '_shippingSet', label: '楽天: 送料セット' },
  { key: '_shippingName', label: '楽天: 送料名' },
  { key: '_indivShipping', label: '楽天: 個別送料' },
  { key: '_stockType', label: '楽天: 在庫タイプ' },
  { key: '_restockBtn', label: '楽天: 再入荷ボタン' },
  { key: '_orderLimit', label: '楽天: 注文制限' },
  { key: '_salePeriodStart', label: '楽天: 販売期間(開始)' },
  { key: '_salePeriodEnd', label: '楽天: 販売期間(終了)' },
  { key: '_pointRate', label: '楽天: ポイント倍率' },
  { key: '_pointStart', label: '楽天: ポイント開始日' },
  { key: '_pointEnd', label: '楽天: ポイント終了日' },
  { key: '_asuraku', label: '楽天: あす楽' },
  { key: '_noshi', label: '楽天: のし' },
  { key: '_controlCol', label: '楽天: コントロールカラム' },
  { key: 'memo', label: '楽天: メモ' },
  { key: 'tags', label: '楽天: タグ' },
  { key: 'img1',  label: '楽天: 画像1' },
  { key: 'img2',  label: '楽天: 画像2' },
  { key: 'img3',  label: '楽天: 画像3' },
  { key: 'img4',  label: '楽天: 画像4' },
  { key: 'img5',  label: '楽天: 画像5' },
  { key: 'img6',  label: '楽天: 画像6' },
  { key: 'img7',  label: '楽天: 画像7' },
  { key: 'img8',  label: '楽天: 画像8' },
  { key: 'img9',  label: '楽天: 画像9' },
  { key: 'img10', label: '楽天: 画像10' },
  { key: 'skuCode',   label: 'SKU: SKU番号' },
  { key: 'skuPrice',  label: 'SKU: 価格' },
  { key: 'skuImage',  label: 'SKU: SKU画像' },
  { key: 'var1Name',  label: 'SKU: バリエーション1名称' },
  { key: 'var1Value', label: 'SKU: バリエーション1値' },
  { key: 'var1Image', label: 'SKU: バリエーション1画像' },
  { key: 'var2Name',       label: 'SKU: バリエーション2名称' },
  { key: 'var2Value',      label: 'SKU: バリエーション2値' },
  { key: 'stockQty',       label: 'SKU: 在庫数' },
  { key: 'sizeChartImg',   label: '楽天: サイズ表画像(最終画像)' },
  { key: 'tiktokDescWithImgs', label: '楽天: TikTok用説明文(画像タグ含む)' },
];

const COLUMN_ACTION_LABELS = { set: 'セット', prefix: '先頭に追加', suffix: '末尾に追加', remove: 'テキスト除去' };

// 各シートのヘッダー定義（FutureShop列名選択用）
const FS_SHEET_HEADERS = {
  ccGoods: [
    'コントロールカラム','商品URLコード','ステータス','商品番号','商品名',
    'メイングループ','優先度','本体価格','定価','消費税',
    '販売期間(From)','販売期間(to)','販売期間表示','クール便指定',
    '送料','送料パターン','送料パターン表示','送料個別金額','個別送料表示',
    'オススメ商品商品ページ内表示','オススメ商品リスト','オススメ商品表示方法',
    '商品価格上部コメントHTMLタグ','商品価格上部コメント',
    '定価価格前文字','定価価格後文字','販売価格前文字','取消線','定価表示方法',
    '在庫管理','在庫数表示設定','在庫数表示設定方法','在庫僅少表示閾値',
    '在庫なし表示テキスト','在庫なし表示テキスト表示方法',
    '現在在庫数','調整在庫数','在庫数切れメール閾値',
    'バリエーション横軸名','バリエーション縦軸名',
    '会員価格設定','会員価格','アクセス制限',
    'ポイント付与率設定','ポイント付与率',
    'ステータス（他社サービス）','サンプル商品設定','サンプル商品同梱設定',
    '最大購入制限個数','入荷お知らせメールボタン表示',
    'JANコード','キャッチコピー',
    'レコメンド２：行動履歴収集タグ出力フラグ','レコメンド２：レコメンド商品出力フラグ',
    'レコメンド２：レコメンド表示フラグ','レコメンド２：レコメンド使用タグ優先設定',
    'レコメンド２：商品ページ上部コメントの上','レコメンド２：商品ページ上部コメントの下',
    'レコメンド２：商品ページ下部コメントの上','レコメンド２：商品ページ下部コメントの下',
    'レコメンド２：商品ページおすすめ商品の上','レコメンド２：商品ページおすすめ商品の下',
    'お気に入り登録数','メール便指定','メール便同梱数',
    'バンドル販売','外部連携任意項目',
    'おすすめ商品表示パターン設定','おすすめ商品表示パターン(コマースクリエイター)',
    '外部連携商品名','外部連携商品説明',
    'レイアウト割当名',
    'ページ名(コマースクリエイター)','ページ名表示方法(コマースクリエイター)',
    'キーワード(コマースクリエイター)','キーワード表示方法(コマースクリエイター)',
    'Description(コマースクリエイター)','Description表示方法(コマースクリエイター)',
    '商品一言説明(コマースクリエイター)',
    '商品説明（大）','商品説明（小）',
    '独自コメント（1）','独自コメント（2）','独自コメント（3）','独自コメント（4）',
    '独自コメント（5）','独自コメント（6）','独自コメント（7）','独自コメント（8）',
    '独自コメント（9）','独自コメント（10）','独自コメント（11）','独自コメント（12）',
    '独自コメント（13）','独自コメント（14）','独自コメント（15）','独自コメント（16）',
    '独自コメント（17）','独自コメント（18）','独自コメント（19）','独自コメント（20）',
    'レコメンド２：レコメンド表示フラグ(コマースクリエイター)',
    'レコメンド２：レコメンド使用タグ優先設定(コマースクリエイター)',
    'レコメンド２：出力タグ１','レコメンド２：出力タグ２','レコメンド２：出力タグ３',
    'レコメンド２：出力タグ４','レコメンド２：出力タグ５','レコメンド２：出力タグ６',
    '配送種別','メール便同梱可能数（upgrade）','商品リードタイム',
    '登録日時','最終更新日時'
  ],
  vc: [
    'コントロールカラム','商品URLコード',
    'バリエーション1','バリエーション2','バリエーション3','バリエーション4',
    '表示順','商品番号','商品名','最終更新日時'
  ],
  vd: [
    '商品URLコード',
    'バリエーション1','バリエーション2','バリエーション3','バリエーション4',
    '代表バリエーション','在庫閾値','在庫切れメール',
    '商品番号','商品管理番号','商品名','JANコード','最終更新日付'
  ],
  gs: [
    'コントロールカラム','商品URLコード','選択肢タイプ',
    'セレクト／ラジオボタン用項目名','セレクト／ラジオボタン用選択肢','項目選択肢前改行',
    '項目名位置','項目選択肢表示','テキスト幅','最終更新日時'
  ]
};

const FS_SHEET_LABELS = { ccGoods: 'ccGoods_', vc: 'goodsVariationConfirm_', vd: 'goodsVariationDetail_', gs: 'goodsSelection_' };

function renderFsColumnSettings(sheetKey) {
  const container = document.getElementById('mall-fs-settings-' + sheetKey);
  if (!container) return;
  const settings = _fsColumnSettings[sheetKey] || [];
  const countEl = document.getElementById('fs-' + sheetKey + '-count');
  if (countEl) countEl.textContent = settings.length + '項目';
  if (settings.length === 0) {
    container.innerHTML = '<p style="font-size:13px; color:#aaa; margin:6px 0;">設定なし</p>';
    return;
  }
  const headers = FS_SHEET_HEADERS[sheetKey] || [];
  // CSVヘッダーの左→右順に並び替え
  const colOrder = {};
  headers.forEach((h, idx) => { colOrder[h] = idx; });
  settings.sort((a, b) => {
    const ai = colOrder[a.fsColumn] !== undefined ? colOrder[a.fsColumn] : 99999;
    const bi = colOrder[b.fsColumn] !== undefined ? colOrder[b.fsColumn] : 99999;
    return ai - bi;
  });
  const srcOpts = RAKUTEN_SOURCE_FIELDS.map(f => '<option value="' + f.key + '">' + escapeHtml(f.label) + '</option>').join('');
  const actKeys = Object.keys(COLUMN_ACTION_LABELS);

  let html = '<table style="width:100%; border-collapse:collapse; font-size:13px;">';
  html += '<tr style="background:#f8f8f8;"><th style="text-align:left; padding:6px 10px; border-bottom:2px solid #ddd; font-weight:600;">FutureShop列</th><th style="text-align:left; padding:6px 10px; border-bottom:2px solid #ddd; font-weight:600;">ソース</th><th style="text-align:left; padding:6px 10px; border-bottom:2px solid #ddd; font-weight:600;">操作</th><th style="text-align:left; padding:6px 10px; border-bottom:2px solid #ddd; font-weight:600;">値</th><th style="width:36px;"></th></tr>';
  settings.forEach((entry, i) => {
    const sk = escapeHtml(sheetKey);
    const rowBg = i % 2 === 0 ? '#fff' : '#f7f5f2';
    html += '<tr style="border-bottom:1px solid #eee; background:' + rowBg + ';">';
    // FutureShop列（固定テキスト）
    html += '<td style="padding:4px 6px; font-size:13px; font-weight:500;">' + escapeHtml(entry.fsColumn) + '</td>';
    // ソース select
    html += '<td style="padding:4px 6px;"><select onchange="updateFsColumnSetting(\'' + sk + '\',' + i + ',\'source\',this.value)" style="width:100%; padding:4px 6px; border:1px solid #ddd; border-radius:4px; font-size:13px;">';
    html += srcOpts.replace('value="' + entry.source + '"', 'value="' + entry.source + '" selected');
    html += '</select></td>';
    // 操作 select
    html += '<td style="padding:4px 6px;"><select onchange="updateFsColumnSetting(\'' + sk + '\',' + i + ',\'action\',this.value)" style="width:100%; padding:4px 6px; border:1px solid #ddd; border-radius:4px; font-size:13px;">';
    actKeys.forEach(ak => {
      const sel = ak === entry.action ? ' selected' : '';
      html += '<option value="' + ak + '"' + sel + '>' + COLUMN_ACTION_LABELS[ak] + '</option>';
    });
    html += '</select></td>';
    // 値 input
    html += '<td style="padding:4px 6px;"><input type="text" value="' + escapeHtml(entry.value || '') + '" onchange="updateFsColumnSetting(\'' + sk + '\',' + i + ',\'value\',this.value)" style="width:100%; padding:4px 6px; border:1px solid #ddd; border-radius:4px; font-size:13px;"></td>';
    // 削除
    html += '<td style="padding:4px 6px; text-align:center;"><button onclick="deleteFsColumnSetting(\'' + sk + '\',' + i + ')" style="background:none; border:none; color:#e53935; cursor:pointer; font-size:16px;" title="削除">✕</button></td>';
    html += '</tr>';
  });
  html += '</table>';
  container.innerHTML = html;
}

function updateFsColumnSetting(sheetKey, index, field, value) {
  if (!_fsColumnSettings[sheetKey] || !_fsColumnSettings[sheetKey][index]) return;
  _fsColumnSettings[sheetKey][index][field] = value;
  markMasterDirty();
}

function addFsColumnSetting(sheetKey) {
  const fsCol = document.getElementById('fs-set-col-' + sheetKey)?.value?.trim();
  const source = document.getElementById('fs-set-src-' + sheetKey)?.value?.trim();
  const action = document.getElementById('fs-set-action-' + sheetKey)?.value || 'set';
  const value = document.getElementById('fs-set-val-' + sheetKey)?.value?.trim() || '';
  if (!fsCol) { notify('FutureShop列を選択してください', 'error'); return; }
  if (!source) { notify('ソースを選択してください', 'error'); return; }
  if (source === 'fixed' && !value) { notify('固定値を入力してください', 'error'); return; }
  if (!_fsColumnSettings[sheetKey]) _fsColumnSettings[sheetKey] = [];
  _fsColumnSettings[sheetKey].push({ fsColumn: fsCol, source, action, value });
  document.getElementById('fs-set-col-' + sheetKey).value = '';
  document.getElementById('fs-set-val-' + sheetKey).value = '';
  renderFsColumnSettings(sheetKey);
  markMasterDirty();
}

function deleteFsColumnSetting(sheetKey, index) {
  _fsColumnSettings[sheetKey].splice(index, 1);
  renderFsColumnSettings(sheetKey);
  markMasterDirty();
}

// デフォルトの列マッピング設定（全列を表示、実データに基づく値を設定）
function getDefaultFsColumnSettings() {
  // ccGoods: 既知のデフォルト値マップ
  const ccGoodsDefaults = {
    'コントロールカラム': { source: 'fixed', value: 'n' },
    'ステータス': { source: 'fixed', value: '1' },
    'メイングループ': { source: 'fixed', value: '全てのアイテム' },
    '優先度': { source: 'fixed', value: '10000' },
    '消費税': { source: 'fixed', value: '1' },
    '販売期間表示': { source: 'fixed', value: '0' },
    'クール便指定': { source: 'fixed', value: '0' },
    '送料': { source: 'fixed', value: '0' },
    '送料パターン表示': { source: 'fixed', value: '0' },
    '個別送料表示': { source: 'fixed', value: '0' },
    'オススメ商品商品ページ内表示': { source: 'fixed', value: '1' },
    'オススメ商品表示方法': { source: 'fixed', value: '0' },
    '商品価格上部コメントHTMLタグ': { source: 'fixed', value: '0' },
    '定価価格前文字': { source: 'fixed', value: '定価' },
    '定価価格後文字': { source: 'fixed', value: 'のところ' },
    '販売価格前文字': { source: 'fixed', value: '当店特別価格' },
    '取消線': { source: 'fixed', value: '1' },
    '定価表示方法': { source: 'fixed', value: '0' },
    '在庫管理': { source: 'fixed', value: '1' },
    '在庫数表示設定': { source: 'fixed', value: '0' },
    '在庫数表示設定方法': { source: 'fixed', value: '0' },
    '在庫数切れメール閾値': { source: 'fixed', value: '0' },
    'バリエーション横軸名': { source: 'fixed', value: 'カラー' },
    'バリエーション縦軸名': { source: 'fixed', value: 'サイズ' },
    '会員価格設定': { source: 'fixed', value: '0' },
    'アクセス制限': { source: 'fixed', value: '0' },
    'ポイント付与率設定': { source: 'fixed', value: '0' },
    'ステータス（他社サービス）': { source: 'fixed', value: '0' },
    'サンプル商品設定': { source: 'fixed', value: '0' },
    '入荷お知らせメールボタン表示': { source: 'fixed', value: '1' },
    'キャッチコピー': { source: 'cleanName', value: '' },
    'メール便指定': { source: 'fixed', value: '0' },
    'バンドル販売': { source: 'fixed', value: '0' },
    '外部連携任意項目': { source: 'fixed', value: '0' },
    '外部連携商品名': { source: 'cleanName', value: '' },
    '外部連携商品説明': { source: 'pcDescClean', value: '' },
    'ページ名(コマースクリエイター)': { source: 'fixed', value: '{% product.name %}' },
    'ページ名表示方法(コマースクリエイター)': { source: 'fixed', value: '0' },
    'キーワード(コマースクリエイター)': { source: 'fixed', value: ',NOAHL,ノアル,レディース' },
    'キーワード表示方法(コマースクリエイター)': { source: 'fixed', value: '2' },
    'Description表示方法(コマースクリエイター)': { source: 'fixed', value: '0' },
    '商品説明（大）': { source: 'spDesc', value: '' },
    '商品説明（小）': { source: 'catchCopy', value: '' },
    '配送種別': { source: 'fixed', value: '0100' },
  };
  // 全114列を生成（値がないものはfixed空欄）
  const ccGoods = FS_SHEET_HEADERS.ccGoods.map(col => {
    const d = ccGoodsDefaults[col];
    return d
      ? { fsColumn: col, source: d.source, action: 'set', value: d.value }
      : { fsColumn: col, source: 'fixed', action: 'set', value: '' };
  });

  // vc: 明示値あり→その値、なし→'-'（上書きしない）
  const vcDefaults = {
    'コントロールカラム': { source: 'fixed', value: 'n' },
  };
  const vc = FS_SHEET_HEADERS.vc.map(col => {
    const d = vcDefaults[col];
    return d
      ? { fsColumn: col, source: d.source, action: 'set', value: d.value }
      : { fsColumn: col, source: 'none', action: 'set', value: '' };
  });

  // vd: 全列'-'（プログラム側で設定済み）
  const vd = FS_SHEET_HEADERS.vd.map(col => ({ fsColumn: col, source: 'none', action: 'set', value: '' }));

  // gs: 明示値あり→その値、なし→'-'
  const gsDefaults = {
    'コントロールカラム': { source: 'fixed', value: 'n' },
    '選択肢タイプ': { source: 'fixed', value: 's' },
    '項目選択肢前改行': { source: 'fixed', value: '0' },
    '項目名位置': { source: 'fixed', value: '0' },
    '項目選択肢表示': { source: 'fixed', value: '0' },
  };
  const gs = FS_SHEET_HEADERS.gs.map(col => {
    const d = gsDefaults[col];
    return d
      ? { fsColumn: col, source: d.source, action: 'set', value: d.value }
      : { fsColumn: col, source: 'none', action: 'set', value: '' };
  });

  return { ccGoods, vc, vd, gs };
}

// 旧フォーマットからの移行
function migrateFsColumnSettings(mallData) {
  if (mallData.columnSettings) {
    // 全シートが空の場合はデフォルトを返す
    const cs = mallData.columnSettings;
    const isEmpty = ['ccGoods','vc','vd','gs'].every(k => !(cs[k] || []).length);
    if (isEmpty) return getDefaultFsColumnSettings();
    // ccGoodsのみ: 既存設定にない列をデフォルトから補完（FS_SHEET_HEADERSに追加された列に対応）
    const defaults = getDefaultFsColumnSettings();
    const existingCcGoods = cs['ccGoods'] || [];
    const existingCols = new Set(existingCcGoods.map(e => e.fsColumn));
    const missing = defaults['ccGoods'].filter(e => !existingCols.has(e.fsColumn));
    return {
      ccGoods: [...existingCcGoods, ...missing],
      vc: (cs['vc'] !== undefined ? cs['vc'] : defaults['vc']).map(e => e.source === 'fixed' && e.value === '' ? { ...e, source: 'none' } : e),
      vd: (cs['vd'] !== undefined ? cs['vd'] : defaults['vd']).map(e => e.source === 'fixed' && e.value === '' ? { ...e, source: 'none' } : e),
      gs: (cs['gs'] !== undefined ? cs['gs'] : defaults['gs']).map(e => e.source === 'fixed' && e.value === '' ? { ...e, source: 'none' } : e),
    };
  }
  const result = { ccGoods: [], vc: [], vd: [], gs: [] };
  // 旧 defaults → fixed source
  const defaultsMap = { ccGoodsDefaults: 'ccGoods', vcDefaults: 'vc', vdDefaults: 'vd', gsDefaults: 'gs' };
  let hasOldData = false;
  Object.entries(defaultsMap).forEach(([dk, sk]) => {
    const defaults = mallData[dk] || {};
    Object.entries(defaults).forEach(([col, val]) => {
      result[sk].push({ fsColumn: col, source: 'fixed', action: 'set', value: String(val) });
      hasOldData = true;
    });
  });
  // 旧 changeRules → current source
  const rawCR = mallData.changeRules || {};
  const crObj = Array.isArray(rawCR) ? { ccGoods: rawCR } : rawCR;
  Object.entries(crObj).forEach(([sk, rules]) => {
    (rules || []).forEach(rule => {
      result[sk].push({ fsColumn: rule.column, source: 'current', action: rule.action, value: rule.value });
      hasOldData = true;
    });
  });
  // 旧データもない場合はデフォルトを返す
  return hasOldData ? result : getDefaultFsColumnSettings();
}

// 列マッピングを行に適用する汎用関数
function applyFsColumnSettings(settings, colIndex, row, prod) {
  (settings || []).forEach(entry => {
    const ci = colIndex[entry.fsColumn];
    if (ci === undefined) return;
    if (entry.source === 'none') return; // 上書きしない
    let baseVal;
    if (entry.source === 'fixed') {
      row[ci] = entry.value;
      return;
    } else if (entry.source === 'current') {
      baseVal = row[ci];
    } else {
      baseVal = String(prod[entry.source] || '');
    }
    if (entry.action === 'prefix') row[ci] = entry.value + baseVal;
    else if (entry.action === 'suffix') row[ci] = baseVal + entry.value;
    else if (entry.action === 'remove') row[ci] = baseVal.split(entry.value).join('');
    else row[ci] = baseVal; // 'set'
  });
}


function saveMaster(which) {
  if (which === 'colorOrder') {
    MASTER.colorOrder = parseColorOrderText(document.getElementById('master-color-order').value);
  } else if (which === 'nameClean') {
    MASTER.nameCleanPatterns = document.getElementById('master-name-clean').value.split('\n').filter(l => l.trim());
  } else if (which === 'deleteTpl') {
    MASTER.deleteTemplates = document.getElementById('master-delete-tpl').value.split('\n').filter(l => l.trim());
  }
  markMasterDirty();
  notify('変更を保持しました。「GitHubに保存」で確定してください。', 'info');
}

// フォームからMASTERにモール設定を読み取る（共通処理）
function readMallFormToMaster(mall) {
  const m = MASTER.malls[mall];
  const el = (id) => document.getElementById(id);
  if (el(`mall-${mall}-price-rate`)) m.priceRate = parseInt(el(`mall-${mall}-price-rate`).value) || 100;
  if (el(`mall-${mall}-tax`)) m.taxType = el(`mall-${mall}-tax`).value;
  if (el(`mall-${mall}-name-prefix`)) m.namePrefix = el(`mall-${mall}-name-prefix`).value;
  if (el(`mall-${mall}-name-suffix`)) m.nameSuffix = el(`mall-${mall}-name-suffix`).value;
  if (el(`mall-${mall}-default-stock`)) m.defaultStock = parseInt(el(`mall-${mall}-default-stock`).value) || 0;
  if (el(`mall-${mall}-brand`)) m.brand = el(`mall-${mall}-brand`).value.trim();
  if (mall === 'rakuten') {
    m.controlCol = el('mall-rakuten-control-col')?.value || 'n';
    m.genreId = el('mall-rakuten-genre-id')?.value?.trim() || '';
    m.catalogReason = el('mall-rakuten-catalog-reason')?.value || '3';
    m.stockType = el('mall-rakuten-stock-type')?.value || '1';
    m.restockBtn = el('mall-rakuten-restock-btn')?.value || '0';
    m.pointRate = parseInt(el('mall-rakuten-point-rate')?.value) || 1;
    m.pointStart = el('mall-rakuten-point-start')?.value?.trim() || '';
    m.pointEnd = el('mall-rakuten-point-end')?.value?.trim() || '';
    m.shippingFee = el('mall-rakuten-shipping-fee')?.value || '0';
    m.indivShipping = parseInt(el('mall-rakuten-indiv-shipping')?.value) || 0;
    m.shippingCat1 = el('mall-rakuten-shipping-cat1')?.value?.trim() || '';
    m.shippingCat2 = el('mall-rakuten-shipping-cat2')?.value?.trim() || '';
    m.shippingSet = el('mall-rakuten-shipping-set')?.value?.trim() || '';
    m.shippingName = el('mall-rakuten-shipping-name')?.value?.trim() || '';
    const setsText = el('mall-rakuten-shipping-sets-list')?.value || '';
    m.shippingSets = setsText.split('\n').map(l => l.trim()).filter(l => l && l.includes(',')).map(line => {
      const idx = line.indexOf(',');
      return { num: line.substring(0, idx).trim(), name: line.substring(idx + 1).trim() };
    });
    m.asuraku = el('mall-rakuten-asuraku')?.value?.trim() || '';
    m.shipLeadtime = el('mall-rakuten-ship-leadtime')?.value?.trim() || '';
    m.deliveryLeadtime = el('mall-rakuten-delivery-leadtime')?.value?.trim() || '';
    m.okihai = el('mall-rakuten-okihai')?.value || '';
    m.deliveryInfo = el('mall-rakuten-delivery-info')?.value?.trim() || '';
    m.noshi = el('mall-rakuten-noshi')?.value || '0';
    m.pcDescTpl = el('mall-rakuten-pc-desc-tpl')?.value || '';
    m.spDescTpl = el('mall-rakuten-sp-desc-tpl')?.value || '';
    m.saleDescTpl = el('mall-rakuten-sale-desc-tpl')?.value || '';
    m.imgCabinet = el('mall-rakuten-img-cabinet')?.value?.trim() || '';
    m.imgCabinetBase = el('mall-rakuten-img-cabinet-base')?.value?.trim() || '/shohin/';
    m.maxProductImages = parseInt(el('mall-rakuten-max-images')?.value) || 20;
    m.imgType = el('mall-rakuten-img-type')?.value || '0';
    m.serviceSecret = el('mall-rakuten-service-secret')?.value?.trim() || '';
    m.licenseKey = el('mall-rakuten-license-key')?.value?.trim() || '';
    m.corsProxy = el('mall-rakuten-cors-proxy')?.value?.trim() || '';
    m.itemCatPriority = el('mall-rakuten-itemcat-priority')?.value?.trim() || '';
    m.itemCatDefaultCat = el('mall-rakuten-itemcat-default-cat')?.value?.trim() || '';
    const catMapText = el('mall-rakuten-shop-category-map')?.value || '';
    const catMapObj = {};
    catMapText.split('\n').map(l => l.trim()).filter(l => l).forEach(line => {
      if (line.includes(',')) {
        const parts = line.split(',');
        const key = parts[0].trim();
        const cat = parts[1].trim();
        const pri = (parts[2] || '').trim();
        if (key && cat) {
          catMapObj[key] = pri ? { cat, priority: pri } : cat;
        }
      }
    });
    m.shopCategoryMap = catMapObj;
    m.neClientId = el('mall-rakuten-ne-client-id')?.value?.trim() || '';
    m.neClientSecret = el('mall-rakuten-ne-client-secret')?.value?.trim() || '';
    m.neAccessToken = el('mall-rakuten-ne-access-token')?.value?.trim() || '';
    m.neRefreshToken = el('mall-rakuten-ne-refresh-token')?.value?.trim() || '';
    m.neUid = el('mall-rakuten-ne-uid')?.value?.trim() || '';
  }
  if (mall === 'futureshop') {
    // レビュー投稿設定
    m.selectionOptionName = el('mall-fs-selectionOptionName')?.value?.trim() || '';
    const choicesText = el('mall-fs-selectionChoices')?.value?.trim() || '';
    if (choicesText) m.selectionChoices = choicesText.split(',').map(s => s.trim()).filter(Boolean);
    // 列マッピング
    m.columnSettings = {};
    ['ccGoods','vc','vd','gs'].forEach(sk => {
      m.columnSettings[sk] = (_fsColumnSettings[sk] || []).map(e => Object.assign({}, e));
    });
  }
  if (mall === 'tiktok') {
    m.columnMappings = _tiktokColumnMappings.map(e => Object.assign({}, e));
  }
}

function saveMallMaster(mall) {
  readMallFormToMaster(mall);
  markMasterDirty();
  notify('変更を保持しました。「GitHubに保存」で確定してください。', 'info');
}

// 配送方法セット管理
function onShippingSetSelect(sel) {
  const val = sel.value;
  if (!val) {
    document.getElementById('mall-rakuten-shipping-set').value = '';
    document.getElementById('mall-rakuten-shipping-name').value = '';
    return;
  }
  const parts = val.split('|');
  document.getElementById('mall-rakuten-shipping-set').value = parts[0] || '';
  document.getElementById('mall-rakuten-shipping-name').value = parts[1] || '';
}

function updateShippingSetDropdown() {
  const text = document.getElementById('mall-rakuten-shipping-sets-list').value;
  const sets = text.split('\n').map(l => l.trim()).filter(l => l && l.includes(','));
  const sel = document.getElementById('mall-rakuten-shipping-set-select');
  const currentVal = sel.value;
  sel.innerHTML = '<option value="">（未選択）</option>';
  sets.forEach(line => {
    const idx = line.indexOf(',');
    const num = line.substring(0, idx).trim();
    const name = line.substring(idx + 1).trim();
    const opt = document.createElement('option');
    opt.value = num + '|' + name;
    opt.textContent = num + ': ' + name;
    sel.appendChild(opt);
  });
  if (currentVal) sel.value = currentVal;
  notify('配送方法セットのリストを更新しました', 'info');
}

function loadShippingSetsUI() {
  const m = MASTER.malls.rakuten;
  const sets = m.shippingSets || [];
  document.getElementById('mall-rakuten-shipping-sets-list').value = sets.map(s => s.num + ',' + s.name).join('\n');
  const sel = document.getElementById('mall-rakuten-shipping-set-select');
  sel.innerHTML = '<option value="">（未選択）</option>';
  sets.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.num + '|' + s.name;
    opt.textContent = s.num + ': ' + s.name;
    sel.appendChild(opt);
  });
  if (m.shippingSet) {
    sel.value = m.shippingSet + '|' + (m.shippingName || '');
  }
}

// ジャンルID検索：IDからジャンル名パスを取得
function lookupGenreId() {
  const gid = document.getElementById('mall-rakuten-genre-id').value.trim();
  const resultEl = document.getElementById('genre-id-result');
  if (!gid) { resultEl.textContent = 'ジャンルIDを入力してください'; resultEl.style.color = '#c33'; return; }
  resultEl.textContent = '取得中...'; resultEl.style.color = '#999';
  fetchRakutenGenrePath(gid).then(path => {
    if (path) { resultEl.textContent = path; resultEl.style.color = '#1565c0'; }
    else { resultEl.textContent = '取得できませんでした（IDを確認してください）'; resultEl.style.color = '#c33'; }
  });
}

// ジャンル名でキーワード検索（静的マップから検索）
function searchGenreByKeyword() {
  const keyword = document.getElementById('mall-rakuten-genre-search').value.trim();
  const resultEl = document.getElementById('genre-search-result');
  if (!keyword) { resultEl.textContent = 'キーワードを入力してください'; resultEl.style.color = '#c33'; return; }
  const kw = keyword.toLowerCase();
  const matches = Object.entries(GENRE_MAP).filter(([id, path]) => path.toLowerCase().includes(kw));
  if (matches.length === 0) {
    resultEl.innerHTML = '<span style="color:#c33;">「' + keyword + '」に一致するジャンルが見つかりませんでした。</span>';
    return;
  }
  let html = '<div style="max-height:200px; overflow-y:auto; border:1px solid #ddd; border-radius:4px; padding:4px; margin-top:4px;">';
  matches.forEach(([gid, path]) => {
    html += '<div style="padding:4px 8px; cursor:pointer; border-bottom:1px solid #f0f0f0; font-size:12px;" onmouseover="this.style.background=\'#e3f2fd\'" onmouseout="this.style.background=\'#fff\'" onclick="document.getElementById(\'mall-rakuten-genre-id\').value=\'' + gid + '\'; lookupGenreId();">';
    html += '<span style="font-weight:600; color:#1565c0;">' + gid + '</span> ' + path;
    html += '</div>';
  });
  html += '</div>';
  resultEl.innerHTML = html;
}

// HTMLプレビュー：新しいウィンドウで商品説明文を表示
function previewHtml(htmlContent, title) {
  const win = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');
  if (!win) { alert('ポップアップがブロックされました。ブラウザの設定を確認してください。'); return; }
  win.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>' + (title || 'HTMLプレビュー') + '</title>');
  win.document.write('<style>body{margin:20px;font-family:sans-serif;} img{max-width:100%;height:auto;}</style></head><body>');
  win.document.write(htmlContent);
  win.document.write('</body></html>');
  win.document.close();
}

// カタログIDなしの理由を名前に変換
function catalogReasonLabel(code) {
  const map = {'1':'セット商品', '2':'サービス商品', '3':'店舗オリジナル商品', '4':'項目選択肢在庫商品', '5':'該当製品コードなし'};
  return code ? (map[code] || '不明') : '';
}

function loadDefaultColorOrder() {
  MASTER.colorOrder = parseColorOrderText(DEFAULT_COLOR_ORDER);
  const co = Object.entries(MASTER.colorOrder).map(([k,v]) => `${k},${v}`).join('\n');
  if (document.getElementById('master-color-order')) document.getElementById('master-color-order').value = co;
  renderColorOrderTable();
  markMasterDirty();
  notify('デフォルトのカラー表示順を読み込みました', 'info');
}

function renderColorOrderTable() {
  const container = document.getElementById('color-order-table');
  if (!container) return;
  const entries = Object.entries(MASTER.colorOrder).sort((a, b) => a[1] - b[1]);
  if (!entries.length) {
    container.innerHTML = '<p style="padding:12px; color:#999; font-size:12px;">データがありません</p>';
    return;
  }
  let html = '<table style="width:100%; border-collapse:collapse; font-size:12px;">';
  html += '<thead><tr style="background:#f5f3f0; position:sticky; top:0;"><th style="padding:6px 10px; text-align:left; font-weight:600; border-bottom:1px solid var(--border);">カラー／サイズ名</th><th style="padding:6px 10px; text-align:center; font-weight:600; width:80px; border-bottom:1px solid var(--border);">表示順</th><th style="padding:6px 10px; width:40px; border-bottom:1px solid var(--border);"></th></tr></thead><tbody>';
  entries.forEach(([name, order], idx) => {
    const rowBg = idx % 2 === 0 ? '#fff' : '#f7f5f2';
    html += '<tr style="border-bottom:1px solid #eee; background:' + rowBg + ';">';
    html += '<td style="padding:5px 10px;">' + escapeHtml(name) + '</td>';
    html += '<td style="padding:5px 10px; text-align:center;"><input type="number" value="' + order + '" min="0" style="width:60px; padding:2px 4px; border:1px solid var(--border); border-radius:3px; font-size:11px; text-align:center;" onchange="updateColorOrderRow(\'' + escapeHtml(name).replace(/'/g, "\\'") + '\', this.value)"></td>';
    html += '<td style="padding:5px 10px; text-align:center;"><button onclick="deleteColorOrderRow(\'' + escapeHtml(name).replace(/'/g, "\\'") + '\')" style="background:none; border:none; color:#c44; cursor:pointer; font-size:14px;" title="削除">×</button></td>';
    html += '</tr>';
  });
  html += '</tbody></table>';
  container.innerHTML = html;
}

function addColorOrderRow() {
  const nameEl = document.getElementById('color-order-new-name');
  const orderEl = document.getElementById('color-order-new-order');
  const name = (nameEl?.value || '').trim();
  const order = parseInt(orderEl?.value) || 9999;
  if (!name) { notify('カラー名／サイズ名を入力してください', 'warn'); return; }
  MASTER.colorOrder[name] = order;
  syncColorOrderTextarea();
  renderColorOrderTable();
  markMasterDirty();
  if (nameEl) nameEl.value = '';
  if (orderEl) orderEl.value = '';
}

function updateColorOrderRow(name, val) {
  MASTER.colorOrder[name] = parseInt(val) || 9999;
  syncColorOrderTextarea();
  markMasterDirty();
}

function deleteColorOrderRow(name) {
  delete MASTER.colorOrder[name];
  syncColorOrderTextarea();
  renderColorOrderTable();
  markMasterDirty();
}

function syncColorOrderTextarea() {
  const co = Object.entries(MASTER.colorOrder).map(([k,v]) => `${k},${v}`).join('\n');
  const ta = document.getElementById('master-color-order');
  if (ta) ta.value = co;
}

function toggleColorOrderEdit() {
  const tableView = document.getElementById('color-order-table-view');
  const textView = document.getElementById('color-order-text-view');
  const btn = document.getElementById('color-order-toggle-btn');
  if (!tableView || !textView) return;
  if (textView.style.display === 'none') {
    // テキスト編集モードへ
    textView.style.display = 'block';
    tableView.style.display = 'none';
    if (btn) btn.textContent = 'テーブル表示に戻す';
  } else {
    // テーブル表示へ戻す（テキストエリアの内容を反映）
    const ta = document.getElementById('master-color-order');
    if (ta) MASTER.colorOrder = parseColorOrderText(ta.value);
    textView.style.display = 'none';
    tableView.style.display = 'block';
    renderColorOrderTable();
    if (btn) btn.textContent = '一括テキスト編集';
  }
}

// モール別の商品名加工
function applyMallName(name, mallKey) {
  const m = MASTER.malls[mallKey];
  if (!m) return name;
  return (m.namePrefix || '') + name + (m.nameSuffix || '');
}

// モール別の価格計算
function calcMallPrice(basePrice, mallKey) {
  const m = MASTER.malls[mallKey];
  if (!m || !m.priceRate || m.priceRate === 100) return basePrice;
  const p = parseInt(basePrice);
  if (!p || isNaN(p)) return basePrice;
  return String(Math.round(p * m.priceRate / 100));
}

// ============================================================
// PRODUCT NAME CLEANING
// ============================================================
function cleanProductName(name) {
  if (!name) return '';
  let cleaned = name;
  MASTER.nameCleanPatterns.forEach(pattern => {
    try {
      const re = new RegExp(pattern, 'g');
      cleaned = cleaned.replace(re, '');
    } catch(e) {}
  });
  return cleaned.replace(/\s{2,}/g, ' ').trim();
}

// PC用商品説明文から【商品紹介】セクションを抽出しHTMLタグを除去
function extractPcDescClean(pcDesc) {
  if (!pcDesc) return '';
  const m = pcDesc.match(/【商品紹介】(?:<br\s*\/?>)?\s*([\s\S]*?)\s*【[^】]+】/);
  if (!m) return '';
  return m[1].replace(/<br\s*\/?>/gi, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

// TikTok用説明文生成: table形式・【】形式の両方に対応
// 商品紹介・素材とカラー・備考を整形し、※注意書きを末尾に追加
function buildTiktokDesc(html) {
  if (!html) return '';
  function decodeEntities(s) {
    return s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&nbsp;/g,' ').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
  }
  function splitNotices(text) {
    const biko = [], notices = [];
    text.split('\n').forEach(ln => { const t = ln.trim(); if (!t) return; (/^※/.test(t) ? notices : biko).push(t); });
    return { biko: biko.join('\n'), notices: notices.join('\n') };
  }
  let intro = '', material = '', color = '', biko = '', notices = '';
  const isTable = /<table[\s>]/i.test(html) && /<th[^>]*>[\s\S]*?商品紹介/i.test(html);
  if (isTable) {
    const pat = /<th[^>]*>([\s\S]*?)<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/gi;
    let m;
    while ((m = pat.exec(html)) !== null) {
      const hd = m[1].replace(/<[^>]+>/g,'').trim();
      const ct = decodeEntities(m[2].replace(/<br\s*\/?>/gi,'\n').replace(/<[^>]+>/g,'')).trim();
      if (/商品紹介/.test(hd)) intro = ct;
      else if (/素材/.test(hd)) material = ct;
      else if (/カラー/.test(hd)) color = ct;
      else if (/備考/.test(hd)) { const sp = splitNotices(ct); biko = sp.biko; notices = sp.notices; }
    }
  } else {
    let t = html;
    const si = t.search(/【商品紹介】|商品紹介/);
    if (si === -1) return extractPcDescClean(html);
    t = decodeEntities(t.substring(si).replace(/<br\s*\/?>/gi,'\n').replace(/<[^>]+>/g,''));
    const sections = {};
    let cur = '';
    t.split('\n').forEach(rawLn => {
      const ln = rawLn.trim(); if (!ln) return;
      const hm = ln.match(/^【(.+?)】/);
      if (hm) { cur = hm[1]; const rest = ln.replace(/^【.+?】/,'').trim(); if (rest) (sections[cur] = sections[cur]||[]).push(rest); }
      else if (cur) (sections[cur] = sections[cur]||[]).push(ln);
    });
    intro = (sections['商品紹介']||[]).join('\n');
    material = (sections['素材']||[]).join('\n');
    color = (sections['カラー']||[]).join('\n');
    if (sections['備考']) { const sp = splitNotices(sections['備考'].join('\n')); biko = sp.biko; notices = sp.notices; }
  }
  const parts = [];
  if (intro) parts.push('【商品紹介】\n' + intro);
  if (material || color) {
    parts.push('\n【素材とカラー】');
    if (material) parts.push('素材：' + material);
    if (color) parts.push('カラー：' + color);
  }
  if (biko) parts.push('\n【備考】\n' + biko);
  if (notices) parts.push('\n' + notices);
  return parts.join('\n').trim();
}

// ============================================================
// PRICE CALCULATION
// ============================================================
function calcListPrice(sellPrice, mallKey) {
  const p = parseInt(sellPrice);
  if (!p || isNaN(p)) return '';
  const rate = (mallKey && MASTER.malls[mallKey]) ? MASTER.malls[mallKey].priceRate : 40;
  return Math.round(p / (rate / 100));
}

// ============================================================
// SOURCE SELECTION
// ============================================================
function selectSource(type) {
  sourceType = type;
  document.querySelectorAll('.source-btn').forEach(b => b.classList.remove('selected'));
  document.querySelector(`.source-btn[data-source="${type}"]`).classList.add('selected');
}

// ============================================================
// FILE HANDLING
// ============================================================
function handleDrop(e) {
  e.preventDefault();
  e.target.closest('.upload-area').classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
}

function handleFile(file) {
  if (!file) return;
  const ext = file.name.split('.').pop().toLowerCase();
  // Excel → 自動で自社システムに切り替え
  if (ext === 'xlsx' || ext === 'xls') {
    selectSource('jisha');
    const reader = new FileReader();
    reader.onload = function(e) {
      parseExcelFile(e.target.result, file);
    };
    reader.readAsArrayBuffer(file);
    return;
  }
  // CSV → ヘッダーを読んで自動判別
  const reader = new FileReader();
  reader.onload = function(e) {
    const buf = e.target.result;
    const uint8 = new Uint8Array(buf);
    let text;
    try {
      const utf8 = new TextDecoder('utf-8', { fatal: true });
      text = utf8.decode(uint8);
    } catch(err) {
      const sjis = new TextDecoder('shift-jis');
      text = sjis.decode(uint8);
    }
    if (text.charCodeAt(0) === 0xFEFF) { text = text.substring(1); }
    // ヘッダー行から自動判別
    const firstLine = text.split(/[\r\n]/)[0] || '';
    if (firstLine.includes('商品管理番号（商品URL）') || firstLine.includes('バリエーション項目キー定義')) {
      selectSource('rakuten');
    }
    parseCSVText(text, file);
  };
  reader.readAsArrayBuffer(file);
}

function parseExcelFile(arrayBuffer, file) {
  try {
    const wb = XLSX.read(arrayBuffer, { type: 'array' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
    if (data.length < 2) { notify('Excelの読み込みに失敗しました', 'warning'); return; }
    headers = data[0].map(h => String(h).trim());
    rawRows = data.slice(1).filter(row => row.some(cell => cell !== ''));
    rawRows = rawRows.map(row => row.map(cell => String(cell)));
    CI = {};
    headers.forEach((h, i) => { CI[h] = i; });

    const log = document.getElementById('parse-log');
    const requiredCols = ['タスクID', '商品番号', '商品名', 'カラー', '販売金額(税込)'];
    const found = requiredCols.filter(c => CI[c] !== undefined);
    const missing = requiredCols.filter(c => CI[c] === undefined);
    let logHTML = `<div style="color:var(--success);">✓ Excel読込成功: ${headers.length}列</div>`;
    logHTML += `<div style="color:var(--success);">✓ 検出列: ${found.join(', ')}</div>`;
    if (missing.length > 0) {
      logHTML += `<div style="color:var(--danger);">✗ 未検出列: ${missing.join(', ')}</div>`;
    }
    let prodCount = 0, skuCount = 0;
    rawRows.forEach(row => {
      const name = col(row, '商品名');
      if (name && name.trim()) prodCount++;
      else if (col(row, 'カラー') || col(row, 'サイズ') || col(row, 'JAN')) skuCount++;
    });
    logHTML += `<div>→ 商品行: ${prodCount}, SKU行: ${skuCount}, 合計: ${rawRows.length}行</div>`;
    log.innerHTML = logHTML;
    log.style.display = 'block';
    document.getElementById('file-name').textContent = file.name;
    document.getElementById('file-info').textContent = `${headers.length}列 × ${rawRows.length}行 ｜ ソース: 自社システム（Excel）`;
    document.getElementById('upload-status').style.display = 'block';
    document.getElementById('upload-area').classList.add('has-file');
    document.getElementById('btn-next-1').disabled = false;
    notify('Excelを読み込みました', 'success');
  } catch(err) {
    notify('Excelファイルの解析に失敗しました: ' + err.message, 'warning');
  }
}

function parseCSVText(text, file) {
  const parsed = parseCSV(text);
  if (parsed.length < 2) { notify('CSVの読み込みに失敗しました', 'warning'); return; }
  headers = parsed[0];
  rawRows = parsed.slice(1);
  CI = {};
  headers.forEach((h, i) => { CI[h] = i; });

  const log = document.getElementById('parse-log');
  let logHTML = '';
  if (sourceType === 'rakuten') {
    const requiredCols = ['商品管理番号（商品URL）', '商品名', 'SKU管理番号', 'バリエーション項目キー定義'];
    const found = requiredCols.filter(c => CI[c] !== undefined);
    const missing = requiredCols.filter(c => CI[c] === undefined);
    logHTML += `<div style="color:var(--success);">✓ 検出ヘッダー: ${headers.length}列</div>`;
    logHTML += `<div style="color:var(--success);">✓ 必須列一致: ${found.join(', ')}</div>`;
    if (missing.length > 0) {
      logHTML += `<div style="color:var(--danger);">✗ 未検出列: ${missing.join(', ')}</div>`;
    }
  }

  let prodCount = 0, skuCount = 0;
  if (sourceType === 'rakuten') {
    rawRows.forEach(row => {
      const name = col(row, '商品名');
      if (name && name.trim()) prodCount++;
      else if (col(row, 'SKU管理番号')) skuCount++;
    });
  }
  logHTML += `<div>→ 商品行: ${prodCount}, SKU行: ${skuCount}, 合計: ${rawRows.length}行</div>`;
  log.innerHTML = logHTML;
  log.style.display = 'block';
  document.getElementById('file-name').textContent = file.name;
  document.getElementById('file-info').textContent = `${headers.length}列 × ${rawRows.length}行 ｜ ソース: ${sourceType === 'rakuten' ? '楽天' : '自社システム'}`;
  document.getElementById('upload-status').style.display = 'block';
  document.getElementById('upload-area').classList.add('has-file');
  document.getElementById('btn-next-1').disabled = false;
  notify('CSVを読み込みました', 'success');
}

function col(row, name) {
  return CI[name] !== undefined ? (row[CI[name]] || '') : '';
}

function parseCSV(text) {
  const rows = [];
  let current = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];
    if (inQuotes) {
      if (c === '"' && next === '"') { field += '"'; i++; }
      else if (c === '"') { inQuotes = false; }
      else { field += c; }
    } else {
      if (c === '"') { inQuotes = true; }
      else if (c === ',') { current.push(field); field = ''; }
      else if (c === '\n' || (c === '\r' && next === '\n')) {
        current.push(field); field = '';
        if (current.length > 1 || current[0] !== '') rows.push(current);
        current = [];
        if (c === '\r') i++;
      } else if (c === '\r') {
        current.push(field); field = '';
        if (current.length > 1 || current[0] !== '') rows.push(current);
        current = [];
      } else { field += c; }
    }
  }
  current.push(field);
  if (current.length > 1 || current[0] !== '') rows.push(current);
  return rows;
}

// ============================================================
// PROCESS DATA
// ============================================================
function processAndGoStep2() {
  if (sourceType === 'rakuten') { products = structureRakuten(); }
  else { products = structureJisha(); }
  editedFields = {};
  goToStep(2);
}

function structureRakuten() {
  const prods = [];
  let currentProduct = null;
  for (let r = 0; r < rawRows.length; r++) {
    const row = rawRows[r];
    while (row.length < headers.length) row.push('');
    const productName = col(row, '商品名');
    const productId = col(row, '商品管理番号（商品URL）');
    const skuMgmtNo = col(row, 'SKU管理番号');
    if (productName && productName.trim()) {
      currentProduct = {
        rowIndex: r, id: productId, number: col(row, '商品番号'),
        name: productName, cleanName: cleanProductName(productName),
        genreId: col(row, 'ジャンルID'), catchCopy: col(row, 'キャッチコピー'),
        pcDesc: col(row, 'PC用商品説明文'), pcDescClean: extractPcDescClean(col(row, 'PC用商品説明文')),
        tiktokDesc: buildTiktokDesc(col(row, 'PC用商品説明文') || col(row, 'スマートフォン用商品説明文')),
        spDesc: col(row, 'スマートフォン用商品説明文'),
        pcSaleDesc: col(row, 'PC用販売説明文'),
        warehouse: col(row, '倉庫指定'), searchDisplay: col(row, 'サーチ表示'),
        taxType: col(row, '消費税'), taxRate: col(row, '消費税率'),
        pointRate: col(row, 'ポイント変倍率'),
        pointStart: col(row, 'ポイント変倍率適用期間（開始日時）'),
        pointEnd: col(row, 'ポイント変倍率適用期間（終了日時）'),
        varDef: { keys: col(row, 'バリエーション項目キー定義'), names: col(row, 'バリエーション項目名定義'), options: [] },
        images: [], skus: [], options: [], raw: row
      };
      for (let v = 1; v <= 6; v++) {
        const optDef = col(row, `バリエーション${v}選択肢定義`);
        if (optDef) currentProduct.varDef.options.push(optDef);
      }
      for (let img = 1; img <= 20; img++) {
        const imgType = col(row, `商品画像タイプ${img}`);
        const imgPath = col(row, `商品画像パス${img}`);
        if (imgPath) currentProduct.images.push({ type: imgType, path: imgPath });
      }
      for (let i = 1; i <= 10; i++) currentProduct['img' + i] = currentProduct.images[i - 1]?.path || '';
      prods.push(currentProduct);
    } else if (skuMgmtNo && currentProduct) {
      const sku = {
        rowIndex: r, parentId: productId, skuMgmtNo: skuMgmtNo,
        systemSku: col(row, 'システム連携用SKU番号'), price: col(row, '通常購入販売価格'),
        displayPrice: col(row, '表示価格'), stock: col(row, '在庫数'),
        catalogId: col(row, 'カタログID'), catalogNoReason: col(row, 'カタログIDなしの理由'),
        skuImgType: col(row, 'SKU画像タイプ'), skuImgPath: col(row, 'SKU画像パス'),
        shipping: col(row, '送料'), shippingSet: col(row, '配送方法セット管理番号'),
        noshi: col(row, 'のし対応'), restockBtn: col(row, '再入荷お知らせボタン'),
        variants: [], customFields: [], raw: row
      };
      for (let k = 1; k <= 6; k++) {
        const vKey = col(row, `バリエーション項目キー${k}`);
        const vVal = col(row, `バリエーション項目選択肢${k}`);
        if (vKey) sku.variants.push({ key: vKey, value: vVal });
      }
      for (let f = 1; f <= 5; f++) {
        const label = col(row, `自由入力行（項目）${f}`);
        const val = col(row, `自由入力行（値）${f}`);
        if (label || val) sku.customFields.push({ label, value: val });
      }
      currentProduct.skus.push(sku);
    } else if (currentProduct && !skuMgmtNo && !productName) {
      // 商品オプション行（商品名もSKU管理番号もない行）
      const optType = col(row, '選択肢タイプ');
      const optName = col(row, '商品オプション項目名');
      if (optName) {
        const choices = [];
        for (let c = 1; c <= 100; c++) {
          const cv = col(row, `商品オプション選択肢${c}`);
          if (cv) choices.push(cv);
          else break;
        }
        const required = col(row, '商品オプション選択必須');
        currentProduct.options.push({ type: optType, name: optName, choices, required });
      }
    }
  }
  return prods;
}

// ============================================================
// STRUCTURE: Jisha (自社システムExcel)
// ============================================================
function structureJisha() {
  const prods = [];
  let currentProduct = null;
  for (let r = 0; r < rawRows.length; r++) {
    const row = rawRows[r];
    while (row.length < headers.length) row.push('');
    const productName = col(row, '商品名');
    const productNo = col(row, '商品番号');
    const colorVal = col(row, 'カラー');
    const sizeVal = col(row, 'サイズ');
    if (productName && productName.trim()) {
      currentProduct = {
        rowIndex: r,
        id: productNo,
        number: productNo,
        name: productName,
        cleanName: cleanProductName(productName),
        taskId: col(row, 'タスクID'),
        assignee: col(row, '依頼担当'),
        imageUrl: col(row, '画像'),
        category: col(row, 'カテゴリ'),
        saleStartDate: col(row, '販売日'),
        saleEndDate: col(row, '終了日'),
        material: col(row, '素材'),
        costPrice: col(row, '仕入金額(円)') || col(row, '仕入金額'),
        sellPrice: col(row, '販売金額(税込)') || col(row, '販売金額'),
        measureSize: col(row, '採寸サイズ') || '',
        productPoint: col(row, '商品ポイント') || '',
        spec: col(row, '仕様') || '',
        modelShootDate: col(row, 'モデル撮影予定日') || '',
        productionStaff: col(row, '制作担当者') || '',
        laundryLabel: col(row, '洗濯表記') || '',
        shippingMethod: col(row, '配送方法'),
        referenceUrl: col(row, '参考URL'),
        memo: col(row, 'メモ'),
        images: [],
        skus: [],
        raw: row
      };
      const imgUrl = col(row, '画像');
      if (imgUrl && imgUrl.trim()) {
        currentProduct.images.push({ url: imgUrl.trim() });
      }
      prods.push(currentProduct);
    } else if (currentProduct && (colorVal || sizeVal)) {
      const skuProductNo = col(row, '商品番号');
      const janCode = col(row, 'JAN');
      // 商品番号をSKU商品番号から導出: nlpt495-2602-EC-M → nlpt495-2602
      if (skuProductNo && !currentProduct.number) {
        const parts = skuProductNo.split('-');
        if (parts.length >= 2) currentProduct.number = parts.slice(0, 2).join('-');
        currentProduct.id = currentProduct.number;
      }
      if (skuProductNo && currentProduct.number === col(currentProduct.raw, '商品番号')) {
        const parts = skuProductNo.split('-');
        if (parts.length >= 2) {
          currentProduct.number = parts.slice(0, 2).join('-');
          currentProduct.id = currentProduct.number;
        }
      }
      // SKU商品番号からカラーコードを抽出: nlpt495-2603-EC-M → EC
      let colorCode = '';
      if (skuProductNo) {
        const parts = skuProductNo.split('-');
        if (parts.length >= 3) colorCode = parts[2];
      }
      const sku = {
        rowIndex: r,
        parentId: currentProduct.id,
        skuMgmtNo: skuProductNo || '',
        systemSku: janCode || '',
        jan: janCode || '',
        color: colorVal || '',
        colorCode: colorCode,
        size: sizeVal || '',  // L列＝サイズ
        price: currentProduct.sellPrice || '',  // 販売金額は親行のR列をそのまま使用
        variants: [],
        customFields: [],
        raw: row
      };
      if (sku.color) sku.variants.push({ key: 'カラー', value: sku.color });
      if (sku.size) sku.variants.push({ key: 'サイズ', value: sku.size });
      if (janCode) sku.customFields.push({ label: '型番', value: janCode });
      currentProduct.skus.push(sku);
    }
  }
  return prods;
}

// ============================================================
// IMAGE URL
// ============================================================
function buildRakutenImgUrl(imgPath) {
  if (!imgPath) return '';
  return `https://image.rakuten.co.jp/noahl/cabinet${imgPath}`;
}

// 品番から楽天商品画像URLリスト（最大20枚）を自動生成
// 例: nlpt495-2603 → base=nlpt495, folder=2026/202603/
// 1枚目: {base}-1r.jpg  最後: {base}-11.jpg  最後から2番目: {base}-10.jpg
// 残り: カラーコード別に均等分配 {base}-{colorCode}1.jpg ～
function generateRakutenImageUrls(prod) {
  const rm = MASTER.malls.rakuten;
  const maxImages = rm.maxProductImages || 20;
  const number = prod.number || '';
  if (!number) return [];

  // 品番を分解: nlpt495-2603 → base=nlpt495, ymCode=2603
  const parts = number.split('-');
  if (parts.length < 2) return [];
  const base = parts[0];
  const ymCode = parts[1]; // 2603

  // フォルダパス: 2603 → 2026/202603/
  const yy = ymCode.substring(0, 2);
  const folder = `20${yy}/20${ymCode}/`;
  const cabinetBase = rm.imgCabinetBase || '/shohin/';
  const urlBase = `https://image.rakuten.co.jp/noahl/cabinet${cabinetBase}${folder}${base}`;

  // SKUからユニークなカラーコードを取得（出現順を維持）
  const colorCodes = [];
  const seen = new Set();
  prod.skus.forEach(sku => {
    const code = sku.colorCode || '';
    if (code && !seen.has(code)) {
      seen.add(code);
      colorCodes.push(code.toLowerCase());
    }
  });

  if (colorCodes.length === 0) return [`${urlBase}.jpg`];

  const urls = [];

  // 1枚目: メイン画像
  urls.push(`${urlBase}-1r.jpg`);

  // カラバリ枚数の計算: 全体 - 固定3枚(1r, -10, -11)
  const colorSlots = maxImages - 3;
  const perColor = Math.floor(colorSlots / colorCodes.length);
  const extraSlots = colorSlots - perColor * colorCodes.length;

  // カラーバリエーション画像（余り枠は先頭の色から順に1枚ずつ追加）
  colorCodes.forEach((code, idx) => {
    const count = perColor + (idx < extraSlots ? 1 : 0);
    for (let i = 1; i <= count; i++) {
      urls.push(`${urlBase}-${code}${i}.jpg`);
    }
  });

  // 最後から2番目: -10
  urls.push(`${urlBase}-10.jpg`);
  // 最後: -11
  urls.push(`${urlBase}-11.jpg`);

  return urls;
}

// 品番img画像URL生成: nltp497img.jpg
function generateImgUrl(prod) {
  const rm = MASTER.malls.rakuten;
  const number = prod.number || '';
  if (!number) return '';
  const parts = number.split('-');
  if (parts.length < 2) return '';
  const base = parts[0];
  const ymCode = parts[1];
  const yy = ymCode.substring(0, 2);
  const folder = `20${yy}/20${ymCode}/`;
  const cabinetBase = rm.imgCabinetBase || '/shohin/';
  return `https://image.rakuten.co.jp/noahl/cabinet${cabinetBase}${folder}${base}img.jpg`;
}

// 色別img画像URLマップ生成: { 1: "...nltp497imgbe.jpg", 2: "...nltp497imggy.jpg", ... }
function generateColorImgUrlMap(prod) {
  const rm = MASTER.malls.rakuten;
  const number = prod.number || '';
  if (!number) return {};
  const parts = number.split('-');
  if (parts.length < 2) return {};
  const base = parts[0];
  const ymCode = parts[1];
  const yy = ymCode.substring(0, 2);
  const folder = `20${yy}/20${ymCode}/`;
  const cabinetBase = rm.imgCabinetBase || '/shohin/';
  const urlBase = `https://image.rakuten.co.jp/noahl/cabinet${cabinetBase}${folder}${base}`;

  const colorCodes = [];
  const seen = new Set();
  prod.skus.forEach(sku => {
    const code = sku.colorCode || '';
    if (code && !seen.has(code)) {
      seen.add(code);
      colorCodes.push(code.toLowerCase());
    }
  });

  const map = {};
  colorCodes.forEach((code, idx) => {
    map[idx + 1] = `${urlBase}img${code}.jpg`;
  });
  return map;
}

// 色番号別の画像URLマップを生成: { 1: [url1, url2, ...], 2: [...], ... }
function generateColorImageMap(prod) {
  const rm = MASTER.malls.rakuten;
  const maxImages = rm.maxProductImages || 20;
  const number = prod.number || '';
  if (!number) return {};

  const parts = number.split('-');
  if (parts.length < 2) return {};
  const base = parts[0];
  const ymCode = parts[1];
  const yy = ymCode.substring(0, 2);
  const folder = `20${yy}/20${ymCode}/`;
  const cabinetBase = rm.imgCabinetBase || '/shohin/';
  const urlBase = `https://image.rakuten.co.jp/noahl/cabinet${cabinetBase}${folder}${base}`;

  const colorCodes = [];
  const seen = new Set();
  prod.skus.forEach(sku => {
    const code = sku.colorCode || '';
    if (code && !seen.has(code)) {
      seen.add(code);
      colorCodes.push(code.toLowerCase());
    }
  });

  if (colorCodes.length === 0) return {};

  const perColor = rm.imagesPerColor || 10;
  const map = {};
  colorCodes.forEach((code, idx) => {
    const urls = [];
    for (let i = 1; i <= perColor; i++) {
      urls.push(`${urlBase}-${code}${i}.jpg`);
    }
    map[idx + 1] = urls;
  });
  return map;
}

// ============================================================
// STEP 3: モール別CSV出力プレビュー
// ============================================================
function renderRmsPreview() {
  const container = document.getElementById('rms-preview-container');
  if (!container) return;

  // Step3のh2, desc, actionsを非表示にしてフルスクリーン化
  const panel3 = document.getElementById('panel-3');
  if (panel3) {
    const h2 = panel3.querySelector('h2');
    const desc = panel3.querySelector('.desc');
    const actions = panel3.querySelector('.actions');
    if (h2) h2.style.display = 'none';
    if (desc) desc.style.display = 'none';
    if (actions) actions.style.display = 'none';
    panel3.style.padding = '0';
  }

  const result = convertToRakuten();
  if (!result || !result.rows || result.rows.length === 0) {
    container.innerHTML = '<p style="color:#999; text-align:center; padding:40px;">変換データがありません。</p>';
    return;
  }
  const rows = result.rows;
  const rH = result.headers;
  const RI = {};
  rH.forEach((h, i) => RI[h] = i);

  // 商品数カウント
  let prodCount = 0;
  rows.forEach(row => { if (row[RI['商品名']] && row[RI['商品名']].trim()) prodCount++; });

  // モール別CSV出力タブ
  const mallPreviews = [
    { tab: 'mall_futureshop', label: 'FutureShop', convertFn: 'futureshop' },
    { tab: 'mall_zozo', label: 'ZOZO', convertFn: 'zozo' },
    { tab: 'mall_rakufashion', label: '楽天ファッション', convertFn: 'rakufashion' },
    { tab: 'mall_tiktok', label: 'TikTok', convertFn: 'tiktok' },
  ];

  let html = '';
  html += '<div id="rms3-layout-root" style="display:flex; flex-direction:column; overflow:hidden; width:100%; box-sizing:border-box;">';

  // モールタブバー
  html += '<div style="display:flex; align-items:center; background:#f5f5f5; border-bottom:1px solid #ddd; padding:0 16px; flex-shrink:0;">';
  html += '<div style="font-size:15px; font-weight:700; color:#333; padding:12px 0; margin-right:20px;">CSV出力プレビュー</div>';
  mallPreviews.forEach((mp, idx) => {
    const isActive = idx === 0;
    html += '<div class="mall-csv-tab" data-mall-tab="' + mp.tab + '" onclick="switchMallCsvTab(\'' + mp.tab + '\',\'' + mp.convertFn + '\')" style="padding:12px 24px; cursor:pointer; font-size:14px; font-weight:700; border-radius:6px 6px 0 0; margin-bottom:-1px; border:1px solid ' + (isActive ? '#1976d2' : 'transparent') + '; border-bottom:1px solid ' + (isActive ? '#fff' : 'transparent') + '; background:' + (isActive ? '#fff' : 'transparent') + '; color:' + (isActive ? '#1976d2' : '#666') + ';">' + mp.label + '</div>';
  });
  html += '</div>';

  // モールコンテンツ
  mallPreviews.forEach((mp, idx) => {
    html += '<div class="mall-csv-content" data-mall-tab="' + mp.tab + '" style="flex:1; min-height:0; overflow:auto; padding:20px; display:' + (idx === 0 ? '' : 'none') + ';">';
    html += '<div class="mall-preview-area" data-mall="' + mp.tab + '" style="font-size:12px;">';
    html += '<p style="color:#999;">読み込み中...</p>';
    html += '</div>';
    html += '</div>';
  });

  // フッター
  html += '<div style="padding:12px 24px; border-top:1px solid #ddd; background:#fff; display:flex; justify-content:space-between; align-items:center; flex-shrink:0;">';
  html += '<button class="btn btn-outline" onclick="goToStep(2)">← 戻る</button>';
  html += '<div style="font-size:13px; color:#666;">' + prodCount + '商品 / ' + rows.length + '行</div>';
  html += '<button class="btn btn-primary" onclick="goToStep(4)">ダウンロードへ →</button>';
  html += '</div>';

  html += '</div>'; // rms3-layout-root

  container.innerHTML = html;

  // 高さ調整
  const root = document.getElementById('rms3-layout-root');
  if (root) {
    const adjustHeight = () => {
      const top = root.getBoundingClientRect().top;
      root.style.height = (window.innerHeight - top) + 'px';
    };
    adjustHeight();
    window._rms3ResizeHandler = adjustHeight;
    window.addEventListener('resize', adjustHeight);
  }

  // 最初のタブ(FutureShop)を自動生成
  switchMallCsvTab('mall_futureshop', 'futureshop');
}


function switchMallCsvTab(tabId, convertFn) {
  // タブ切替
  document.querySelectorAll('.mall-csv-tab').forEach(el => {
    const active = el.dataset.mallTab === tabId;
    el.style.border = active ? '1px solid #1976d2' : '1px solid transparent';
    el.style.borderBottom = active ? '1px solid #fff' : '1px solid transparent';
    el.style.background = active ? '#fff' : 'transparent';
    el.style.color = active ? '#1976d2' : '#666';
  });
  // コンテンツ切替
  document.querySelectorAll('.mall-csv-content').forEach(el => {
    el.style.display = el.dataset.mallTab === tabId ? '' : 'none';
  });
  // プレビュー生成
  refreshMallPreview(tabId, convertFn);
}

function refreshMallPreview(tabId, mallKey) {
  const area = document.querySelector('.mall-preview-area[data-mall="' + tabId + '"]');
  if (!area) return;
  let result;
  try {
    switch (mallKey) {
      case 'futureshop': result = convertToFutureshop(); break;
      case 'tiktok': result = convertToTiktok(); break;
      case 'zozo': result = convertToZozo(); break;
      case 'rakufashion': result = convertToRakufashion(); break;
      default: area.innerHTML = '<p style="color:#999;">未対応のモールです。</p>'; return;
    }
  } catch (e) {
    area.innerHTML = '<p style="color:#c00;">変換エラー: ' + esc(e.message) + '</p>';
    return;
  }
  if (!result) { area.innerHTML = '<p style="color:#999;">変換データがありません。</p>'; return; }

  // workbook（TikTok xlsx等）: Templateシートをプレビュー表示
  if (result.workbook) {
    const wb = result.workbook;
    const wsName = wb.SheetNames.find(n => n === 'Template') || wb.SheetNames[0];
    const ws = wb.Sheets[wsName];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
    if (!data || data.length === 0) { area.innerHTML = '<p style="color:#999;">データなし</p>'; return; }
    const headers = data[0].map(String);
    const rows = data.slice(6); // 7行目以降がデータ
    let html = '<div style="margin-bottom:8px;"><span style="font-size:11px; color:#888;">(' + rows.length + '行 × ' + headers.length + '列) ※Templateシート7行目以降</span></div>';
    html += buildCsvPreviewTable(headers, rows);
    area.innerHTML = html;
    return;
  }

  // FutureShopは複数シートを返す
  if (result.sheets) {
    let html = '';
    result.sheets.forEach((file, fi) => {
      html += '<div style="margin-bottom:20px;">';
      html += '<div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">';
      html += '<h5 style="font-size:14px; color:#333; margin:0; font-weight:700;">' + esc(file.name) + '</h5>';
      html += '<span style="font-size:12px; color:#888;">(' + file.rows.length + '行 × ' + file.headers.length + '列)</span>';
      html += '</div>';
      html += buildCsvPreviewTable(file.headers, file.rows);
      html += '</div>';
    });
    area.innerHTML = html;
  } else if (result.headers && result.rows) {
    let html = '<div style="margin-bottom:8px;">';
    html += '<span style="font-size:11px; color:#888;">(' + result.rows.length + '行 × ' + result.headers.length + '列)</span>';
    html += '</div>';
    html += buildCsvPreviewTable(result.headers, result.rows);
    area.innerHTML = html;
  } else {
    area.innerHTML = '<p style="color:#999;">データなし</p>';
  }
}

function buildCsvPreviewTable(headers, rows) {
  let html = '<div style="overflow-x:auto; max-height:500px; overflow-y:auto; border:1px solid #ddd; border-radius:4px;">';
  html += '<table style="width:100%; border-collapse:collapse; font-size:13px; white-space:nowrap;">';
  html += '<thead><tr>';
  headers.forEach(h => {
    html += '<th style="background:#f0f0f0; padding:8px 10px; border:1px solid #ddd; font-weight:600; position:sticky; top:0; z-index:1; font-size:12px;">' + esc(h) + '</th>';
  });
  html += '</tr></thead><tbody>';
  rows.forEach((row, ri) => {
    const bg = ri % 2 === 0 ? '#fff' : '#fafafa';
    html += '<tr style="background:' + bg + ';">';
    headers.forEach((h, ci) => {
      const val = row[ci] || '';
      const truncVal = val.length > 60 ? val.substring(0, 60) + '…' : val;
      html += '<td contenteditable="true" style="padding:6px 10px; border:1px solid #eee; max-width:200px; overflow:hidden; text-overflow:ellipsis; outline:none; cursor:text;" title="' + esc(val) + '">' + esc(truncVal) + '</td>';
    });
    html += '</tr>';
  });
  html += '</tbody></table></div>';
  return html;
}

function switchStep3RmsProduct(idx) {
  document.querySelectorAll('.step3-rms-panel').forEach(p => p.style.display = 'none');
  const panel = document.querySelectorAll('.step3-rms-panel')[idx];
  if (panel) panel.style.display = 'flex';
  // 左サイドバーのアクティブ表示切替
  document.querySelectorAll('.s3rms-prod-item').forEach((el, i) => {
    el.style.borderLeftColor = i === idx ? 'var(--primary)' : 'transparent';
    el.style.background = i === idx ? '#e8e2dc' : '';
  });
}

function switchRmsTab(tabId, gi, sideEl) {
  // タブコンテンツ切替
  document.querySelectorAll('.rms-tab-content[data-gi="' + gi + '"]').forEach(el => {
    el.style.display = el.dataset.tab === tabId ? '' : 'none';
  });
  // タブヘッダー切替
  document.querySelectorAll('.rms-tab[data-gi="' + gi + '"]').forEach(el => {
    const active = el.dataset.tab === tabId;
    el.style.background = active ? '#333' : '#f5f5f5';
    el.style.color = active ? '#fff' : '#666';
    el.style.borderColor = active ? '#333' : '#ddd';
  });
  // サイドバー切替
  document.querySelectorAll('.rms-side-item[data-gi="' + gi + '"]').forEach(el => {
    const active = el.dataset.tab === tabId;
    el.style.background = active ? '#555' : 'transparent';
    el.style.color = active ? 'white' : '#ccc';
    el.style.borderLeftColor = active ? '#bf0000' : 'transparent';
  });
}

function switchRmsProduct(idx, btn) {
  document.querySelectorAll('.rms-product-panel').forEach(p => p.style.display = 'none');
  const panel = document.querySelectorAll('.rms-product-panel')[idx];
  if (panel) panel.style.display = 'flex';
  if (btn) {
    btn.closest('div').querySelectorAll('button').forEach(b => { b.classList.remove('btn-primary'); b.classList.add('btn-outline'); });
    btn.classList.remove('btn-outline');
    btn.classList.add('btn-primary');
  }
}

// フォーカス時に元の値を記憶（修正検知用）
function onRmsFocus(el) {
  const val = el.tagName === 'TEXTAREA' ? el.value : el.innerText;
  el.dataset._origVal = val;
}

// RMSプレビュー編集ハンドラ: 商品フィールド
function onRmsEdit(el, gi) {
  const field = el.dataset.rmsField;
  // textarea の場合は value、contenteditable の場合は innerText
  const val = el.tagName === 'TEXTAREA' ? el.value.trim() : el.innerText.trim();
  if (!field || !products[gi]) return;
  // 修正検知: 元の値と違えば赤くする
  const origVal = (el.dataset._origVal || '').trim();
  if (val !== origVal) {
    el.style.borderColor = '#bf0000';
    el.style.background = '#fff5f5';
  }
  const prod = products[gi];
  switch (field) {
    case 'number': prod.number = val; prod.id = val; break;
    case 'productNo': prod._productNo = val; break;
    case 'cleanName': prod.cleanName = val; prod.name = val; break;
    case 'catchCopy': prod._catchCopy = val; break;
    case 'sellPrice': prod.sellPrice = val; break;
    case 'displayPrice': prod._displayPrice = val; break;
    case 'taxType': prod._taxType = val; break;
    case 'salePeriodStart': prod._salePeriodStart = val; break;
    case 'salePeriodEnd': prod._salePeriodEnd = val; break;
    case 'orderLimit': prod._orderLimit = val; break;
    case 'stockType': prod._stockType = val; break;
    case 'restockBtn': prod._restockBtn = val; break;
    case 'shippingFee': prod._shippingFee = val; break;
    case 'indivShipping': prod._indivShipping = val; break;
    case 'shippingCat1': prod._shippingCat1 = val; break;
    case 'shippingCat2': prod._shippingCat2 = val; break;
    case 'shippingSet': prod._shippingSet = val; break;
    case 'shippingName': prod._shippingName = val; break;
    case 'asuraku': prod._asuraku = val; break;
    case 'noshi': prod._noshi = val; break;
    case 'controlCol': prod._controlCol = val; break;
    case 'genreId': prod._autoGenreId = val; break;
    case 'catalogId': prod._catalogId = val; break;
    case 'catalogReason': prod._catalogReason = val; break;
    case 'pcDesc': prod._pcDesc = val; break;
    case 'spDesc': prod._spDesc = val; break;
    case 'saleDesc': prod._saleDesc = val; break;
    case 'pointRate': prod._pointRate = val; break;
    case 'pointStart': prod._pointStart = val; break;
    case 'pointEnd': prod._pointEnd = val; break;
  }
}

// RMSプレビュー編集ハンドラ: SKUフィールド
function onRmsSkuEdit(el, gi, si) {
  const field = el.dataset.rmsSku;
  const val = el.innerText.trim();
  // 修正検知
  const origVal = (el.dataset._origVal || '').trim();
  if (val !== origVal) {
    el.style.borderColor = '#bf0000';
    el.style.background = '#fff5f5';
  }
  if (!products[gi] || !products[gi].skus[si]) return;
  const sku = products[gi].skus[si];
  switch (field) {
    case 'price': sku.price = val; break;
    case 'stock': sku._stock = val; break;
    case 'skuMgmt': sku._skuMgmtOverride = val; break;
    case 'systemSku': sku._systemSkuOverride = val; break;
    case 'color': sku.color = val; break;
    case 'size': sku.size = val; break;
    case 'jan': sku.jan = val; break;
    case 'catalogReason': sku._catalogReason = val; break;
    case 'skuImgType': sku._skuImgType = val; break;
    case 'skuImgPath': sku._skuImgPath = val; break;
  }
}

// ============================================================
// RENDER STEP 2
// ============================================================
function renderStep2() {
  const totalProducts = products.length;
  const totalSkus = products.reduce((s, p) => s + p.skus.length, 0);
  const totalImages = products.reduce((s, p) => s + p.images.length, 0);
  const totalOptions = products.reduce((s, p) => s + (p.options ? p.options.length : 0), 0);
  const src = sourceType === 'rakuten' ? '楽天' : sourceType === 'jisha' ? '自社Excel' : '自社';
  const containerEl = document.querySelector('.container');
  const panelEl = document.getElementById('panel-2');
  const headerText = document.getElementById('step2-header-text');
  if (sourceType === 'rakuten') {
    // 楽天: summary-cardsは非表示にし、左サイドバー内に統計を表示
    document.getElementById('summary-cards').innerHTML = '';
    document.getElementById('step2-jisha-view').style.display = 'none';
    document.getElementById('step2-rms-view').style.display = '';
    if (headerText) headerText.style.display = 'none';
    // RMSフルスクリーンモード
    document.body.classList.add('rms-fullscreen');
    if (containerEl) { containerEl.style.maxWidth = 'none'; containerEl.style.padding = '0'; containerEl.style.margin = '0'; containerEl.style.width = '100%'; }
    if (panelEl) { panelEl.style.padding = '0'; panelEl.style.margin = '0'; panelEl.style.borderRadius = '0'; panelEl.style.boxShadow = 'none'; panelEl.style.background = 'transparent'; }
    const rmsView = document.getElementById('step2-rms-view');
    if (rmsView) {
      rmsView.style.background = '#f5f0eb';
      rmsView.style.width = '100%';
      rmsView.style.overflow = 'hidden';
    }
    const step2Actions = document.getElementById('step2-actions');
    if (step2Actions) step2Actions.style.display = 'none';
    renderStep2Rms();
  } else {
    document.getElementById('summary-cards').innerHTML = '';
    document.getElementById('step2-jisha-view').style.display = '';
    document.getElementById('step2-rms-view').style.display = 'none';
    if (headerText) headerText.style.display = 'none';
    // RMSフルスクリーンモード（overflow:hiddenのまま、内部スクロール）
    document.body.classList.add('rms-fullscreen');
    if (containerEl) { containerEl.style.maxWidth = 'none'; containerEl.style.padding = '0'; containerEl.style.margin = '0'; containerEl.style.width = '100%'; }
    if (panelEl) { panelEl.style.padding = '0'; panelEl.style.margin = '0'; panelEl.style.borderRadius = '0'; panelEl.style.boxShadow = 'none'; panelEl.style.background = 'transparent'; }
    if (window._rmsResizeHandler) { window.removeEventListener('resize', window._rmsResizeHandler); window._rmsResizeHandler = null; }
    const step2Actions = document.getElementById('step2-actions');
    if (step2Actions) step2Actions.style.display = 'none';
    renderJishaRmsView();
  }
}

function renderStep2Rms() {
  const container = document.getElementById('step2-rms-view');
  if (!container || products.length === 0) { if (container) container.innerHTML = '<p style="color:#999; text-align:center; padding:40px;">楽天データがありません。</p>'; return; }

  let html = '';
  // === フルスクリーンレイアウト（ステップバーの下に収まる） ===
  html += '<div id="rms-layout-root" style="display:flex; flex-direction:column; overflow:hidden; padding:0 8px 8px 0; width:100%; box-sizing:border-box;">';
  // 2カラムレイアウト: 左=品番リスト（240px固定）、右=商品詳細（残り）
  html += '<div style="display:grid; grid-template-columns:240px 1fr; flex:1; min-height:0; overflow:hidden;">';

  // --- 左: 品番リスト（画像+品番、縦スクロール） ---
  html += '<div id="s2rms-product-list" style="background:#f7f5f3; border:1px solid var(--border); border-radius:8px 0 0 8px; overflow-y:auto; overflow-x:hidden; min-height:0;">';
  html += '<div style="padding:8px 14px; border-bottom:1px solid var(--border); position:sticky; top:0; background:#f7f5f3; z-index:1;">';
  html += '<div style="font-size:13px; font-weight:700; color:var(--primary-dark); margin-bottom:4px;">商品一覧 (' + products.length + ')</div>';
  html += '<div style="display:flex; gap:6px; font-size:10px; color:#888;">';
  html += '<span style="background:#ece8e3; padding:1px 6px; border-radius:8px;"><strong>' + products.reduce((s,p)=>s+p.skus.length,0) + '</strong> SKU</span>';
  html += '<span style="background:#ece8e3; padding:1px 6px; border-radius:8px;"><strong>' + products.reduce((s,p)=>s+p.images.length,0) + '</strong> 画像</span>';
  html += '</div></div>';
  products.forEach((p, i) => {
    const thumbUrl = p.imageUrl || (p.images.length > 0 ? buildRakutenImgUrl(p.images[0].path) : '');
    const label = p.number || p.id || '';
    const shortName = (p.cleanName || p.name || '').substring(0, 18);
    html += '<div class="s2rms-prod-item" data-idx="' + i + '" onclick="switchStep2RmsProduct(' + i + ')" style="padding:10px 12px; cursor:pointer; border-bottom:1px solid #ece8e3; display:flex; align-items:center; gap:10px; transition:background 0.15s;' + (i === 0 ? ' background:#e8e2dc; border-left:3px solid var(--primary);' : ' border-left:3px solid transparent;') + '">';
    html += '<div style="width:60px; height:60px; flex-shrink:0; border:1px solid #ddd; border-radius:4px; background:#fff; overflow:hidden; display:flex; align-items:center; justify-content:center;">';
    if (thumbUrl) html += '<img src="' + esc(thumbUrl) + '" style="max-width:100%; max-height:100%; object-fit:cover;" onerror="this.style.display=\'none\'" loading="lazy">';
    else html += '<span style="font-size:10px; color:#ccc;">-</span>';
    html += '</div>';
    html += '<div style="min-width:0; flex:1;">';
    html += '<div style="font-size:13px; font-weight:600; color:#333; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' + esc(label) + '</div>';
    html += '<div style="font-size:12px; color:#888; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-top:2px;">' + esc(shortName) + '</div>';
    html += '<div style="font-size:11px; color:#aaa; margin-top:2px;">SKU:' + p.skus.length + ' / 画像:' + p.images.length + '</div>';
    html += '</div></div>';
  });
  html += '</div>';

  // --- 右: 商品詳細パネル群 ---
  html += '<div style="min-width:0; min-height:0; display:flex; flex-direction:column; overflow:hidden;">';

  products.forEach((prod, gi) => {
    const imgUrl = prod.imageUrl || (prod.images.length > 0 ? (prod.images[0].url || buildRakutenImgUrl(prod.images[0].path)) : '');
    const E = 'style="padding:6px 10px; border:1px solid #eee; border-radius:4px; background:#fafafa; font-size:13px;"';

    html += '<div class="step2-rms-panel" data-rms-idx="' + gi + '" style="display:' + (gi > 0 ? 'none' : 'flex') + '; flex-direction:column; flex:1; min-height:0; min-width:0; overflow:hidden;">';

    // メインコンテンツ
    html += '<div style="flex:1; min-width:0; min-height:0; border:1px solid #ddd; border-radius:6px; background:#fff; display:flex; flex-direction:column; overflow:hidden;">';

    // === スクロール領域（パンくず・ヘッダー・タブバー・タブコンテンツすべて含む） ===
    html += '<div class="s2rms-tab-area" data-gi="' + gi + '" style="flex:1; min-height:0; overflow-y:scroll; overflow-x:hidden;">';

    // パンくず（スクロールで消える）
    const srcLabel = sourceType === 'rakuten' ? '楽天CSV取込' : '自社Excel取込';
    html += '<div style="padding:10px 20px; font-size:13px; color:#888; border-bottom:1px solid #eee;">' + srcLabel + ' &gt; 商品確認 &gt; <span style="color:#333; font-weight:600;">' + esc(prod.number || prod.id || '') + '</span></div>';

    // 基本情報エリア（タブの上、スクロールで消える）— RMS準拠
    const warehouse = prod.warehouse || '0';
    html += '<div style="padding:16px 24px;">';
    // 商品画像 + 基本フィールド
    html += '<div style="display:flex; gap:16px; align-items:flex-start;">';
    html += '<div style="flex-shrink:0; text-align:center;">';
    html += '<div style="width:80px; height:80px; border:1px solid #ddd; border-radius:4px; background:#fff; display:flex; align-items:center; justify-content:center; overflow:hidden;">';
    if (imgUrl) html += '<img src="' + esc(imgUrl) + '" style="max-width:100%; max-height:100%; object-fit:contain;" onerror="this.parentElement.innerHTML=\'<div style=color:#ccc;font-size:10px>No Image</div>\'">';
    else html += '<div style="color:#ccc; font-size:10px;">No Image</div>';
    html += '</div>';
    html += '<div style="font-size:10px; color:#1565c0; margin-top:4px; cursor:pointer;">商品ページ<br>URLコピー</div>';
    html += '</div>';
    html += '<div style="flex:1; min-width:0;">';
    // 商品管理番号 / 商品番号
    html += '<div style="display:flex; gap:24px; margin-bottom:10px; font-size:13px;">';
    html += '<div><span style="color:#666;">商品管理番号（商品URL）</span><div style="margin-top:2px; font-weight:600; color:#333;">' + esc(prod.id || '') + '</div></div>';
    html += '<div><span style="color:#666;">商品番号</span><div style="margin-top:2px; padding:4px 8px; border:1px solid #eee; border-radius:4px; background:#fafafa; min-width:120px;">' + esc(prod.number || '') + '</div></div>';
    html += '</div>';
    // 商品名
    html += '<div style="margin-bottom:8px;">';
    html += '<div style="font-size:13px; color:#666; margin-bottom:2px;">商品名 <span style="background:#bf0000; color:#fff; font-size:10px; padding:1px 6px; border-radius:3px; margin-left:4px;">必須</span></div>';
    html += '<div style="padding:6px 10px; border:1px solid #eee; border-radius:4px; background:#fafafa; font-size:13px; line-height:1.5; word-break:break-all;">' + esc(prod.cleanName || prod.name || '') + '</div>';
    html += '</div>';
    // キャッチコピー
    html += '<div style="margin-bottom:10px;">';
    html += '<div style="font-size:13px; color:#666; margin-bottom:2px;">キャッチコピー</div>';
    html += '<div style="padding:6px 10px; border:1px solid #eee; border-radius:4px; background:#fafafa; font-size:13px;">' + esc(prod.catchCopy || '') + '</div>';
    html += '</div>';
    // 倉庫指定 / サーチ表示（横並び）
    html += '<div style="display:flex; gap:24px; align-items:center; font-size:13px;">';
    html += '<div style="display:flex; align-items:center; gap:6px;"><span style="color:#666;">倉庫指定</span>';
    html += '<span style="background:' + (warehouse === '0' ? '#4caf50' : '#ff9800') + '; color:white; padding:2px 10px; border-radius:10px; font-size:11px; font-weight:600;">' + (warehouse === '0' ? '販売中' : '倉庫') + '</span></div>';
    html += '<div style="display:flex; align-items:center; gap:6px;"><span style="color:#666;">サーチ表示</span>';
    const searchDisp = (prod.searchDisplay || '1') === '1';
    html += '<span style="background:' + (searchDisp ? '#4caf50' : '#9e9e9e') + '; color:white; padding:2px 10px; border-radius:10px; font-size:11px; font-weight:600;">' + (searchDisp ? '表示' : '非表示') + '</span></div>';
    html += '</div>';
    html += '</div></div></div>';

    // 横タブ（楽天RMS風）— sticky固定でスクロールしても残る
    const tabItems = [
      {label:'バリエーション', tab:'s2var'},
      {label:'販売・価格', tab:'s2price'},
      {label:'在庫・配送', tab:'s2stock'},
      {label:'製品情報', tab:'s2product'},
      {label:'ページデザイン', tab:'s2design'},
    ];
    html += '<div style="display:flex; border-bottom:2px solid #ccc; padding:0 16px; background:#fafafa; position:sticky; top:0; z-index:2;">';
    tabItems.forEach((item, idx) => {
      const isActive = idx === 0;
      html += '<div class="s2rms-side" data-tab="' + item.tab + '" data-gi="' + gi + '" onclick="switchS2RmsTab(\'' + item.tab + '\',' + gi + ')" style="padding:10px 20px; cursor:pointer; font-size:13px; font-weight:600; border:1px solid ' + (isActive ? '#ccc' : 'transparent') + '; border-bottom:' + (isActive ? '2px solid #fff' : '2px solid transparent') + '; margin-bottom:-2px; border-radius:6px 6px 0 0; background:' + (isActive ? '#fff' : 'transparent') + '; color:' + (isActive ? '#333' : '#888') + ';">';
      html += item.label + '</div>';
    });
    html += '</div>';

    // === タブコンテンツ ===
    html += '<div style="padding:16px 24px 24px;">';

    // バリエーション（RMS準拠: バリエーション定義 + SKU管理番号テーブル）
    html += '<div class="s2rms-tab" data-tab="s2var" data-gi="' + gi + '" style="padding:16px 0;">';
    html += '<h4 style="font-size:16px; color:#333; margin:0 0 14px; border-bottom:2px solid #333; padding-bottom:8px;">バリエーション設定</h4>';
    html += '<div style="font-size:13px; color:#666; margin-bottom:10px;">バリエーション</div>';
    if (prod.skus.length > 0) {
      // バリエーション名のヘッダーを取得（楽天はvarDef、自社はSKUのvariantsから導出）
      let varKeyNames = [];
      if (prod.varDef && prod.varDef.names) {
        varKeyNames = prod.varDef.names.split('|');
      } else if (prod.skus.length > 0 && prod.skus[0].variants && prod.skus[0].variants.length > 0) {
        varKeyNames = prod.skus[0].variants.map(v => v.key);
      }
      html += '<div style="overflow-x:auto;"><table style="width:100%; border-collapse:collapse; font-size:13px;">';
      html += '<thead><tr>';
      varKeyNames.forEach(kn => { html += '<th style="background:#f5f5f5; padding:8px 10px; border:1px solid #ddd; font-weight:600;">' + esc(kn) + '</th>'; });
      html += '<th style="background:#f5f5f5; padding:8px 10px; border:1px solid #ddd; font-weight:600;">SKU管理番号（半角32文字）</th>';
      html += '<th style="background:#f5f5f5; padding:8px 10px; border:1px solid #ddd; font-weight:600;">システム連携用SKU番号（全角48文字）</th>';
      html += '</tr></thead><tbody>';
      prod.skus.forEach((sku, si) => {
        html += '<tr style="background:' + (si % 2 === 0 ? '#fff' : '#fafafa') + ';">';
        // バリエーション値
        if (sku.variants) {
          sku.variants.forEach(v => { html += '<td style="padding:8px 10px; border:1px solid #ddd;">' + esc(v.value || '') + '</td>'; });
          // 足りない列を埋める
          for (let vi = sku.variants.length; vi < varKeyNames.length; vi++) html += '<td style="padding:8px 10px; border:1px solid #ddd;"></td>';
        } else {
          varKeyNames.forEach(() => { html += '<td style="padding:8px 10px; border:1px solid #ddd;"></td>'; });
        }
        html += '<td style="padding:8px 10px; border:1px solid #ddd;">' + esc(sku.skuMgmtNo || '') + '</td>';
        html += '<td style="padding:8px 10px; border:1px solid #ddd;">' + esc(sku.systemSku || '') + '</td>';
        html += '</tr>';
      });
      html += '</tbody></table></div>';
    } else {
      html += '<p style="color:#999; font-size:14px;">バリエーションなし</p>';
    }
    html += '</div>';

    // 販売・価格（RMS準拠: 価格設定、ポイント変倍、販売設定、商品オプション）
    html += '<div class="s2rms-tab" data-tab="s2price" data-gi="' + gi + '" style="padding:16px 0; display:none;">';
    // 価格設定
    html += '<h4 style="font-size:16px; color:#333; margin:0 0 14px; border-bottom:2px solid #333; padding-bottom:8px;">価格設定</h4>';
    html += '<table style="width:100%; border-collapse:collapse; font-size:14px;">';
    html += '<tr><td style="padding:10px 14px; background:#f5f5f5; border:1px solid #ddd; width:180px; font-weight:600;">通常購入販売価格</td>';
    html += '<td style="padding:10px 14px; border:1px solid #ddd;">' + esc(prod.skus[0] ? (prod.skus[0].price || prod.sellPrice || '') : (prod.sellPrice || '')) + '</td></tr>';
    html += '<tr><td style="padding:10px 14px; background:#f5f5f5; border:1px solid #ddd; font-weight:600;">表示価格</td>';
    html += '<td style="padding:10px 14px; border:1px solid #ddd;">' + esc(prod.skus[0] ? prod.skus[0].displayPrice || '' : '') + '</td></tr>';
    html += '<tr><td style="padding:10px 14px; background:#f5f5f5; border:1px solid #ddd; font-weight:600;">消費税率</td>';
    const taxType = prod.taxType || MASTER.malls.rakuten.taxType || '0';
    html += '<td style="padding:10px 14px; border:1px solid #ddd;">' + esc(taxType === '0' ? '税込み' : taxType) + (prod.taxRate ? ' / ' + esc(prod.taxRate + '%') : '') + '</td></tr>';
    html += '</table>';
    // SKU別価格
    if (prod.skus.length > 1) {
      html += '<h4 style="font-size:14px; color:#333; margin:16px 0 8px; border-bottom:1px solid #ddd; padding-bottom:6px;">SKU別価格</h4>';
      html += '<div style="overflow-x:auto;"><table style="width:100%; border-collapse:collapse; font-size:13px;">';
      html += '<thead><tr><th style="background:#f5f5f5; padding:8px 10px; border:1px solid #ddd; font-weight:600;">SKU管理番号</th><th style="background:#f5f5f5; padding:8px 10px; border:1px solid #ddd; font-weight:600;">バリエーション</th><th style="background:#f5f5f5; padding:8px 10px; border:1px solid #ddd; font-weight:600;">販売価格</th><th style="background:#f5f5f5; padding:8px 10px; border:1px solid #ddd; font-weight:600;">表示価格</th></tr></thead><tbody>';
      prod.skus.forEach((sku, si) => {
        const vars = sku.variants ? sku.variants.map(v => v.value).filter(Boolean).join(' / ') : '';
        html += '<tr style="background:' + (si % 2 === 0 ? '#fff' : '#fafafa') + ';">';
        html += '<td style="padding:7px 10px; border:1px solid #ddd;">' + esc(sku.skuMgmtNo || '') + '</td>';
        html += '<td style="padding:7px 10px; border:1px solid #ddd;">' + esc(vars) + '</td>';
        html += '<td style="padding:7px 10px; border:1px solid #ddd; text-align:right;">' + esc(sku.price || '') + '</td>';
        html += '<td style="padding:7px 10px; border:1px solid #ddd; text-align:right;">' + esc(sku.displayPrice || '') + '</td>';
        html += '</tr>';
      });
      html += '</tbody></table></div>';
    }
    // 商品別ポイント変倍
    html += '<h4 style="font-size:16px; color:#333; margin:16px 0 10px; border-bottom:2px solid #333; padding-bottom:8px;">商品別ポイント変倍</h4>';
    html += '<table style="width:100%; border-collapse:collapse; font-size:14px;">';
    html += '<tr><td style="padding:10px 14px; background:#f5f5f5; border:1px solid #ddd; width:180px; font-weight:600;">ポイント変倍率</td>';
    html += '<td style="padding:10px 14px; border:1px solid #ddd;">' + (prod.pointRate ? esc(prod.pointRate) + '倍' : '個別設定しない') + '</td></tr>';
    if (prod.pointStart || prod.pointEnd) {
      html += '<tr><td style="padding:10px 14px; background:#f5f5f5; border:1px solid #ddd; font-weight:600;">ポイント変倍適用期間</td>';
      html += '<td style="padding:10px 14px; border:1px solid #ddd;">' + esc(prod.pointStart || '') + ' 〜 ' + esc(prod.pointEnd || '') + '</td></tr>';
    }
    html += '</table>';
    // 販売設定
    html += '<h4 style="font-size:16px; color:#333; margin:16px 0 10px; border-bottom:2px solid #333; padding-bottom:8px;">販売設定</h4>';
    html += '<table style="width:100%; border-collapse:collapse; font-size:14px;">';
    html += '<tr><td style="padding:10px 14px; background:#f5f5f5; border:1px solid #ddd; width:180px; font-weight:600;">再入荷お知らせ</td>';
    html += '<td style="padding:10px 14px; border:1px solid #ddd;">' + (prod.skus[0] && prod.skus[0].restockBtn === '1' ? '受け付ける' : '受け付けない') + '</td></tr>';
    html += '<tr><td style="padding:10px 14px; background:#f5f5f5; border:1px solid #ddd; font-weight:600;">のし対応</td>';
    html += '<td style="padding:10px 14px; border:1px solid #ddd;">' + (prod.skus[0] && prod.skus[0].noshi === '0' ? '対応しない' : prod.skus[0] ? (prod.skus[0].noshi || '') : '') + '</td></tr>';
    html += '</table>';
    // 商品オプション
    html += '<h4 style="font-size:16px; color:#333; margin:16px 0 10px; border-bottom:2px solid #333; padding-bottom:8px;">商品オプション</h4>';
    if (prod.options && prod.options.length > 0) {
      html += '<table style="width:100%; border-collapse:collapse; font-size:14px;">';
      html += '<thead><tr><th style="background:#f5f5f5; padding:8px 12px; border:1px solid #ddd; font-weight:600;">項目名</th><th style="background:#f5f5f5; padding:8px 12px; border:1px solid #ddd; font-weight:600;">ユーザーからの入力</th></tr></thead><tbody>';
      prod.options.forEach(opt => {
        html += '<tr><td style="padding:8px 12px; border:1px solid #ddd; font-weight:600;">' + esc(opt.name || '') + '</td>';
        html += '<td style="padding:8px 12px; border:1px solid #ddd;">' + (opt.required === '1' ? '必須' : '任意') + '</td></tr>';
      });
      html += '</tbody></table>';
    } else {
      html += '<p style="color:#999; font-size:14px;">商品オプションなし</p>';
    }
    html += '</div>';

    // 在庫・配送（RMS準拠: 在庫数、在庫設定、納期・リードタイム、配送設定）
    html += '<div class="s2rms-tab" data-tab="s2stock" data-gi="' + gi + '" style="padding:16px 0; display:none;">';
    // 在庫数
    html += '<h4 style="font-size:16px; color:#333; margin:0 0 14px; border-bottom:2px solid #333; padding-bottom:8px;">在庫数</h4>';
    if (prod.skus.length > 0) {
      html += '<div style="overflow-x:auto;"><table style="width:100%; border-collapse:collapse; font-size:13px;">';
      html += '<thead><tr><th style="background:#f5f5f5; padding:8px 10px; border:1px solid #ddd; font-weight:600;">SKU / SKU管理番号</th><th style="background:#f5f5f5; padding:8px 10px; border:1px solid #ddd; font-weight:600;">在庫数</th></tr></thead><tbody>';
      prod.skus.forEach((sku, si) => {
        const vars = sku.variants ? sku.variants.map(v => v.value).filter(Boolean).join(' / ') : '';
        html += '<tr style="background:' + (si % 2 === 0 ? '#fff' : '#fafafa') + ';">';
        html += '<td style="padding:7px 10px; border:1px solid #ddd;"><div style="font-weight:600;">' + esc(sku.skuMgmtNo || '') + '</div>';
        if (vars) html += '<div style="font-size:12px; color:#666;">' + esc(vars) + '</div>';
        html += '</td>';
        html += '<td style="padding:7px 10px; border:1px solid #ddd; text-align:center; width:120px;">' + esc(sku.stock || '') + '</td>';
        html += '</tr>';
      });
      html += '</tbody></table></div>';
    }
    // 配送設定
    html += '<h4 style="font-size:16px; color:#333; margin:20px 0 14px; border-bottom:2px solid #333; padding-bottom:8px;">配送設定</h4>';
    html += '<table style="width:100%; border-collapse:collapse; font-size:14px;">';
    const rmShip = MASTER.malls.rakuten;
    let shipSetVal = (prod.skus[0] && prod.skus[0].shippingSet) ? prod.skus[0].shippingSet : rmShip.shippingSet || '';
    let shipNameVal = (prod.skus[0] && prod.skus[0].shippingName) ? prod.skus[0].shippingName : rmShip.shippingName || '';
    // 自社Excelの配送方法から自動解決
    if (!shipSetVal && prod.shippingMethod && rmShip.shippingSets && rmShip.shippingSets.length > 0) {
      const method = prod.shippingMethod.trim();
      const found = rmShip.shippingSets.find(s => s.name === method || method.includes(s.name) || s.name.includes(method));
      if (found) { shipSetVal = found.num; shipNameVal = found.name; }
    }
    const shipFeeVal = (prod.skus[0] && prod.skus[0].shipping) ? prod.skus[0].shipping : rmShip.shippingFee || '';
    const shipFeeLabel = shipFeeVal === '0' ? '送料込み' : shipFeeVal === '1' ? '送料別' : shipFeeVal === '2' ? '送料無料' : shipFeeVal;
    const deliveryFields = [
      ['配送方法セット', shipSetVal + (shipNameVal ? ' (' + shipNameVal + ')' : '')],
      ['送料', shipFeeLabel],
    ];
    deliveryFields.forEach(([label, val]) => {
      html += '<tr><td style="padding:10px 14px; background:#f5f5f5; border:1px solid #ddd; width:180px; font-weight:600;">' + esc(label) + '</td>';
      html += '<td style="padding:10px 14px; border:1px solid #ddd;">' + esc(val) + '</td></tr>';
    });
    html += '</table>';
    html += '</div>';

    // 製品情報
    html += '<div class="s2rms-tab" data-tab="s2product" data-gi="' + gi + '" style="padding:16px 0; display:none;">';
    html += '<h4 style="font-size:16px; color:#333; margin:0 0 14px; border-bottom:2px solid #333; padding-bottom:8px;">製品情報</h4>';
    html += '<table style="width:100%; border-collapse:collapse; font-size:14px;">';
    html += '<tr><td style="padding:10px 14px; background:#f5f5f5; border:1px solid #ddd; width:180px; font-weight:600;">ジャンルID</td>';
    html += '<td style="padding:10px 14px; border:1px solid #ddd;">';
    const gId = prod.genreId || MASTER.malls.rakuten.genreId || '';
    html += '<span>' + esc(gId) + '</span>';
    html += ' <span class="genre-name-display" data-genre-id="' + esc(gId) + '" style="font-size:12px; margin-left:8px;"></span>';
    html += '</td></tr>';
    // カタログID情報
    const catReason = (prod.skus.length > 0 && prod.skus[0].catalogNoReason) ? prod.skus[0].catalogNoReason : MASTER.malls.rakuten.catalogReason || '3';
    const catId = (prod.skus.length > 0 && prod.skus[0].catalogId) ? prod.skus[0].catalogId : '';
    html += '<tr><td style="padding:10px 14px; background:#f5f5f5; border:1px solid #ddd; font-weight:600;">カタログID</td>';
    html += '<td style="padding:10px 14px; border:1px solid #ddd;">' + esc(catId || catReason) + '</td></tr>';
    html += '<tr><td style="padding:10px 14px; background:#f5f5f5; border:1px solid #ddd; font-weight:600;">カタログIDなしの理由</td>';
    html += '<td style="padding:10px 14px; border:1px solid #ddd;">' + esc(catalogReasonLabel(catReason)) + '</td></tr>';
    // 自社Excel固有情報
    if (prod.material) {
      html += '<tr><td style="padding:10px 14px; background:#f5f5f5; border:1px solid #ddd; font-weight:600;">素材</td>';
      html += '<td style="padding:10px 14px; border:1px solid #ddd;">' + esc(prod.material) + '</td></tr>';
    }
    if (prod.spec) {
      html += '<tr><td style="padding:10px 14px; background:#f5f5f5; border:1px solid #ddd; font-weight:600;">仕様</td>';
      html += '<td style="padding:10px 14px; border:1px solid #ddd;">' + esc(prod.spec) + '</td></tr>';
    }
    if (prod.laundryLabel) {
      html += '<tr><td style="padding:10px 14px; background:#f5f5f5; border:1px solid #ddd; font-weight:600;">洗濯表記</td>';
      html += '<td style="padding:10px 14px; border:1px solid #ddd;">' + esc(prod.laundryLabel) + '</td></tr>';
    }
    if (prod.category) {
      html += '<tr><td style="padding:10px 14px; background:#f5f5f5; border:1px solid #ddd; font-weight:600;">カテゴリ</td>';
      html += '<td style="padding:10px 14px; border:1px solid #ddd;">' + esc(prod.category) + '</td></tr>';
    }
    html += '</table>';
    // 自由入力行
    const customRows = prod.skus.length > 0 && prod.skus[0].customFields ? prod.skus[0].customFields.filter(f => f.label || f.value) : [];
    if (customRows.length > 0) {
      html += '<h4 style="font-size:16px; color:#333; margin:16px 0 10px; border-bottom:2px solid #333; padding-bottom:8px;">自由入力行</h4>';
      html += '<table style="width:100%; border-collapse:collapse; font-size:14px;">';
      customRows.forEach(f => {
        html += '<tr><td style="padding:10px 14px; background:#f5f5f5; border:1px solid #ddd; width:180px; font-weight:600;">' + esc(f.label || '') + '</td>';
        html += '<td style="padding:10px 14px; border:1px solid #ddd;">' + esc(f.value || '') + '</td></tr>';
      });
      html += '</table>';
    }
    html += '</div>';

    // ページデザイン（画像 + 説明文）
    html += '<div class="s2rms-tab" data-tab="s2design" data-gi="' + gi + '" style="padding:16px 0; display:none;">';
    // 自動生成画像URL一覧
    if (sourceType === 'jisha') {
      const imgUrls2 = generateRakutenImageUrls(prod);
      if (imgUrls2.length > 0) {
        html += '<h4 style="font-size:16px; color:#333; margin:0 0 14px; border-bottom:2px solid #333; padding-bottom:8px;">商品画像URL（自動生成: ' + imgUrls2.length + '枚）</h4>';
        html += '<div style="background:#fafafa; border:1px solid #e0e0e0; border-radius:6px; padding:12px; margin-bottom:20px; max-height:400px; overflow-y:auto;">';
        html += '<table style="width:100%; border-collapse:collapse; font-size:12px; font-family:monospace;">';
        imgUrls2.forEach((url, i) => {
          const lbl = i === 0 ? 'メイン(-1r)' : (i === imgUrls2.length - 1 ? '最後(-11)' : (i === imgUrls2.length - 2 ? '最後-1(-10)' : 'カラバリ'));
          html += '<tr style="border-bottom:1px solid #eee;">';
          html += '<td style="padding:5px 8px; color:#888; width:30px;">' + (i + 1) + '</td>';
          html += '<td style="padding:5px 8px; color:#999; width:80px; font-size:11px;">' + lbl + '</td>';
          html += '<td style="padding:5px 8px; word-break:break-all;"><a href="' + esc(url) + '" target="_blank" style="color:#1565c0; text-decoration:none;">' + esc(url) + '</a></td>';
          html += '</tr>';
        });
        html += '</table>';
        html += '</div>';
      }
    }
    html += '<h4 style="font-size:16px; color:#333; margin:0 0 14px; border-bottom:2px solid #333; padding-bottom:8px;">商品画像（' + prod.images.length + '件）</h4>';
    if (prod.images.length > 0) {
      html += '<div style="display:flex; flex-wrap:wrap; gap:10px;">';
      prod.images.forEach((img, ii) => {
        const url = img.url || buildRakutenImgUrl(img.path);
        html += '<div style="width:110px; text-align:center;">';
        html += '<div style="width:110px; height:110px; border:1px solid #ddd; border-radius:4px; overflow:hidden; background:#fff; display:flex; align-items:center; justify-content:center;">';
        html += '<img src="' + esc(url) + '" style="max-width:100%; max-height:100%; object-fit:contain;" onerror="this.parentElement.innerHTML=\'<div style=color:#ccc;font-size:11px>Error</div>\'" loading="lazy"></div>';
        html += '<div style="font-size:11px; color:#888; margin-top:3px;">' + (img.type || '') + '画像' + (ii + 1) + '</div></div>';
      });
      html += '</div>';
    } else {
      html += '<p style="color:#999; font-size:14px;">画像データなし</p>';
    }
    // SKU画像
    const skuImgs = prod.skus.filter(s => s.skuImgPath);
    if (skuImgs.length > 0) {
      html += '<h4 style="font-size:14px; color:#333; margin:16px 0 8px; border-bottom:2px solid #333; padding-bottom:6px;">SKU画像（' + skuImgs.length + '件）</h4>';
      html += '<div style="display:flex; flex-wrap:wrap; gap:8px;">';
      skuImgs.forEach(sku => {
        const url = buildRakutenImgUrl(sku.skuImgPath);
        const vars = sku.variants ? sku.variants.map(v => v.value).filter(Boolean).join('/') : '';
        html += '<div style="width:80px; text-align:center;">';
        html += '<div style="width:80px; height:80px; border:1px solid #ddd; border-radius:4px; overflow:hidden; background:#fff; display:flex; align-items:center; justify-content:center;">';
        html += '<img src="' + esc(url) + '" style="max-width:100%; max-height:100%; object-fit:contain;" onerror="this.parentElement.innerHTML=\'<div style=color:#ccc;font-size:9px>Error</div>\'" loading="lazy"></div>';
        html += '<div style="font-size:9px; color:#888; margin-top:2px;">' + esc(vars) + '</div></div>';
      });
      html += '</div>';
    }
    // 説明文
    html += '<h4 style="font-size:16px; color:#333; margin:20px 0 14px; border-bottom:2px solid #333; padding-bottom:8px;">商品説明文</h4>';
    // 自社Excelの場合はマスタテンプレートから生成、楽天CSVの場合は既存データを使用
    const rm = MASTER.malls.rakuten;
    const s2pcDesc = prod.pcDesc || applyDescTemplate(rm.pcDescTpl, prod);
    const s2spDesc = prod.spDesc || applyDescTemplate(rm.spDescTpl, prod);
    const s2saleDesc = prod.pcSaleDesc || applyDescTemplate(rm.saleDescTpl, prod);
    [['PC用商品説明文', s2pcDesc], ['スマートフォン用商品説明文', s2spDesc], ['PC用販売説明文', s2saleDesc]].forEach(([label, val]) => {
      html += '<div style="margin-bottom:14px;"><div style="display:flex; align-items:center; gap:8px; font-size:14px; font-weight:600; color:#333; margin-bottom:6px;">' + esc(label);
      if (val) {
        html += ' <button class="btn btn-sm btn-outline" style="font-size:11px; padding:2px 8px;" onclick="previewHtml(decodeURIComponent(\'' + encodeURIComponent(val) + '\'), \'' + esc(label) + '\')">確認</button>';
      }
      html += '</div>';
      if (val) {
        html += '<div style="padding:10px; background:#fff; border:1px solid #ccc; border-radius:4px; font-size:13px; max-height:180px; overflow:auto; word-break:break-all; white-space:pre-wrap;">' + esc(val) + '</div>';
        html += '<div style="font-size:11px; color:#888; margin-top:3px;">' + val.length + '文字</div>';
      } else {
        html += '<span style="color:#ccc; font-size:13px;">（未設定）</span>';
      }
      html += '</div>';
    });
    html += '</div>';

    html += '</div>'; // タブコンテンツ padding div
    html += '</div>'; // s2rms-tab-area (スクロール領域)
    html += '</div>'; // main content
    html += '</div>'; // panel
  });

  html += '</div>'; // 右: 商品詳細パネル群
  html += '</div>'; // 2カラムレイアウト
  // 固定フッターボタン
  const totalSkus = products.reduce((s, p) => s + p.skus.length, 0);
  html += '<div style="padding:12px 24px; border-top:1px solid #ddd; background:#fff; display:flex; justify-content:space-between; align-items:center; flex-shrink:0;">';
  html += '<button class="btn btn-outline" onclick="goToStep(1)">← 戻る</button>';
  html += '<div style="font-size:13px; color:#666;">' + products.length + '商品 / ' + totalSkus + ' SKU / 楽天CSV</div>';
  html += '<button class="btn btn-primary" onclick="goToStep(3)">編集へ →</button>';
  html += '</div>';
  html += '</div>'; // フルスクリーンレイアウト

  container.innerHTML = html;

  // ステップバー下端からビューポート底までの高さを計算してセット
  function adjustRmsHeight() {
    const layoutRoot = document.getElementById('rms-layout-root');
    if (layoutRoot) {
      const top = layoutRoot.getBoundingClientRect().top;
      layoutRoot.style.height = (window.innerHeight - top) + 'px';
    }
  }
  adjustRmsHeight();
  window._rmsResizeHandler = adjustRmsHeight;
  window.addEventListener('resize', adjustRmsHeight);
  resolveGenreNames();
}

function switchStep2RmsProduct(idx) {
  // パネル切替
  document.querySelectorAll('.step2-rms-panel').forEach(p => p.style.display = 'none');
  const panel = document.querySelectorAll('.step2-rms-panel')[idx];
  if (panel) panel.style.display = 'flex';
  // 品番リスト選択状態更新
  document.querySelectorAll('.s2rms-prod-item').forEach((item, i) => {
    if (i === idx) {
      item.style.background = '#e8e2dc';
      item.style.borderLeftColor = 'var(--primary)';
    } else {
      item.style.background = '';
      item.style.borderLeftColor = 'transparent';
    }
  });
  // 選択した項目が見えるようスクロール
  const selectedItem = document.querySelectorAll('.s2rms-prod-item')[idx];
  if (selectedItem) selectedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function switchS2RmsTab(tabId, gi) {
  document.querySelectorAll('.s2rms-tab[data-gi="' + gi + '"]').forEach(el => {
    el.style.display = el.dataset.tab === tabId ? '' : 'none';
  });
  // スクロール位置をリセット
  const tabArea = document.querySelector('.s2rms-tab-area[data-gi="' + gi + '"]');
  if (tabArea) tabArea.scrollTop = 0;
  document.querySelectorAll('.s2rms-side[data-gi="' + gi + '"]').forEach(el => {
    const active = el.dataset.tab === tabId;
    el.style.background = active ? '#fff' : 'transparent';
    el.style.color = active ? '#333' : '#888';
    el.style.border = active ? '1px solid #ccc' : '1px solid transparent';
    el.style.borderBottom = active ? '2px solid #fff' : '2px solid transparent';
  });
}

// ============================================================
// STEP 2 自社Excel: シンプルなデータ確認画面
// ============================================================
function renderJishaRmsView() {
  const jishaView = document.getElementById('step2-jisha-view');
  if (!jishaView || products.length === 0) return;

  const totalSkus = products.reduce((s, p) => s + p.skus.length, 0);
  const totalImages = products.reduce((s, p) => s + p.images.length, 0);
  const src = '自社Excel';

  // 全商品で不足している情報を集計
  const missingStats = { image: 0, category: 0, material: 0, sellPrice: 0, jan: 0 };
  products.forEach(p => {
    if (!p.imageUrl && p.images.length === 0) missingStats.image++;
    if (!p.category) missingStats.category++;
    if (!p.material) missingStats.material++;
    if (!p.sellPrice) missingStats.sellPrice++;
    const noJan = p.skus.some(s => !s.jan);
    if (noJan) missingStats.jan++;
  });

  let html = '';
  html += '<div id="jisha-layout-root" style="display:flex; flex-direction:column; overflow:hidden; width:100%; box-sizing:border-box;">';

  // 2カラム: 左=商品リスト(240px)、右=詳細
  html += '<div style="display:grid; grid-template-columns:240px 1fr; flex:1; min-height:0; overflow:hidden;">';

  // --- 左サイドバー: 商品リスト ---
  html += '<div id="jisha-product-list" style="background:#f7f5f3; border:1px solid var(--border); border-radius:8px 0 0 8px; overflow-y:auto; overflow-x:hidden; min-height:0;">';
  html += '<div style="padding:8px 14px; border-bottom:1px solid var(--border); position:sticky; top:0; background:#f7f5f3; z-index:1;">';
  html += '<div style="font-size:13px; font-weight:700; color:var(--primary-dark); margin-bottom:4px;">取込データ (' + products.length + '商品)</div>';
  html += '<div style="display:flex; gap:6px; font-size:10px; color:#888; flex-wrap:wrap;">';
  html += '<span style="background:#ece8e3; padding:1px 6px; border-radius:8px;"><strong>' + totalSkus + '</strong> SKU</span>';
  html += '<span style="background:#ece8e3; padding:1px 6px; border-radius:8px;"><strong>' + totalImages + '</strong> 画像</span>';
  html += '</div></div>';

  products.forEach((p, i) => {
    const thumbUrl = p.imageUrl || (p.images.length > 0 ? (p.images[0].url || '') : '');
    const label = p.number || p.id || '';
    const shortName = (p.cleanName || p.name || '').substring(0, 18);
    html += '<div class="jisha-prod-item" data-idx="' + i + '" onclick="switchJishaProduct(' + i + ')" style="padding:10px 12px; cursor:pointer; border-bottom:1px solid #ece8e3; display:flex; align-items:center; gap:10px; transition:background 0.15s;' + (i === 0 ? ' background:#e8e2dc; border-left:3px solid var(--primary);' : ' border-left:3px solid transparent;') + '">';
    html += '<div style="width:50px; height:50px; flex-shrink:0; border:1px solid #ddd; border-radius:4px; background:#fff; overflow:hidden; display:flex; align-items:center; justify-content:center;">';
    if (thumbUrl) html += '<img src="' + esc(thumbUrl) + '" style="max-width:100%; max-height:100%; object-fit:cover;" onerror="this.style.display=\'none\'" loading="lazy">';
    else html += '<span style="font-size:10px; color:#ccc;">-</span>';
    html += '</div>';
    html += '<div style="min-width:0; flex:1;">';
    html += '<div style="font-size:13px; font-weight:600; color:#333; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' + esc(label) + '</div>';
    html += '<div style="font-size:12px; color:#888; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-top:2px;">' + esc(shortName) + '</div>';
    html += '<div style="font-size:11px; color:#aaa; margin-top:2px;">SKU:' + p.skus.length + ' / ' + esc(p.category || '未分類') + '</div>';
    html += '</div></div>';
  });
  html += '</div>';

  // --- 右: 商品詳細パネル ---
  html += '<div style="min-width:0; min-height:0; display:flex; flex-direction:column; overflow:hidden;">';

  products.forEach((prod, gi) => {
    const imgUrl = prod.imageUrl || (prod.images.length > 0 ? (prod.images[0].url || '') : '');
    html += '<div class="jisha-detail-panel" data-jisha-idx="' + gi + '" style="display:' + (gi > 0 ? 'none' : 'flex') + '; flex-direction:column; flex:1; min-height:0; min-width:0; overflow:hidden;">';
    html += '<div style="flex:1; min-width:0; min-height:0; border:1px solid #ddd; border-radius:0 6px 6px 0; background:#fff; display:flex; flex-direction:column; overflow:hidden;">';
    html += '<div style="flex:1; min-height:0; overflow-y:auto; overflow-x:hidden; padding:20px 24px;">';

    // 商品ヘッダー（画像＋基本）
    html += '<div style="display:flex; gap:16px; margin-bottom:20px; padding-bottom:16px; border-bottom:2px solid var(--primary);">';
    html += '<div style="width:80px; height:80px; flex-shrink:0; border:1px solid #ddd; border-radius:4px; background:#fff; display:flex; align-items:center; justify-content:center; overflow:hidden;">';
    if (imgUrl) html += '<img src="' + esc(imgUrl) + '" style="max-width:100%; max-height:100%; object-fit:contain;" onerror="this.parentElement.innerHTML=\'<div style=color:#ccc;font-size:10px>No Image</div>\'">';
    else html += '<div style="color:#ccc; font-size:10px;">No Image</div>';
    html += '</div>';
    html += '<div style="flex:1; min-width:0;">';
    html += '<div style="font-size:16px; font-weight:700; color:#333; margin-bottom:6px; word-break:break-all;">' + esc(prod.name || '') + '</div>';
    html += '<div style="display:flex; gap:16px; font-size:13px; color:#666; flex-wrap:wrap;">';
    html += '<span>商品番号: <strong>' + esc(prod.number || '-') + '</strong></span>';
    html += '<span>カテゴリ: <strong>' + esc(prod.category || '-') + '</strong></span>';
    html += '<span>販売金額: <strong>' + esc(prod.sellPrice ? prod.sellPrice + '円' : '-') + '</strong></span>';
    html += '<span>SKU: <strong>' + prod.skus.length + '件</strong></span>';
    html += '</div></div></div>';

    // 取り込みデータ一覧（フラットなテーブル形式）
    html += '<div style="margin-bottom:20px;">';
    html += '<div style="font-size:14px; font-weight:700; color:var(--primary-dark); margin-bottom:10px;">取り込み項目</div>';
    html += '<table style="width:100%; border-collapse:collapse; font-size:13px;">';
    const allFields = [
      ['商品名', prod.name],
      ['商品名（クリーン）', prod.cleanName],
      ['商品番号', prod.number],
      ['カテゴリ', prod.category],
      ['販売金額(税込)', prod.sellPrice],
      ['仕入金額(円)', prod.costPrice],
      ['素材', prod.material],
      ['採寸サイズ', prod.measureSize],
      ['商品ポイント', prod.productPoint],
      ['仕様', prod.spec],
      ['洗濯表記', prod.laundryLabel],
      ['販売日', prod.saleStartDate],
      ['終了日', prod.saleEndDate],
      ['配送方法', prod.shippingMethod],
      ['参考URL', prod.referenceUrl],
      ['メモ', prod.memo],
      ['画像', imgUrl],
    ];
    allFields.forEach(([label, value]) => {
      const hasVal = value && String(value).trim();
      html += '<tr style="border-bottom:1px solid #f0f0f0;">';
      html += '<td style="padding:6px 12px; width:150px; color:#666; background:#faf8f6; font-weight:600; white-space:nowrap;">' + esc(label) + '</td>';
      html += '<td style="padding:6px 12px; word-break:break-all;">';
      if (hasVal) {
        if (label === '画像' && String(value).match(/^https?:\/\//)) {
          html += '<a href="' + esc(value) + '" target="_blank" style="color:#1565c0; font-size:12px;">' + esc(String(value).substring(0, 60)) + '</a>';
        } else {
          html += esc(String(value));
        }
      } else {
        html += '<span style="color:#ccc;">-</span>';
      }
      html += '</td></tr>';
    });
    html += '</table></div>';

    // 楽天変換プレビュー（推測結果）
    const guessedGid = guessGenreId(prod.category, prod.cleanName || prod.name);
    const guessedGenrePath = guessedGid ? GENRE_MAP[guessedGid] : '';
    const catchCopy = prod.productPoint || '';
    html += '<div style="margin-bottom:20px;">';
    html += '<div style="font-size:14px; font-weight:700; color:var(--primary-dark); margin-bottom:10px;">楽天変換プレビュー（自動推測）</div>';
    html += '<table style="width:100%; border-collapse:collapse; font-size:13px;">';
    html += '<tr style="border-bottom:1px solid #f0f0f0;">';
    html += '<td style="padding:6px 12px; width:150px; color:#666; background:#faf8f6; font-weight:600; white-space:nowrap;">ジャンルID</td>';
    html += '<td style="padding:6px 12px;">';
    if (guessedGid) {
      html += '<strong>' + esc(guessedGid) + '</strong> <span style="color:#1565c0; font-size:12px; margin-left:8px;">' + esc(guessedGenrePath) + '</span>';
    } else {
      html += '<span style="color:#c33;">推測できませんでした（マスタ設定のジャンルIDが使われます）</span>';
    }
    html += '</td></tr>';
    html += '<tr style="border-bottom:1px solid #f0f0f0;">';
    html += '<td style="padding:6px 12px; width:150px; color:#666; background:#faf8f6; font-weight:600; white-space:nowrap;">キャッチコピー</td>';
    html += '<td style="padding:6px 12px;">' + (catchCopy ? esc(catchCopy) : '<span style="color:#ccc;">商品ポイント未設定</span>') + '</td></tr>';
    html += '</table></div>';

    // SKU一覧
    html += '<div style="margin-bottom:20px;">';
    html += '<div style="font-size:14px; font-weight:700; color:var(--primary-dark); margin-bottom:10px;">SKU一覧（' + prod.skus.length + '件）</div>';
    if (prod.skus.length > 0) {
      html += '<table style="width:100%; border-collapse:collapse; font-size:13px;">';
      html += '<thead><tr style="background:#f8f6f4;">';
      html += '<th style="padding:8px 10px; text-align:left; border-bottom:2px solid #ddd; white-space:nowrap;">SKU番号</th>';
      html += '<th style="padding:8px 10px; text-align:left; border-bottom:2px solid #ddd;">カラー</th>';
      html += '<th style="padding:8px 10px; text-align:left; border-bottom:2px solid #ddd;">サイズ</th>';
      html += '<th style="padding:8px 10px; text-align:left; border-bottom:2px solid #ddd;">JAN</th>';
      html += '<th style="padding:8px 10px; text-align:right; border-bottom:2px solid #ddd;">価格</th>';
      html += '</tr></thead><tbody>';
      prod.skus.forEach((sku) => {
        html += '<tr style="border-bottom:1px solid #f0f0f0;">';
        html += '<td style="padding:6px 10px;">' + esc(sku.skuMgmtNo || '-') + '</td>';
        html += '<td style="padding:6px 10px;">' + esc(sku.color || '-') + '</td>';
        html += '<td style="padding:6px 10px;">' + esc(sku.size || '-') + '</td>';
        html += '<td style="padding:6px 10px;">' + (sku.jan ? esc(sku.jan) : '<span style="color:#ccc;">-</span>') + '</td>';
        html += '<td style="padding:6px 10px; text-align:right;">' + esc(sku.price || '-') + '</td>';
        html += '</tr>';
      });
      html += '</tbody></table>';
    } else {
      html += '<div style="color:#999; padding:12px; text-align:center;">SKUデータなし</div>';
    }
    html += '</div>';

    html += '</div>'; // scroll area
    html += '</div>'; // border wrapper
    html += '</div>'; // detail panel
  });

  html += '</div>'; // right column
  html += '</div>'; // grid

  // フッター
  html += '<div style="padding:12px 24px; border-top:1px solid #ddd; background:#fff; display:flex; justify-content:space-between; align-items:center; flex-shrink:0;">';
  html += '<button class="btn btn-outline" onclick="goToStep(1)">← 戻る</button>';
  html += '<div style="font-size:13px; color:#666;">' + products.length + '商品 / ' + totalSkus + ' SKU / ' + src + '</div>';
  html += '<button class="btn btn-primary" onclick="goToStep(3)">編集へ →</button>';
  html += '</div>';

  html += '</div>'; // layout root

  jishaView.innerHTML = html;

  // 高さ調整
  const root = document.getElementById('jisha-layout-root');
  if (root) {
    const adjustHeight = () => {
      const top = root.getBoundingClientRect().top;
      root.style.height = (window.innerHeight - top) + 'px';
    };
    adjustHeight();
    window._jishaResizeHandler = adjustHeight;
    window.addEventListener('resize', adjustHeight);
  }
}

function switchJishaProduct(idx) {
  document.querySelectorAll('.jisha-detail-panel').forEach(p => p.style.display = 'none');
  const panel = document.querySelectorAll('.jisha-detail-panel')[idx];
  if (panel) panel.style.display = 'flex';
  document.querySelectorAll('.jisha-prod-item').forEach((el, i) => {
    el.style.background = i === idx ? '#e8e2dc' : '';
    el.style.borderLeft = i === idx ? '3px solid var(--primary)' : '3px solid transparent';
  });
}

function switchJishaTab(tabId, gi) {
  document.querySelectorAll('.jisha-tab-content[data-gi="' + gi + '"]').forEach(el => {
    el.style.display = el.dataset.tab === tabId ? '' : 'none';
  });
  document.querySelectorAll('.jisha-tab-btn[data-gi="' + gi + '"]').forEach(el => {
    const active = el.dataset.tab === tabId;
    el.style.background = active ? '#fff' : 'transparent';
    el.style.color = active ? '#333' : '#888';
    el.style.border = active ? '1px solid #ccc' : '1px solid transparent';
    el.style.borderBottom = active ? '2px solid #fff' : '2px solid transparent';
    el.style.fontWeight = active ? '600' : '400';
  });
}

function renderCardView() {
  const container = document.getElementById('card-view');
  let html = '';
  products.forEach((prod, pi) => {
    const displayName = sourceType === 'rakuten' ? (prod.cleanName || prod.name) : prod.name;
    html += `<div class="product-card" data-pi="${pi}" data-search="${esc(prod.name + ' ' + prod.id)}">`;
    html += `<div class="product-card-header" onclick="toggleCard(this)">`;
    html += `<h3>${esc(displayName)}</h3>`;
    html += `<div style="display:flex;gap:6px;align-items:center;">`;
    html += `<span class="badge badge-product">${esc(prod.id)}</span>`;
    html += `<span class="badge badge-sku">SKU: ${prod.skus.length}</span>`;
    html += `<span class="badge badge-img">画像: ${prod.images.length}</span>`;
    html += `<span class="arrow">▼</span>`;
    html += `</div></div>`;
    html += `<div class="product-card-body">`;
    if (sourceType === 'jisha') {
      const fields = [
        ['商品番号', 'number', prod.number],
        ['商品名', 'name', prod.name],
        ['商品名（クリーン）', 'cleanName', prod.cleanName],
        ['カテゴリ', 'category', prod.category],
        ['素材', 'material', prod.material],
        ['仕入金額(円)', 'costPrice', prod.costPrice],
        ['販売金額(税込)', 'sellPrice', prod.sellPrice],
        ['採寸サイズ', 'measureSize', prod.measureSize],
        ['商品ポイント', 'productPoint', prod.productPoint],
        ['仕様', 'spec', prod.spec],
        ['洗濯表記', 'laundryLabel', prod.laundryLabel],
        ['モデル撮影予定日', '_modelShootDate', prod.modelShootDate],
        ['制作担当者', '_productionStaff', prod.productionStaff],
        ['販売開始日', 'saleStartDate', prod.saleStartDate],
        ['販売終了日', 'saleEndDate', prod.saleEndDate],
        ['配送方法', 'shippingMethod', prod.shippingMethod],
        ['担当者', '_assignee', prod.assignee],
        ['メモ', 'memo', prod.memo],
      ];
      fields.forEach(([label, key, value]) => {
        const editable = !key.startsWith('_');
        html += `<div class="field-row">`;
        html += `<div class="field-label">${label}</div>`;
        html += `<div class="field-value">${esc(trunc(value, 200))}</div>`;
        html += `</div>`;
      });
    } else if (sourceType === 'rakuten') {
      const fields = [
        ['商品管理番号', 'id', prod.id],
        ['商品番号', 'number', prod.number],
        ['商品名（原文）', 'name', prod.name],
        ['商品名（クリーン）', 'cleanName', prod.cleanName],
        ['ジャンルID', 'genreId', prod.genreId],
        ['キャッチコピー', 'catchCopy', prod.catchCopy],
        ['バリエーション定義', '_varDef', prod.varDef.names + ' → ' + prod.varDef.options.join(' | ')],
        ['販売価格', '_price', prod.skus.length > 0 ? prod.skus[0].price : ''],
        ['定価(掛率' + MASTER.malls.rakuten.priceRate + '%)', '_listPrice', prod.skus.length > 0 ? calcListPrice(prod.skus[0].price, 'rakuten') : ''],
      ];
      fields.forEach(([label, key, value]) => {
        const editable = !key.startsWith('_');
        html += `<div class="field-row">`;
        html += `<div class="field-label">${label}</div>`;
        html += `<div class="field-value">${esc(trunc(value, 200))}`;
        if (key === 'genreId' && value) html += ` <span class="genre-name-display" data-genre-id="${esc(String(value))}" style="font-size:12px; margin-left:8px;"></span>`;
        html += `</div>`;
        html += `</div>`;
      });
      html += `<div class="field-row"><div class="field-label">PC用商品説明文</div>`;
      html += `<div><div class="field-value" style="max-height:80px;overflow:hidden;font-size:11px;color:#888;" onclick="this.style.maxHeight=this.style.maxHeight==='none'?'80px':'none'">${esc(trunc(prod.pcDesc, 300))}</div></div></div>`;
    } else {
      const fields = [
        ['Handle', 'id', prod.id],
        ['タイトル', 'name', prod.name],
        ['サブタイトル', 'subtitle', prod.subtitle],
        ['SPU', 'spu', prod.spu],
        ['ブランド', 'vendor', prod.vendor],
        ['タグ', 'tags', prod.tags],
      ];
      fields.forEach(([label, key, value]) => {
        html += `<div class="field-row">`;
        html += `<div class="field-label">${label}</div>`;
        html += `<div class="field-value">${esc(trunc(value, 200))}</div>`;
        html += `</div>`;
      });
    }
    if (prod.images.length > 0) {
      html += `<div class="field-row"><div class="field-label">商品画像</div><div class="img-grid">`;
      const showMax = 8;
      prod.images.slice(0, showMax).forEach(img => {
        const url = sourceType === 'rakuten' ? buildRakutenImgUrl(img.path) : (img.url || '');
        html += `<img src="${url}" class="img-thumb" onerror="this.style.display='none'" loading="lazy">`;
      });
      if (prod.images.length > showMax) {
        html += `<div class="img-more">+${prod.images.length - showMax}</div>`;
      }
      html += `</div></div>`;
    }
    if (prod.skus.length > 0) {
      html += `<div style="margin-top:10px;"><div class="field-label" style="margin-bottom:6px;">SKU一覧 (${prod.skus.length}件)</div>`;
      html += `<div class="table-wrapper"><table><thead><tr>`;
      if (sourceType === 'rakuten') {
        html += `<th>SKU管理番号</th><th>システム連携SKU</th><th>バリエーション</th><th>価格</th><th>カタログID</th><th>型番</th><th>SKU画像</th>`;
      } else if (sourceType === 'jisha') {
        html += `<th>SKU番号</th><th>カラー</th><th>サイズ</th><th>JAN</th><th>価格</th>`;
      } else {
        html += `<th>SKU</th><th>オプション</th><th>価格</th><th>在庫</th><th>画像</th>`;
      }
      html += `</tr></thead><tbody>`;
      prod.skus.forEach((sku, si) => {
        html += `<tr>`;
        if (sourceType === 'rakuten') {
          const vars = sku.variants.map(v => v.value).join(' / ');
          const typeNo = sku.customFields.find(f => f.label === '型番');
          const skuImgUrl = sku.skuImgPath ? buildRakutenImgUrl(sku.skuImgPath) : '';
          html += `<td title="${esc(sku.skuMgmtNo)}">${esc(sku.skuMgmtNo)}</td>`;
          html += `<td title="${esc(sku.systemSku)}">${esc(sku.systemSku)}</td>`;
          html += `<td>${esc(vars)}</td>`;
          html += `<td>${esc(sku.price)}</td>`;
          html += `<td>${esc(sku.catalogId || sku.catalogNoReason)}</td>`;
          html += `<td>${esc(typeNo ? typeNo.value : '')}</td>`;
          html += `<td>${skuImgUrl ? `<img src="${skuImgUrl}" style="width:36px;height:36px;object-fit:cover;border-radius:3px;" onerror="this.style.display='none'" loading="lazy">` : ''}</td>`;
        } else if (sourceType === 'jisha') {
          html += `<td>${esc(sku.skuMgmtNo)}</td>`;
          html += `<td>${esc(sku.color)}</td>`;
          html += `<td>${esc(sku.size)}</td>`;
          html += `<td>${esc(sku.jan)}</td>`;
          html += `<td>${esc(sku.price)}</td>`;
        } else {
          const opts = sku.options.map(o => `${o.name}:${o.value}`).join(' / ');
          html += `<td>${esc(sku.skuId)}</td>`;
          html += `<td>${esc(opts)}</td>`;
          html += `<td>${esc(sku.price)}</td>`;
          html += `<td>${esc(sku.inventory)}</td>`;
          html += `<td>${sku.image ? `<img src="${sku.image}" style="width:36px;height:36px;object-fit:cover;border-radius:3px;" onerror="this.style.display='none'" loading="lazy">` : ''}</td>`;
        }
        html += `</tr>`;
      });
      html += `</tbody></table></div></div>`;
    }
    html += `</div></div>`;
  });
  container.innerHTML = html;
  resolveGenreNames();
}

function renderTableView() {
  const container = document.getElementById('table-view');
  let keyCols;
  if (sourceType === 'rakuten') {
    keyCols = ['商品管理番号（商品URL）','商品名','商品番号','キャッチコピー','バリエーション項目名定義','SKU管理番号','システム連携用SKU番号','バリエーション項目選択肢1','バリエーション項目選択肢2','通常購入販売価格','カタログID'];
  } else if (sourceType === 'jisha') {
    keyCols = ['タスクID','商品番号','商品名','カテゴリ','素材','サイズ','カラー','JAN','仕入金額(円)','販売金額(税込)','採寸サイズ','商品ポイント','仕様','洗濯表記','配送方法'];
  } else {
    keyCols = ['Handle','Title*','SKU','Option1 name','Option1 value','Option2 name','Option2 value','SKU price','SKU Inventory Quantity'];
  }
  const colIndices = keyCols.map(c => CI[c]).filter(i => i !== undefined);
  const colNames = keyCols.filter(c => CI[c] !== undefined);
  let html = '<table><thead><tr><th class="col-idx">#</th>';
  colNames.forEach(cn => { html += `<th>${esc(cn)}</th>`; });
  html += '</tr></thead><tbody>';
  rawRows.forEach((row, ri) => {
    const hasName = sourceType === 'rakuten' ? (col(row, '商品名') || '').trim() : sourceType === 'jisha' ? (col(row, '商品名') || '').trim() : (col(row, 'Title*') || col(row, 'Title') || '').trim();
    html += `<tr class="${hasName ? 'row-product' : 'row-sku'}">`;
    html += `<td class="col-idx">${ri + 1}</td>`;
    colIndices.forEach(ci => {
      const val = row[ci] || '';
      html += `<td>${esc(trunc(val, 60))}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody></table>';
  container.innerHTML = html;
}

// ============================================================
// EDIT HANDLERS
// ============================================================
function onFieldEdit(el, pi, key) {
  const val = el.innerText.trim();
  if (products[pi] && products[pi][key] !== undefined) products[pi][key] = val;
}

function onSkuEdit(el, pi, si, field) {
  const val = el.innerText.trim();
  if (products[pi] && products[pi].skus[si]) {
    products[pi].skus[si][field] = val;
    const sku = products[pi].skus[si];
    if (field === 'price') {
      const priceCol = sourceType === 'rakuten' ? '通常購入販売価格' : 'SKU price';
      if (CI[priceCol] !== undefined) rawRows[sku.rowIndex][CI[priceCol]] = val;
    }
  }
}

function onCellEdit(el, ri, ci) {
  const val = el.innerText.trim();
  if (rawRows[ri]) rawRows[ri][ci] = val;
}

// ============================================================
// VIEW HELPERS
// ============================================================
function setView(mode, btn) {
  btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('card-view').style.display = mode === 'card' ? 'block' : 'none';
  document.getElementById('table-view').style.display = mode === 'table' ? 'block' : 'none';
}

function toggleCard(hdr) { hdr.closest('.product-card').classList.toggle('open'); }
function expandAll() { document.querySelectorAll('.product-card').forEach(c => c.classList.add('open')); }
function collapseAll() { document.querySelectorAll('.product-card').forEach(c => c.classList.remove('open')); }
function filterProducts(q) {
  const lq = q.toLowerCase();
  document.querySelectorAll('.product-card').forEach(card => {
    const s = (card.dataset.search || '').toLowerCase();
    card.style.display = (lq === '' || s.includes(lq)) ? '' : 'none';
  });
}

// ============================================================
// NAVIGATION
// ============================================================
function goToStep(n) {
  // Step2へ遷移時、データ未処理なら自動処理
  if (n === 2 && products.length === 0 && rawRows.length > 0) {
    if (sourceType === 'rakuten') { products = structureRakuten(); }
    else { products = structureJisha(); }
    editedFields = {};
  }
  if (n > 1 && products.length === 0) return;
  const containerEl = document.querySelector('.container');
  const panel2 = document.getElementById('panel-2');
  const panel3 = document.getElementById('panel-3');
  const isFullscreen = n === 1 || n === 2 || n === 3;
  // body.style.overflowをリセット（renderStep2で変更される可能性あり）
  document.body.style.overflow = '';
  // step2-actionsの固定位置をリセット
  const step2Actions = document.getElementById('step2-actions');
  if (step2Actions) { step2Actions.style.position = ''; step2Actions.style.bottom = ''; step2Actions.style.left = ''; step2Actions.style.right = ''; step2Actions.style.borderTop = ''; step2Actions.style.zIndex = ''; step2Actions.style.justifyContent = ''; step2Actions.style.display = ''; }
  if (isFullscreen) {
    document.body.classList.add('rms-fullscreen');
    const panel1 = document.getElementById('panel-1');
    const targetPanel = n === 1 ? panel1 : n === 2 ? panel2 : panel3;
    if (containerEl) { containerEl.style.maxWidth = 'none'; containerEl.style.padding = '0'; containerEl.style.margin = '0'; containerEl.style.width = '100%'; containerEl.style.overflow = ''; }
    if (targetPanel) { targetPanel.style.padding = '0'; targetPanel.style.margin = '0'; targetPanel.style.borderRadius = '0'; targetPanel.style.boxShadow = 'none'; targetPanel.style.background = 'transparent'; }
  } else {
    document.body.classList.remove('rms-fullscreen');
    if (containerEl) { containerEl.style.maxWidth = ''; containerEl.style.padding = ''; containerEl.style.margin = ''; containerEl.style.width = ''; containerEl.style.overflow = ''; }
    if (panel2) { panel2.style.padding = ''; panel2.style.margin = ''; panel2.style.borderRadius = ''; panel2.style.boxShadow = ''; }
    if (panel3) { panel3.style.padding = ''; panel3.style.margin = ''; panel3.style.borderRadius = ''; panel3.style.boxShadow = ''; }
    const rmsViewNav = document.getElementById('step2-rms-view');
    if (rmsViewNav) { rmsViewNav.style.background = ''; }
    if (window._rmsResizeHandler) { window.removeEventListener('resize', window._rmsResizeHandler); window._rmsResizeHandler = null; }
    if (window._rms3ResizeHandler) { window.removeEventListener('resize', window._rms3ResizeHandler); window._rms3ResizeHandler = null; }
    if (window._jishaResizeHandler) { window.removeEventListener('resize', window._jishaResizeHandler); window._jishaResizeHandler = null; }
  }
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.getElementById(`panel-${n}`).classList.add('active');
  document.querySelectorAll('.step').forEach(s => {
    const sn = parseInt(s.dataset.step);
    s.classList.remove('active', 'done');
    if (sn === n) s.classList.add('active');
    else if (sn < n) s.classList.add('done');
  });
  if (n === 2 && products.length > 0) renderStep2();
  if (n === 3) renderRmsPreview();
  if (n === 4) renderStep4Download();
}

// ============================================================
// STEP 4: DOWNLOAD
// ============================================================
const MALLS = {
  rakuten: { name: '楽天', desc: '楽天市場 商品一括登録CSV' },
  futureshop: { name: 'FutureShop', desc: 'FutureShop 商品CSV（4ファイル）' },
  tiktok: { name: 'TikTok', desc: 'TikTok Shop 商品CSV' },
  zozo: { name: 'ZOZO', desc: 'ZOZO用 商品Excel' },
  rakufashion: { name: '楽天ファッション', desc: '楽天ファッション 商品CSV' },
};

function renderStep4Download() {
  const totalProducts = products.length;
  const totalSkus = products.reduce((s, p) => s + p.skus.length, 0);
  document.getElementById('summary-cards-dl').innerHTML = `
    <div class="summary-card"><div class="num">${totalProducts}</div><div class="label">商品数</div></div>
    <div class="summary-card"><div class="num">${totalSkus}</div><div class="label">SKU数</div></div>
    <div class="summary-card"><div class="num">${sourceType === 'jisha' ? 1 : Object.keys(MALLS).length}</div><div class="label">出力先モール</div></div>
  `;
  let html = '';
  const mallEntries = sourceType === 'jisha'
    ? [['rakuten', MALLS.rakuten]]
    : Object.entries(MALLS);
  mallEntries.forEach(([key, mall]) => {
    const isSame = (key === sourceType);
    html += `<div class="download-card">`;
    html += `<div class="mall-name">${mall.name}</div>`;
    html += `<div class="mall-desc">${mall.desc}</div>`;
    if (isSame) html += `<div style="font-size:10px;color:var(--warning);margin-bottom:6px;">（元データと同じ形式）</div>`;
    html += `<button class="btn btn-success" onclick="downloadMall('${key}')">⬇ ${key === 'rakuten' ? 'normal-item.csv' : 'CSVダウンロード'}</button>`;
    // 楽天の場合: item-cat.csvダウンロードボタン
    if (key === 'rakuten') {
      html += `<button class="btn btn-outline" onclick="downloadItemCat()" style="margin-top:6px; font-size:12px;">⬇ item-cat.csv</button>`;
    }
    // 楽天 + 自社Excelの場合: API直接登録ボタンを追加
    if (key === 'rakuten' && sourceType === 'jisha') {
      const hasApiCreds = MASTER.malls.rakuten.serviceSecret && MASTER.malls.rakuten.licenseKey;
      html += `<div style="margin-top:10px; padding-top:10px; border-top:1px dashed var(--border);">`;
      if (hasApiCreds) {
        html += `<button class="btn btn-primary" onclick="registerToRakutenApi()" style="background:#c45c5c;">🔗 楽天APIで直接登録</button>`;
      } else {
        html += `<button class="btn btn-outline" disabled style="opacity:0.5; cursor:not-allowed;">🔗 楽天APIで直接登録</button>`;
        html += `<div style="font-size:11px; color:#999; margin-top:4px;">マスタ設定でRMS API認証情報を設定してください</div>`;
      }
      html += `</div>`;
    }
    html += `</div>`;
  });

  // ネクストエンジンAPI直接登録カード
  if (sourceType === 'jisha') {
    const hasNeCreds = MASTER.malls.rakuten.corsProxy && MASTER.malls.rakuten.neAccessToken && MASTER.malls.rakuten.neRefreshToken;
    html += `<div class="download-card" style="border-color:#f39c12;">`;
    html += `<div class="mall-name" style="color:#e67e22;">ネクストエンジン</div>`;
    html += `<div class="mall-desc">NE APIで商品マスタを直接登録</div>`;
    if (hasNeCreds) {
      html += `<button class="btn btn-primary" onclick="registerToNextEngineApi()" style="background:#e67e22; border-color:#e67e22;">🔗 NE APIで直接登録</button>`;
    } else {
      html += `<button class="btn btn-outline" disabled style="opacity:0.5; cursor:not-allowed;">🔗 NE APIで直接登録</button>`;
      html += `<div style="font-size:11px; color:#999; margin-top:4px;">マスタ設定でNE API認証情報を設定してください</div>`;
    }
    html += `</div>`;
  }

  // 楽天API登録の進捗表示エリア
  if (sourceType === 'jisha') {
    html += `<div id="api-register-status" style="display:none; grid-column:1/-1; border:1px solid var(--border); border-radius:10px; padding:16px;">`;
    html += `<div style="font-weight:600; margin-bottom:8px; color:var(--primary-dark);">楽天API登録 進捗</div>`;
    html += `<div id="api-register-progress" style="font-size:13px; margin-bottom:8px; color:var(--text-light);"></div>`;
    html += `<div id="api-register-log" style="max-height:200px; overflow-y:auto; border:1px solid #eee; border-radius:6px; padding:8px; background:#fafafa;"></div>`;
    html += `</div>`;
  }

  // NE API登録の進捗表示エリア
  if (sourceType === 'jisha') {
    html += `<div id="ne-api-register-status" style="display:none; grid-column:1/-1; border:1px solid #f39c12; border-radius:10px; padding:16px;">`;
    html += `<div style="font-weight:600; margin-bottom:8px; color:#e67e22;">ネクストエンジンAPI登録 進捗</div>`;
    html += `<div id="ne-api-register-progress" style="font-size:13px; margin-bottom:8px; color:var(--text-light);"></div>`;
    html += `<div id="ne-api-register-log" style="max-height:200px; overflow-y:auto; border:1px solid #eee; border-radius:6px; padding:8px; background:#fafafa;"></div>`;
    html += `</div>`;
  }
  document.getElementById('download-grid').innerHTML = html;
}

function downloadMall(mallKey) {
  let result;
  switch(mallKey) {
    case 'rakuten': result = convertToRakuten(); break;
    case 'futureshop': result = convertToFutureshop(); break;
    case 'tiktok': result = convertToTiktok(); break;
    case 'zozo': result = convertToZozo(); break;
    case 'rakufashion': result = convertToRakufashion(); break;
    default: return;
  }

  const bom = '\uFEFF';
  const ts = dateTimeStr();

  // TikTok: xlsx出力
  if (result.workbook) {
    const wbOut = XLSX.write(result.workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbOut], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tiktok_${ts}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
    notify('TikTokのExcelをダウンロードしました', 'success');
    return;
  }

  if (result.sheets) {
    // 複数CSV出力（FutureShop等）
    result.sheets.forEach((sheet, i) => {
      setTimeout(() => {
        const csvStr = buildCSV(sheet.headers, sheet.rows);
        const blob = new Blob([bom + csvStr], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${sheet.name}${ts}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }, i * 500);
    });
    notify(`${MALLS[mallKey].name}の${result.sheets.length}つのCSVをダウンロードしました`, 'success');
  } else {
    // 単一CSV出力
    const csvStr = buildCSV(result.headers, result.rows);
    const blob = new Blob([bom + csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const mallFileNames = { rakuten: 'normal-item', futureshop: 'futureshop', zozo: 'zozo', rakufashion: 'rakuten-fashion' };
    a.download = `${mallFileNames[mallKey] || mallKey}_${ts}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    notify(`${MALLS[mallKey].name}のCSVをダウンロードしました`, 'success');
  }
}

// ============================================================
// CONVERSION: Rakuten
// ============================================================
// 採寸サイズを整形: 【M】着丈：97cm / ウエスト：32-38cm... → サイズ別テキスト
function formatMeasureSize(measureStr) {
  if (!measureStr) return '';
  const sizePattern = /【([^】]+)】/g;
  const matches = [];
  let match;
  while ((match = sizePattern.exec(measureStr)) !== null) {
    matches.push({ label: match[1], start: match.index + match[0].length });
  }
  if (matches.length === 0) return measureStr;
  // サイズグループ名（M/Lなど）をスキップして各サイズセクションを整形
  const lines = [];
  for (let i = 0; i < matches.length; i++) {
    const label = matches[i].label;
    // M/L, フリー等のグループ名はスキップ
    if (label.includes('/') || label.includes('フリー') || label.includes('ワンサイズ')) continue;
    const end = (i + 1 < matches.length) ? matches[i + 1].start - matches[i + 1].label.length - 2 : measureStr.length;
    const text = measureStr.substring(matches[i].start, end).trim();
    const items = text.split(/\s*\/\s*/);
    lines.push(label + '<br>');
    items.forEach(item => {
      const m = item.match(/^([^：:]+?)\s*(?:\([^)]*\))?\s*[：:]\s*(.+)$/);
      if (m) {
        lines.push(m[1].trim() + '：' + m[2].trim() + '<br>');
      }
    });
  }
  return lines.join('\n');
}

// カラー一覧をSKUから生成
function formatColorList(prod) {
  if (!prod.skus || prod.skus.length === 0) return '';
  const colors = [...new Set(prod.skus.map(s => s.color).filter(Boolean))];
  return colors.join(' / ');
}

// 仕様を改行形式に整形: "透け感あり / 伸縮性なし / ..." → "・透け感あり<br>・伸縮性なし<br>..."
function formatSpec(spec) {
  if (!spec) return '';
  return spec.split(/\s*[\/／]\s*/).map(s => '・' + s.trim()).join('<br>');
}

// テンプレート置換: {商品名} {素材} 等を実データに置換
function applyDescTemplate(tpl, prod) {
  if (!tpl) return '';
  // 画像URLリストを生成
  const imageUrls = generateRakutenImageUrls(prod);
  let result = tpl
    .replace(/\{商品名\}/g, prod.cleanName || prod.name || '')
    .replace(/\{素材\}/g, prod.material || '')
    .replace(/\{採寸サイズ\}/g, prod.measureSize || '')
    .replace(/\{商品ポイント\}/g, prod.productPoint || '')
    .replace(/\{仕様\}/g, prod.spec || '')
    .replace(/\{洗濯表記\}/g, prod.laundryLabel || '')
    .replace(/\{販売金額\}/g, prod.sellPrice || '')
    .replace(/\{商品番号\}/g, prod.number || '')
    .replace(/\{カテゴリ\}/g, prod.category || '')
    .replace(/\{仕入金額\}/g, prod.costPrice || '')
    .replace(/\{採寸サイズ整形\}/g, formatMeasureSize(prod.measureSize))
    .replace(/\{カラー一覧\}/g, formatColorList(prod))
    .replace(/\{仕様整形\}/g, formatSpec(prod.spec));
  // {img画像} を置換（品番img.jpg）
  const imgUrl = generateImgUrl(prod);
  result = result.replace(/\{img画像\}/g, imgUrl);
  // {画像URL1}〜{画像URL20} を置換
  for (let i = 1; i <= 20; i++) {
    result = result.replace(new RegExp(`\\{画像URL${i}\\}`, 'g'), imageUrls[i - 1] || '');
  }
  // {カラバリ繰返し}...{/カラバリ繰返し} を色の数だけ展開
  const colorImageMap = generateColorImageMap(prod);
  const colorImgUrlMap = generateColorImgUrlMap(prod);
  const colorCount = Object.keys(colorImageMap).length;
  result = result.replace(/\{カラバリ繰返し\}([\s\S]*?)\{\/カラバリ繰返し\}/g, (match, inner) => {
    const blocks = [];
    for (let c = 1; c <= colorCount; c++) {
      // {色画像N} → そのカラーのN枚目URL
      let block = inner.replace(/\{色画像(\d+)\}/g, (m, imgNum) => {
        const urls = colorImageMap[c];
        if (!urls) return '';
        return urls[parseInt(imgNum) - 1] || '';
      });
      // {色img画像} → そのカラーのimg画像URL
      block = block.replace(/\{色img画像\}/g, colorImgUrlMap[c] || '');
      // {色番号} → 1, 2, 3...
      block = block.replace(/\{色番号\}/g, String(c));
      blocks.push(block);
    }
    return blocks.join('');
  });
  // {1色目画像1}〜{N色目画像M} を置換（個別指定も引き続き対応）
  result = result.replace(/\{(\d+)色目画像(\d+)\}/g, (match, colorNum, imgNum) => {
    const urls = colorImageMap[parseInt(colorNum)];
    if (!urls) return '';
    return urls[parseInt(imgNum) - 1] || '';
  });
  // {1色目img画像}〜{N色目img画像} を置換
  result = result.replace(/\{(\d+)色目img画像\}/g, (match, colorNum) => {
    return colorImgUrlMap[parseInt(colorNum)] || '';
  });
  return result;
}

function convertToRakuten() {
  if (sourceType === 'rakuten') return { headers, rows: rawRows };
  const rm = MASTER.malls.rakuten;
  // RMS完全互換ヘッダー（楽天RMSダウンロードCSV準拠）
  const rH = [
    'コントロールカラム',
    '商品管理番号（商品URL）','商品番号','商品名',
    '倉庫指定','サーチ表示',
    '消費税','消費税率',
    '販売期間指定（開始日時）','販売期間指定（終了日時）',
    'ポイント変倍率','ポイント変倍率適用期間（開始日時）','ポイント変倍率適用期間（終了日時）',
    '終了日未設定','注文ボタン','予約商品発売日','ソーシャルギフト',
    '商品問い合わせボタン','闇市パスワード','在庫表示','代引料',
    'ジャンルID','非製品属性タグID',
    'キャッチコピー','PC用商品説明文','スマートフォン用商品説明文','PC用販売説明文'
  ];
  // 商品画像 ×20（タイプ・パス・ALT）
  for (let i = 1; i <= 20; i++) {
    rH.push(`商品画像タイプ${i}`, `商品画像パス${i}`, `商品画像名（ALT）${i}`);
  }
  rH.push(
    '動画','白背景画像タイプ','白背景画像パス',
    '商品情報レイアウト','ヘッダー・フッター・レフトナビ','表示項目の並び順',
    '共通説明文（小）','目玉商品','共通説明文（大）',
    'レビュー本文表示','メーカー提供情報表示',
    '定期購入設定','定期用指定可能なお届け日・月ごとに日付を指定','定期用指定可能なお届け日・週ごとに曜日を指定',
    '頒布会設定','頒布会購入ボタン','頒布会用指定可能なお届け日・月ごとに日付を指定','頒布会用指定可能なお届け日・週ごとに曜日を指定',
    'お届け回数','商品ページへの発送商品名の表示','発送商品名',
    'バリエーション項目キー定義','バリエーション項目名定義',
    'バリエーション1選択肢定義','バリエーション2選択肢定義','バリエーション3選択肢定義',
    'バリエーション4選択肢定義','バリエーション5選択肢定義','バリエーション6選択肢定義',
    '選択肢タイプ','商品オプション項目名'
  );
  // 商品オプション選択肢 ×100
  for (let i = 1; i <= 100; i++) { rH.push(`商品オプション選択肢${i}`); }
  rH.push(
    '商品オプション選択必須',
    'SKU管理番号','システム連携用SKU番号'
  );
  // バリエーション項目キー/選択肢 ×6
  for (let i = 1; i <= 6; i++) { rH.push(`バリエーション項目キー${i}`, `バリエーション項目選択肢${i}`); }
  rH.push(
    '通常購入販売価格','表示価格','二重価格文言管理番号',
    '注文受付数','再入荷お知らせボタン','のし対応',
    '在庫数','在庫戻しフラグ','在庫切れ時の注文受付',
    '在庫あり時納期管理番号','在庫切れ時納期管理番号',
    '在庫あり時出荷リードタイム','在庫切れ時出荷リードタイム','配送リードタイム',
    'SKU倉庫指定',
    '配送方法セット管理番号','送料','送料区分1','送料区分2',
    '個別送料','地域別個別送料管理番号','単品配送設定使用',
    '海外配送管理番号','置き配指定',
    'カタログID','カタログIDなしの理由','セット商品用カタログID',
    'SKU画像タイプ','SKU画像パス','SKU画像名（ALT）',
    '定期購入販売価格','定期用初回価格','頒布会販売価格','頒布会用初回価格'
  );
  // 商品属性 ×100（項目・値・単位）
  for (let i = 1; i <= 100; i++) { rH.push(`商品属性（項目）${i}`, `商品属性（値）${i}`, `商品属性（単位）${i}`); }
  // 自由入力行 ×5
  for (let i = 1; i <= 5; i++) { rH.push(`自由入力行（項目）${i}`, `自由入力行（値）${i}`); }

  const RI = {};
  rH.forEach((h, i) => RI[h] = i);
  const rows = [];
  const cabinetPrefix = 'https://image.rakuten.co.jp/noahl/cabinet';
  const toCabinetPath = (url) => url && url.startsWith(cabinetPrefix) ? url.substring(cabinetPrefix.length) : url;

  if (sourceType === 'jisha') {
    products.forEach(prod => {
      const colorSet = new Set();
      const sizeSet = new Set();
      prod.skus.forEach(sku => {
        if (sku.color) colorSet.add(sku.color);
        if (sku.size) sizeSet.add(sku.size);
      });
      const hasColor = colorSet.size > 0;
      const hasSize = sizeSet.size > 0;
      const rakutenName = applyMallName(prod.cleanName || prod.name, 'rakuten');

      // === 商品行 ===
      const pRow = new Array(rH.length).fill('');
      pRow[RI['コントロールカラム']] = prod._controlCol || rm.controlCol || 'n';
      pRow[RI['商品管理番号（商品URL）']] = prod.number;
      pRow[RI['商品番号']] = prod._productNo || prod.number;
      pRow[RI['商品名']] = rakutenName;
      pRow[RI['倉庫指定']] = prod._warehouse !== undefined ? prod._warehouse : (prod.warehouse || '0');
      pRow[RI['サーチ表示']] = prod._searchDisplay !== undefined ? prod._searchDisplay : (prod.searchDisplay || '0');
      pRow[RI['消費税']] = prod._taxType !== undefined ? prod._taxType : (rm.taxType || '0');
      pRow[RI['販売期間指定（開始日時）']] = prod._salePeriodStart !== undefined ? prod._salePeriodStart : (prod.saleStartDate || '');
      pRow[RI['販売期間指定（終了日時）']] = prod._salePeriodEnd !== undefined ? prod._salePeriodEnd : (prod.saleEndDate || '');
      pRow[RI['ポイント変倍率']] = prod._pointRate !== undefined ? prod._pointRate : String(rm.pointRate || 1);
      pRow[RI['ポイント変倍率適用期間（開始日時）']] = prod._pointStart !== undefined ? prod._pointStart : (rm.pointStart || '');
      pRow[RI['ポイント変倍率適用期間（終了日時）']] = prod._pointEnd !== undefined ? prod._pointEnd : (rm.pointEnd || '');
      pRow[RI['ジャンルID']] = prod._autoGenreId || rm.genreId || guessGenreId(prod.category, prod.cleanName || prod.name);
      pRow[RI['キャッチコピー']] = prod._catchCopy || prod.name || rakutenName;
      pRow[RI['PC用商品説明文']] = prod._pcDesc !== undefined ? prod._pcDesc : applyDescTemplate(rm.pcDescTpl, prod);
      pRow[RI['スマートフォン用商品説明文']] = prod._spDesc !== undefined ? prod._spDesc : applyDescTemplate(rm.spDescTpl, prod);
      pRow[RI['PC用販売説明文']] = prod._saleDesc !== undefined ? prod._saleDesc : applyDescTemplate(rm.saleDescTpl, prod);

      // 商品画像（CABINET形式）
      const imageUrls = generateRakutenImageUrls(prod);
      imageUrls.forEach((url, i) => {
        if (i < 20) {
          pRow[RI[`商品画像タイプ${i + 1}`]] = 'CABINET';
          pRow[RI[`商品画像パス${i + 1}`]] = toCabinetPath(url);
          pRow[RI[`商品画像名（ALT）${i + 1}`]] = rakutenName;
        }
      });

      // バリエーション定義
      const keyParts = [];
      const nameParts = [];
      if (hasColor) { keyParts.push('カラー'); nameParts.push('カラー'); }
      if (hasSize) { keyParts.push('サイズ'); nameParts.push('サイズ'); }
      pRow[RI['バリエーション項目キー定義']] = keyParts.join('|');
      pRow[RI['バリエーション項目名定義']] = nameParts.join('|');
      if (hasColor) {
        const sortedColors = [...colorSet].sort((a, b) => {
          return (MASTER.colorOrder[a] || 9999) - (MASTER.colorOrder[b] || 9999);
        });
        pRow[RI['バリエーション1選択肢定義']] = sortedColors.join('|');
      }
      if (hasSize) {
        const sizeOrder = {'S':1, 'M':2, 'L':3, 'XL':4, 'XXL':5, 'F':0, 'F(M)':0, 'フリー':0, 'FREE':0, 'F(M)フリー':0};
        const sortedSizes = [...sizeSet].sort((a, b) => (sizeOrder[a] || 99) - (sizeOrder[b] || 99));
        const sizeIdx = hasColor ? 2 : 1;
        pRow[RI[`バリエーション${sizeIdx}選択肢定義`]] = sortedSizes.join('|');
      }

      // 商品オプション（自社データにあれば設定）
      if (prod._options && prod._options.length > 0) {
        prod._options.forEach((opt, oi) => {
          if (oi === 0) {
            pRow[RI['選択肢タイプ']] = opt.type || '';
            pRow[RI['商品オプション項目名']] = opt.name || '';
            opt.choices.forEach((ch, ci) => {
              if (ci < 100) pRow[RI[`商品オプション選択肢${ci + 1}`]] = ch;
            });
            pRow[RI['商品オプション選択必須']] = opt.required || '0';
          }
        });
      }

      rows.push(pRow);

      // === SKU行 ===
      prod.skus.forEach(sku => {
        const sRow = new Array(rH.length).fill('');
        sRow[RI['コントロールカラム']] = prod._controlCol || rm.controlCol || 'n';
        sRow[RI['商品管理番号（商品URL）']] = prod.number;

        // SKU管理番号
        if (sku._skuMgmtOverride !== undefined) {
          sRow[RI['SKU管理番号']] = sku._skuMgmtOverride;
        } else {
          let skuSuffix = '';
          const skuFull = (sku.skuMgmtNo || '').trim();
          const parentNo = (prod.number || '').trim();
          if (skuFull && parentNo && skuFull.startsWith(parentNo)) {
            skuSuffix = skuFull.substring(parentNo.length);
          } else if (skuFull && parentNo) {
            const parts = skuFull.split('-');
            if (parts.length > 2) {
              skuSuffix = '-' + parts.slice(2).join('-');
            } else {
              skuSuffix = skuFull;
            }
          } else {
            skuSuffix = skuFull || sku.jan;
          }
          sRow[RI['SKU管理番号']] = skuSuffix;
        }

        // システム連携用SKU番号
        sRow[RI['システム連携用SKU番号']] = sku._systemSkuOverride !== undefined ? sku._systemSkuOverride : (sku.skuMgmtNo || (prod.number + sRow[RI['SKU管理番号']]));

        // バリエーション項目キー/選択肢
        if (hasColor) { sRow[RI['バリエーション項目キー1']] = 'カラー'; sRow[RI['バリエーション項目選択肢1']] = sku.color; }
        if (hasSize) {
          const sizeKeyIdx = hasColor ? 2 : 1;
          sRow[RI[`バリエーション項目キー${sizeKeyIdx}`]] = 'サイズ';
          sRow[RI[`バリエーション項目選択肢${sizeKeyIdx}`]] = sku.size;
        }

        // 価格・在庫
        sRow[RI['通常購入販売価格']] = sku.price || prod.sellPrice;
        sRow[RI['表示価格']] = sku._displayPrice || '';
        sRow[RI['注文受付数']] = prod._orderLimit || '';
        sRow[RI['再入荷お知らせボタン']] = prod._restockBtn !== undefined ? prod._restockBtn : (rm.restockBtn || '0');
        sRow[RI['のし対応']] = prod._noshi !== undefined ? prod._noshi : (rm.noshi || '0');
        sRow[RI['在庫数']] = sku._stock || '0';

        // 配送
        // 自社Excelの配送方法からセット管理番号を自動解決
        let resolvedShippingSet = prod._shippingSet !== undefined ? prod._shippingSet : (rm.shippingSet || '');
        if (!resolvedShippingSet && prod.shippingMethod && rm.shippingSets && rm.shippingSets.length > 0) {
          const method = prod.shippingMethod.trim();
          const found = rm.shippingSets.find(s => s.name === method || method.includes(s.name) || s.name.includes(method));
          if (found) resolvedShippingSet = found.num;
        }
        sRow[RI['配送方法セット管理番号']] = resolvedShippingSet;
        sRow[RI['送料']] = prod._shippingFee !== undefined ? prod._shippingFee : (rm.shippingFee || '0');
        sRow[RI['送料区分1']] = prod._shippingCat1 !== undefined ? prod._shippingCat1 : (rm.shippingCat1 || '');
        sRow[RI['送料区分2']] = prod._shippingCat2 !== undefined ? prod._shippingCat2 : (rm.shippingCat2 || '');
        sRow[RI['個別送料']] = prod._indivShipping !== undefined ? prod._indivShipping : String(rm.indivShipping || 0);

        // カタログID
        sRow[RI['カタログID']] = sku._catalogId || prod._catalogId || '';
        sRow[RI['カタログIDなしの理由']] = sku._catalogReason !== undefined ? sku._catalogReason : (prod._catalogReason || rm.catalogReason || '3');

        // SKU画像（CABINET形式）
        if (sku._skuImgType || sku._skuImgPath) {
          sRow[RI['SKU画像タイプ']] = sku._skuImgType || '';
          sRow[RI['SKU画像パス']] = sku._skuImgPath || '';
        } else if (sku.colorCode) {
          const skuParts = (prod.number || '').split('-');
          if (skuParts.length >= 2) {
            const skuBase = skuParts[0];
            const skuYm = skuParts[1];
            const skuYy = skuYm.substring(0, 2);
            const skuFolder = `20${skuYy}/20${skuYm}/`;
            const skuCabinetBase = rm.imgCabinetBase || '/shohin/';
            sRow[RI['SKU画像タイプ']] = 'CABINET';
            sRow[RI['SKU画像パス']] = `${skuCabinetBase}${skuFolder}${skuBase}-${sku.colorCode.toLowerCase()}1.jpg`;
          }
        }

        // 商品属性（カラー、ブランド名、メーカー型番、素材、代表カラー、サイズ）
        let attrIdx = 1;
        if (sku.color) {
          sRow[RI[`商品属性（項目）${attrIdx}`]] = 'カラー';
          sRow[RI[`商品属性（値）${attrIdx}`]] = sku.color;
          attrIdx++;
        }
        const brandName = rm.brandName || 'NOAHL';
        sRow[RI[`商品属性（項目）${attrIdx}`]] = 'ブランド名';
        sRow[RI[`商品属性（値）${attrIdx}`]] = brandName;
        attrIdx++;
        const prodBase = (prod.number || '').split('-')[0] || '';
        if (prodBase) {
          sRow[RI[`商品属性（項目）${attrIdx}`]] = 'メーカー型番';
          sRow[RI[`商品属性（値）${attrIdx}`]] = prodBase;
          attrIdx++;
        }
        if (prod.material) {
          sRow[RI[`商品属性（項目）${attrIdx}`]] = '素材（生地・毛糸）';
          sRow[RI[`商品属性（値）${attrIdx}`]] = prod.material;
          attrIdx++;
        }
        const repColor = getRepresentativeColor(sku.color);
        if (repColor) {
          sRow[RI[`商品属性（項目）${attrIdx}`]] = '代表カラー';
          sRow[RI[`商品属性（値）${attrIdx}`]] = repColor;
          attrIdx++;
        }
        if (sku.size) {
          sRow[RI[`商品属性（項目）${attrIdx}`]] = 'サイズ';
          sRow[RI[`商品属性（値）${attrIdx}`]] = sku.size;
          attrIdx++;
        }
        // 採寸サイズから寸法属性を自動設定
        if (prod.measureSize && sku.size) {
          const measures = parseMeasureSize(prod.measureSize, sku.size);
          const measureOrder = ['着丈','総丈','肩幅','身幅','そで丈','ゆき丈','ウエスト','ヒップ','股上','股下','もも幅','裾幅','スカート丈'];
          measureOrder.forEach(attrName => {
            if (measures[attrName] && attrIdx <= 100) {
              sRow[RI[`商品属性（項目）${attrIdx}`]] = attrName;
              sRow[RI[`商品属性（値）${attrIdx}`]] = measures[attrName];
              sRow[RI[`商品属性（単位）${attrIdx}`]] = 'cm';
              attrIdx++;
            }
          });
        }

        // 自由入力行
        sRow[RI['自由入力行（項目）1']] = '型番';
        sRow[RI['自由入力行（値）1']] = sku.jan || sku.skuMgmtNo;

        rows.push(sRow);
      });

      // === 商品オプション行（2つ目以降） ===
      if (prod._options && prod._options.length > 1) {
        for (let oi = 1; oi < prod._options.length; oi++) {
          const opt = prod._options[oi];
          const oRow = new Array(rH.length).fill('');
          oRow[RI['商品管理番号（商品URL）']] = prod.number;
          oRow[RI['選択肢タイプ']] = opt.type || '';
          oRow[RI['商品オプション項目名']] = opt.name || '';
          opt.choices.forEach((ch, ci) => {
            if (ci < 100) oRow[RI[`商品オプション選択肢${ci + 1}`]] = ch;
          });
          oRow[RI['商品オプション選択必須']] = opt.required || '0';
          rows.push(oRow);
        }
      }
    });
  } else {
    // 他モール→楽天変換
    products.forEach(prod => {
      const optMap = {};
      prod.skus.forEach(sku => {
        sku.options.forEach(o => {
          if (o.name && !optMap[o.name]) optMap[o.name] = new Set();
          if (o.name) optMap[o.name].add(o.value);
        });
      });
      const optKeys = Object.keys(optMap);
      const pRow = new Array(rH.length).fill('');
      pRow[RI['コントロールカラム']] = 'n';
      pRow[RI['商品管理番号（商品URL）']] = prod.id.replace(/-/g, '');
      pRow[RI['商品番号']] = prod.spu || pRow[RI['商品管理番号（商品URL）']];
      pRow[RI['商品名']] = applyMallName(prod.name, 'rakuten');
      pRow[RI['倉庫指定']] = '1';
      pRow[RI['サーチ表示']] = '0';
      pRow[RI['キャッチコピー']] = prod.subtitle || '';
      pRow[RI['PC用商品説明文']] = prod.description || '';
      pRow[RI['バリエーション項目キー定義']] = optKeys.map((_, i) => `key${i+1}`).join('|');
      pRow[RI['バリエーション項目名定義']] = optKeys.join('|');
      if (optKeys[0]) pRow[RI['バリエーション1選択肢定義']] = [...optMap[optKeys[0]]].join('|');
      if (optKeys[1]) pRow[RI['バリエーション2選択肢定義']] = [...optMap[optKeys[1]]].join('|');
      rows.push(pRow);
      prod.skus.forEach(sku => {
        const sRow = new Array(rH.length).fill('');
        sRow[RI['商品管理番号（商品URL）']] = pRow[RI['商品管理番号（商品URL）']];
        sRow[RI['SKU管理番号']] = sku.skuId;
        sRow[RI['システム連携用SKU番号']] = sku.skuId;
        if (sku.options[0]) { sRow[RI['バリエーション項目キー1']] = 'key1'; sRow[RI['バリエーション項目選択肢1']] = sku.options[0].value; }
        if (sku.options[1]) { sRow[RI['バリエーション項目キー2']] = 'key2'; sRow[RI['バリエーション項目選択肢2']] = sku.options[1].value; }
        sRow[RI['通常購入販売価格']] = sku.price;
        sRow[RI['カタログIDなしの理由']] = '3';
        sRow[RI['自由入力行（項目）1']] = '型番';
        sRow[RI['自由入力行（値）1']] = sku.skuId;
        rows.push(sRow);
      });
    });
  }
  return { headers: rH, rows };
}

// ============================================================
// CONVERSION: FutureShop (4 CSV files)
// ============================================================

// Helper: サイズ名からサイズコードを抽出 (Sサイズ → S, F(M)フリー → F)
function getFsSizeCode(sizeName) {
  if (!sizeName) return '';
  const s = sizeName.replace(/サイズ$/, '').replace(/フリー$/, '').trim();
  return s || sizeName;
}

// Helper: SKUからカラー名/コード/サイズ名/コードを取得
function getFsSkuInfo(sku, prod) {
  let color = '', colorCode = '', size = '', sizeCode = '';
  if (sourceType === 'rakuten') {
    color = sku.variants?.[0]?.value || '';
    size = sku.variants?.[1]?.value || '';
    // システム連携用SKU番号からカラーコード/サイズコード抽出 (nbetp0004-2603-GJ-F → GJ, F)
    const fullSku = sku.systemSku || sku.skuMgmtNo || '';
    const prodId = prod.id || '';
    if (fullSku.startsWith(prodId) && fullSku.length > prodId.length) {
      const suffixParts = fullSku.substring(prodId.length).split('-').filter(Boolean);
      colorCode = suffixParts[0] || '';
      sizeCode = suffixParts[1] || '';
    } else {
      const parts = (sku.skuMgmtNo || '').split('-');
      const prodParts = (prod.id || '').split('-');
      if (parts.length > prodParts.length) colorCode = parts[prodParts.length] || '';
      if (parts.length > prodParts.length + 1) sizeCode = parts[prodParts.length + 1] || '';
    }
  } else {
    color = sku.color || '';
    colorCode = sku.colorCode || '';
    size = sku.size || '';
    sizeCode = getFsSizeCode(size);
  }
  return { color, colorCode, size, sizeCode };
}

function convertToFutureshop() {
  const fm = MASTER.malls.futureshop || {};
  const rm = MASTER.malls.rakuten || {};
  const sheets = [];

  // ========== 各商品のカラー/サイズ情報を事前計算 ==========
  const prodInfos = products.map(prod => {
    const colorMap = new Map();
    const sizeMap = new Map();
    prod.skus.forEach(sku => {
      const info = getFsSkuInfo(sku, prod);
      if (info.color && !colorMap.has(info.color)) colorMap.set(info.color, info.colorCode);
      if (info.size && !sizeMap.has(info.size)) sizeMap.set(info.size, info.sizeCode);
    });
    const sortedColors = [...colorMap.keys()].sort((a, b) =>
      (MASTER.colorOrder[a] || 9999) - (MASTER.colorOrder[b] || 9999)
    );
    const sizeOrder = {'S':1,'M':2,'L':3,'XL':4,'XXL':5,'F':0,'F(M)':0,'フリー':0,'FREE':0,'F(M)フリー':0};
    const sortedSizes = [...sizeMap.keys()].sort((a, b) =>
      (sizeOrder[getFsSizeCode(a)] || sizeOrder[a] || 99) - (sizeOrder[getFsSizeCode(b)] || sizeOrder[b] || 99)
    );
    return { prod, colorMap, sizeMap, sortedColors, sortedSizes };
  });

  // ========== 1. ccGoods_ (商品基本情報 114列) ==========
  const ccH = [
    'コントロールカラム','商品URLコード','ステータス','商品番号','商品名',
    'メイングループ','優先度','本体価格','定価','消費税',
    '販売期間(From)','販売期間(to)','販売期間表示','クール便指定',
    '送料','送料パターン','送料パターン表示','送料個別金額','個別送料表示',
    'オススメ商品商品ページ内表示','オススメ商品リスト','オススメ商品表示方法',
    '商品価格上部コメントHTMLタグ','商品価格上部コメント',
    '定価価格前文字','定価価格後文字','販売価格前文字','取消線','定価表示方法',
    '在庫管理','在庫数表示設定','在庫数表示設定方法','在庫僅少表示閾値',
    '在庫なし表示テキスト','在庫なし表示テキスト表示方法',
    '現在在庫数','調整在庫数','在庫数切れメール閾値',
    'バリエーション横軸名','バリエーション縦軸名',
    '会員価格設定','会員価格','アクセス制限',
    'ポイント付与率設定','ポイント付与率',
    'ステータス（他社サービス）','サンプル商品設定','サンプル商品同梱設定',
    '最大購入制限個数','入荷お知らせメールボタン表示',
    'JANコード','キャッチコピー',
    'レコメンド２：行動履歴収集タグ出力フラグ','レコメンド２：レコメンド商品出力フラグ',
    'レコメンド２：レコメンド表示フラグ','レコメンド２：レコメンド使用タグ優先設定',
    'レコメンド２：商品ページ上部コメントの上','レコメンド２：商品ページ上部コメントの下',
    'レコメンド２：商品ページ下部コメントの上','レコメンド２：商品ページ下部コメントの下',
    'レコメンド２：商品ページおすすめ商品の上','レコメンド２：商品ページおすすめ商品の下',
    'お気に入り登録数','メール便指定','メール便同梱数',
    'バンドル販売','外部連携任意項目',
    'おすすめ商品表示パターン設定','おすすめ商品表示パターン(コマースクリエイター)',
    '外部連携商品名','外部連携商品説明',
    'レイアウト割当名',
    'ページ名(コマースクリエイター)','ページ名表示方法(コマースクリエイター)',
    'キーワード(コマースクリエイター)','キーワード表示方法(コマースクリエイター)',
    'Description(コマースクリエイター)','Description表示方法(コマースクリエイター)',
    '商品一言説明(コマースクリエイター)',
    '商品説明（大）','商品説明（小）',
    '独自コメント（1）','独自コメント（2）','独自コメント（3）','独自コメント（4）',
    '独自コメント（5）','独自コメント（6）','独自コメント（7）','独自コメント（8）',
    '独自コメント（9）','独自コメント（10）','独自コメント（11）','独自コメント（12）',
    '独自コメント（13）','独自コメント（14）','独自コメント（15）','独自コメント（16）',
    '独自コメント（17）','独自コメント（18）','独自コメント（19）','独自コメント（20）',
    'レコメンド２：レコメンド表示フラグ(コマースクリエイター)',
    'レコメンド２：レコメンド使用タグ優先設定(コマースクリエイター)',
    'レコメンド２：出力タグ１','レコメンド２：出力タグ２','レコメンド２：出力タグ３',
    'レコメンド２：出力タグ４','レコメンド２：出力タグ５','レコメンド２：出力タグ６',
    '配送種別','メール便同梱可能数（upgrade）','商品リードタイム',
    '登録日時','最終更新日時'
  ];
  const ccI = {};
  ccH.forEach((h, i) => ccI[h] = i);
  const ccRows = [];

  // 列マッピング設定を取得
  const csData = migrateFsColumnSettings(fm);

  prodInfos.forEach(({ prod, colorMap, sizeMap, sortedColors, sortedSizes }) => {
    // 商品名: 楽天ソースではキャッチコピーをクリーンして使用
    const fsCatchCopy = prod.catchCopy || prod.productPoint || '';
    const fsCleanName = cleanProductName(fsCatchCopy) || prod.cleanName || prod.name || '';
    const name = applyMallName(fsCleanName, 'futureshop');

    // 本体価格: 楽天商品名の末尾数字を逆順にして取得
    let price = '';
    if (sourceType === 'rakuten') {
      const rawName = prod.name || '';
      const lastNumMatch = rawName.match(/(\d+)\s*$/);
      if (lastNumMatch) {
        price = lastNumMatch[1].split('').reverse().join('');
        // 先頭の0を除去
        price = price.replace(/^0+/, '') || '0';
      }
    }
    if (!price) {
      const basePrice = prod.sellPrice || prod.skus[0]?.price || '';
      price = calcMallPrice(basePrice, 'futureshop');
    }

    const hasColor = sortedColors.length > 0;
    const hasSize = sortedSizes.length > 0;

    const row = new Array(ccH.length).fill('');

    // 商品個別の値（動的に決まるもの）
    row[ccI['商品URLコード']] = prod.id || prod.number || '';
    row[ccI['商品番号']] = prod.id || prod.number || '';
    row[ccI['商品名']] = name;
    row[ccI['本体価格']] = price;

    // メール便指定（配送方法またはキャッチコピーから判定）
    const shippingHint = prod.shippingMethod || fsCatchCopy || prod.name || '';
    if (shippingHint.includes('メール便') || shippingHint.includes('ネコポス') || shippingHint.includes('ゆうパケット')) {
      row[ccI['メール便指定']] = '1';
      row[ccI['メール便同梱数']] = '0';
    }

    // 列マッピング適用（ccGoods_）- マスタ設定の値で上書き
    applyFsColumnSettings(csData.ccGoods, ccI, row, prod);

    ccRows.push(row);
  });
  sheets.push({ name: 'ccGoods_', headers: ccH, rows: ccRows });

  // ========== 2. goodsVariationConfirm_ (バリエーション定義) ==========
  const vcH = [
    'コントロールカラム','商品URLコード',
    'バリエーション1','バリエーション2','バリエーション3','バリエーション4',
    '表示順','商品番号','商品名','最終更新日時'
  ];
  const vcI = {};
  vcH.forEach((h, i) => vcI[h] = i);
  const vcRows = [];
  prodInfos.forEach(({ prod, colorMap, sizeMap, sortedColors, sortedSizes }) => {
    const fsCatchCopy2 = prod.catchCopy || prod.productPoint || '';
    const name = cleanProductName(fsCatchCopy2) || prod.cleanName || prod.name || '';
    const urlCode = prod.id || prod.number || '';

    sortedColors.forEach(color => {
      const code = colorMap.get(color) || '';
      const order = MASTER.colorOrder[color] || '';
      const row = new Array(vcH.length).fill('');
      row[vcI['商品URLコード']] = urlCode;
      row[vcI['バリエーション1']] = color;
      row[vcI['バリエーション2']] = code ? '-' + code : '';
      row[vcI['表示順']] = String(order);
      row[vcI['商品番号']] = urlCode;
      row[vcI['商品名']] = name;
      applyFsColumnSettings(csData.vc, vcI, row, prod);
      vcRows.push(row);
    });

    sortedSizes.forEach((size, idx) => {
      const code = sizeMap.get(size) || getFsSizeCode(size);
      const sizeOrder = MASTER.colorOrder[size] || (idx + 1);
      const row = new Array(vcH.length).fill('');
      row[vcI['商品URLコード']] = urlCode;
      row[vcI['バリエーション3']] = size;
      row[vcI['バリエーション4']] = code ? '-' + code : '';
      row[vcI['表示順']] = String(sizeOrder);
      row[vcI['商品番号']] = urlCode;
      row[vcI['商品名']] = name;
      applyFsColumnSettings(csData.vc, vcI, row, prod);
      vcRows.push(row);
    });
  });
  sheets.push({ name: 'goodsVariationConfirm_', headers: vcH, rows: vcRows });

  // ========== 3. goodsVariationDetail_ (SKU明細: 色×サイズ全組合せ) ==========
  const vdH = [
    '商品URLコード',
    'バリエーション1','バリエーション2','バリエーション3','バリエーション4',
    '代表バリエーション','在庫閾値','在庫切れメール',
    '商品番号','商品管理番号','商品名','JANコード','最終更新日付'
  ];
  const vdI = {};
  vdH.forEach((h, i) => vdI[h] = i);
  const vdRows = [];
  prodInfos.forEach(({ prod, colorMap, sizeMap, sortedColors, sortedSizes }) => {
    const fsCatchCopy3 = prod.catchCopy || prod.productPoint || '';
    const name = cleanProductName(fsCatchCopy3) || prod.cleanName || prod.name || '';
    const urlCode = prod.id || prod.number || '';

    let isFirstVariation = true;
    sortedColors.forEach(color => {
      const cCode = colorMap.get(color) || '';
      sortedSizes.forEach(size => {
        const sCode = sizeMap.get(size) || getFsSizeCode(size);
        const matchSku = prod.skus.find(sku => {
          const info = getFsSkuInfo(sku, prod);
          return info.color === color && info.size === size;
        });
        const mgmtNo = urlCode + (cCode ? '-' + cCode : '');

        const row = new Array(vdH.length).fill('');
        row[vdI['商品URLコード']] = urlCode;
        row[vdI['バリエーション1']] = color;
        row[vdI['バリエーション2']] = cCode ? '-' + cCode : '';
        row[vdI['バリエーション3']] = size;
        row[vdI['バリエーション4']] = sCode ? '-' + sCode : '';
        row[vdI['代表バリエーション']] = isFirstVariation ? '1' : '';
        row[vdI['商品番号']] = urlCode;
        row[vdI['商品管理番号']] = mgmtNo;
        row[vdI['商品名']] = name;
        applyFsColumnSettings(csData.vd, vdI, row, prod);
        vdRows.push(row);
        isFirstVariation = false;
      });
    });
  });
  sheets.push({ name: 'goodsVariationDetail_', headers: vdH, rows: vdRows });

  // ========== 4. goodsSelection_ (選択肢項目) ==========
  const gsH = [
    'コントロールカラム','商品URLコード','選択肢タイプ',
    'セレクト／ラジオボタン用項目名','セレクト／ラジオボタン用選択肢','項目選択肢前改行',
    '項目名位置','項目選択肢表示','テキスト幅','最終更新日時'
  ];
  const gsI = {};
  gsH.forEach((h, i) => gsI[h] = i);
  const gsRows = [];

  // 全商品に「レビュー投稿でノベルティを」選択肢を生成
  const reviewOptionName = fm.selectionOptionName || 'レビュー投稿でノベルティを';
  const reviewChoices = fm.selectionChoices || ['GETする', 'GETしない'];

  prodInfos.forEach(({ prod }) => {
    const urlCode = prod.id || prod.number || '';
    // レビュー投稿オプション（全商品に付与）
    reviewChoices.forEach(choice => {
      const row = new Array(gsH.length).fill('');
      row[gsI['商品URLコード']] = urlCode;
      row[gsI['セレクト／ラジオボタン用項目名']] = reviewOptionName;
      row[gsI['セレクト／ラジオボタン用選択肢']] = choice;
      applyFsColumnSettings(csData.gs, gsI, row, prod);
      gsRows.push(row);
    });
    // 追加の商品オプションがあれば出力
    const opts = prod._options || prod.options || [];
    opts.forEach(opt => {
      if (opt.name === reviewOptionName) return;
      (opt.choices || []).forEach(choice => {
        const row = new Array(gsH.length).fill('');
        row[gsI['商品URLコード']] = urlCode;
        row[gsI['選択肢タイプ']] = opt.type || 's';
        row[gsI['セレクト／ラジオボタン用項目名']] = opt.name || '';
        row[gsI['セレクト／ラジオボタン用選択肢']] = choice;
        applyFsColumnSettings(csData.gs, gsI, row, prod);
        gsRows.push(row);
      });
    });
  });
  sheets.push({ name: 'goodsSelection_', headers: gsH, rows: gsRows });

  return { sheets };
}

// ============================================================
// CONVERSION: TikTok Shop
// ============================================================

// 商品をSKUごとに展開し、バリエーション情報をフラット化
function expandProductsToSkuRows(prods) {
  const rm = MASTER.malls.rakuten || {};
  const shopId = rm.shopId || '';
  function toFullUrl(path) {
    if (!path) return '';
    if (/^https?:\/\//.test(path)) return path;
    if (!shopId) return path;
    return 'https://image.rakuten.co.jp/' + shopId + '/cabinet' + (path.startsWith('/') ? path : '/' + path);
  }

  // 説明文テキストに商品・SKU画像の <img> タグを挿入する（※注意書きの前）
  function buildDescWithImgs(prod) {
    const usedUrls = new Set();
    const imgUrls = [];
    const addImg = (url) => { if (url && !usedUrls.has(url)) { usedUrls.add(url); imgUrls.push(url); } };
    // 商品画像1・2
    if (prod.img1) addImg(toFullUrl(prod.img1));
    if (prod.img2) addImg(toFullUrl(prod.img2));
    // 全SKU画像
    (prod.skus || []).forEach(sku => { if (sku.skuImgPath) addImg(toFullUrl(sku.skuImgPath)); });
    // 後ろから2番目の商品画像（詳細/サイズ感画像）
    if (prod.images && prod.images.length >= 2) addImg(toFullUrl(prod.images[prod.images.length - 2].path));

    const base = prod.tiktokDesc || '';
    if (!imgUrls.length) return base;
    const imgHtml = '<br>\n' + imgUrls.map(u => `<img src="${u}">`).join('<br>');
    // 最初の ※ 行の前に <img> タグを挿入
    const lines = base.split('\n');
    const noticeStart = lines.findIndex(l => l.trim().startsWith('※'));
    if (noticeStart === -1) return base + '\n' + imgHtml;
    const before = lines.slice(0, noticeStart).join('\n').trimEnd();
    const notices = lines.slice(noticeStart).join('\n');
    return before + '\n' + imgHtml + '\n<br>\n' + notices;
  }

  const flatRows = [];
  prods.forEach(prod => {
    const varKeys = (prod.varDef && prod.varDef.keys ? prod.varDef.keys : '').split('|').filter(Boolean);
    const varNames = (prod.varDef && prod.varDef.names ? prod.varDef.names : '').split('|').filter(Boolean);
    const keyToName = {};
    varKeys.forEach((k, i) => { keyToName[k] = varNames[i] || k; });

    // img1〜img10 をフルURLに変換（パスのまま出力されるバグを修正）
    const imgUrls = {};
    for (let i = 1; i <= 10; i++) imgUrls['img' + i] = toFullUrl(prod['img' + i]);

    // サイズ表画像 = 最終画像
    const sizeChartImg = (prod.images && prod.images.length > 0)
      ? toFullUrl(prod.images[prod.images.length - 1].path) : '';

    // 説明文（画像タグ含む）= 商品単位で1回計算
    const tiktokDescWithImgs = buildDescWithImgs(prod);

    if (!prod.skus || prod.skus.length === 0) {
      flatRows.push(Object.assign({}, prod, imgUrls, {
        skuCode: prod.id || '', skuPrice: prod.price || '',
        skuImage: toFullUrl(prod.img1),
        var1Name: varNames[0] || '', var1Value: '', var1Image: '',
        var2Name: varNames[1] || '', var2Value: '',
        stockQty: 0, sizeChartImg, tiktokDescWithImgs,
      }));
    } else {
      prod.skus.forEach(sku => {
        const v1 = sku.variants && sku.variants[0];
        const v2 = sku.variants && sku.variants[1];
        const skuImg = toFullUrl(sku.skuImgPath) || toFullUrl(prod.img1);
        flatRows.push(Object.assign({}, prod, imgUrls, {
          skuCode: sku.systemSku || sku.skuMgmtNo || '',
          skuPrice: sku.price || prod.price || '',
          skuImage: skuImg,
          var1Name:  v1 ? (keyToName[v1.key] || v1.key) : '',
          var1Value: v1 ? v1.value : '',
          var1Image: toFullUrl(sku.skuImgPath) || '',
          var2Name:  v2 ? (keyToName[v2.key] || v2.key) : '',
          var2Value: v2 ? v2.value : '',
          stockQty: parseInt(sku.stock) || 0,
          sizeChartImg, tiktokDescWithImgs,
        }));
      });
    }
  });
  return flatRows;
}

function convertToTiktok() {
  const tm = MASTER.malls.tiktok || {};
  const mappings = tm.columnMappings || [];
  const templateB64 = tm.templateData || '';
  const flatRows = expandProductsToSkuRows(products);

  // テンプレートなし: シンプルCSVプレビュー
  if (!templateB64) {
    const ttH = mappings.length ? mappings.map(m => m.ttColumn) : ['商品コード', '商品名', '商品説明'];
    const colIndex = {};
    ttH.forEach((h, i) => colIndex[h] = i);
    const rows = flatRows.map(prod => {
      const row = new Array(ttH.length).fill('');
      applyTiktokMapping(mappings, colIndex, row, prod);
      return row;
    });
    return { headers: ttH, rows };
  }

  // テンプレートあり: xlsx出力
  const binary = Uint8Array.from(atob(templateB64), c => c.charCodeAt(0));
  const wb = XLSX.read(binary, { type: 'array' });
  const wsName = wb.SheetNames.find(n => n === 'Template') || wb.SheetNames[0];
  const ws = wb.Sheets[wsName];

  // 1行目から列インデックスを構築
  const range = XLSX.utils.decode_range(ws['!ref']);
  const colIndex = {};
  for (let c = range.s.c; c <= range.e.c; c++) {
    const cell = ws[XLSX.utils.encode_cell({ r: 0, c })];
    if (cell?.v) colIndex[String(cell.v)] = c;
  }

  // 6行目（index 5）以降に商品データを書き込む
  const numCols = range.e.c + 1;
  const dataRows = flatRows.map(prod => {
    const row = new Array(numCols).fill('');
    applyTiktokMapping(mappings, colIndex, row, prod);
    return row;
  });
  XLSX.utils.sheet_add_aoa(ws, dataRows, { origin: { r: 5, c: 0 } });
  return { workbook: wb };
}

function applyTiktokMapping(mappings, colIndex, row, prod) {
  (mappings || []).forEach(entry => {
    const ci = colIndex[entry.ttColumn];
    if (ci === undefined || entry.source === 'none') return;
    let val;
    if (entry.source === 'fixed') {
      val = entry.value;
    } else if (entry.source === 'current') {
      val = row[ci] || '';
    } else {
      val = String(prod[entry.source] || '');
    }
    if (entry.action === 'prefix') row[ci] = entry.value + (row[ci] || '');
    else if (entry.action === 'suffix') row[ci] = (row[ci] || '') + entry.value;
    else if (entry.action === 'remove') row[ci] = String(row[ci] || '').split(entry.value).join('');
    else row[ci] = val;
  });
}

// ============================================================
// CONVERSION: ZOZO (stub)
// ============================================================
function convertToZozo() {
  // TODO: ZOZO用Excelフォーマットの実装
  const zH = ['商品コード','商品名','販売価格','カラー','サイズ'];
  const rows = [];
  products.forEach(prod => {
    const name = prod.cleanName || prod.name;
    prod.skus.forEach(sku => {
      const r = new Array(zH.length).fill('');
      r[0] = prod.id || prod.number || '';
      r[1] = applyMallName(name, 'zozo');
      r[2] = sku.price || '';
      if (sourceType === 'rakuten') {
        r[3] = sku.variants?.[0]?.value || '';
        r[4] = sku.variants?.[1]?.value || '';
      } else {
        r[3] = sku.color || '';
        r[4] = sku.size || '';
      }
      rows.push(r);
    });
  });
  return { headers: zH, rows };
}

// ============================================================
// CONVERSION: 楽天ファッション (stub)
// ============================================================
function convertToRakufashion() {
  // TODO: 楽天ファッションCSVフォーマットの実装
  const rfH = ['商品コード','商品名','販売価格','カラー','サイズ'];
  const rows = [];
  products.forEach(prod => {
    const name = prod.cleanName || prod.name;
    prod.skus.forEach(sku => {
      const r = new Array(rfH.length).fill('');
      r[0] = prod.id || prod.number || '';
      r[1] = applyMallName(name, 'rakufashion');
      r[2] = sku.price || '';
      if (sourceType === 'rakuten') {
        r[3] = sku.variants?.[0]?.value || '';
        r[4] = sku.variants?.[1]?.value || '';
      } else {
        r[3] = sku.color || '';
        r[4] = sku.size || '';
      }
      rows.push(r);
    });
  });
  return { headers: rfH, rows };
}

// ============================================================
// LEGACY: Shopline (deprecated)
// ============================================================
function convertToShopline() {
  if (sourceType === 'shopline') return { headers, rows: rawRows };
  const slH = ['spuid','skuid','Handle','Title*','Subtitle','Product description html','SPU','Vendor','Tags','Collections','Master image','Image Alt Text','SEO title','SEO description','SEO keywords','Published','Status','Standardized Product Type','Custom Product Type','Created time','SKU','Option1 name','Option1 value','Option2 name','Option2 value','Option3 name','Option3 value','Option4 name','Option4 value','Option5 name','Option5 value','Image','SKU price','SKU compare at price','SKU weight','SKU weight unit','SKU Inventory Tracker','SKU Inventory Policy','SKU Inventory Quantity','Cost per item','Barcode (ISBN, UPC, GTIN, etc.)','SKU tax policy','SKU shipping policy','Google Shopping / Google Product Category','Google Shopping / Gender','Google Shopping / Age Group','Google Shopping / MPN','Google Shopping / AdWords Grouping','Google Shopping / AdWords Labels','Google Shopping / Condition','Google Shopping / Custom Product','Google Shopping / Custom Label 0','Google Shopping / Custom Label 1','Google Shopping / Custom Label 2','Google Shopping / Custom Label 3','Google Shopping / Custom Label 4','Path','HS code','Shipping origin','Included / Japan'];
  const SL = {};
  slH.forEach((h,i) => SL[h] = i);
  const rows = [];
  products.forEach(prod => {
    const pName = (sourceType === 'rakuten') ? prod.cleanName : (prod.cleanName || prod.name);
    const handle = pName.replace(/\s+/g, '-').substring(0, 60);
    const isRakuten = sourceType === 'rakuten';
    const varNames = isRakuten && prod.varDef ? prod.varDef.names.split('|') : ['カラー', 'サイズ'];
    prod.skus.forEach((sku, si) => {
      const r = new Array(slH.length).fill('');
      r[SL['Handle']] = handle;
      if (si === 0) {
        r[SL['Title*']] = applyMallName(pName, 'shopline');
        r[SL['Subtitle']] = isRakuten ? (prod.catchCopy || '') : '';
        r[SL['Product description html']] = isRakuten ? (prod.pcDesc || '') : '';
        r[SL['SPU']] = prod.number || '';
        r[SL['Vendor']] = '';
        if (prod.images.length > 0) {
          r[SL['Master image']] = isRakuten ? buildRakutenImgUrl(prod.images[0].path) : (prod.images[0].url || '');
        }
        r[SL['Image Alt Text']] = pName;
        r[SL['SEO title']] = pName;
        r[SL['Published']] = 'Y';
        r[SL['Status']] = 'Y';
      }
      const typeNo = sku.customFields ? sku.customFields.find(f => f.label === '型番') : null;
      r[SL['SKU']] = typeNo ? typeNo.value : (sku.systemSku || sku.jan || '');
      if (sku.variants && sku.variants[0]) { r[SL['Option1 name']] = varNames[0] || 'カラー'; r[SL['Option1 value']] = sku.variants[0].value; }
      if (sku.variants && sku.variants[1]) { r[SL['Option2 name']] = varNames[1] || 'サイズ'; r[SL['Option2 value']] = sku.variants[1].value; }
      if (isRakuten && sku.skuImgPath) r[SL['Image']] = buildRakutenImgUrl(sku.skuImgPath);
      r[SL['SKU price']] = sku.price || (sourceType === 'jisha' ? prod.sellPrice : '');
      r[SL['SKU compare at price']] = r[SL['SKU price']];
      r[SL['SKU weight']] = '10';
      r[SL['SKU weight unit']] = 'g';
      r[SL['SKU Inventory Tracker']] = 'T';
      r[SL['SKU Inventory Policy']] = 'deny';
      r[SL['SKU Inventory Quantity']] = '0';
      r[SL['Cost per item']] = sourceType === 'jisha' ? (prod.costPrice || '0') : '0';
      r[SL['SKU tax policy']] = 'T';
      r[SL['SKU shipping policy']] = 'T';
      r[SL['Path']] = `/products/${handle}`;
      r[SL['Included / Japan']] = 'TRUE';
      rows.push(r);
    });
    prod.images.slice(1).forEach(img => {
      const r = new Array(slH.length).fill('');
      r[SL['Handle']] = handle;
      r[SL['Master image']] = isRakuten ? buildRakutenImgUrl(img.path) : (img.url || '');
      r[SL['Image Alt Text']] = pName;
      rows.push(r);
    });
  });
  return { headers: slH, rows };
}

// ============================================================
// CONVERSION: Yahoo
// ============================================================
function convertToYahoo() {
  const yH = ['path','name','code','sub-code','original-price','price','sale-price','options','headline','caption','abstract','explanation','additional1','additional2','additional3','sp-additional','relevant-links','ship-weight','taxable','delivery','condition','product-category','spec1','spec2','spec3','spec4','spec5','display','in-stock','lead-time-instock','lead-time-outstock'];
  const rows = [];
  products.forEach(prod => {
    const name = (sourceType === 'rakuten') ? prod.cleanName : (prod.cleanName || prod.name);
    const code = (sourceType === 'rakuten') ? prod.id : (sourceType === 'jisha') ? prod.number : (prod.spu || prod.id);
    const desc = (sourceType === 'rakuten') ? prod.pcDesc : (sourceType === 'jisha') ? '' : prod.description;
    let optStr = '';
    if (sourceType === 'rakuten' && prod.varDef) {
      const names = prod.varDef.names.split('|');
      const optSets = prod.varDef.options;
      optStr = names.map((n, i) => optSets[i] ? `${n}:${optSets[i].replace(/\|/g, ',')}` : '').filter(x=>x).join(';');
    } else if (sourceType === 'jisha') {
      const colorSet = new Set();
      const sizeSet = new Set();
      prod.skus.forEach(sku => {
        if (sku.color) colorSet.add(sku.color);
        if (sku.size) sizeSet.add(sku.size);
      });
      const parts = [];
      if (colorSet.size > 0) parts.push(`カラー:${[...colorSet].join(',')}`);
      if (sizeSet.size > 0) parts.push(`サイズ:${[...sizeSet].join(',')}`);
      optStr = parts.join(';');
    } else {
      const m = {};
      prod.skus.forEach(sku => sku.options.forEach(o => {
        if (!m[o.name]) m[o.name] = new Set();
        m[o.name].add(o.value);
      }));
      optStr = Object.entries(m).map(([k,v]) => `${k}:${[...v].join(',')}`).join(';');
    }
    const basePrice = (sourceType === 'jisha') ? prod.sellPrice : (prod.skus.length > 0 ? prod.skus[0].price : '');
    const r = new Array(yH.length).fill('');
    r[1] = applyMallName(name, 'yahoo'); r[2] = code;
    r[4] = calcListPrice(basePrice, 'yahoo') || basePrice;
    r[5] = basePrice;
    r[7] = optStr;
    r[8] = (sourceType === 'rakuten') ? prod.catchCopy : '';
    r[9] = desc || '';
    r[27] = '1'; r[28] = '1';
    rows.push(r);
  });
  return { headers: yH, rows };
}

// ============================================================
// CONVERSION: Amazon
// ============================================================
function convertToAmazon() {
  const aH = ['item_sku','item_name','external_product_id','external_product_id_type','brand_name','manufacturer','item_type','main_image_url','other_image_url1','other_image_url2','other_image_url3','parent_child','parent_sku','relationship_type','variation_theme','color_name','size_name','standard_price','quantity','product_description','bullet_point1','bullet_point2','bullet_point3','generic_keywords','fulfillment_channel'];
  const rows = [];
  products.forEach(prod => {
    const name = (sourceType === 'rakuten') ? prod.cleanName : (prod.cleanName || prod.name);
    const parentSku = (sourceType === 'rakuten') ? prod.id : (sourceType === 'jisha') ? prod.number : (prod.spu || prod.id);
    const desc = (sourceType === 'rakuten') ? (prod.pcDesc || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 2000) : (sourceType === 'jisha') ? '' : (prod.description || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 2000);
    let mainImg = '';
    if (sourceType === 'rakuten' && prod.images.length > 0) mainImg = buildRakutenImgUrl(prod.images[0].path);
    else if (prod.images.length > 0) mainImg = prod.images[0].url || '';
    const pR = new Array(aH.length).fill('');
    const amazonName = applyMallName(name, 'amazon');
    const amazonBrand = MASTER.malls.amazon.brand || '';
    pR[0] = parentSku; pR[1] = amazonName; pR[4] = amazonBrand; pR[5] = amazonBrand;
    pR[7] = mainImg; pR[11] = 'parent'; pR[14] = 'ColorSize'; pR[19] = desc;
    rows.push(pR);
    prod.skus.forEach(sku => {
      const cR = new Array(aH.length).fill('');
      if (sourceType === 'jisha') {
        cR[0] = sku.jan || sku.skuMgmtNo;
      } else if (sourceType === 'rakuten') {
        cR[0] = sku.customFields.find(f=>f.label==='型番')?.value || sku.systemSku;
      } else {
        cR[0] = sku.skuId;
      }
      cR[1] = amazonName; cR[4] = amazonBrand; cR[5] = amazonBrand;
      cR[11] = 'child'; cR[12] = parentSku; cR[13] = 'Variation'; cR[14] = 'ColorSize';
      if (sourceType === 'jisha') {
        cR[15] = sku.color || ''; cR[16] = sku.size || '';
      } else if (sourceType === 'rakuten') {
        const hVar = sku.variants.find(v => v.key === 'カラー');
        const vVar = sku.variants.find(v => v.key === 'サイズ');
        cR[15] = hVar ? hVar.value : ''; cR[16] = vVar ? vVar.value : '';
      } else {
        cR[15] = sku.options[0]?.value || ''; cR[16] = sku.options[1]?.value || '';
      }
      cR[17] = sku.price || prod.sellPrice; cR[18] = '0';
      rows.push(cR);
    });
  });
  return { headers: aH, rows };
}

// ============================================================
// CONVERSION: Qoo10
// ============================================================
function convertToQoo10() {
  const qH = ['flag','seller_code','item_title','item_price','item_qty','industrial_code_type','industrial_code','brief_description','item_description','item_image','option_type','option_info','shipping_group','item_condition','return_policy','keyword','model_nm','brand_nm','manufacture_nm','material','adult_yn','contact_info'];
  const rows = [];
  products.forEach(prod => {
    const name = (sourceType === 'rakuten') ? prod.cleanName : (prod.cleanName || prod.name);
    const code = (sourceType === 'rakuten') ? prod.id : (sourceType === 'jisha') ? prod.number : (prod.spu || prod.id);
    const desc = (sourceType === 'rakuten') ? prod.pcDesc : (sourceType === 'jisha') ? '' : prod.description;
    const price = (sourceType === 'jisha') ? prod.sellPrice : (prod.skus.length > 0 ? prod.skus[0].price : '');
    let optInfo = '';
    if (prod.skus.length > 1) {
      optInfo = prod.skus.map(sku => {
        let label = '';
        if (sourceType === 'jisha') label = [sku.color, sku.size].filter(x=>x).join('/');
        else if (sourceType === 'rakuten') label = sku.variants.map(v => v.value).join('/');
        else label = sku.options.map(o => o.value).join('/');
        return `${label}:${sku.price || price}:0`;
      }).join('|');
    }
    let imgUrl = '';
    if (sourceType === 'rakuten' && prod.images.length > 0) imgUrl = buildRakutenImgUrl(prod.images[0].path);
    else if (prod.images.length > 0) imgUrl = prod.images[0].url || '';
    const r = new Array(qH.length).fill('');
    r[0] = 'I'; r[1] = code; r[2] = applyMallName(name, 'qoo10'); r[3] = price; r[4] = '0';
    r[7] = (sourceType === 'rakuten') ? prod.catchCopy : '';
    r[8] = desc || ''; r[9] = imgUrl;
    r[10] = prod.skus.length > 1 ? 'Y' : 'N';
    r[11] = optInfo; r[13] = 'NEW'; r[17] = ''; r[18] = '';
    r[19] = (sourceType === 'jisha') ? (prod.material || '') : '';
    r[20] = 'N';
    rows.push(r);
  });
  return { headers: qH, rows };
}

// ============================================================
// CONVERSION: item-cat.csv（楽天カテゴリ紐づけCSV）
// ============================================================
function convertToItemCat() {
  const rm = MASTER.malls.rakuten;
  const catHeaders = [
    'コントロールカラム',
    '商品管理番号（商品URL）',
    '表示先カテゴリ',
    '優先度',
    '1ページ複数形式'
  ];
  const rows = [];
  // shopCategoryMap: { "Tシャツ・カットソー": { "cat": "トップス\\Tシャツ・カットソー", "priority": "100" }, ... }
  // or simple format: { "Tシャツ・カットソー": "トップス\\Tシャツ・カットソー", ... }
  const catMap = rm.shopCategoryMap || {};
  const defaultPriority = rm.itemCatPriority || '';
  const defaultCat = rm.itemCatDefaultCat || '';

  products.forEach(prod => {
    const itemId = prod.number || '';
    if (!itemId) return;
    // カテゴリパスを決定: shopCategoryMap > デフォルト
    const rawCat = prod.category || '';
    let shopCat = '';
    let priority = defaultPriority;
    const mapEntry = catMap[rawCat];
    if (mapEntry) {
      if (typeof mapEntry === 'object') {
        shopCat = mapEntry.cat || '';
        if (mapEntry.priority) priority = mapEntry.priority;
      } else {
        shopCat = mapEntry;
      }
    }
    if (!shopCat) shopCat = defaultCat;
    if (!shopCat) return;

    const r = new Array(catHeaders.length).fill('');
    r[0] = rm.controlCol || 'n';  // コントロールカラム
    r[1] = itemId;                 // 商品管理番号
    r[2] = shopCat;                // 表示先カテゴリ
    r[3] = priority;               // 優先度
    r[4] = '';                     // 1ページ複数形式
    rows.push(r);
  });
  return { headers: catHeaders, rows };
}

function downloadItemCat() {
  const result = convertToItemCat();
  if (result.rows.length === 0) {
    notify('カテゴリ情報のある商品がありません', 'warning');
    return;
  }
  const csvStr = buildCSV(result.headers, result.rows);
  const bom = '\uFEFF';
  const blob = new Blob([bom + csvStr], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `item-cat_${dateTimeStr()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  notify('item-cat.csv（カテゴリ紐づけ）をダウンロードしました', 'success');
}

// ============================================================
// CORS PROXY CODE DISPLAY
// ============================================================
const CORS_PROXY_CODE = `// Cloudflare Workers - APIプロキシ（楽天RMS / ネクストエンジン対応）
// ※ ALLOWED_ORIGINS のURLを自分のGitHub PagesのURLに変更してください

const ALLOWED_ORIGINS = [
  'https://tiast2026.github.io',
  'http://localhost:3000'
];

const ALLOWED_HOSTS = {
  'api.rms.rakuten.co.jp': 'https://api.rms.rakuten.co.jp',
  'api.next-engine.org': 'https://api.next-engine.org'
};

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return corsResponse(request, new Response(null, { status: 204 }));
    }
    const origin = request.headers.get('Origin') || '';
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return new Response('Forbidden', { status: 403 });
    }
    const url = new URL(request.url);
    const targetHost = request.headers.get('X-Target-Host') || 'api.rms.rakuten.co.jp';
    const targetBase = ALLOWED_HOSTS[targetHost];
    if (!targetBase) {
      return corsResponse(request, new Response(JSON.stringify({error:'Host not allowed'}), {
        status: 403, headers: {'Content-Type':'application/json'}
      }));
    }
    const target = targetBase + url.pathname + url.search;
    const headers = new Headers();
    for (const [k, v] of request.headers.entries()) {
      if (!['host','origin','referer','x-target-host'].includes(k.toLowerCase())) headers.set(k, v);
    }
    try {
      const res = await fetch(target, {
        method: request.method, headers,
        body: ['GET','HEAD'].includes(request.method) ? null : request.body
      });
      return corsResponse(request, new Response(res.body, {
        status: res.status, statusText: res.statusText, headers: res.headers
      }));
    } catch (e) {
      return corsResponse(request, new Response(JSON.stringify({error:e.message}), {
        status: 502, headers: {'Content-Type':'application/json'}
      }));
    }
  }
};

function corsResponse(req, res) {
  const origin = req.headers.get('Origin') || '';
  const r = new Response(res.body, res);
  r.headers.set('Access-Control-Allow-Origin', ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]);
  r.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  r.headers.set('Access-Control-Allow-Headers', 'Authorization,Content-Type,X-Target-Host');
  r.headers.set('Access-Control-Max-Age', '86400');
  return r;
}`;

function initCorsProxyCodeDisplay() {
  const el = document.getElementById('cors-proxy-code');
  if (el) el.textContent = CORS_PROXY_CODE;
}

function copyCorsProxyCode() {
  navigator.clipboard.writeText(CORS_PROXY_CODE).then(() => {
    notify('コードをコピーしました！Cloudflareのエディタに貼り付けてください。', 'success');
  }).catch(() => {
    // フォールバック
    const ta = document.createElement('textarea');
    ta.value = CORS_PROXY_CODE;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    notify('コードをコピーしました！', 'success');
  });
}

// ============================================================
// ネクストエンジンAPI連携
// ============================================================
async function testNextEngineApi() {
  const resultEl = document.getElementById('ne-test-result');
  if (resultEl) resultEl.textContent = '接続テスト中...';

  // フォームから最新値を読み取り
  readMallFormToMaster('rakuten');
  const m = MASTER.malls.rakuten;
  const proxy = m.corsProxy;
  const accessToken = m.neAccessToken;
  const refreshToken = m.neRefreshToken;

  if (!proxy) {
    if (resultEl) resultEl.innerHTML = '<span style="color:red;">CORSプロキシURLが未設定です。楽天タブのRMS API設定で設定してください。</span>';
    return;
  }
  if (!accessToken || !refreshToken) {
    if (resultEl) resultEl.innerHTML = '<span style="color:red;">アクセストークンとリフレッシュトークンを入力してください。</span>';
    return;
  }

  try {
    // ネクストエンジンの /api_v1_login_company/info でログイン企業情報を取得（テスト用）
    const proxyBase = proxy.replace(/\/$/, '');
    const params = new URLSearchParams();
    params.append('access_token', accessToken);
    params.append('refresh_token', refreshToken);

    const res = await fetch(proxyBase + '/api_v1_login_company/info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Target-Host': 'api.next-engine.org'
      },
      body: params.toString()
    });

    const data = await res.json();

    if (data.result === 'success') {
      // トークンが更新された場合は保存
      if (data.access_token && data.access_token !== accessToken) {
        m.neAccessToken = data.access_token;
        document.getElementById('mall-rakuten-ne-access-token').value = data.access_token;
      }
      if (data.refresh_token && data.refresh_token !== refreshToken) {
        m.neRefreshToken = data.refresh_token;
        document.getElementById('mall-rakuten-ne-refresh-token').value = data.refresh_token;
      }
      const companyName = data.company_name || '(取得成功)';
      if (resultEl) resultEl.innerHTML = `<span style="color:green;">接続成功！ 企業名: ${companyName}</span>`;
      markMasterDirty();
      notify('ネクストエンジンAPI接続テスト成功', 'success');
    } else if (data.result === 'error') {
      if (resultEl) resultEl.innerHTML = `<span style="color:red;">エラー: ${data.message || data.code || 'unknown'}</span>`;
    } else {
      if (resultEl) resultEl.innerHTML = `<span style="color:orange;">応答: ${JSON.stringify(data).substring(0, 200)}</span>`;
    }
  } catch(e) {
    if (resultEl) resultEl.innerHTML = `<span style="color:red;">通信エラー: ${e.message}</span>`;
  }
}

// ============================================================
// RAKUTEN RMS API 2.0 DIRECT REGISTRATION
// ============================================================
function getRakutenApiAuth() {
  const ss = MASTER.malls.rakuten.serviceSecret;
  const lk = MASTER.malls.rakuten.licenseKey;
  if (!ss || !lk) return null;
  return 'ESA ' + btoa(ss + ':' + lk);
}

function getRakutenApiUrl(path) {
  const proxy = MASTER.malls.rakuten.corsProxy;
  const base = 'https://api.rms.rakuten.co.jp';
  if (proxy) {
    // プロキシURL末尾のスラッシュを正規化
    const p = proxy.endsWith('/') ? proxy.slice(0, -1) : proxy;
    return p + '/es/2.0' + path;
  }
  return base + '/es/2.0' + path;
}

async function testRakutenApi() {
  const resultEl = document.getElementById('rakuten-api-test-result');
  // 入力欄から直接読み取る（MASTER保存前でもテスト可能にする）
  const ss = document.getElementById('mall-rakuten-service-secret')?.value?.trim();
  const lk = document.getElementById('mall-rakuten-license-key')?.value?.trim();
  const proxy = document.getElementById('mall-rakuten-cors-proxy')?.value?.trim();
  if (!ss || !lk) {
    resultEl.textContent = 'serviceSecretとlicenseKeyを入力してください';
    resultEl.style.color = '#c33';
    return;
  }
  const auth = 'ESA ' + btoa(ss + ':' + lk);
  resultEl.textContent = '接続テスト中...';
  resultEl.style.color = '#999';
  try {
    const baseUrl = proxy || 'https://api.rms.rakuten.co.jp';
    const url = baseUrl.replace(/\/+$/, '') + '/items/manage-numbers/___test___';
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Authorization': auth }
    });
    if (res.status === 404) {
      resultEl.textContent = '接続成功（認証OK）';
      resultEl.style.color = '#5a9e6f';
    } else if (res.status === 401) {
      resultEl.textContent = '認証失敗（serviceSecret/licenseKeyを確認してください）';
      resultEl.style.color = '#c33';
    } else {
      resultEl.textContent = `レスポンス: ${res.status} ${res.statusText}`;
      resultEl.style.color = res.ok ? '#5a9e6f' : '#c33';
    }
  } catch(e) {
    resultEl.textContent = 'CORS エラー: CORSプロキシを設定してください → ' + e.message;
    resultEl.style.color = '#c33';
  }
}

function buildRakutenApiItem(prod) {
  const rm = MASTER.malls.rakuten;
  const genreId = prod._autoGenreId || rm.genreId || guessGenreId(prod.category, prod.cleanName || prod.name);
  const itemName = applyMallName(prod.cleanName || prod.name, 'rakuten');
  const catchCopy = prod._catchCopy || prod.productPoint || '';

  // バリエーション情報の収集
  const colorSet = new Set();
  const sizeSet = new Set();
  prod.skus.forEach(sku => {
    if (sku.color) colorSet.add(sku.color);
    if (sku.size) sizeSet.add(sku.size);
  });
  const hasColor = colorSet.size > 0;
  const hasSize = sizeSet.size > 0;

  // バリエーション定義
  const variants = [];
  if (hasColor) {
    const sortedColors = [...colorSet].sort((a, b) =>
      (MASTER.colorOrder[a] || 9999) - (MASTER.colorOrder[b] || 9999)
    );
    variants.push({
      key: 'カラー',
      name: 'カラー',
      values: sortedColors
    });
  }
  if (hasSize) {
    const sizeOrder = {'S':1, 'M':2, 'L':3, 'XL':4, 'XXL':5, 'F':0, 'F(M)':0, 'フリー':0, 'FREE':0, 'F(M)フリー':0};
    const sortedSizes = [...sizeSet].sort((a, b) => (sizeOrder[a] || 99) - (sizeOrder[b] || 99));
    variants.push({
      key: 'サイズ',
      name: 'サイズ',
      values: sortedSizes
    });
  }

  // API用JSONボディ
  const item = {
    title: itemName,
    tagline: catchCopy,
    productDescription: {
      pc: applyDescTemplate(rm.pcDescTpl, prod) || undefined,
      sp: applyDescTemplate(rm.spDescTpl, prod) || undefined
    },
    salesDescription: applyDescTemplate(rm.saleDescTpl, prod) || undefined,
    taxType: parseInt(rm.taxType) || 0,
    postageSegment1: rm.shippingCat1 ? parseInt(rm.shippingCat1) : undefined,
    postageSegment2: rm.shippingCat2 ? parseInt(rm.shippingCat2) : undefined,
    shippingMethodSetId: rm.shippingSet ? parseInt(rm.shippingSet) : undefined,
    genreId: genreId ? parseInt(genreId) : undefined,
    noshiFlag: parseInt(rm.noshi) || 0
  };

  // undefinedフィールド除去
  Object.keys(item).forEach(k => { if (item[k] === undefined) delete item[k]; });
  if (item.productDescription) {
    Object.keys(item.productDescription).forEach(k => { if (!item.productDescription[k]) delete item.productDescription[k]; });
    if (Object.keys(item.productDescription).length === 0) delete item.productDescription;
  }

  // SKU情報
  const skus = prod.skus.map(sku => {
    let skuSuffix = '';
    const skuFull = (sku.skuMgmtNo || '').trim();
    const parentNo = (prod.number || '').trim();
    if (skuFull && parentNo && skuFull.startsWith(parentNo)) {
      skuSuffix = skuFull.substring(parentNo.length);
    } else if (skuFull && parentNo) {
      const parts = skuFull.split('-');
      if (parts.length > 2) skuSuffix = '-' + parts.slice(2).join('-');
      else skuSuffix = skuFull;
    } else {
      skuSuffix = skuFull || sku.jan;
    }

    const skuObj = {
      manageNumber: skuSuffix,
      merchantDefinedSkuId: sku.skuMgmtNo || (prod.number + skuSuffix),
      standardPrice: parseInt(sku.price || prod.sellPrice) || 0,
      stockQuantity: parseInt(sku._stock) || 0,
      catalogIdNotRequiredReason: parseInt(rm.catalogReason) || 3
    };

    // バリエーション値
    const variantSelections = [];
    if (hasColor) variantSelections.push({ key: 'カラー', value: sku.color || '' });
    if (hasSize) variantSelections.push({ key: 'サイズ', value: sku.size || '' });
    if (variantSelections.length > 0) skuObj.variantSelections = variantSelections;

    return skuObj;
  });

  return { item, skus, variants, manageNumber: prod.number };
}

async function registerToRakutenApi() {
  const auth = getRakutenApiAuth();
  if (!auth) {
    notify('RMS API認証情報が未設定です。マスタ設定から設定してください。', 'warning');
    return;
  }
  if (!products || products.length === 0) {
    notify('登録する商品がありません', 'warning');
    return;
  }

  // 確認ダイアログ
  const cnt = products.length;
  const skuCnt = products.reduce((s, p) => s + p.skus.length, 0);
  if (!confirm(`楽天RMS APIで ${cnt}商品（${skuCnt} SKU）を登録します。\n\n続行しますか？`)) return;

  // 進捗表示
  const statusEl = document.getElementById('api-register-status');
  if (statusEl) statusEl.style.display = 'block';
  const progressEl = document.getElementById('api-register-progress');
  const logEl = document.getElementById('api-register-log');
  if (logEl) logEl.innerHTML = '';

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < products.length; i++) {
    const prod = products[i];
    const apiData = buildRakutenApiItem(prod);
    if (progressEl) progressEl.textContent = `${i + 1} / ${cnt} 処理中: ${prod.cleanName || prod.name}`;

    try {
      // 1. 商品登録（UPSERT）
      const itemUrl = getRakutenApiUrl('/items/manage-numbers/' + encodeURIComponent(apiData.manageNumber));
      const itemRes = await fetch(itemUrl, {
        method: 'PUT',
        headers: {
          'Authorization': auth,
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(apiData.item)
      });

      if (!itemRes.ok) {
        const errBody = await itemRes.text();
        throw new Error(`商品登録失敗 (${itemRes.status}): ${errBody}`);
      }

      // 2. SKU登録（在庫一括更新）
      if (apiData.skus.length > 0) {
        // SKU個別登録
        for (const sku of apiData.skus) {
          const skuUrl = getRakutenApiUrl('/items/manage-numbers/' + encodeURIComponent(apiData.manageNumber) + '/skus/' + encodeURIComponent(sku.manageNumber));
          const skuBody = {
            merchantDefinedSkuId: sku.merchantDefinedSkuId,
            standardPrice: sku.standardPrice,
            catalogIdNotRequiredReason: sku.catalogIdNotRequiredReason
          };
          if (sku.variantSelections) skuBody.variantSelections = sku.variantSelections;

          const skuRes = await fetch(skuUrl, {
            method: 'PUT',
            headers: {
              'Authorization': auth,
              'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(skuBody)
          });

          if (!skuRes.ok) {
            const skuErr = await skuRes.text();
            appendApiLog(logEl, 'warning', `SKU ${sku.manageNumber}: ${skuRes.status} ${skuErr}`);
          }
        }

        // 3. 在庫一括更新
        const inventoryItems = apiData.skus.map(sku => ({
          manageNumber: apiData.manageNumber,
          skuManageNumber: sku.manageNumber,
          quantity: sku.stockQuantity
        }));
        const invUrl = getRakutenApiUrl('/inventories/bulk-upsert');
        const invRes = await fetch(invUrl, {
          method: 'POST',
          headers: {
            'Authorization': auth,
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: JSON.stringify({ inventories: inventoryItems })
        });

        if (!invRes.ok) {
          const invErr = await invRes.text();
          appendApiLog(logEl, 'warning', `在庫更新: ${invRes.status} ${invErr}`);
        }
      }

      successCount++;
      appendApiLog(logEl, 'success', `${prod.number}: ${prod.cleanName || prod.name} - 登録完了`);
    } catch(e) {
      errorCount++;
      appendApiLog(logEl, 'error', `${prod.number}: ${e.message}`);
    }
  }

  if (progressEl) progressEl.textContent = `完了: 成功 ${successCount}件 / エラー ${errorCount}件`;
  notify(`楽天API登録完了: 成功 ${successCount}件、エラー ${errorCount}件`, errorCount > 0 ? 'warning' : 'success');
}

function appendApiLog(logEl, type, msg) {
  if (!logEl) return;
  const colors = { success: '#5a9e6f', warning: '#d4a843', error: '#c45c5c' };
  const icons = { success: '✓', warning: '⚠', error: '✕' };
  logEl.innerHTML += `<div style="padding:3px 0; font-size:12px; color:${colors[type] || '#333'};">${icons[type] || ''} ${esc(msg)}</div>`;
  logEl.scrollTop = logEl.scrollHeight;
}

// ============================================================
// ネクストエンジンAPI 商品登録
// ============================================================
async function neApiFetch(endpoint, extraParams = {}) {
  const m = MASTER.malls.rakuten;
  const proxy = m.corsProxy;
  if (!proxy) throw new Error('CORSプロキシURLが未設定です');
  if (!m.neAccessToken || !m.neRefreshToken) throw new Error('NE APIトークンが未設定です');

  const proxyBase = proxy.replace(/\/$/, '');
  const params = new URLSearchParams();
  params.append('access_token', m.neAccessToken);
  params.append('refresh_token', m.neRefreshToken);
  for (const [k, v] of Object.entries(extraParams)) {
    params.append(k, v);
  }

  const res = await fetch(proxyBase + endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Target-Host': 'api.next-engine.org'
    },
    body: params.toString()
  });

  const data = await res.json();

  // トークンが更新された場合は保存
  if (data.access_token && data.access_token !== m.neAccessToken) {
    m.neAccessToken = data.access_token;
    const el = document.getElementById('mall-rakuten-ne-access-token');
    if (el) el.value = data.access_token;
  }
  if (data.refresh_token && data.refresh_token !== m.neRefreshToken) {
    m.neRefreshToken = data.refresh_token;
    const el = document.getElementById('mall-rakuten-ne-refresh-token');
    if (el) el.value = data.refresh_token;
  }

  return data;
}

function buildNeGoodsCsv(products) {
  // NE商品マスタCSVヘッダー
  const headers = [
    'syohin_code',          // 商品コード（SKU単位）
    'daihyo_syohin_code',   // 代表商品コード（親）
    'syohin_name',          // 商品名
    'syohin_kbn',           // 商品区分（0:通常）
    'toriatukai_kbn',       // 取扱区分（0:通常）
    'jan_code',             // JANコード
    'baika_tnk',            // 販売価格
    'genka_tnk',            // 原価
    'iro',                  // 色
    'size'                  // サイズ
  ];

  const rows = [];
  for (const prod of products) {
    const parentCode = prod.number || '';
    const name = prod.cleanName || prod.name || '';
    const costPrice = prod.costPrice || '';

    for (const sku of prod.skus) {
      const skuCode = sku.skuMgmtNo || parentCode;
      const row = [
        skuCode,                                          // syohin_code
        parentCode,                                       // daihyo_syohin_code
        name,                                             // syohin_name
        '0',                                              // syohin_kbn（通常）
        '0',                                              // toriatukai_kbn（通常）
        sku.jan || '',                                    // jan_code
        sku.price || prod.sellPrice || '',                // baika_tnk
        costPrice,                                        // genka_tnk
        sku.color || '',                                  // iro
        sku.size || ''                                    // size
      ];
      rows.push(row);
    }
  }

  // CSV文字列を構築
  const escCSV = (v) => {
    if (v == null) return '';
    const s = String(v);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };
  let csv = headers.join(',') + '\n';
  for (const row of rows) {
    csv += row.map(escCSV).join(',') + '\n';
  }
  return csv;
}

async function registerToNextEngineApi() {
  const m = MASTER.malls.rakuten;
  if (!m.corsProxy || !m.neAccessToken || !m.neRefreshToken) {
    notify('NE API認証情報が未設定です。マスタ設定から設定してください。', 'warning');
    return;
  }
  if (!products || products.length === 0) {
    notify('登録する商品がありません', 'warning');
    return;
  }

  const cnt = products.length;
  const skuCnt = products.reduce((s, p) => s + p.skus.length, 0);
  if (!confirm(`ネクストエンジンAPIで ${cnt}商品（${skuCnt} SKU）を新規登録します。\n\n※ 処理は非同期で行われます。結果はNE管理画面のアップロードキューで確認してください。\n\n続行しますか？`)) return;

  // 進捗表示
  const statusEl = document.getElementById('ne-api-register-status');
  if (statusEl) statusEl.style.display = 'block';
  const progressEl = document.getElementById('ne-api-register-progress');
  const logEl = document.getElementById('ne-api-register-log');
  if (logEl) logEl.innerHTML = '';

  if (progressEl) progressEl.textContent = 'CSV データを構築中...';

  try {
    const csvData = buildNeGoodsCsv(products);
    appendApiLog(logEl, 'success', `CSV生成完了: ${cnt}商品, ${skuCnt} SKU行`);

    if (progressEl) progressEl.textContent = 'ネクストエンジンAPIにアップロード中...';

    const result = await neApiFetch('/api_v1_master_goods/upload', {
      data_type: 'csv',
      data: csvData,
      wait_flag: '1'
    });

    if (result.result === 'success') {
      const queId = result.que_id || '';
      appendApiLog(logEl, 'success', `アップロード成功！ キューID: ${queId}`);
      appendApiLog(logEl, 'success', 'NE管理画面 → 設定 → アップロードキュー で処理状況を確認してください');
      if (progressEl) progressEl.textContent = `完了: アップロード成功（キューID: ${queId}）`;
      notify('ネクストエンジンへのアップロードが完了しました', 'success');
      markMasterDirty();
    } else {
      const errMsg = result.message || result.code || JSON.stringify(result);
      appendApiLog(logEl, 'error', `APIエラー: ${errMsg}`);
      if (progressEl) progressEl.textContent = 'エラーが発生しました';
      notify('NE APIエラー: ' + errMsg, 'warning');
    }
  } catch(e) {
    appendApiLog(logEl, 'error', `通信エラー: ${e.message}`);
    if (progressEl) progressEl.textContent = 'エラーが発生しました';
    notify('NE API通信エラー: ' + e.message, 'warning');
  }
}

// ============================================================
// CSV BUILDER
// ============================================================
function buildCSV(hdrs, rows) {
  const escCSV = (v) => {
    if (v == null) return '';
    const s = String(v);
    if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };
  let csv = hdrs.map(escCSV).join(',') + '\n';
  rows.forEach(row => {
    const padded = [...row];
    while (padded.length < hdrs.length) padded.push('');
    csv += padded.map(escCSV).join(',') + '\n';
  });
  return csv;
}

// ============================================================
// UTILITIES
// ============================================================
function esc(str) {
  if (str == null) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function trunc(str, len) {
  if (!str) return '';
  const s = String(str);
  return s.length > len ? s.substring(0, len) + '…' : s;
}

function dateStr() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
}
function dateTimeStr() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}_${String(d.getHours()).padStart(2,'0')}${String(d.getMinutes()).padStart(2,'0')}${String(d.getSeconds()).padStart(2,'0')}`;
}

function notify(msg, type='info') {
  const el = document.createElement('div');
  el.className = `notification ${type}`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}
