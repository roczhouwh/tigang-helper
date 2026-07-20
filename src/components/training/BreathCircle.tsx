'use client';

import { motion } from 'framer-motion';
import { BreathPattern } from '@/types';

interface Props {
  pattern: BreathPattern;
  isActive: boolean;
  size?: number;
}

export default function BreathCircle({ pattern, isActive, size = 260 }: Props) {
  const getScale = () => {
    switch (pattern) {
      case 'inhale': return [1, 0.55];
      case 'exhale': return [0.55, 1];
      case 'hold': return [0.55, 0.55];
    }
  };

  // Warm, organic color palette
  const getColors = () => {
    switch (pattern) {
      case 'inhale':
        return {
          main: 'from-[#E8B4A2] to-[#D4917A]',
          glow: 'bg-[#E8B4A2]',
          ring: 'border-[#E8B4A2]/30',
        };
      case 'exhale':
        return {
          main: 'from-[#5B8C5A] to-[#3D6B4F]',
          glow: 'bg-[#5B8C5A]',
          ring: 'border-[#5B8C5A]/30',
        };
      case 'hold':
        return {
          main: 'from-[#F2CC8F] to-[#E0A85C]',
          glow: 'bg-[#F2CC8F]',
          ring: 'border-[#F2CC8F]/30',
        };
    }
  };

  const getLabel = () => {
    switch (pattern) {
      case 'inhale': return '吸气';
      case 'exhale': return '收紧';
      case 'hold': return '保持';
    }
  };

  const [targetScale] = getScale();
  const colors = getColors();

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* 外圈光晕 — 标志性设计元素 */}
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

      {/* 呼吸圈主体 */}
      <motion.div
        className={`absolute inset-0 rounded-full bg-gradient-to-br ${colors.main} shadow-xl`}
        animate={isActive ? { scale: targetScale } : { scale: 1 }}
        transition={{ duration: 1.8, ease: 'easeInOut' }}
      />

      {/* 内圈 */}
      <motion.div
        className="absolute rounded-full bg-white/15 backdrop-blur-sm"
        style={{ width: size * 0.68, height: size * 0.68 }}
        animate={isActive ? { scale: targetScale } : { scale: 1 }}
        transition={{ duration: 1.8, ease: 'easeInOut' }}
      />

      {/* 最内圈 */}
      <motion.div
        className="absolute rounded-full bg-white/10"
        style={{ width: size * 0.42, height: size * 0.42 }}
        animate={isActive ? { scale: targetScale } : { scale: 1 }}
        transition={{ duration: 1.8, ease: 'easeInOut' }}
      />

      {/* 中心文字 */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.span
          className="text-3xl font-bold text-white drop-shadow-md tracking-wider"
          animate={isActive ? { scale: [1, 1.08, 1] } : { scale: 1 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          {getLabel()}
        </motion.span>
      </div>
    </div>
  );
}