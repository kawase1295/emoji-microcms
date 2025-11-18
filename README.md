# microCMS 絵文字ピッカー 拡張フィールド

microCMS の拡張フィールドで使用できる絵文字ピッカーです。
`microcms-field-extension-react` を使用して構築されています。

## 機能

- 絵文字の検索と選択
- 選択した絵文字の表示
- microCMS 管理画面への絵文字データの送信
- Unicode 情報の表示

## セットアップ

### 1. 依存関係のインストール

```bash
bun install
```

### 2. 環境変数の設定（オプション）

開発環境では環境変数なしでも動作します（ワイルドカード `*` を使用）。

**本番環境では必須：** `.env.example` をコピーして `.env` ファイルを作成します：

```bash
cp .env.example .env
```

`.env` ファイルを編集して、microCMS のサービス ID を設定します：

```
MICROCMS_ORIGIN=https://your-service-id.microcms.io
```

> **注意:** 本番環境では必ず `MICROCMS_ORIGIN` を設定してください。設定しない場合、セキュリティリスクがあります。

### 3. 開発サーバーの起動

```bash
bun dev
```

開発サーバーは `http://localhost:3000` で起動します。

## microCMS での設定

1. microCMS の管理画面で API を開く
2. API スキーマから「拡張フィールド」を追加
3. 拡張フィールドの URL に、デプロイした URL または `http://localhost:3000` を設定
4. フィールドを保存

## デプロイ

本番環境で使用する場合は、以下の手順を実行します：

### 1. 環境変数の設定

デプロイサービス（Vercel、Netlify など）で以下の環境変数を設定してください：

```
MICROCMS_ORIGIN=https://your-service-id.microcms.io
```

> **重要:** `your-service-id` を実際の microCMS サービス ID に置き換えてください。

### 2. ビルドとデプロイ

```bash
bun run build
```

ビルドされたファイル（`dist` フォルダ）を任意の静的ホスティングサービスにデプロイしてください。

## 使用技術

- [Bun](https://bun.com) - JavaScript ランタイム
- [React](https://react.dev) - UI ライブラリ
- [Tailwind CSS](https://tailwindcss.com) - CSS フレームワーク
- [emoji-mart](https://github.com/missive/emoji-mart) - 絵文字ピッカー
- [microcms-field-extension-react](https://github.com/microcmsio/microcms-field-extension) - microCMS 拡張フィールド SDK

## ライセンス

MIT
