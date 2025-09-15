export { MnemonicGenerator } from './mnemonicGenerator';

/**
 * 复制文本到剪贴板
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  } catch {
    return false;
  }
};

/**
 * 防抖函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

/**
 * 节流函数
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * 格式化助记词显示
 */
export const formatMnemonic = (mnemonic: string): string[] => {
  return mnemonic.trim().split(/\s+/).filter(word => word.length > 0);
};

/**
 * 生成随机索引
 */
export const getRandomIndex = (max: number): number => {
  return Math.floor(Math.random() * max);
};

/**
 * 验证是否为有效的助记词格式
 */
export const isValidMnemonicFormat = (text: string): boolean => {
  const words = formatMnemonic(text);
  return words.length === 12 && words.every(word => /^[a-zA-Z]+$/.test(word));
};

/**
 * 安全地解析JSON
 */
export const safeJsonParse = <T>(json: string, defaultValue: T): T => {
  try {
    return JSON.parse(json) || defaultValue;
  } catch {
    return defaultValue;
  }
};

/**
 * 获取强度颜色
 */
export const getStrengthColor = (strength: string): string => {
  switch (strength) {
    case 'very_strong': return '#52c41a'; // green
    case 'strong': return '#73d13d'; // light green
    case 'good': return '#faad14'; // yellow
    case 'fair': return '#fa8c16'; // orange
    case 'weak': return '#f5222d'; // red
    default: return '#d9d9d9'; // gray
  }
};

/**
 * 获取强度文本
 */
export const getStrengthText = (strength: string): string => {
  switch (strength) {
    case 'very_strong': return '非常强';
    case 'strong': return '强';
    case 'good': return '良好';
    case 'fair': return '一般';
    case 'weak': return '弱';
    default: return '未知';
  }
};