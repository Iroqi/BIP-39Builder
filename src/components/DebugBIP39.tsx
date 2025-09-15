import React, { useState } from 'react';
import { Button, Card, Typography, Space } from 'antd';
import * as bip39 from 'bip39';
import { useMnemonicStore } from '../store';

const { Text, Paragraph } = Typography;

const DebugBIP39: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addLog = (message: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearLogs = () => {
    setDebugInfo([]);
  };

  const testCurrentWords = () => {
    clearLogs();
    addLog('测试当前store中的词汇组合');
    
    // 使用store中当前的词汇
    const { selectedWords, wordList } = useMnemonicStore.getState();
    addLog(`当前store中的词汇: [${selectedWords.join(', ')}]`);
    addLog(`当前词典大小: ${wordList.length}`);
    
    const validWords = selectedWords.filter((w: string) => w && w.trim());
    if (validWords.length !== 11) {
      addLog(`❌ 词汇数量不足11个，当前有效词汇: ${validWords.length}`);
      return;
    }
    
    // 验证每个词是否在词典中
    for (let i = 0; i < selectedWords.length; i++) {
      const word = selectedWords[i];
      if (!word) {
        addLog(`❌ 第${i + 1}个词为空`);
        return;
      }
      
      const isInDict = wordList.includes(word.toLowerCase());
      addLog(`${i + 1}. "${word}" 在词典中: ${isInDict}`);
      
      if (!isInDict) {
        addLog(`❌ 词汇 "${word}" 不在词典中`);
        return;
      }
    }
    
    addLog('✅ 所有词汇都在词典中，开始计算第12个词...');
    
    // 使用当前词汇计算
    let found = false;
    let attempts = 0;
    
    for (let i = 0; i < wordList.length; i++) {
      attempts++;
      const testWord = wordList[i];
      const testMnemonic = [...selectedWords, testWord].join(' ');
      
      try {
        const isValid = bip39.validateMnemonic(testMnemonic);
        if (isValid) {
          addLog(`✅ 找到有效的第12个词: "${testWord}" (尝试了 ${attempts} 次)`);
          addLog(`完整助记词: ${testMnemonic}`);
          found = true;
          break;
        }
      } catch (error) {
        addLog(`❌ 验证第${attempts}个词"${testWord}"时出错: ${error}`);
        break;
      }
      
      if (attempts % 200 === 0) {
        addLog(`已尝试 ${attempts} 个词...`);
      }
    }
    
    if (!found) {
      addLog(`❌ 未找到有效的第12个词，总共尝试了 ${attempts} 个词`);
      addLog('这个词汇组合可能确实无法生成有效的BIP39助记词');
      addLog('建议：尝试点击"全部随机"重新生成词汇');
    }
  };

  const testSimpleCase = () => {
    clearLogs();
    addLog('测试简单情况（全部abandon）');
    
    const simpleWords = Array(11).fill('abandon');
    const wordList = bip39.wordlists.english;
    
    addLog(`简单测试词汇: ${simpleWords.join(' ')}`);
    addLog(`词典大小: ${wordList.length}`);
    
    let found = false;
    let attempts = 0;
    
    for (let i = 0; i < wordList.length; i++) {
      attempts++;
      const testWord = wordList[i];
      const testMnemonic = [...simpleWords, testWord].join(' ');
      
      try {
        const isValid = bip39.validateMnemonic(testMnemonic);
        if (isValid) {
          addLog(`✅ 简单测试成功！第12个词: "${testWord}" (尝试了 ${attempts} 次)`);
          addLog(`完整助记词: ${testMnemonic}`);
          found = true;
          break;
        }
      } catch (error) {
        addLog(`❌ 简单测试验证时出错: ${error}`);
        break;
      }
    }
    
    if (!found) {
      addLog('❌ 简单测试也失败了，bip39库可能有问题');
    } else {
      addLog('✅ 简单测试成功，bip39库工作正常');
    }
  };

  const testRandomGeneration = () => {
    clearLogs();
    addLog('测试随机生成助记词');
    
    try {
      const randomMnemonic = bip39.generateMnemonic();
      addLog(`随机生成的助记词: ${randomMnemonic}`);
      
      const words = randomMnemonic.split(' ');
      addLog(`词汇数量: ${words.length}`);
      
      const isValid = bip39.validateMnemonic(randomMnemonic);
      addLog(`验证结果: ${isValid}`);
      
      if (isValid) {
        const entropy = bip39.mnemonicToEntropy(randomMnemonic);
        addLog(`熵值: ${entropy}`);
      }
    } catch (error) {
      addLog(`❌ 随机生成失败: ${error}`);
    }
  };

  return (
    <Card title="BIP39 调试工具" style={{ margin: '20px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space wrap>
          <Button type="primary" onClick={testCurrentWords}>
            测试当前词汇组合
          </Button>
          <Button onClick={testSimpleCase}>
            测试简单情况
          </Button>
          <Button onClick={testRandomGeneration}>
            测试随机生成
          </Button>
          <Button onClick={clearLogs}>
            清空日志
          </Button>
        </Space>
        
        <Card title="调试日志" size="small">
          <div style={{ maxHeight: '400px', overflow: 'auto', fontFamily: 'monospace' }}>
            {debugInfo.length === 0 ? (
              <Text type="secondary">暂无日志，点击上方按钮开始测试</Text>
            ) : (
              debugInfo.map((log, index) => (
                <Paragraph key={index} style={{ margin: '2px 0', fontSize: '12px' }}>
                  {log}
                </Paragraph>
              ))
            )}
          </div>
        </Card>
      </Space>
    </Card>
  );
};

export default DebugBIP39;