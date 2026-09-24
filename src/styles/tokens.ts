/**
 * 21st.dev Design System Tokens & Motion Physics
 */

export const COLORS = {
  // Canvas & Surfaces
  canvas: '#08090A',
  surfaceSubtle: '#0E1013',
  surfaceElevated: '#15181E',
  surfaceHighlight: '#1E232B',
  surfaceGlass: 'rgba(21, 24, 30, 0.75)',

  // Borders
  borderSubtle: 'rgba(255, 255, 255, 0.08)',
  borderLight: 'rgba(255, 255, 255, 0.14)',
  borderGold: 'rgba(245, 158, 11, 0.35)',
  borderEmerald: 'rgba(16, 185, 129, 0.35)',

  // Accents & Semantics
  gold: {
    champagne: '#F6C177',
    primary: '#F59E0B',
    glow: 'rgba(245, 158, 11, 0.25)',
  },
  emerald: {
    vitality: '#10B981',
    glow: 'rgba(16, 185, 129, 0.25)',
  },
  indigo: {
    wisdom: '#6366F1',
    glow: 'rgba(99, 102, 241, 0.25)',
  },
  sky: {
    clarity: '#38BDF8',
    glow: 'rgba(56, 189, 248, 0.25)',
  },
  rose: {
    critic: '#FB7185',
    glow: 'rgba(251, 113, 133, 0.25)',
  },
  text: {
    primary: '#F8FAFC',
    secondary: '#94A3B8',
    muted: '#64748B',
    faint: '#475569',
  },
};

// Motion (Framer Motion v12) Spring Curves
export const SPRINGS = {
  gentle: { type: 'spring' as const, stiffness: 260, damping: 28 },
  bouncy: { type: 'spring' as const, stiffness: 420, damping: 22 },
  snappy: { type: 'spring' as const, stiffness: 500, damping: 35 },
  subtleHover: { type: 'spring' as const, stiffness: 400, damping: 30 },
};

// Motion Stagger Variants
export const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...SPRINGS.gentle },
  },
};
