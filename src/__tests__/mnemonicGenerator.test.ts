import { describe, it, expect } from 'vitest';
import { MnemonicGenerator } from '../utils/mnemonicGenerator';

describe('MnemonicGenerator', () => {
  let generator: MnemonicGenerator;

  beforeEach(() => {
    generator = new MnemonicGenerator('english');
  });

  describe('基础功能测试', () => {
    it('应该正确初始化英语词典', () => {
      const wordList = generator.getWordList();
      expect(wordList).toHaveLength(2048);
      expect(wordList).toContain('abandon');
      expect(wordList).toContain('zoo');
    });

    it('应该验证词汇是否在词典中', () => {
      expect(generator.validateWordInDictionary('abandon', generator.getWordList())).toBe(true);
      expect(generator.validateWordInDictionary('invalidword', generator.getWordList())).toBe(false);
    });

    it('应该验证助记词长度', () => {
      const validWords = Array(12).fill('abandon');
      const invalidWords = Array(11).fill('abandon');
      
      expect(generator.validateMnemonicLength(validWords)).toBe(true);
      expect(generator.validateMnemonicLength(invalidWords)).toBe(false);
    });
  });

  describe('助记词生成测试', () => {
    it('应该为有效的前11个词生成正确的第12个词', () => {
      const selectedWords = [
        'abandon', 'ability', 'able', 'about', 'above', 
        'absent', 'absorb', 'abstract', 'absurd', 'abuse', 'access'
      ];
      
      const fullMnemonic = generator.generateFromPrefix(selectedWords);
      expect(fullMnemonic.split(' ')).toHaveLength(12);
      expect(generator.validateMnemonic(fullMnemonic)).toBe(true);
    });

    it('应该拒绝无效的词汇', () => {
      const invalidWords = [
        'invalid', 'words', 'not', 'in', 'dictionary', 
        'should', 'fail', 'validation', 'test', 'case', 'here'
      ];
      
      expect(() => generator.generateFromPrefix(invalidWords)).toThrow();
    });

    it('应该拒绝错误数量的词汇', () => {
      const tooFewWords = ['abandon', 'ability', 'able'];
      const tooManyWords = Array(15).fill('abandon');
      
      expect(() => generator.generateFromPrefix(tooFewWords)).toThrow();
      expect(() => generator.generateFromPrefix(tooManyWords)).toThrow();
    });
  });

  describe('校验和计算测试', () => {
    it('应该找到有效的校验和词', () => {
      const selectedWords = [
        'abandon', 'ability', 'able', 'about', 'above', 
        'absent', 'absorb', 'abstract', 'absurd', 'abuse', 'access'
      ];
      
      const checksumWord = generator.calculateChecksum(selectedWords);
      expect(checksumWord).toBeTruthy();
      expect(generator.getWordList()).toContain(checksumWord);
      
      const fullMnemonic = [...selectedWords, checksumWord].join(' ');
      expect(generator.validateMnemonic(fullMnemonic)).toBe(true);
    });
  });

  describe('强度评估测试', () => {
    it('应该正确计算助记词强度', () => {
      const strongMnemonic = generator.generateRandomMnemonic();
      const score = generator.calculateStrengthScore(strongMnemonic);
      
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('应该为无效助记词返回0分', () => {
      const invalidMnemonic = 'invalid mnemonic phrase';
      const score = generator.calculateStrengthScore(invalidMnemonic);
      
      expect(score).toBe(0);
    });

    it('应该正确评估强度等级', () => {
      expect(generator.getStrengthLevel(95)).toBe('very_strong');
      expect(generator.getStrengthLevel(80)).toBe('strong');
      expect(generator.getStrengthLevel(65)).toBe('good');
      expect(generator.getStrengthLevel(50)).toBe('fair');
      expect(generator.getStrengthLevel(30)).toBe('weak');
    });
  });

  describe('语言支持测试', () => {
    it('应该支持多种语言', () => {
      const languages = MnemonicGenerator.getSupportedLanguages();
      
      expect(languages).toContain('english');
      expect(languages).toContain('chinese_simplified');
      expect(languages).toContain('japanese');
    });

    it('应该能够切换语言', () => {
      generator.setLanguage('chinese_simplified');
      expect(generator.getLanguage()).toBe('chinese_simplified');
      
      const wordList = generator.getWordList();
      expect(wordList).toHaveLength(2048);
    });
  });

  describe('助记词转换测试', () => {
    it('应该能够将助记词转换为种子', () => {
      const mnemonic = generator.generateRandomMnemonic();
      const seed = generator.mnemonicToSeed(mnemonic);
      
      expect(seed).toBeInstanceOf(Buffer);
      expect(seed.length).toBe(64); // BIP39 种子长度
    });

    it('应该能够将助记词转换为熵', () => {
      const mnemonic = generator.generateRandomMnemonic();
      const entropy = generator.mnemonicToEntropy(mnemonic);
      
      expect(entropy).toBeTruthy();
      expect(typeof entropy).toBe('string');
    });
  });
});