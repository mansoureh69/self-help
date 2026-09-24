import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { SPRINGS } from '../../styles/tokens';

interface GlowCardProps extends HTMLMotionProps<'div'> {
  glowColor?: 'amber' | 'emerald' | 'indigo' | 'none';
  children: React.ReactNode;
  className?: string;
}

export const GlowCard: React.FC<GlowCardProps> = ({
  glowColor = 'amber',
  children,
  className = '',
  ...props
}) => {
  const glowClasses = {
    amber: 'hover:border-amber-500/40 hover:shadow-[0_16px_36px_-12px_rgba(0,0,0,0.7),0_0_24px_1px_rgba(245,158,11,0.12)]',
    emerald: 'hover:border-emerald-500/40 hover:shadow-[0_16px_36px_-12px_rgba(0,0,0,0.7),0_0_24px_1px_rgba(16,185,129,0.12)]',
    indigo: 'hover:border-indigo-500/40 hover:shadow-[0_16px_36px_-12px_rgba(0,0,0,0.7),0_0_24px_1px_rgba(99,102,241,0.12)]',
    none: 'hover:border-stone-700',
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      transition={SPRINGS.subtleHover}
      className={`relative rounded-3xl border border-white/[0.08] bg-[#0e1117]/80 backdrop-blur-xl transition-colors duration-300 ${glowClasses[glowColor]} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
