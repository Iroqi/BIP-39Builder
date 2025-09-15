import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as bip39 from 'bip39';
import { SupportedLanguage, ValidationError } from '../types';

interface MnemonicStore {
  // 状态
  selectedWords: string[];
  generatedMnemonic: string;
  language: SupportedLanguage;
  wordList: string[];
  isValid: boolean;
  entropy: number;
  validationErrors: ValidationError[];
  isLoading: boolean;
  
  // 操作
  setWord: (index: number, word: string) => void;
  generateMnemonic: () => void;
  validateMnemonic: (mnemonic?: string) => boolean;
  setLanguage: (language: SupportedLanguage) => void;
  resetGenerator: () => void;
  randomizeWord: (index: number) => void;
  randomizeAllWords: () => void;
  calculateEntropy: () => number;
  
  // 内部方法
  loadWordList: (language: SupportedLanguage) => void;
  validateWordInDictionary: (word: string) => boolean;
  calculateChecksum: () => string;
}

export const useMnemonicStore = create<MnemonicStore>()(
  devtools(
    (set, get) => ({
      // 初始状态
      selectedWords: Array(11).fill(''),
      generatedMnemonic: '',
      language: 'english',
      wordList: [],
      isValid: false,
      entropy: 0,
      validationErrors: [],
      isLoading: false,

      // 设置指定位置的单词
      setWord: (index: number, word: string) => {
        if (index < 0 || index > 10) return;
        
        const state = get();
        const newSelectedWords = [...state.selectedWords];
        
        // 清理和标准化输入的词汇
        const cleanWord = word ? word.toString().trim().toLowerCase().normalize('NFC') : '';
        
        newSelectedWords[index] = cleanWord;
        
        set({ selectedWords: newSelectedWords });
        
        // 自动生成助记词
        get().generateMnemonic();
      },

      // 生成完整的助记词
      generateMnemonic: () => {
        const state = get();
        const { selectedWords, wordList } = state;
        
        // 检查前11个词是否都已选择且有效
        const validWords = selectedWords.filter(word => word && state.validateWordInDictionary(word));
        
        if (validWords.length !== 11) {
          set({ 
            generatedMnemonic: '',
            isValid: false,
            entropy: 0,
            validationErrors: [{ type: 'invalid_length', message: '请选择完整的11个单词' }]
          });
          return;
        }

        try {
          // 计算校验和并找到第12个词
          const checksumWord = state.calculateChecksum();
          
          if (!checksumWord) {
            set({
              generatedMnemonic: '',
              isValid: false,
              entropy: 0,
              validationErrors: [{ type: 'invalid_checksum', message: '无法计算有效的校验和词' }]
            });
            return;
          }
          
          const fullMnemonic = [...selectedWords, checksumWord].join(' ');
          
          // 验证生成的助记词
          const isValid = bip39.validateMnemonic(fullMnemonic);
          const entropy = isValid ? state.calculateEntropy() : 0;
          
          set({
            generatedMnemonic: fullMnemonic,
            isValid,
            entropy,
            validationErrors: isValid ? [] : [{ type: 'invalid_checksum', message: '校验和验证失败' }]
          });
        } catch (error) {
          set({
            generatedMnemonic: '',
            isValid: false,
            entropy: 0,
            validationErrors: [{ type: 'unknown', message: '生成助记词时发生错误' }]
          });
        }
      },

      // 验证助记词
      validateMnemonic: (mnemonic?: string) => {
        const targetMnemonic = mnemonic || get().generatedMnemonic;
        if (!targetMnemonic) return false;
        
        try {
          const isValid = bip39.validateMnemonic(targetMnemonic);
          set({ isValid });
          return isValid;
        } catch {
          set({ isValid: false });
          return false;
        }
      },

      // 设置语言
      setLanguage: (language: SupportedLanguage) => {
        set({ language, isLoading: true });
        get().loadWordList(language);
        get().resetGenerator();
        set({ isLoading: false });
      },

      // 重置生成器
      resetGenerator: () => {
        set({
          selectedWords: Array(11).fill(''),
          generatedMnemonic: '',
          isValid: false,
          entropy: 0,
          validationErrors: []
        });
      },

      // 随机化指定位置的单词
      randomizeWord: (index: number) => {
        if (index < 0 || index > 10) return;
        
        const { wordList } = get();
        if (wordList.length === 0) return;
        
        const randomIndex = Math.floor(Math.random() * wordList.length);
        const randomWord = wordList[randomIndex];
        
        get().setWord(index, randomWord);
      },

      // 随机化所有单词
      randomizeAllWords: () => {
        const { wordList } = get();
        if (wordList.length === 0) {
          return;
        }
        
        // 随机选择前11个词
        const newSelectedWords = [];
        for (let i = 0; i < 11; i++) {
          const randomIndex = Math.floor(Math.random() * wordList.length);
          newSelectedWords.push(wordList[randomIndex]);
        }
        
        // 一次性设置所有词汇，然后才触发生成
        set({ selectedWords: newSelectedWords });
        get().generateMnemonic();
      },

      // 计算熵值
      calculateEntropy: () => {
        const { generatedMnemonic } = get();
        if (!generatedMnemonic) return 0;
        
        // BIP39 12词助记词的熵值是128位
        return 128;
      },

      // 加载指定语言的词汇表
      loadWordList: (language: SupportedLanguage) => {
        try {
          const wordlist = bip39.wordlists[language as keyof typeof bip39.wordlists];
          if (wordlist) {
            set({ wordList: wordlist });
          } else {
            // 如果语言不支持，回退到英语
            set({ 
              wordList: bip39.wordlists.english,
              language: 'english'
            });
          }
        } catch (error) {
          // 错误情况下使用英语词汇表
          set({ 
            wordList: bip39.wordlists.english,
            language: 'english'
          });
        }
      },

      // 验证单词是否在词典中
      validateWordInDictionary: (word: string) => {
        const { wordList } = get();
        if (!word) return false;
        
        // 清理和标准化词汇
        const cleanWord = word.toString().trim().toLowerCase().normalize('NFC');
        return wordList.includes(cleanWord);
      },

      // 计算校验和
      calculateChecksum: () => {
        const state = get();
        const { selectedWords, wordList } = state;
        
        try {
          // 检查是否有空词汇
          const emptyCount = selectedWords.filter(w => !w || w.trim() === '').length;
          if (emptyCount > 0) {
            return '';
          }
          
          // 寻找第12个词
          for (let i = 0; i < wordList.length; i++) {
            const testWord = wordList[i];
            const testMnemonic = [...selectedWords, testWord].join(' ');
            const isValid = bip39.validateMnemonic(testMnemonic);
            
            if (isValid) {
              return testWord;
            }
          }
          
          return '';
        } catch (error) {
          console.error('计算校验和时出错:', error instanceof Error ? error.message : String(error));
          return '';
        }
      },
    }),
    {
      name: 'mnemonic-store',
    }
  )
);

// 初始化store
export const initializeStore = () => {
  const store = useMnemonicStore.getState();
  store.loadWordList('english');
};