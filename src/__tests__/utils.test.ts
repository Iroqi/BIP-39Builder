import { describe, it, expect } from 'vitest';
import { 
  copyToClipboard, 
  debounce, 
  throttle, 
  formatMnemonic, 
  getRandomIndex, 
  isValidMnemonicFormat,
  getStrengthColor,
  getStrengthText
} from '../utils';

describe('Utils Functions', () => {
  describe('formatMnemonic', () => {
    it('应该正确格式化助记词', () => {
      const mnemonic = 'abandon ability able about above absent absorb abstract absurd abuse access';
      const formatted = formatMnemonic(mnemonic);
      
      expect(formatted).toHaveLength(11);
      expect(formatted[0]).toBe('abandon');
      expect(formatted[10]).toBe('access');
    });

    it('应该处理多余的空格', () => {
      const mnemonic = '  abandon   ability   able  ';
      const formatted = formatMnemonic(mnemonic);
      
      expect(formatted).toHaveLength(3);
      expect(formatted).toEqual(['abandon', 'ability', 'able']);
    });

    it('应该处理空字符串', () => {
      const formatted = formatMnemonic('');
      expect(formatted).toHaveLength(0);
    });
  });

  describe('getRandomIndex', () => {
    it('应该返回有效的随机索引', () => {
      const max = 100;
      const index = getRandomIndex(max);
      
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(max);
    });

    it('应该处理边界情况', () => {
      const index = getRandomIndex(1);
      expect(index).toBe(0);
    });
  });

  describe('isValidMnemonicFormat', () => {
    it('应该验证有效的助记词格式', () => {
      const validMnemonic = 'abandon ability able about above absent absorb abstract absurd abuse access account';
      expect(isValidMnemonicFormat(validMnemonic)).toBe(true);
    });

    it('应该拒绝无效的助记词格式', () => {
      expect(isValidMnemonicFormat('too few words')).toBe(false);
      expect(isValidMnemonicFormat('word1 word2 word3 123 word5 word6 word7 word8 word9 word10 word11 word12')).toBe(false);
      expect(isValidMnemonicFormat('')).toBe(false);
    });
  });

  describe('getStrengthColor', () => {
    it('应该返回正确的强度颜色', () => {
      expect(getStrengthColor('very_strong')).toBe('#52c41a');
      expect(getStrengthColor('strong')).toBe('#73d13d');
      expect(getStrengthColor('good')).toBe('#faad14');
      expect(getStrengthColor('fair')).toBe('#fa8c16');
      expect(getStrengthColor('weak')).toBe('#f5222d');
      expect(getStrengthColor('unknown')).toBe('#d9d9d9');
    });
  });

  describe('getStrengthText', () => {
    it('应该返回正确的强度文本', () => {
      expect(getStrengthText('very_strong')).toBe('非常强');
      expect(getStrengthText('strong')).toBe('强');
      expect(getStrengthText('good')).toBe('良好');
      expect(getStrengthText('fair')).toBe('一般');
      expect(getStrengthText('weak')).toBe('弱');
      expect(getStrengthText('unknown')).toBe('未知');
    });
  });

  describe('debounce', () => {
    it('应该正确防抖动', (done) => {
      let callCount = 0;
      const debouncedFn = debounce(() => {
        callCount++;
      }, 100);

      // 快速调用多次
      debouncedFn();
      debouncedFn();
      debouncedFn();

      // 应该还没有执行
      expect(callCount).toBe(0);

      // 等待防抖时间
      setTimeout(() => {
        expect(callCount).toBe(1);
        done();
      }, 150);
    });
  });

  describe('throttle', () => {
    it('应该正确节流', (done) => {
      let callCount = 0;
      const throttledFn = throttle(() => {
        callCount++;
      }, 100);

      // 快速调用多次
      throttledFn();
      throttledFn();
      throttledFn();

      // 应该只执行一次
      expect(callCount).toBe(1);

      // 等待节流时间
      setTimeout(() => {
        throttledFn();
        expect(callCount).toBe(2);
        done();
      }, 150);
    });
  });
});