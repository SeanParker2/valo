I will completely refactor `src/app/lab/page.tsx` to transform the Light Lab into a professional Creative Suite tool, following your four-phase requirement.

### **Phase 1: Immersive Layout Implementation**
- **Structure**: Create a full-screen (`h-screen`, `overflow-hidden`) layout with three distinct sections:
  1.  **Left Toolbar (72px)**: Fixed width, dark background (`#0f0f0f`).
      -   Icons: Layout, Sun (active state with glow), Camera, Settings.
      -   Bottom: User Profile placeholder.
  2.  **Main Viewport (Flex)**: Elastic center area.
      -   **Top Bar**: "Light Lab BETA 0.9" text + Animated Green "RENDER_ENGINE_READY" indicator.
      -   **Floating Controls**: Bottom centered group (ROTATE, PAN, ZOOM) with `backdrop-blur-xl`.
  3.  **Right Control Panel (420px)**: Fixed width, background `#141414`, 1px border separator.

### **Phase 2: Component Engineering**
- **Light Source Cards**: 
  -   Grid layout for 4 sources: Natural Daylight, Studio Flash, Moonlight, Candle Warmth.
  -   **Active State**: Gold border (`#C69C6D`) + Indicator dot for "Studio Flash".
  -   **Hover Effect**: Subtle brightness increase.
- **Color Temp Slider**:
  -   Custom range input with gradient background (Orange → Blue).
  -   **Typography**: JetBrains Mono for values.
  -   **Thumb**: Custom styled pure white thumb.

### **Phase 3: State & Feedback Logic**
- **State Management**:
  -   `activeLight`: To toggle card selection.
  -   `colorTemp`: To drive slider and image filters.
  -   `isRendering`: To handle the render button animation.
- **Visual Feedback**:
  -   **Image Filters**: Dynamic CSS `filter` styles (brightness, sepia, hue-rotate) applied to the central model image based on selected light and temperature.
  -   **Render Button**: "RENDER HIGH-RES PREVIEW" button will show a loading/progress animation state when clicked.

### **Phase 4: Visual Polishing**
- **Texture**: Add a fixed `pointer-events-none` overlay with SVG noise at 3% opacity.
- **Typography**:
  -   Headings: `font-serif` (Cormorant Garamond).
  -   Data/Values: `font-mono` (JetBrains Mono).
  -   UI/Labels: `font-sans` (Montserrat).
- **Responsive**: Ensure the layout remains usable on smaller desktop screens (flex center viewport shrinks, panels stay fixed).

I will implement all changes directly in `src/app/lab/page.tsx`.