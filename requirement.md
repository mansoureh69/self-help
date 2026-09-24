# Design System & Motion Architecture Specification
**Project:** BeliefCraft — Self-Development, Life Quality & Self-Belief Engine  
**Version:** 2.0 (Modern 21st.dev Aesthetic + Motion & GSAP Architecture)  
**Document:** `requirement.md`

---

## 1. Executive Summary & Design Vision

### 1.1 Objective
Transform BeliefCraft into an ultra-premium, tactile, and emotionally grounded self-development experience. By marrying **21st.dev** component aesthetics (sleek dark glassmorphism, refined bento grids, subtle luminous borders, micro-textured surfaces) with **Motion (Framer Motion v12)** and **GSAP (GreenSock)** motion choreography, the interface will evoke **calm authority, psychological safety, and empirical momentum**.

### 1.2 Core Design Tenets
1. **Empirical Elegance (Anti-Fluff):** Self-belief is cultivated by proof, not hollow platitudes. The UI reflects clarity, precision metrics, and clean typography.
2. **Tactile Micro-Physics (Motion & GSAP):** Every button press, card expansion, and checkmark provides sensory feedback through tuned spring physics and inertial easing.
3. **Calibrated Luminous Contrast (21st.dev Style):** Deep obsidian/slate foundations paired with restrained, warm amber/champagne highlights and restorative emerald vitality indicators.
4. **Focused Viewport Presence:** Uncluttered layouts, contextual drawer/modals, fluid responsive adaptations without cognitive overload.

---

## 2. Color Palette & Thematic Tokens

The palette is engineered to reduce cortisol, encourage deep reflection, and highlight cognitive breakthroughs.

### 2.1 Foundational Dark Tones (Obsidian & Mineral)
* **Surface Background (`--bg-canvas`):** `#08090A` (Deepest Void Charcoal)
* **Surface Layer 1 (`--bg-surface-subtle`):** `#0E1013` (Matte Obsidian)
* **Surface Layer 2 (`--bg-surface-elevated`):** `#15181E` (Graphite Slate)
* **Surface Layer 3 (`--bg-surface-highlight`):** `#1E232B` (Polished Mineral)
* **Border Subtle (`--border-subtle`):** `rgba(255, 255, 255, 0.07)`
* **Border Glow / Active (`--border-focus`):** `rgba(245, 158, 11, 0.35)`

### 2.2 Accent & Semantic Color System
| Token Name | Hex Code | Purpose & Semantic Role |
| :--- | :--- | :--- |
| **`champagne-gold`** | `#F6C177` | Primary belief anchor, key highlights, primary buttons |
| **`amber-glow`** | `#F59E0B` | Active streaks, energy, call-to-actions, flame icons |
| **`vitality-emerald`** | `#10B981` | Habit completions, evidence proofs, resilience indicators |
| **`calm-sage`** | `#34D399` | Guided somatic breathing, restorative progress |
| **`wisdom-indigo`** | `#6366F1` | AI Cognition, CBT analysis, thought reframing badges |
| **`clarity-sky`** | `#38BDF8` | Diagnostics, deep focus, metric charts |
| **`critic-rose`** | `#FB7185` | Identified cognitive distortions, alert boundaries |
| **`sand-muted`** | `#A8A29E` | Secondary captions, timestamps, structural labels |

### 2.3 Atmospheric Gradients & Glows (21st.dev Patterns)
```css
/* Ambient radial gradients for hero cards and active cards */
--glow-gold-radial: radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.15) 0%, transparent 70%);
--glow-emerald-radial: radial-gradient(circle at 100% 100%, rgba(16, 185, 129, 0.12) 0%, transparent 60%);
--glass-card-bg: linear-gradient(135deg, rgba(255, 255, 255, 0.035) 0%, rgba(255, 255, 255, 0.01) 100%);
--glass-card-border: 1px solid rgba(255, 255, 255, 0.08);
```

---

## 3. Typography Hierarchy

Utilizing **Outfit** for geometric, confident headings paired with **Plus Jakarta Sans** for high-legibility UI body and reflective coaching text.

* **Display 1 (Hero Numbers & Titles):** `Outfit`, 36px–48px / Weight 800 / Tracking -0.03em
* **H1 / Section Titles:** `Outfit`, 24px–28px / Weight 700 / Tracking -0.02em
* **H2 / Card Headers:** `Outfit`, 18px–20px / Weight 600 / Tracking -0.01em
* **Body Primary (Coaching Dialogue & Inputs):** `Plus Jakarta Sans`, 14px–15px / Weight 400 & 500 / Line Height 1.6
* **Micro-Data & Badges:** `Plus Jakarta Sans`, 11px–12px / Weight 600 / Uppercase / Tracking 0.05em
* **Monospace / Metric Tags:** `JetBrains Mono` or `ui-monospace`, 12px / Tabular numbers

---

## 4. Motion Architecture (Motion v12 & GSAP Choreography)

### 4.1 Orchestration Framework
* **Motion (formerly Framer Motion):** Handles stateful React animations, enter/exit transitions (`AnimatePresence`), gesture-driven layout springs, and interactive tab switches.
* **GSAP (GreenSock):** Handles complex SVG data visualizations (radar charts, dial gauges), timeline-based breathing cycles, staggered counter numbers, and smooth path morphing.

### 4.2 Standard Easing & Physics Specs
```ts
// Motion Physics Tokens
export const SPRING_GENTLE = { type: "spring", stiffness: 260, damping: 28 };
export const SPRING_BOUNCY = { type: "spring", stiffness: 420, damping: 22 };
export const SPRING_SNAPPY = { type: "spring", stiffness: 500, damping: 35 };

// GSAP Easing Constants
export const GSAP_EXPO_OUT = "power4.out";
export const GSAP_SMOOTH_INOUT = "power2.inOut";
export const GSAP_ELASTIC_OUT = "elastic.out(1, 0.75)";
```

### 4.3 Motion Component Recipes

#### A. 21st.dev Interactive Glow Card (Motion)
* **Hover:** Subtle 1px gradient shift along border; `translateY(-3px)` with soft `box-shadow: 0 16px 32px -8px rgba(0,0,0,0.5), 0 0 20px 2px rgba(245, 158, 11, 0.08)`.
* **Tap:** Scaled down to `0.985` with snappy damping.

#### B. Smooth Number Counter (GSAP Timeline)
* Metric counters (e.g., Life Quality index `56% -> 74%`, streak days, proof items) smoothly interpolate with GSAP `roundProps` rather than stepping abruptly.

#### C. Somatic 4-7-8 Breathing Guide (GSAP + SVG Morph)
* 3-phase circular expansion:
  * Inhale (4s): Linear stroke-dashoffset progression, scale to 1.3x with cyan-to-gold aura.
  * Hold (7s): Subtle organic harmonic pulse (`yoyo: true`).
  * Exhale (8s): Gentle deflation back to resting state with calming sage-emerald glow.

---

## 5. UI Component Blueprints (21st.dev Style)

### 5.1 Floating Dock / Command Navigation
* Frosted pill navigation bar with dynamic active pill background (`layoutId="active-nav-pill"`).
* Integrated quick-action trigger: `[Quick Reframe ⌘K]` and live streak flame.

### 5.2 Bento Grid Overview Dashboard
* **Cell A (Hero Trend Area):** Recharts Area visualization with custom glass cursor, luminous gradient underfill, and live sync badges.
* **Cell B (Daily Mindset Anchor):** Glassmorphic quote card with author signature and animated quote switcher.
* **Cell C (Cognitive Reframer Launchpad):** Minimalist dark terminal-inspired card with glow focus.
* **Cell D (Life Wheel Radar / Quick Sliders):** Compact multi-axis equilibrium scanner.

### 5.3 Multi-Turn AI Coaching Sanctuary (`CoachChat`)
* **Role Switcher Dock:** 4 interactive persona cards with dynamic status dots (Dr. Vance, Leo Brooks, Elena Chen, Marcus Ray).
* **Streaming Bubble Dynamics:** Smooth streaming text appearance with Markdown typography, code/quote formatting, and one-click **"Save to Proof Ledger"** micro-interaction with toast confirmation.
* **Fast Mode vs. Deep Mode Toggle:** Minimal tactile slider for `gemini-3.8-flash` vs `gemini-3.1-flash-lite`.

### 5.4 Cognitive Reframer Terminal (`CognitiveReframer`)
* Multi-stage accordion with smooth height animation (`AnimatePresence` + `layout`).
* Distortion tags (Imposter Syndrome, All-or-Nothing) rendered in pill badges with explanatory hover cards.
* Interactive 3-minute action checklist with confetti or haptic completion pulse.

### 5.5 Evidence Locker ("The Undeniable Proof Ledger")
* Tag-filtered masonry or modular 2-column bento layout.
* **Spontaneous Confidence Shot:** Modal with backdrop blur and gold spotlight revealing past capability proof.

---

## 6. Technical Stack & Implementation Requirements

### 6.1 Package Requirements
* `react`: `^19.0.1`
* `motion`: `^12.23.24` (already installed)
* `gsap`: to be added for complex timeline morphing & numeric interpolation (`npm install gsap`)
* `recharts`: `^2.15.x` (already installed)
* `lucide-react`: `^0.546.0` (already installed)
* `tailwindcss`: `^4.1.14` (with `@tailwindcss/vite`)

### 6.2 Code Architecture Standards
* **Modular Tokens File:** Create `src/styles/tokens.ts` containing all color values, easing curves, spring configs, and glow definitions.
* **Component Encapsulation:** Zero bloated single files; separate animated sub-components (e.g., `GlowCard`, `AnimatedCounter`, `BreathingCircle`, `BentoGrid`).
* **Hardware Acceleration:** All animated elements use `transform`, `opacity`, and `will-change: transform` to guarantee 60–120 FPS on all displays.
* **Accessibility (a11y):** Full keyboard navigation, `aria-expanded`, contrast ratios exceeding WCAG AA standards (minimum 4.5:1 for text), and `prefers-reduced-motion` compliance.

---

## 7. Migration & Rollout Plan

1. **Phase 1: Token & Tailwind Palette Foundation**
   * Configure CSS variables and tokens in `src/index.css` and `src/styles/tokens.ts`.
2. **Phase 2: Global Shell & Navigation Modernization**
   * Implement 21st.dev floating dock navigation with `layoutId` pill transitions.
3. **Phase 3: Dashboard Bento Grid & Animated Recharts**
   * Upgrade `OverviewHome` into a responsive bento grid; add animated entrance staggers and metric counter transitions.
4. **Phase 4: Component Refinement (Reframer, Evidence, Chat, Habits)**
   * Apply glassmorphic surface styles, glow borders, and GSAP/Motion micro-interactions.
5. **Phase 5: Verification & Performance Audit**
   * Run linter, compiler build checks, and ensure zero frame drops during chat streaming and chart rendering.
