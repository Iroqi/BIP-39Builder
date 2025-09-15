import React, { useState } from 'react';
import { Card, Button, Typography, message, Space, Divider, Tooltip } from 'antd';
import { CopyOutlined, EyeOutlined, EyeInvisibleOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { MnemonicDisplayProps } from '../types';
import { copyToClipboard, formatMnemonic } from '../utils';

const { Text, Paragraph } = Typography;

const MnemonicDisplay: React.FC<MnemonicDisplayProps> = ({
  mnemonic,
  highlightChecksum = true,
  onCopy,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [copying, setCopying] = useState(false);

  const words = formatMnemonic(mnemonic);
  const hasValidMnemonic = words.length === 12;

  const handleCopy = async () => {
    if (!mnemonic) {
      message.warning('没有可复制的助记词');
      return;
    }

    setCopying(true);
    try {
      const success = await copyToClipboard(mnemonic);
      if (success) {
        message.success('助记词已复制到剪贴板');
        onCopy?.();
      } else {
        message.error('复制失败，请手动选择文本复制');
      }
    } catch {
      message.error('复制失败');
    } finally {
      setCopying(false);
    }
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const renderWord = (word: string, index: number) => {
    const isChecksumWord = index === 11 && highlightChecksum;
    const isHidden = !isVisible;

    return (
      <div
        key={index}
        className={`mnemonic-word ${isChecksumWord ? 'checksum-word' : ''} ${isHidden ? 'hidden' : ''}`}
      >
        <span className="word-number">{index + 1}</span>
        <span className="word-text">
          {isHidden ? '••••••' : word}
        </span>
        {isChecksumWord && (
          <Tooltip title="这是根据前11个词计算得出的校验词">
            <CheckCircleOutlined className="checksum-icon" />
          </Tooltip>
        )}
      </div>
    );
  };

  return (
    <Card
      title={
        <div className="mnemonic-display-header">
          <span>生成的助记词</span>
          {hasValidMnemonic && (
            <div className="mnemonic-status">
              <CheckCircleOutlined style={{ color: '#52c41a' }} />
              <span>有效</span>
            </div>
          )}
        </div>
      }
      className="mnemonic-display"
      extra={
        <Space>
          <Button
            icon={isVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            onClick={toggleVisibility}
            size="small"
            title={isVisible ? '隐藏助记词' : '显示助记词'}
          />
          <Button
            icon={<CopyOutlined />}
            onClick={handleCopy}
            loading={copying}
            disabled={!hasValidMnemonic}
            type="primary"
            size="small"
          >
            复制
          </Button>
        </Space>
      }
    >
      {!hasValidMnemonic ? (
        <div className="mnemonic-placeholder">
          <ExclamationCircleOutlined style={{ fontSize: '24px', color: '#faad14' }} />
          <Text type="secondary">请先选择前11个助记词，系统将自动计算第12个校验词</Text>
        </div>
      ) : (
        <>
          <div className="mnemonic-grid">
            {words.map((word, index) => renderWord(word, index))}
          </div>
          
          <Divider />
          
          <div className="mnemonic-text-format">
            <Text code copyable={!copying} className="mnemonic-text">
              {isVisible ? mnemonic : '•••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• •••••• ••••••'}
            </Text>
          </div>
          
          <div className="mnemonic-info">
            <Space direction="vertical" size="small">
              <Text type="secondary">
                • 前11个词是您选择的，第12个词（
                <Text strong className={highlightChecksum ? 'checksum-highlight' : ''}>
                  {words[11]}
                </Text>
                ）是自动计算的校验词
              </Text>
              <Text type="secondary">
                • 请安全保存您的助记词，不要与他人分享
              </Text>
              <Text type="secondary">
                • 助记词可用于恢复您的加密货币钱包
              </Text>
            </Space>
          </div>
        </>
      )}
    </Card>
  );
};

export default MnemonicDisplay;