import React from 'react';
import { Select, Space } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { LanguageSelectorProps, SupportedLanguage } from '../types';

const { Option } = Select;

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  language,
  onLanguageChange,
  availableLanguages,
}) => {
  const languageNames: Record<SupportedLanguage, string> = {
    english: 'English (英语)',
    chinese_simplified: '简体中文',
    chinese_traditional: '繁體中文',
    french: 'Français (法语)',
    italian: 'Italiano (意大利语)',
    japanese: '日本語 (日语)',
    korean: '한국어 (韩语)',
    spanish: 'Español (西班牙语)',
  };

  return (
    <Space>
      <GlobalOutlined />
      <Select
        value={language}
        onChange={onLanguageChange}
        style={{ minWidth: 200 }}
        placeholder="选择语言"
      >
        {availableLanguages.map((lang) => (
          <Option key={lang} value={lang}>
            {languageNames[lang] || lang}
          </Option>
        ))}
      </Select>
    </Space>
  );
};

export default LanguageSelector;