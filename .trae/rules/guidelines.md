1. 核心上下文 (Core Context)
项目属性： 高奢 BJD (Ball-Jointed Doll) 品牌集成平台。

目标： 通过极致的光影交互，实现新手引导、视觉展示、硬核收藏三位一体。

原则： 所有的代码生成必须优先考虑“质感（Texture）”与“性能（Performance）”。

2. 设计系统规范 (Design Tokens)
强制 AI 在编写 CSS/Tailwind 时引用的常量：

色板 (Palette):

--color-surface: #FFFFFF (极简白)

--color-depth: #0A0A0A (深邃黑)

--color-shadow: rgba(0, 0, 0, 0.05) (呼吸感阴影)

--color-accent: #C0C0C0 (月光银，仅限线条或微小交互)

排版 (Typography):

Heading: serif (如 Playfair Display)，字间距 0.05em。

Body: sans-serif (如 Inter)，行高 1.6。

动效 (Motion):

Curve: cubic-bezier(0.4, 0, 0.2, 1) (标准的缓动曲线)。

Duration: 400ms (基础转场), 200ms (悬浮反馈)。

3. 技术架构准则 (Engineering Principles)
Next.js 15 模式： * 默认使用 Server Components，仅在有交互时使用 use client。

强制执行 Atomic Design (原子化设计) 目录结构。

TypeScript 类型安全： * 禁止使用 any。所有 API 响应和 Props 必须定义 interface 或 type。

娃娃（Doll）实体必须包含：id, series, resin_type, skin_tone, joints_data, photographs[]。

性能预算： * 图片必须使用 next/image 且预设 placeholder="blur"。

关键渲染路径（LCP）组件必须进行代码分割。

4. 领域逻辑约束 (Domain-Specific Logic)
多层次展示逻辑 (Multi-tier Logic):

Level 1 (Basic): 提供 InfoHover 组件，自动解析 BJD 专业术语（如“打磨”、“侧线”）。

Level 2 (Visual): 画廊组件必须支持 LightSimulator 属性，通过 CSS 滤镜或多层图片叠加模拟环境光。

Level 3 (Hardcore): 规格表必须包含 TechnicalSpecs 模块，显示力学参数（如重心偏移、关节极限角度）。

5. Trae AI 协作协议 (AI Interaction Protocol)
思考路径 (Chain of Thought): 在生成任何复杂组件前，AI 必须在注释中简述其“光影实现方案”和“响应式策略”。

代码注释： 关键交互逻辑必须附带 // @VALO-UX 注释，解释该动效如何增强品牌感。

错误处理： 所有数据请求必须包含自定义的 ErrorBoundary，展示符合品牌风格的错误态（Empty State / Error State）。

6. 目录结构规范 (File Tree)
Plaintext

/src
  /app           # Next.js App Router
  /components
    /atoms       # 按钮、标签、线条
    /molecules   # 搜索框、术语卡片
    /organisms   # 产品列表、光影实验室、导航栏
    /templates   # 页面骨架布局
  /hooks         # 自定义 React Hooks
  /lib           # 工具类、Supabase 配置
  /types         # 全局 TypeScript 接口
  /styles        # 全局变量、Tailwind 配置