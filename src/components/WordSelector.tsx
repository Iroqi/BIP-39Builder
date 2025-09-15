import React, { useState, useMemo } from 'react';
import { Select, Button, Row, Col, AutoComplete, Tooltip } from 'antd';
import { ReloadOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { WordSelectorProps } from '../types';

const { Option } = Select;

const WordSelector: React.FC<WordSelectorProps> = ({
  wordList,
  selectedWords,
  onWordChange,
  onRandomWord,
}) => {
  const [searchValues, setSearchValues] = useState<string[]>(Array(11).fill(''));

  // 为每个输入框生成过滤后的选项
  const getFilteredOptions = (searchValue: string) => {
    if (!searchValue) return [];
    
    return wordList
      .filter(word => word.toLowerCase().includes(searchValue.toLowerCase()))
      .slice(0, 10) // 限制显示数量以提高性能
      .map(word => ({ value: word, label: word }));
  };

  // 处理AutoComplete的搜索
  const handleSearch = (value: string, index: number) => {
    const newSearchValues = [...searchValues];
    newSearchValues[index] = value;
    setSearchValues(newSearchValues);
  };

  // 处理选择
  const handleSelect = (value: string, index: number) => {
    console.log(`选择第${index + 1}个词:`, value);
    onWordChange(index, value);
    const newSearchValues = [...searchValues];
    newSearchValues[index] = value;
    setSearchValues(newSearchValues);
  };

  // 清除输入
  const handleClear = (index: number) => {
    onWordChange(index, '');
    const newSearchValues = [...searchValues];
    newSearchValues[index] = '';
    setSearchValues(newSearchValues);
  };

  // 渲染单个词汇选择器
  const renderWordSelector = (index: number) => {
    const isValid = selectedWords[index] && wordList.includes(selectedWords[index]);
    
    return (
      <Col xs={24} sm={12} md={8} lg={6} xl={4} key={index}>
        <div className="word-selector-item">
          <div className="word-label">
            <span className="word-number">{index + 1}.</span>
            <Tooltip title="选择一个有效的BIP39单词">
              <QuestionCircleOutlined className="word-help" />
            </Tooltip>
          </div>
          
          <div className="word-input-group">
            <AutoComplete
              value={selectedWords[index] || searchValues[index]}
              options={getFilteredOptions(searchValues[index])}
              onSearch={(value) => handleSearch(value, index)}
              onSelect={(value) => handleSelect(value, index)}
              onBlur={() => {
                // 如果输入的值在词典中，自动选择
                const inputValue = searchValues[index];
                if (inputValue && wordList.includes(inputValue.toLowerCase())) {
                  handleSelect(inputValue.toLowerCase(), index);
                }
              }}
              placeholder={`选择第${index + 1}个词`}
              title={`第${index + 1}个助记词输入框`}
              className={`word-autocomplete ${isValid ? 'valid' : selectedWords[index] ? 'invalid' : ''}`}
              allowClear
              onClear={() => handleClear(index)}
              filterOption={false}
            />
            
            <Button
              icon={<ReloadOutlined />}
              onClick={() => onRandomWord(index)}
              className="random-btn"
              size="small"
              title="随机选择"
            />
          </div>
          
          {selectedWords[index] && !isValid && (
            <div className="error-message">
              词汇不在字典中
            </div>
          )}
        </div>
      </Col>
    );
  };

  return (
    <div className="word-selector">
      <div className="word-selector-header">
        <h3>选择前11个助记词</h3>
        <div className="word-selector-actions">
          <Button
            onClick={() => {
              for (let i = 0; i < 11; i++) {
                onRandomWord(i);
              }
            }}
            icon={<ReloadOutlined />}
          >
            全部随机
          </Button>
          
          <Button
            onClick={() => {
              for (let i = 0; i < 11; i++) {
                onWordChange(i, '');
              }
              setSearchValues(Array(11).fill(''));
            }}
            type="default"
          >
            全部清除
          </Button>
        </div>
      </div>
      
      <Row gutter={[16, 16]} className="word-selector-grid">
        {Array.from({ length: 11 }, (_, index) => renderWordSelector(index))}
      </Row>
      
      <div className="word-selector-info">
        <p>
          选择前11个助记词，系统将自动计算第12个校验词。
          所有词汇必须来自 BIP39 标准词典。
        </p>
      </div>
    </div>
  );
};

export default WordSelector;