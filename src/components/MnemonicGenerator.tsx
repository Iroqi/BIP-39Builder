import React, { useEffect } from 'react';
import { Layout, Space, Typography, Divider, Card, Button, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { WordSelector, MnemonicDisplay, ValidationPanel, LanguageSelector } from '../components';
import { useMnemonicStore, initializeStore } from '../store';
import { MnemonicGenerator as CoreGenerator } from '../utils';
import { MnemonicGeneratorProps } from '../types';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

const MnemonicGenerator: React.FC<MnemonicGeneratorProps> = ({
  defaultLanguage = 'english',
  onMnemonicGenerated,
}) => {
  const {
    selectedWords,
    generatedMnemonic,
    language,
    wordList,
    isValid,
    entropy,
    validationErrors,
    isLoading,
    setWord,
    generateMnemonic,
    validateMnemonic,
    setLanguage,
    resetGenerator,
    randomizeWord,
    randomizeAllWords,
  } = useMnemonicStore();

  // 初始化store和设置默认语言
  useEffect(() => {
    initializeStore();
    if (defaultLanguage !== language) {
      setLanguage(defaultLanguage as any);
    }
  }, []);

  // 当助记词生成时通知父组件
  useEffect(() => {
    if (generatedMnemonic && isValid && onMnemonicGenerated) {
      onMnemonicGenerated(generatedMnemonic);
    }
  }, [generatedMnemonic, isValid, onMnemonicGenerated]);

  const handleWordChange = (index: number, word: string) => {
    setWord(index, word);
  };

  const handleRandomWord = (index: number) => {
    randomizeWord(index);
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as any);
    message.info(`语言已切换为${newLanguage}`);
  };

  const handleValidate = () => {
    const isValidResult = validateMnemonic();
    if (isValidResult) {
      message.success('助记词验证通过！');
    } else {
      message.error('助记词验证失败！');
    }
  };

  const handleReset = () => {
    resetGenerator();
    message.info('已重置所有选择');
  };

  const handleRandomizeAll = () => {
    randomizeAllWords();
    message.info('已随机生成所有词汇');
  };

  const availableLanguages = CoreGenerator.getSupportedLanguages();

  return (
    <Layout className="mnemonic-generator-layout">
      <Header className="mnemonic-header">
        <div className="header-content">
          <div className="header-title">
            <Title level={2} style={{ color: 'white', margin: 0 }}>
              BIP39 助记词生成器
            </Title>
            <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
              自定义前11个单词的助记词生成工具
            </Paragraph>
          </div>
          
          <div className="header-controls">
            <Space size="large">
              <LanguageSelector
                language={language}
                onLanguageChange={handleLanguageChange}
                availableLanguages={availableLanguages}
              />
              
              <Space>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleRandomizeAll}
                  loading={isLoading}
                >
                  全部随机
                </Button>
                
                <Button
                  onClick={handleReset}
                  disabled={isLoading}
                >
                  重置
                </Button>
              </Space>
            </Space>
          </div>
        </div>
      </Header>

      <Content className="mnemonic-content">
        <div className="content-container">
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* 介绍说明 */}
            <Card className="intro-card">
              <Space direction="vertical">
                <Title level={4}>功能介绍</Title>
                <Paragraph>
                  本工具允许您自定义前11个助记词，系统会自动计算符合BIP39标准的第12个校验词。
                  这样您可以创建个性化的助记词，同时确保其符合加密货币钱包的标准要求。
                </Paragraph>
                <Paragraph type="warning">
                  ⚠️ 警告：自定义助记词可能降低安全性。建议仅在您完全理解风险的情况下使用。
                  对于实际使用，建议使用完全随机生成的助记词。
                </Paragraph>
              </Space>
            </Card>

            {/* 词汇选择器 */}
            <WordSelector
              wordList={wordList}
              selectedWords={selectedWords}
              onWordChange={handleWordChange}
              onRandomWord={handleRandomWord}
            />

            <Divider />

            {/* 助记词显示 */}
            <MnemonicDisplay
              mnemonic={generatedMnemonic}
              highlightChecksum={true}
              onCopy={() => message.success('助记词已复制！')}
            />

            <Divider />

            {/* 验证面板 */}
            <ValidationPanel
              mnemonic={generatedMnemonic}
              isValid={isValid}
              entropy={entropy}
              onValidate={handleValidate}
            />

            {/* 错误显示 */}
            {validationErrors.length > 0 && (
              <Card title="验证错误" className="error-card">
                <Space direction="vertical">
                  {validationErrors.map((error, index) => (
                    <Paragraph key={index} type="danger">
                      • {error.message}
                      {error.wordIndex !== undefined && ` (第${error.wordIndex + 1}个词)`}
                    </Paragraph>
                  ))}
                </Space>
              </Card>
            )}

            {/* 使用说明 */}
            <Card title="使用说明" className="instructions-card">
              <Space direction="vertical">
                <Title level={5}>操作步骤：</Title>
                <ol>
                  <li>选择您喜欢的语言（默认为英语）</li>
                  <li>在上方的输入框中选择或输入前11个助记词</li>
                  <li>系统会自动计算并显示第12个校验词</li>
                  <li>验证生成的助记词是否符合BIP39标准</li>
                  <li>安全地保存您的完整助记词</li>
                </ol>
                
                <Title level={5}>注意事项：</Title>
                <ul>
                  <li>所有词汇必须来自BIP39标准词典</li>
                  <li>第12个词是根据前11个词计算得出的校验和</li>
                  <li>请确保在安全的环境中使用本工具</li>
                  <li>不要在公共场所或不安全的网络环境中生成助记词</li>
                </ul>
              </Space>
            </Card>
          </Space>
        </div>
      </Content>
    </Layout>
  );
};

export default MnemonicGenerator;