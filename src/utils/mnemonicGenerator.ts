import * as bip39 from 'bip39';
import { createHash } from 'crypto-js/sha256';
import { SupportedLanguage, ChecksumCalculator, ValidationRules, MnemonicStrength } from '../types';

/**
 * BIP39助记词生成器核心类
 */
export class MnemonicGenerator implements ChecksumCalculator, ValidationRules {
  private wordList: string[];
  private language: SupportedLanguage;

  constructor(language: SupportedLanguage = 'english') {
    this.language = language;
    this.wordList = this.loadWordList(language);
  }

  /**
   * 加载指定语言的词汇表
   */
  private loadWordList(language: SupportedLanguage): string[] {
    try {
      const wordlist = bip39.wordlists[language as keyof typeof bip39.wordlists];
      return wordlist || bip39.wordlists.english;
    } catch {
      return bip39.wordlists.english;
    }
  }

  /**
   * 根据前11个词生成完整的12词助记词
   */
  generateFromPrefix(selectedWords: string[]): string {
    if (selectedWords.length !== 11) {
      throw new Error('必须提供恰好11个单词');
    }

    // 验证所有词都在词典中
    for (let i = 0; i < selectedWords.length; i++) {
      if (!this.validateWordInDictionary(selectedWords[i], this.wordList)) {
        throw new Error(`第${i + 1}个词"${selectedWords[i]}"不在词典中`);
      }
    }

    // 计算第12个词
    const checksumWord = this.findValidWord(selectedWords, this.wordList);
    if (!checksumWord) {
      throw new Error('无法找到有效的校验和词');
    }

    const fullMnemonic = [...selectedWords, checksumWord].join(' ');
    
    // 验证生成的助记词
    if (!this.validateMnemonic(fullMnemonic)) {
      throw new Error('生成的助记词验证失败');
    }

    return fullMnemonic;
  }

  /**
   * 计算校验和 - 使用试探法找到正确的第12个词
   */
  calculateChecksum(words: string[]): string {
    if (words.length !== 11) {
      throw new Error('需要恰好11个单词来计算校验和');
    }

    return this.findValidWord(words, this.wordList);
  }

  /**
   * 找到使助记词有效的第12个词
   */
  findValidWord(prefix: string[], wordList: string[]): string {
    for (const word of wordList) {
      const testMnemonic = [...prefix, word].join(' ');
      if (bip39.validateMnemonic(testMnemonic)) {
        return word;
      }
    }
    throw new Error('无法找到有效的校验和词');
  }

  /**
   * 验证词序列是否有效
   */
  validateWordSequence(words: string[]): boolean {
    if (words.length !== 12) return false;
    
    for (const word of words) {
      if (!this.validateWordInDictionary(word, this.wordList)) {
        return false;
      }
    }
    
    return this.validateMnemonic(words.join(' '));
  }

  /**
   * 验证单词是否在词典中
   */
  validateWordInDictionary(word: string, wordList: string[]): boolean {
    return wordList.includes(word.toLowerCase().trim());
  }

  /**
   * 验证助记词长度
   */
  validateMnemonicLength(words: string[]): boolean {
    return words.length === 12;
  }

  /**
   * 验证助记词校验和完整性
   */
  validateChecksumIntegrity(mnemonic: string): boolean {
    try {
      return bip39.validateMnemonic(mnemonic);
    } catch {
      return false;
    }
  }

  /**
   * 计算助记词强度评分
   */
  calculateStrengthScore(mnemonic: string): number {
    if (!mnemonic || !this.validateChecksumIntegrity(mnemonic)) {
      return 0;
    }

    const words = mnemonic.split(' ');
    if (words.length !== 12) return 0;

    // 基础分数：有效的12词助记词
    let score = 60;

    // 检查词汇多样性
    const uniqueWords = new Set(words);
    if (uniqueWords.size === words.length) {
      score += 20; // 所有词都不重复
    } else if (uniqueWords.size >= 10) {
      score += 10; // 大部分词不重复
    }

    // 检查是否包含常见词汇（降低分数）
    const commonWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'day'];
    const hasCommonWords = words.some(word => commonWords.includes(word.toLowerCase()));
    if (hasCommonWords) {
      score -= 10;
    }

    // 检查词汇分布（是否来自词典的不同部分）
    const firstLetters = words.map(word => word.charAt(0).toLowerCase());
    const uniqueFirstLetters = new Set(firstLetters);
    if (uniqueFirstLetters.size >= 8) {
      score += 10; // 词汇分布良好
    }

    // 确保分数在0-100之间
    return Math.max(0, Math.min(100, score));
  }

  /**
   * 获取助记词强度等级
   */
  getStrengthLevel(score: number): MnemonicStrength {
    if (score >= 90) return 'very_strong';
    if (score >= 75) return 'strong';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'weak';
  }

  /**
   * 验证助记词
   */
  validateMnemonic(mnemonic: string): boolean {
    return this.validateChecksumIntegrity(mnemonic);
  }

  /**
   * 计算助记词的熵值
   */
  calculateEntropy(mnemonic: string): number {
    if (!this.validateMnemonic(mnemonic)) return 0;
    
    const words = mnemonic.split(' ');
    if (words.length === 12) {
      return 128; // 12词助记词对应128位熵
    }
    return 0;
  }

  /**
   * 生成随机助记词（用于测试和比较）
   */
  generateRandomMnemonic(): string {
    return bip39.generateMnemonic();
  }

  /**
   * 获取当前语言
   */
  getLanguage(): SupportedLanguage {
    return this.language;
  }

  /**
   * 获取当前词汇表
   */
  getWordList(): string[] {
    return [...this.wordList]; // 返回副本以防修改
  }

  /**
   * 更改语言
   */
  setLanguage(language: SupportedLanguage): void {
    this.language = language;
    this.wordList = this.loadWordList(language);
  }

  /**
   * 获取支持的语言列表
   */
  static getSupportedLanguages(): SupportedLanguage[] {
    return [
      'english',
      'chinese_simplified',
      'chinese_traditional',
      'french',
      'italian',
      'japanese',
      'korean',
      'spanish'
    ];
  }

  /**
   * 将助记词转换为种子
   */
  mnemonicToSeed(mnemonic: string, passphrase?: string): Buffer {
    if (!this.validateMnemonic(mnemonic)) {
      throw new Error('无效的助记词');
    }
    return bip39.mnemonicToSeedSync(mnemonic, passphrase);
  }

  /**
   * 将助记词转换为熵
   */
  mnemonicToEntropy(mnemonic: string): string {
    if (!this.validateMnemonic(mnemonic)) {
      throw new Error('无效的助记词');
    }
    return bip39.mnemonicToEntropy(mnemonic);
  }
}