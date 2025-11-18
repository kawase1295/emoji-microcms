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
    <div className="bg-white p-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          絵文字を選択
        </h2>

        {/* 選択された絵文字の表示 */}
        {selectedEmoji && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6 border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-6xl">{selectedEmoji.native}</div>
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    {selectedEmoji.name || selectedEmoji.id}
                  </p>
                  <p className="text-sm text-gray-600">
                    Unicode: {selectedEmoji.unified}
                  </p>
                </div>
              </div>
              <button
                onClick={clearSelection}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                クリア
              </button>
            </div>
          </div>
        )}

        {/* 絵文字ピッカー */}
        <div className="flex justify-center">
          <Picker
            data={data}
            onEmojiSelect={onEmojiSelect}
            locale="ja"
            theme="light"
            previewPosition="none"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
