# 重塑 VALO 视觉与交互体验计划

我们将分三步对项目进行深度视觉打磨，采用“现代工坊”设计语言。

## 第一步：全局视觉基调重塑 (CSS & Tailwind v4)

由于项目使用 Tailwind CSS v4，我们将直接在 CSS 文件中定义设计变量，而非 `tailwind.config.ts`。

1. **修改** **`src/app/globals.css`**：

   * **色板更新**：

     * 背景色：`#FFFFFF` -> `#F7F5F2` (Alabaster)

     * 文字色：`#0A0A0A` -> `#1A1918` (Charcoal)

   * **排版系统**：

     * 确认 `Cormorant Garamond` (Serif) 和 `Montserrat` (Sans) 的引入。

     * 在 `@theme` 或 `@layer base` 中定义全局排版规则：

       * `h1`, `h2`: 应用 Serif, light/regular weight, leading-tight (0.9-1.1)。

       * UI 文本 (nav, buttons): 应用 Sans, tracking-widest, uppercase, text-xs/sm。

## 第二步：首页 (Home) 深度打磨

重构 `src/app/page.tsx` 以增强叙事感。

1. **Hero Section (开篇)**：

   * **排版**：H1 字号提升至 `text-8xl` (Desktop)，行高 `leading-[0.85]`。

   * **动效**：使用 Framer Motion 实现文字上浮 (`y: 20 -> 0`, `opacity: 0 -> 1`)，延迟 0.2s。
2. **Sticky Scroll (特征介绍)**：

   * 重构 "Features" 区域。

   * **布局**：左侧文字 (`position: sticky`)，右侧图片列表。

   * **交互**：利用 `framer-motion` 或 `IntersectionObserver` 监听滚动，当文字对应区块到达时，右侧图片进行淡入淡出 (`opacity`) 或视差切换。

## 第二步：档案页 (Archive) 艺术化重构

重构 `src/app/archive/page.tsx` 为沉浸式画廊。

1. **Masonry 瀑布流**：

   * 替换 Grid 布局，使用 Tailwind Columns (`columns-1 md:columns-2 lg:columns-3`) 加上 `gap-8` 或 `gap-12`。

   * 确保图片容器 `break-inside-avoid` 以防止断裂。
2. **沉浸式卡片 (Interaction)**：

   * 移除所有边框和阴影。

   * **悬停效果**：

     * 图片：`scale-105` (缓动)。

     * 元数据：从底部浮现，背景叠加 `backdrop-blur-sm`。
3. **药丸形筛选器**：

   * 更新筛选栏按钮样式：`rounded-full`。

   * 状态样式：

     * Active: `bg-[#1A1918] text-[#F7F5F2]`。

     * Inactive: `bg-transparent border border-[#1A1918]/20`。

