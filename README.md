# BIP39 Mnemonic Generator | BIP39 助记词生成器

[English](#english) | [中文](#中文)

---

## English

A BIP39 mnemonic generation tool that allows users to customize the first 11 words. This tool can automatically calculate and generate a complete 12-word mnemonic that complies with the BIP39 standard based on the first 11 words selected by the user.

### Features

- ✅ **Customize First 11 Words**: Allow users to choose personalized first 11 mnemonic words
- ✅ **Automatic Checksum Calculation**: System automatically calculates the 12th checksum word that complies with BIP39 standard
- ✅ **Multi-language Support**: Support English, Simplified Chinese, Traditional Chinese, French, Italian, Japanese, Korean, Spanish
- ✅ **Real-time Validation**: Real-time validation of mnemonic validity and strength
- ✅ **Security Assessment**: Provide mnemonic strength scoring and security recommendations
- ✅ **Modern UI**: Responsive user interface built with Ant Design
- ✅ **Copy Function**: One-click copy of generated mnemonic
- ✅ **Complete Test Coverage**: Including unit tests and integration tests

### Tech Stack

- **Frontend Framework**: React 18 + TypeScript
- **UI Component Library**: Ant Design 5.x
- **State Management**: Zustand
- **Styling**: Tailwind CSS + Ant Design
- **Build Tool**: Vite
- **Testing Framework**: Vitest + Testing Library
- **Core Libraries**: bip39, crypto-js, buffer

### Quick Start

#### Requirements

- Node.js 16+
- npm or yarn

#### Installation & Running

```bash
# Clone the project
git clone <repository-url>
cd bip-39

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

#### Access Application

After the development server starts, visit `http://localhost:5173` in your browser.

### Usage Guide

#### Basic Operations

1. **Select Language**: Choose your preferred language in the top-right corner (default English)
2. **Select Words**: Choose or input your desired mnemonic words in the 11 input boxes
   - Supports auto-completion and search functionality
   - Only words from the BIP39 standard dictionary can be selected
3. **View Results**: System automatically calculates the 12th checksum word and displays the complete mnemonic
4. **Validation & Assessment**: Check the validation status and security strength score of the mnemonic
5. **Copy & Save**: Use the copy button to securely save your mnemonic

#### Quick Operations

- **Random All**: Quickly generate 11 random words
- **Random Word**: Click the refresh button next to each input box to randomly select a single word
- **Reset**: Clear all selections and start over
- **Hide/Show**: Toggle mnemonic visibility for enhanced security

### Security Notice

⚠️ **Important Warning**:
- Custom mnemonics may reduce security
- Recommended use only when you fully understand the risks
- For actual use, it's recommended to use completely randomly generated mnemonics

🔒 **Security Recommendations**:
- Please use this tool in a secure environment
- Do not generate mnemonics in public places or insecure network environments
- Keep your mnemonic safe and do not share it with others
- It's recommended to write the mnemonic on paper and store it in a safe place
- Do not store digital copies of mnemonics on networked devices

### Project Structure

```
src/
├── components/          # React components
│   ├── WordSelector.tsx        # Word selector
│   ├── MnemonicDisplay.tsx     # Mnemonic display
│   ├── ValidationPanel.tsx     # Validation panel
│   ├── LanguageSelector.tsx    # Language selector
│   ├── MnemonicGenerator.tsx   # Main generator component
│   └── index.ts               # Component exports
├── store/              # Zustand state management
│   └── index.ts
├── types/              # TypeScript type definitions
│   ├── global.d.ts            # Global type declarations
│   └── index.ts
├── utils/              # Utility functions and core algorithms
│   ├── mnemonicGenerator.ts    # BIP39 core algorithm
│   └── index.ts
├── test/               # Test configuration
│   └── setup.ts
├── __tests__/          # Test files
│   ├── mnemonicGenerator.test.ts
│   └── utils.test.ts
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

### API Documentation

#### MnemonicGenerator Class

Core BIP39 mnemonic generator class.

```typescript
class MnemonicGenerator {
  // Generate complete mnemonic from first 11 words
  generateFromPrefix(selectedWords: string[]): string
  
  // Calculate checksum
  calculateChecksum(words: string[]): string
  
  // Validate mnemonic
  validateMnemonic(mnemonic: string): boolean
  
  // Calculate strength score
  calculateStrengthScore(mnemonic: string): number
  
  // More methods...
}
```

#### Zustand Store

Application state management.

```typescript
interface MnemonicStore {
  selectedWords: string[];
  generatedMnemonic: string;
  language: SupportedLanguage;
  isValid: boolean;
  // More states and operations...
}
```

### Testing

The project includes complete test coverage:

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

Tests include:
- BIP39 core algorithm tests
- Utility function tests
- Component unit tests
- Integration tests

### Technical Implementation

#### BIP39 Standard Implementation

The project strictly follows the [BIP39 standard](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki):

1. **Dictionary**: Uses standard 2048-word BIP39 dictionary
2. **Entropy**: 128-bit entropy corresponds to 12-word mnemonic
3. **Checksum**: Checksum calculated via SHA256 hash
4. **Validation**: Complete mnemonic validation process

#### Core Algorithm

```typescript
// Checksum calculation process
1. Convert first 11 words to 11-bit binary representation
2. Concatenate into 121-bit binary string
3. Use trial method to find the 12th word that makes the entire mnemonic valid
4. Verify final mnemonic complies with BIP39 standard
```

### Browser Compatibility

- Chrome 88+
- Firefox 78+
- Safari 14+
- Edge 88+

### Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Create a Pull Request

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Disclaimer

This tool is for educational and research purposes only. Use mnemonics generated by this tool for actual cryptocurrency wallets at your own risk. The developers are not responsible for any losses caused by using this tool.

### Contact Us

For questions or suggestions, please submit an [Issue](../../issues) or contact the development team.

---

**Remember**: Mnemonic phrases are the only credential to access your cryptocurrency assets, please keep them safe!

---

## 中文

一个允许用户自定义前11个单词的BIP39助记词生成工具。该工具能够根据用户选择的前11个单词，自动计算并生成符合BIP39标准的完整12词助记词。

## 功能特点

- ✅ **自定义前11个词**: 允许用户选择个性化的前11个助记词
- ✅ **自动校验和计算**: 系统自动计算符合BIP39标准的第12个校验词
- ✅ **多语言支持**: 支持英语、中文简体、中文繁体、法语、意大利语、日语、韩语、西班牙语
- ✅ **实时验证**: 实时验证助记词的有效性和强度
- ✅ **安全性评估**: 提供助记词强度评分和安全建议
- ✅ **现代化UI**: 使用Ant Design构建的响应式用户界面
- ✅ **复制功能**: 一键复制生成的助记词
- ✅ **完整测试覆盖**: 包含单元测试和集成测试

## 技术栈

- **前端框架**: React 18 + TypeScript
- **UI组件库**: Ant Design 5.x
- **状态管理**: Zustand
- **样式**: Tailwind CSS + Ant Design
- **构建工具**: Vite
- **测试框架**: Vitest + Testing Library
- **核心库**: bip39, crypto-js, buffer

## 快速开始

### 环境要求

- Node.js 16+ 
- npm 或 yarn

### 安装与运行

```bash
# 克隆项目
git clone <repository-url>
cd bip-39

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 运行测试
npm test

# 构建生产版本
npm run build
```

### 访问应用

开发服务器启动后，在浏览器中访问 `http://localhost:5173`

## 使用指南

### 基本操作

1. **选择语言**: 在右上角选择您偏好的语言（默认英语）
2. **选择词汇**: 在11个输入框中选择或输入您想要的助记词
   - 支持自动完成和搜索功能
   - 只能选择BIP39标准词典中的词汇
3. **查看结果**: 系统自动计算第12个校验词并显示完整助记词
4. **验证与评估**: 查看助记词的验证状态和安全强度评分
5. **复制保存**: 使用复制按钮安全保存您的助记词

### 快速操作

- **全部随机**: 快速生成11个随机词汇
- **单词随机**: 点击每个输入框旁的刷新按钮随机选择单个词汇
- **重置**: 清除所有选择重新开始
- **隐藏/显示**: 切换助记词的可见性以提高安全性

## 安全提示

⚠️ **重要警告**: 
- 自定义助记词可能降低安全性
- 建议仅在完全理解风险的情况下使用
- 对于实际使用，推荐使用完全随机生成的助记词

🔒 **安全建议**:
- 请在安全的环境中使用本工具
- 不要在公共场所或不安全的网络环境中生成助记词
- 妥善保管您的助记词，不要与他人分享
- 建议将助记词写在纸上并存放在安全的地方
- 不要在联网的设备上存储助记词的数字副本

## 项目结构

```
src/
├── components/          # React组件
│   ├── WordSelector.tsx        # 词汇选择器
│   ├── MnemonicDisplay.tsx     # 助记词显示
│   ├── ValidationPanel.tsx     # 验证面板
│   ├── LanguageSelector.tsx    # 语言选择器
│   ├── MnemonicGenerator.tsx   # 主生成器组件
│   └── index.ts               # 组件导出
├── store/              # Zustand状态管理
│   └── index.ts
├── types/              # TypeScript类型定义
│   ├── global.d.ts            # 全局类型声明
│   └── index.ts
├── utils/              # 工具函数和核心算法
│   ├── mnemonicGenerator.ts    # BIP39核心算法
│   └── index.ts
├── test/               # 测试配置
│   └── setup.ts
├── __tests__/          # 测试文件
│   ├── mnemonicGenerator.test.ts
│   └── utils.test.ts
├── App.tsx             # 主应用组件
├── main.tsx            # 应用入口
└── index.css           # 全局样式
```

## API 文档

### MnemonicGenerator 类

核心的BIP39助记词生成器类。

```typescript
class MnemonicGenerator {
  // 根据前11个词生成完整助记词
  generateFromPrefix(selectedWords: string[]): string
  
  // 计算校验和
  calculateChecksum(words: string[]): string
  
  // 验证助记词
  validateMnemonic(mnemonic: string): boolean
  
  // 计算强度评分
  calculateStrengthScore(mnemonic: string): number
  
  // 更多方法...
}
```

### Zustand Store

应用状态管理。

```typescript
interface MnemonicStore {
  selectedWords: string[];
  generatedMnemonic: string;
  language: SupportedLanguage;
  isValid: boolean;
  // 更多状态和操作...
}
```

## 测试

项目包含完整的测试覆盖：

```bash
# 运行所有测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 监听模式运行测试
npm run test:watch
```

测试包括：
- BIP39核心算法测试
- 工具函数测试
- 组件单元测试
- 集成测试

## 技术实现

### BIP39标准实现

项目严格遵循[BIP39标准](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)：

1. **词典**: 使用标准2048词BIP39词典
2. **熵值**: 128位熵对应12个词的助记词
3. **校验和**: 通过SHA256哈希计算校验和
4. **验证**: 完整的助记词验证流程

### 核心算法

```typescript
// 校验和计算流程
1. 将前11个词转换为11位二进制表示
2. 连接成121位的二进制字符串
3. 通过试探法找到使整个助记词有效的第12个词
4. 验证最终助记词符合BIP39标准
```

## 浏览器兼容性

- Chrome 88+
- Firefox 78+
- Safari 14+
- Edge 88+

## 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 免责声明

本工具仅用于教育和研究目的。使用本工具生成的助记词用于实际加密货币钱包需自行承担风险。开发者不对因使用本工具而造成的任何损失负责。

## 联系我们

如有问题或建议，请提交 [Issue](../../issues) 或联系开发团队。

---

**记住**: 助记词是访问您加密货币资产的唯一凭证，请务必安全保管！