---
alwaysApply: false
---
# VALO Project Guidelines: The Modern Atelier Standards (v3.0)

## 1. 核心设计哲学 (Design Philosophy)
* **Whitespace is Luxury (留白即奢华):** * 严禁使用紧凑的默认间距。所有 Section 的垂直间距最小为 `py-24` (96px)，核心叙事区域建议 `py-32` 或更大。
    * 留白不是空间的浪费，而是视线的特权。
* **Serif for Soul, Sans for Science (灵魂衬线，科学无衬线):** * **情感表达 (标题/引言)**：强制使用 `Cormorant Garamond`。字重偏轻 (Light/Regular)，行高紧凑 (0.9-1.1)，用于营造史诗感。
    * **功能信息 (标签/参数/导航)**：强制使用 `Montserrat`。必须为 **全大写 (UPPERCASE)**，字间距 **`tracking-widest` (0.2em)**，字号极小 (text-xs)，打造博物馆标签般的精密感。
* **Motion as Material (动效即材质):** * 动效不应是简单的“飞入”，而应是“显影”。使用 `opacity` 和 `blur` 的混合过渡，模拟胶片冲洗或呼吸的过程。

## 2. 布局与网格 (Layout & Grid)
* **Broken Grid (打破网格):** * **严禁**使用死板的等分网格（如 `grid-cols-3`）。
    * **Archive 页面**：必须使用 **Offset Layout (错位布局)**。图片与文字说明左右交替错位，创造视觉节奏感。
    * **Collective 页面**：必须使用 **Masonry (瀑布流)**（CSS `column-count`），允许图片保持原始长宽比，还原摄影展效果。
* **Sticky Narrative (粘性叙事):** * 长内容的左侧描述必须使用 `sticky top-0`，让其在用户滚动浏览右侧图片流时始终保持可见，实现“画外音”般的陪伴感。

## 3. Light Lab 特别规范 (The Digital Twin)
* **从滤镜升级为孪生:** 放弃基于 CSS 滤镜的 2D 模拟。Light Lab 必须定义为 **WebGL 3D 交互场**。
* **技术栈:** 强制使用 `react-three-fiber` (R3F) + `drei`。
* **核心价值:** * **3D 检视:** 加载 `.glb` 模型，支持 360° 旋转与缩放，查看关节结构（S钩、拉筋）。
    * **物理材质 (PBR):** 材质必须开启 `transmission` 和 `thickness` 属性，模拟树脂（Resin）的 **SSS (次表面散射)** 效果，展示光线穿透材质的红润感。
    * **光影联动:** 右侧面板的滑块必须直接控制 3D 场景中的物理灯光 (`SpotLight`, `Environment`)，而非 2D 图片滤镜。

## 4. 组件级规范 (Component Standards)
* **Buttons (按钮):** * **Style:** 严禁使用实心圆角按钮（App 风格）。仅允许 **"Underline"** (文字加下划线) 或 **"Outline"** (极细 1px 边框) 风格。
    * **Interaction:** Hover 时，背景色不要突变。应通过文字颜色反转或下划线从左至右生长来实现微交互。
* **Cards (卡片):**
    * **No Borders:** 移除所有显眼的 `border` 和 `shadow`。内容应自然“悬浮”在背景上。
    * **Reveal (揭示):** 所有的元数据（价格、型号、作者）默认**隐藏**，仅在 Hover 时伴随背景模糊 (`backdrop-blur-sm`) 优雅浮现。

## 5. 技术架构与代码质量 (Engineering)
* **Atomic Design:** 严格执行原子化目录结构 (`atoms`, `molecules`, `organisms`)。
* **Tailwind CSS:** * 禁止使用魔法数值 (如 `w-[123px]`)。
    * 颜色必须引用设计系统变量（如 `bg-atelier-bg`, `text-atelier-black`）。
* **TypeScript:** 所有数据接口（如 `Doll`, `LightConfig`）必须在 `src/types` 中严格定义，禁止 `any`。

## 6. 设计系统常量 (Design Tokens Refined)
* **Colors:**
    * `--color-bg`: `#F7F5F2` (Alabaster / 纸张白) - **全站默认背景**
    * `--color-text`: `#1A1918` (Charcoal / 炭黑) - **主要文字**
    * `--color-gold`: `#A67C52` (Antique Gold / 古铜金) - **高亮与强调**
* **Fonts:**
    * `font-serif`: 'Cormorant Garamond', serif
    * `font-sans`: 'Montserrat', sans-serif

## 7. Trae AI 协作协议
* **自我检视:** 在生成界面代码前，AI 必须先自问：“这段布局是否太拥挤？这个标题是否太普通？” 如果是，请自动增加间距 (`py-32`)、加重字体对比。
* **错误处理:** 所有 3D 场景必须包含 `<Suspense>` 和优雅的 Loading 状态（如呼吸的 Logo），避免黑屏。