import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { MnemonicGenerator } from './components';

function App() {
  const handleMnemonicGenerated = (mnemonic: string) => {
    console.log('Generated mnemonic:', mnemonic);
  };

  return (
    <ConfigProvider locale={zhCN}>
      <div className="App">
        <MnemonicGenerator
          defaultLanguage="english"
          onMnemonicGenerated={handleMnemonicGenerated}
        />
      </div>
    </ConfigProvider>
  );
}

export default App;