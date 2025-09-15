// 助记词生成器相关类型
export interface MnemonicGeneratorProps {
  defaultLanguage?: string;
  onMnemonicGenerated?: (mnemonic: string) => void;
}

export interface MnemonicGeneratorState {
  selectedWords: string[];
  generatedMnemonic: string;
  isValid: boolean;
  language: string;
  wordList: string[];
  entropy: number;
}

// 词汇选择器相关类型
export interface WordSelectorProps {
  wordList: string[];
  selectedWords: string[];
  onWordChange: (index: number, word: string) => void;
  onRandomWord: (index: number) => void;
}

// 助记词显示相关类型
export interface MnemonicDisplayProps {
  mnemonic: string;
  highlightChecksum?: boolean;
  onCopy?: () => void;
}

// 验证面板相关类型
export interface ValidationPanelProps {
  mnemonic: string;
  isValid: boolean;
  entropy: number;
  onValidate: () => void;
}

// 语言选择器相关类型
export interface LanguageSelectorProps {
  language: string;
  onLanguageChange: (language: string) => void;
  availableLanguages: string[];
}

// BIP39核心算法相关类型
export interface ChecksumCalculator {
  calculateChecksum(words: string[]): string;
  findValidWord(prefix: string[], wordList: string[]): string;
  validateWordSequence(words: string[]): boolean;
}

export interface ValidationRules {
  validateWordInDictionary: (word: string, wordList: string[]) => boolean;
  validateMnemonicLength: (words: string[]) => boolean;
  validateChecksumIntegrity: (mnemonic: string) => boolean;
  calculateStrengthScore: (mnemonic: string) => number;
}

// 支持的语言类型
export type SupportedLanguage = 
  | 'english'
  | 'chinese_simplified'
  | 'chinese_traditional'
  | 'french'
  | 'italian'
  | 'japanese'
  | 'korean'
  | 'spanish';

// 助记词强度等级
export type MnemonicStrength = 'weak' | 'fair' | 'good' | 'strong' | 'very_strong';

// 应用状态类型
export interface AppState {
  theme: 'light' | 'dark';
  language: SupportedLanguage;
  showAdvanced: boolean;
}

// 错误类型
export interface ValidationError {
  type: 'invalid_word' | 'invalid_length' | 'invalid_checksum' | 'unknown';
  message: string;
  wordIndex?: number;
}