// microCMS の Origin 設定
// 開発環境と本番環境で異なる値を使用します

// Bun の環境変数から取得（ビルド時に埋め込まれます）
const getOrigin = (): string => {
  // ビルド時に process.env.MICROCMS_ORIGIN が埋め込まれる
  if (typeof process !== 'undefined' && process.env?.MICROCMS_ORIGIN) {
    return process.env.MICROCMS_ORIGIN;
  }

  // フォールバック: 開発環境ではワイルドカードを使用（セキュリティリスクあり、開発のみ）
  // 本番環境では必ず環境変数を設定してください
  return '*';
};

export const config = {
  microcmsOrigin: getOrigin(),
};
