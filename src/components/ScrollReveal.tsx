import React, { useEffect, useRef, useState } from 'react';

export type RevealVariant = 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale-in';

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  delayMs?: number;
  className?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  variant = 'fade-up',
  delayMs = 0,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -36px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const hiddenTransform =
    variant === 'fade-up'
      ? 'opacity-0 translate-y-6'
      : variant === 'slide-left'
      ? 'opacity-0 -translate-x-6'
      : variant === 'slide-right'
      ? 'opacity-0 translate-x-6'
      : variant === 'scale-in'
      ? 'opacity-0 scale-95'
      : 'opacity-0';

  const visibleTransform = 'opacity-100 translate-y-0 translate-x-0 scale-100';

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`scroll-reveal-item transition-all duration-700 ease-out will-change-transform ${
        visible ? visibleTransform : hiddenTransform
      } ${className}`}
    >
      {children}
    </div>
  );
};
