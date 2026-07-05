# Runner Landing Page & Showcase (`lp-space`)

Welcome to **Runner**, an interactive e-commerce showcase and customization platform built using **React 19**, **Vite 8**, **Tailwind CSS v4**, and **GSAP**.

This project provides an immersive web experience for browsing premium footwear (such as the Yeezy Foam RNNR Ararat) and customizing high-performance fins.

---

## 🚀 Technologies & Architecture

This project is built using modern front-end technologies:

### ⚡ Core & Build System
*   **[React 19.2](https://react.dev/)**: Powered by the new **React Compiler** (enabled via Babel & Rolldown) for automated memoization.
*   **[Vite 8.1](https://vite.dev/)**: Fast, next-generation build tool configured with `@tailwindcss/vite` and `@rolldown/plugin-babel`.
*   **[TypeScript 6.0](https://www.typescriptlang.org/)**: Ensures type safety across all components and state management.

### 🎨 Styling & Typography
*   **[Tailwind CSS v4.0](https://tailwindcss.com/)**: Leverages the new CSS-first configuration. Customized themes and typography are defined directly within the global CSS.
*   **Theme Colors**:
    *   `ivory` (`#F5F2EC`) - Background color
    *   `black-main` (`#111111`) - Core typography and contrast elements
    *   `gray-sec` (`#8B8B8B`) - Secondary texts
    *   `border-main` (`#DDD7CF`) - Structural borders
    *   `card-bg` (`#F8F6F2`) - Highlight card backgrounds
*   **Typography**:
    *   Sans-serif: *Plus Jakarta Sans*
    *   Display: *Audiowide* (for headers and futuristic accents)

### ✨ Animations & Interactions
*   **[GSAP 3.15](https://greensock.com/gsap/) & [@gsap/react](https://greensock.com/react/)**: Used to create seamless custom page transitions (curtain slides), reveal entrance animations, and floating interactive pill elements.

---

## 📂 Project Structure

The project follows a clean directory structure with atomic design components:

```
lp-space/
├── public/
├── src/
│   ├── assets/             # Images, SVGs, and static assets
│   ├── components/         # Atomic design system components
│   │   ├── atoms/          # Basic building blocks (Button, Input, Select, etc.)
│   │   ├── molecules/      # Composite elements (FormField, FinSelectorButton, etc.)
│   │   ├── organisms/      # Complex sections (Navbar, Footer, ContactForm, etc.)
│   │   └── templates/      # Layout structures (PageLayout)
│   ├── context/            # Global state (CartContext for cart management)
│   ├── hooks/              # Custom GSAP hooks (useFloatingPills, usePageEntrance)
│   ├── pages/              # Route views (Home, Product, Fins, About, Contact)
│   ├── types/              # TypeScript type definitions (index.ts)
│   ├── App.tsx             # Main router and page transition controller
│   ├── index.css           # Tailwind v4 configuration, font imports, and base rules
│   └── main.tsx            # Application entry point
├── eslint.config.js        # ESLint flat configuration
├── tsconfig.json           # TS config files (app & node targets)
└── vite.config.ts          # Vite bundler configuration
```

---

## 🛠️ Getting Started

Follow these steps to run the project locally.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Runs the Vite dev server locally. |
| `npm run build` | Compiles TypeScript and builds the application for production using Vite. |
| `npm run preview` | Runs the built bundle locally for previewing production builds. |
| `npm run lint` | Runs ESLint to find and fix code style issues. |

---

## ⚙️ Configuration Details

### React Compiler
The new React Compiler is fully configured inside `vite.config.ts` using Babel preset compilation:
```typescript
babel({ presets: [reactCompilerPreset()] })
```
This reduces the necessity of manual hooks like `useMemo` and `useCallback` by pre-compiling component updates.

### Tailwind CSS v4.0
Configured directly in `src/index.css` under the `@theme` directive, removing the need for a separate config file:
```css
@import "tailwindcss";

@theme {
  --font-sans: "Plus Jakarta Sans", sans-serif;
  --font-display: "Audiowide", sans-serif;
  --color-ivory: #F5F2EC;
  --color-black-main: #111111;
  --color-gray-sec: #8B8B8B;
  --color-border-main: #DDD7CF;
  --color-card-bg: #F8F6F2;
}
```
