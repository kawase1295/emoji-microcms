# 使い方ガイド

## microCMS での設定方法

### 1. 拡張フィールドを追加

1. microCMS の管理画面にログイン
2. 対象のサービスを選択
3. API 設定を開く
4. 「API スキーマ」から新しいフィールドを追加
5. フィールドの種類として「拡張フィールド」を選択

### 2. URL の設定

拡張フィールドの設定画面で、以下のいずれかの URL を入力します：

#### 開発環境の場合
```
http://localhost:3000
```

#### 本番環境の場合
デプロイ先の URL（例：Vercel、Netlify など）

### 3. フィールドの保存

フィールドに名前をつけて保存します。
例：`emoji` というフィールド ID を設定

## 使い方

### コンテンツの作成・編集時

1. コンテンツの作成または編集画面を開く
2. 拡張フィールドに絵文字ピッカーが表示される
3. 好きな絵文字を選択
4. 選択した絵文字が表示される
5. 「クリア」ボタンで選択を解除可能

### API からのデータ取得

コンテンツ API のレスポンスには、以下の形式でデータが返されます：

```json
{
  "id": "content-id",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z",
  "publishedAt": "2025-01-01T00:00:00.000Z",
  "emoji": {
    "id": "grinning",
    "native": "😀",
    "unified": "1F600",
    "name": "grinning face"
  }
}
```

### 保存されるデータの構造

拡張フィールドには以下のデータが保存されます：

- `id`: 絵文字の ID (例: "grinning")
- `native`: 実際の絵文字文字 (例: "😀")
- `unified`: Unicode コードポイント (例: "1F600")
- `name`: 絵文字の名前 (例: "grinning face")

### メタデータ

microCMS の管理画面には以下のメタデータも表示されます：

- **title**: 絵文字そのもの (例: 😀)
- **description**: 絵文字名と Unicode (例: "grinning face (1F600)")
- **imageUrl**: Apple スタイルの絵文字画像

## フロントエンドでの利用例

### React での例

```tsx
import { createClient } from 'microcms-js-sdk';

const client = createClient({
  serviceDomain: 'your-service-id',
  apiKey: 'your-api-key',
});

function MyComponent() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    client.get({
      endpoint: 'your-endpoint',
      contentId: 'content-id',
    }).then((data) => {
      setContent(data);
    });
  }, []);

  if (!content) return <div>Loading...</div>;

  return (
    <div>
      <h1>選択された絵文字</h1>
      <p style={{ fontSize: '4rem' }}>{content.emoji.native}</p>
      <p>名前: {content.emoji.name}</p>
      <p>Unicode: {content.emoji.unified}</p>
    </div>
  );
}
```

### Next.js での例

```tsx
import { createClient } from 'microcms-js-sdk';

const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});

export async function getStaticProps() {
  const data = await client.get({
    endpoint: 'your-endpoint',
    contentId: 'content-id',
  });

  return {
    props: {
      content: data,
    },
  };
}

export default function Page({ content }) {
  return (
    <div>
      <h1>選択された絵文字</h1>
      <div className="text-6xl">{content.emoji.native}</div>
      <p>名前: {content.emoji.name}</p>
      <p>Unicode: U+{content.emoji.unified}</p>
    </div>
  );
}
```

## トラブルシューティング

### 絵文字ピッカーが表示されない

1. URL が正しく設定されているか確認
2. 開発サーバーが起動しているか確認（`bun dev`）
3. ブラウザのコンソールでエラーがないか確認

### データが保存されない（本番環境）

1. デプロイサービスで `MICROCMS_ORIGIN` 環境変数が正しく設定されているか確認
2. origin の URL が microCMS のサービス ID と一致しているか確認
   - 正しい例: `https://your-service-id.microcms.io`
   - 間違い例: `https://your-service-id.microcms.io/`（末尾のスラッシュは不要）
3. ビルド時に環境変数が埋め込まれているか確認

### 開発環境でのデータ保存

開発環境（`bun dev`）では、環境変数を設定しなくても動作します。
ただし、セキュリティのため、本番環境では必ず `MICROCMS_ORIGIN` を設定してください。

### 絵文字が文字化けする

- フロントエンドで UTF-8 エンコーディングが設定されているか確認
- HTML の `<meta charset="UTF-8">` タグが含まれているか確認

## 参考リンク

- [microCMS 拡張フィールドドキュメント](https://document.microcms.io/manual/field-extension)
- [microcms-field-extension GitHub](https://github.com/microcmsio/microcms-field-extension)
- [emoji-mart ドキュメント](https://github.com/missive/emoji-mart)
