import "./index.css";
import React, { useState, useEffect } from 'react';
import { useFieldExtension } from 'microcms-field-extension-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { config } from './config';

interface EmojiData {
  id: string;
  native: string;
  unified: string;
  name?: string;
}

function App() {
  const { data: fieldData, sendMessage } = useFieldExtension<EmojiData | null>(null, {
    origin: config.microcmsOrigin,
  });
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiData | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [extensionId, setExtensionId] = useState<string | null>(null);

  // microCMSからのメッセージを受信してIDを取得
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (config.microcmsOrigin !== '*' && event.origin !== config.microcmsOrigin) {
        return;
      }
      if (event.data?.id && !extensionId) {
        setExtensionId(event.data.id);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [extensionId]);

  // iframeの高さを設定
  const setIframeHeight = (height: number) => {
    if (extensionId) {
      window.parent.postMessage(
        {
          id: extensionId,
          action: 'MICROCMS_UPDATE_STYLE',
          message: {
            height,
            width: '100%'
          }
        },
        config.microcmsOrigin === '*' ? '*' : config.microcmsOrigin
      );
    }
  };

  // 初期化時にiframeの高さを設定
  useEffect(() => {
    if (extensionId) {
      setIframeHeight(460);
    }
  }, [extensionId]);

  // microCMSからの初期データを読み込み
  useEffect(() => {
    if (fieldData && !isInitialized) {
      setSelectedEmoji(fieldData);
      setIsInitialized(true);
    }
  }, [fieldData, isInitialized]);

  const onEmojiSelect = (emoji: any) => {
    console.log('Selected emoji:', emoji);

    const emojiData: EmojiData = {
      id: emoji.id,
      native: emoji.native,
      unified: emoji.unified,
      name: emoji.name,
    };

    setSelectedEmoji(emojiData);

    // microCMSにデータを送信
    sendMessage({
      title: emojiData.native,
      description: `${emojiData.name || emojiData.id} (${emojiData.unified})`,
      imageUrl: `https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${emojiData.unified.toLowerCase()}.png`,
      data: emojiData,
    });
  };

  const clearSelection = () => {
    setSelectedEmoji(null);
    sendMessage({
      title: '',
      description: '',
      imageUrl: '',
      data: null,
    });
  };

  return (
    <div className="bg-white p-6 w-full h-full overflow-hidden">
      <div className="flex gap-6 h-full">
        {/* 左側：選択された絵文字の表示 */}
        <div className="w-80 flex-shrink-0 flex flex-col">
          {selectedEmoji ? (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200 h-full flex flex-col justify-center">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="text-8xl">{selectedEmoji.native}</div>
                <div className="w-full">
                  <p className="text-xl font-semibold text-gray-800 mb-2">
                    {selectedEmoji.name || selectedEmoji.id}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Unicode: {selectedEmoji.unified}
                  </p>
                  <button
                    onClick={clearSelection}
                    className="w-full px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    クリア
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200 h-full flex flex-col justify-center">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="text-6xl text-gray-300">?</div>
                <p className="text-gray-500">
                  右側から絵文字を選択してください
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 右側：絵文字ピッカー */}
        <div className="flex-1 flex justify-center">
          <Picker
            data={data}
            onEmojiSelect={onEmojiSelect}
            locale="ja"
            theme="auto"
            previewPosition="none"
            perLine={20}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
