# VALO Project Initialization Plan

I will initialize the VALO project in the current directory (`/Users/seanparker/Documents/valo`) following your specifications. Since the directory contains existing files (`demo/`, `.trae/`), I will generate the project files safely and merge them.

## 1. Project Initialization
- Create a Next.js 15 application using `create-next-app` in a temporary directory to avoid conflicts.
- Configuration:
  - TypeScript: **Yes**
  - Tailwind CSS: **Yes**
  - ESLint: **Yes**
  - App Router: **Yes**
  - Src Directory: **Yes** (`/src`)
  - Import Alias: `@/*`
- Move generated files to the project root.

## 2. Dependency Installation
- Install core dependencies: `framer-motion@10.16.4`, `lucide-react@0.294.0`.
- Install utilities: `clsx@2.0.0`, `tailwind-merge@2.0.0`.
- Ensure all peer dependencies are resolved.

## 3. shadcn/ui Integration
- Initialize `shadcn-ui` with default settings suitable for the project structure.
- Install requested components:
  - `button`
  - `scroll-area`
  - `card`
  - `separator`

## 4. Visual Style Configuration
- **Tailwind Configuration (`tailwind.config.ts`)**:
  - Add Font Families:
    - Serif: "Cormorant Garamond"
    - Sans: "Montserrat"
  - Extend Color Palette (extracted from demos):
    - Backgrounds: `#F7F5F2` (Paper), `#0a0a0a` (Lab)
    - Accents: `#A67C52` (Atelier Gold), `#C69C6D` (Valo Gold)
    - Text: `#1a1918` (Atelier Black)
- **Global Styles (`globals.css`)**:
  - Set default background to `#F7F5F2` (Paper).
  - Configure font definitions (import from Google Fonts).

## 5. Project Structure Setup
- Create Atomic Design directory structure under `src/components`:
  - `atoms/`
  - `molecules/`
  - `organisms/`

## 6. Verification
- Verify successful installation and configuration by running a build check.
