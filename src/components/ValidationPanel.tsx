import React from 'react';
import { Card, Progress, Space, Typography, Statistic, Alert, Button, Descriptions } from 'antd';
import { 
  CheckCircleOutlined, 
  ExclamationCircleOutlined, 
  CloseCircleOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { ValidationPanelProps, MnemonicStrength } from '../types';
import { getStrengthColor, getStrengthText } from '../utils';
import { MnemonicGenerator } from '../utils/mnemonicGenerator';

const { Text, Title } = Typography;

const ValidationPanel: React.FC<ValidationPanelProps> = ({
  mnemonic,
  isValid,
  entropy,
  onValidate,
}) => {
  const generator = new MnemonicGenerator();
  
  // 计算强度评分
  const strengthScore = mnemonic ? generator.calculateStrengthScore(mnemonic) : 0;
  const strengthLevel = generator.getStrengthLevel(strengthScore);
  
  // 获取强度颜色和文本
  const strengthColor = getStrengthColor(strengthLevel);
  const strengthText = getStrengthText(strengthLevel);

  // 验证详情
  const validationDetails = React.useMemo(() => {
    if (!mnemonic) return null;

    const words = mnemonic.split(' ').filter(word => word.length > 0);
    const wordList = generator.getWordList();
    
    return {
      wordCount: words.length,
      validWords: words.filter(word => wordList.includes(word.toLowerCase())).length,
      uniqueWords: new Set(words).size,
      hasValidChecksum: generator.validateChecksumIntegrity(mnemonic),
    };
  }, [mnemonic]);

  const renderValidationStatus = () => {
    if (!mnemonic) {
      return (
        <Alert
          message="等待助记词生成"
          description="请选择前11个助记词，系统将自动生成完整的助记词并进行验证。"
          type="info"
          icon={<ExclamationCircleOutlined />}
          showIcon
        />
      );
    }

    if (isValid) {
      return (
        <Alert
          message="助记词验证通过"
          description="您的助记词符合BIP39标准，可以安全使用。"
          type="success"
          icon={<CheckCircleOutlined />}
          showIcon
        />
      );
    }

    return (
      <Alert
        message="助记词验证失败"
        description="助记词不符合BIP39标准，请检查输入的词汇是否正确。"
        type="error"
        icon={<CloseCircleOutlined />}
        showIcon
      />
    );
  };

  const renderStrengthMeter = () => {
    return (
      <div className="strength-meter">
        <div className="strength-header">
          <Text strong>助记词强度</Text>
          <Text type="secondary">({strengthScore}/100)</Text>
        </div>
        
        <Progress
          percent={strengthScore}
          strokeColor={strengthColor}
          size="small"
          format={() => strengthText}
        />
        
        <div className="strength-description">
          <Text type="secondary">
            {strengthLevel === 'very_strong' && '优秀！您的助记词非常安全。'}
            {strengthLevel === 'strong' && '很好！您的助记词具有良好的安全性。'}
            {strengthLevel === 'good' && '不错！您的助记词安全性良好。'}
            {strengthLevel === 'fair' && '一般。建议选择更多样化的词汇以提高安全性。'}
            {strengthLevel === 'weak' && '较弱。强烈建议重新选择更安全的词汇组合。'}
          </Text>
        </div>
      </div>
    );
  };

  return (
    <Card
      title={
        <Space>
          <SafetyCertificateOutlined />
          <span>验证与安全分析</span>
        </Space>
      }
      className="validation-panel"
      extra={
        mnemonic && (
          <Button onClick={onValidate} size="small">
            重新验证
          </Button>
        )
      }
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 验证状态 */}
        {renderValidationStatus()}

        {/* 基本统计 */}
        {mnemonic && (
          <div className="validation-statistics">
            <Space size="large">
              <Statistic
                title="熵值"
                value={entropy}
                suffix="bits"
                prefix={<ThunderboltOutlined />}
                valueStyle={{ color: entropy >= 128 ? '#3f8600' : '#cf1322' }}
              />
              
              {validationDetails && (
                <>
                  <Statistic
                    title="词汇数量"
                    value={validationDetails.wordCount}
                    suffix="/ 12"
                    valueStyle={{ 
                      color: validationDetails.wordCount === 12 ? '#3f8600' : '#cf1322' 
                    }}
                  />
                  
                  <Statistic
                    title="有效词汇"
                    value={validationDetails.validWords}
                    suffix={`/ ${validationDetails.wordCount}`}
                    valueStyle={{ 
                      color: validationDetails.validWords === validationDetails.wordCount ? '#3f8600' : '#cf1322' 
                    }}
                  />
                  
                  <Statistic
                    title="唯一词汇"
                    value={validationDetails.uniqueWords}
                    suffix={`/ ${validationDetails.wordCount}`}
                    valueStyle={{ 
                      color: validationDetails.uniqueWords === validationDetails.wordCount ? '#3f8600' : '#faad14' 
                    }}
                  />
                </>
              )}
            </Space>
          </div>
        )}

        {/* 强度评估 */}
        {mnemonic && strengthScore > 0 && renderStrengthMeter()}

        {/* 详细信息 */}
        {mnemonic && validationDetails && (
          <Descriptions
            title="验证详情"
            size="small"
            column={1}
            bordered
          >
            <Descriptions.Item 
              label="词汇数量" 
              span={1}
            >
              <Space>
                {validationDetails.wordCount === 12 ? 
                  <CheckCircleOutlined style={{ color: '#52c41a' }} /> : 
                  <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                }
                {validationDetails.wordCount} 个词汇
                {validationDetails.wordCount !== 12 && (
                  <Text type="danger">（需要12个词汇）</Text>
                )}
              </Space>
            </Descriptions.Item>
            
            <Descriptions.Item 
              label="词典验证" 
              span={1}
            >
              <Space>
                {validationDetails.validWords === validationDetails.wordCount ? 
                  <CheckCircleOutlined style={{ color: '#52c41a' }} /> : 
                  <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                }
                {validationDetails.validWords}/{validationDetails.wordCount} 个词汇在BIP39词典中
              </Space>
            </Descriptions.Item>
            
            <Descriptions.Item 
              label="校验和" 
              span={1}
            >
              <Space>
                {validationDetails.hasValidChecksum ? 
                  <CheckCircleOutlined style={{ color: '#52c41a' }} /> : 
                  <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                }
                {validationDetails.hasValidChecksum ? '校验和有效' : '校验和无效'}
              </Space>
            </Descriptions.Item>
            
            <Descriptions.Item 
              label="词汇唯一性" 
              span={1}
            >
              <Space>
                {validationDetails.uniqueWords === validationDetails.wordCount ? 
                  <CheckCircleOutlined style={{ color: '#52c41a' }} /> : 
                  <ExclamationCircleOutlined style={{ color: '#faad14' }} />
                }
                {validationDetails.uniqueWords === validationDetails.wordCount ? 
                  '所有词汇都是唯一的' : 
                  `存在重复词汇（${validationDetails.wordCount - validationDetails.uniqueWords}个重复）`
                }
              </Space>
            </Descriptions.Item>
          </Descriptions>
        )}

        {/* 安全提示 */}
        <Alert
          message="安全提示"
          description={
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>请妥善保管您的助记词，任何人获得助记词都可以控制您的钱包</li>
              <li>建议将助记词写在纸上并存放在安全的地方</li>
              <li>不要在联网的设备上存储助记词的数字副本</li>
              <li>定期验证您能够使用助记词恢复钱包</li>
            </ul>
          }
          type="warning"
          showIcon
        />
      </Space>
    </Card>
  );
};

export default ValidationPanel;