import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1.2,
  suffix = '',
  className = '',
}) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const prevValueRef = useRef<number>(0);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const startVal = prevValueRef.current;
    const obj = { val: startVal };

    const tween = gsap.to(obj, {
      val: value,
      duration,
      ease: 'power3.out',
      onUpdate: () => {
        if (node) {
          node.innerText = `${Math.round(obj.val)}${suffix}`;
        }
      },
    });

    prevValueRef.current = value;

    return () => {
      tween.kill();
    };
  }, [value, duration, suffix]);

  return <span ref={nodeRef} className={className}>{Math.round(value)}{suffix}</span>;
};
