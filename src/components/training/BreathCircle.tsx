'use client';

import { motion } from 'framer-motion';
import { BreathPattern } from '@/types';

interface Props {
  pattern: BreathPattern;
  isActive: boolean;
  size?: number;
}

export default function BreathCircle({ pattern, isActive, size = 160 }: Props) {
  const getScale = () => {
    switch (pattern) {
      case 'inhale': return [1, 0.55];
      case 'exhale': return [0.55, 1];
      case 'hold': return [0.55, 0.55];
    }
  };

  // Medical teal + health green palette
  const getColors = () => {
    switch (pattern) {
      case 'inhale':
        return {
          main: 'from-[#22D3EE] to-[#0891B2]',
          glow: 'bg-[#0891B2]',
          ring: 'border-[#0891B2]/30',
        };
      case 'exhale':
        return {
          main: 'from-[#16A34A] to-[#15803D]',
          glow: 'bg-[#16A34A]',
          ring: 'border-[#16A34A]/30',
        };
      case 'hold':
        return {
          main: 'from-[#F59E0B] to-[#D97706]',
          glow: 'bg-[#F59E0B]',
          ring: 'border-[#F59E0B]/30',
        };
    }
  };

  const getLabel = () => {
    switch (pattern) {
      case 'inhale': return '吸气';
      case 'exhale': return '呼气';
      case 'hold': return '保持';
    }
  };

  const [targetScale] = getScale();
  const colors = getColors();

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* 外圈光晕 */}
      {isActive && (
        <>
          <motion.div
            className={`absolute rounded-full ${colors.glow} opacity-10`}
            style={{ width: size * 1.3, height: size * 1.3 }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.05, 0.1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className={`absolute rounded-full ${colors.glow} opacity-15`}
            style={{ width: size * 1.15, height: size * 1.15 }}
            animate={{ scale: [1, 1.12, 1], opacity: [0.15, 0.08, 0.15] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          />
        </>
      )}

      {/* Neumorphic outer ring */}
      <div
        className="absolute rounded-full"
        style={{
          width: size + 12,
          height: size + 12,
          background: '#F0FDFA',
          boxShadow: '-4px -4px 12px rgba(255,255,255,0.8), 4px 4px 12px rgba(0,0,0,0.06)',
        }}
      />

      {/* 呼吸圈主体 */}
      <motion.div
        className={`absolute rounded-full bg-gradient-to-br ${colors.main} shadow-lg`}
        style={{ width: size - 12, height: size - 12 }}
        animate={isActive ? { scale: targetScale } : { scale: 1 }}
        transition={{ duration: 1.8, ease: 'easeInOut' }}
      />

      {/* 内圈 */}
      <motion.div
        className="absolute rounded-full bg-white/15 backdrop-blur-sm"
        style={{ width: (size - 12) * 0.68, height: (size - 12) * 0.68 }}
        animate={isActive ? { scale: targetScale } : { scale: 1 }}
        transition={{ duration: 1.8, ease: 'easeInOut' }}
      />

      {/* 最内圈 */}
      <motion.div
        className="absolute rounded-full bg-white/10"
        style={{ width: (size - 12) * 0.42, height: (size - 12) * 0.42 }}
        animate={isActive ? { scale: targetScale } : { scale: 1 }}
        transition={{ duration: 1.8, ease: 'easeInOut' }}
      />

      {/* 中心文字 */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.span
          className="text-2xl font-bold text-white drop-shadow-md tracking-wider"
          style={{ fontFamily: 'var(--font-heading)' }}
          animate={isActive ? { scale: [1, 1.08, 1] } : { scale: 1 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          {getLabel()}
        </motion.span>
      </div>
    </div>
  );
}