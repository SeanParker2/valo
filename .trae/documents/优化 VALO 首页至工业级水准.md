# VALO 首页“精装修”优化方案

我将严格按照您的三个阶段要求，结合 `.project_rules.md` 中的规范（尤其是关于质感和性能的部分），对 VALO 首页进行全方位升级。

## 阶段一：全局排版与韵律微调 (Global Typography & Rhythm)
**目标**：提升阅读质感，建立严谨的视觉韵律。

1.  **字体加重 (Weight Calibration)**:
    -   所有 `p` 标签：`font-normal` (400) -> `font-medium` (500)。
    -   导航/小标签：`font-medium` (500) -> `font-semibold` (600)。
2.  **垂直韵律 (Vertical Rhythm)**:
    -   重构所有 Section 的间距，使用 `mb-8`, `mb-12`, `mb-20`, `py-24`, `py-40` 等符合斐波那契数列的 Tailwind 类。
3.  **色彩层次 (Color Hierarchy)**:
    -   深色文字统一替换为 `text-atelier-black` (#1a1918)。
    -   次要信息统一替换为 `text-gray-600`。

## 阶段二：组件级深度打磨 (Component Polish)
**目标**：增强组件的交互反馈和精致度。

1.  **Sidebar Nav**:
    -   Logo: `tracking-widest` -> `tracking-wider` (微调)，保持雕塑感。
    -   Links: 添加 `hover:text-atelier-gold` 和 Framer Motion 下划线动效。
2.  **Hero Section**:
    -   H1: `leading-[0.9]` -> `leading-[0.85]`，增加紧凑感。
    -   Button: 添加 `shadow-lg shadow-atelier-black/20`，Hover 态上浮 + 阴影加深 + 变色。
3.  **Sticky Section**:
    -   左侧目录：Active 状态添加左侧 `atelier-gold` 竖线 + 文字放大加粗。
    -   右侧卡片：描述框改为半悬浮玻璃态 (`backdrop-blur-md`, `shadow-xl`, `border-white/20`)。
4.  **Dark Section (Light Lab)**:
    -   对比度：增强金色/白色标题对比度。
    -   UI 细节：为旋钮/进度条添加内发光 (`shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]`) 和细边框。

## 阶段三：交互与动效注入 (Interaction & Motion)
**目标**：赋予页面生命力。

1.  **平滑滚动**: 检查是否需要引入 Lenis（Next.js 13+ App Router 可尝试原生 css `scroll-behavior: smooth` 或轻量级方案，考虑到性能原则，优先使用 CSS 或轻量级库）。*注：为保证极致体验，我会集成 Lenis。*
2.  **视差滚动 (Parallax)**:
    -   在 Sticky Section 的图片中使用 `framer-motion` 的 `useScroll` 和 `useTransform` 实现真实的视差位移。
3.  **入场动画 (Entrance)**:
    -   Hero 区文字/图片添加 `initial={{ y: 20, opacity: 0 }}` `animate={{ y: 0, opacity: 1 }}`。

## 执行计划
我将直接编辑 `src/components/organisms/Sidebar.tsx` 和 `src/app/page.tsx`，并可能创建新的 Atom 组件（如 `AnimatedLink`, `ParallaxImage`）以保持代码整洁。

准备开始执行。