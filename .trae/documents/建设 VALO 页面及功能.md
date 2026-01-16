# VALO 页面及功能建设方案

我将基于您提供的四个 Demo 文件，在 Next.js 项目中构建对应的页面和功能。

## 1. 环境配置与基础设施
- **图片域名配置**: 修改 `next.config.ts`，允许加载 `images.unsplash.com` 和 `i.pravatar.cc` 的图片资源。
- **字体与样式确认**: 确保全局 CSS 变量（`--font-serif`, `--font-sans` 等）在 Tailwind 中正确映射，以便快速开发。

## 2. 核心组件开发 (Components)
- **Sidebar (导航栏)**:
  - 提取公共导航逻辑，支持不同页面的变体（如 Home 的极简版 vs Archive 的功能版）。
  - 位置：`src/components/organisms/Sidebar.tsx`
- **UI 原子组件**:
  - 封装符合 VALO 风格的 Typography 组件（Serif 标题、Sans 正文）。
  - 定制 Button 变体（Atelier Black, Atelier Gold 风格）。

## 3. 页面开发 (Pages)
### 3.1 首页 (Home) - `src/app/page.tsx`
- **Hero Section**: 实现视差滚动效果的开屏大图。
- **Mastery Section**: 左侧固定标题，右侧滚动图片的布局。
- **Light Lab Teaser**: 黑色背景的光影实验室预告模块。
- **Footer**: 全局页脚。

### 3.2 档案页 (Archive) - `src/app/archive/page.tsx`
- **布局**: 实现左侧图片滚动、右侧信息面板固定的双栏布局。
- **功能**: 展示人偶详细参数、Faceup Simulator 入口卡片。

### 3.3 集合页 (Collective) - `src/app/collective/page.tsx`
- **Header**: 带有筛选器（Trending/Latest）的顶部栏。
- **Masonry Grid**: 使用 CSS Columns 实现响应式瀑布流布局，展示社区图片。

### 3.4 实验室 (Light Lab) - `src/app/lab/page.tsx`
- **布局**: 沉浸式黑色背景，左侧简化导航，右侧控制面板。
- **功能**:
  - 实现 Canvas 区域的模拟展示（Rotate/Pan/Zoom 按钮）。
  - 实现右侧控制面板（光源切换、色温滑块、直方图 UI）。
  - *注：Web 3D 渲染暂以静态 UI 模拟，预留接口。*

## 4. 路由结构
```text
src/app/
├── page.tsx (Home)
├── archive/
│   └── page.tsx
├── collective/
│   └── page.tsx
└── lab/
    └── page.tsx
```

我将按照上述顺序逐步实施。