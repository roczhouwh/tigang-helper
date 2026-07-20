'use client';

import { motion } from 'framer-motion';
import { ActionType } from '@/types';

interface Props {
  actionType: ActionType;
  isActive: boolean;
}

export default function PoseGuide({ actionType, isActive }: Props) {
  const getHighlightAreas = () => {
    switch (actionType) {
      case 'contract':
        return ['pelvis'];
      case 'sustain':
        return ['pelvis', 'core'];
      case 'staircase':
        return ['pelvis', 'core', 'legs'];
      case 'rest':
        return [];
    }
  };

  const highlights = getHighlightAreas();
  const pelvisColor = highlights.includes('pelvis') ? '#00E676' : '#94A3B8';
  const coreColor = highlights.includes('core') ? '#00E676' : '#94A3B8';
  const legsColor = highlights.includes('legs') ? '#00E676' : '#94A3B8';

  return (
    <div className="flex items-center justify-center">
      <svg viewBox="0 0 200 360" width="160" height="288" className="drop-shadow-lg">
        {/* 头部 */}
        <motion.circle
          cx="100" cy="30" r="18"
          fill="#64748B"
          animate={isActive ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        />

        {/* 颈部 */}
        <line x1="100" y1="48" x2="100" y2="60" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />

        {/* 肩膀 */}
        <line x1="60" y1="60" x2="140" y2="60" stroke="#64748B" strokeWidth="6" strokeLinecap="round" />

        {/* 躯干 */}
        <line x1="100" y1="60" x2="100" y2="160" stroke="#64748B" strokeWidth="5" strokeLinecap="round" />

        {/* 核心区域高亮 */}
        {highlights.includes('core') && (
          <motion.ellipse
            cx="100" cy="120" rx="30" ry="35"
            fill={coreColor}
            opacity={0.3}
            animate={isActive ? { opacity: [0.2, 0.5, 0.2] } : { opacity: 0.3 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}

        {/* 骨盆区域高亮 */}
        {highlights.includes('pelvis') && (
          <motion.ellipse
            cx="100" cy="160" rx="28" ry="18"
            fill={pelvisColor}
            opacity={0.4}
            animate={isActive ? { opacity: [0.3, 0.7, 0.3], scale: [1, 1.1, 1] } : { opacity: 0.4 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}

        {/* 髋部横线 */}
        <line x1="70" y1="160" x2="130" y2="160" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />

        {/* 左臂 */}
        <line x1="60" y1="60" x2="40" y2="110" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />
        <line x1="40" y1="110" x2="35" y2="160" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />

        {/* 右臂 */}
        <line x1="140" y1="60" x2="160" y2="110" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />
        <line x1="160" y1="110" x2="165" y2="160" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />

        {/* 左腿 */}
        <line x1="85" y1="160" x2="75" y2="240" stroke="#64748B" strokeWidth="5" strokeLinecap="round" />
        <line x1="75" y1="240" x2="65" y2="320" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />

        {/* 右腿 */}
        <line x1="115" y1="160" x2="125" y2="240" stroke="#64748B" strokeWidth="5" strokeLinecap="round" />
        <line x1="125" y1="240" x2="135" y2="320" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />

        {/* 腿部高亮 */}
        {highlights.includes('legs') && (
          <>
            <motion.ellipse cx="70" cy="280" rx="22" ry="40" fill={legsColor} opacity={0.2}
              animate={isActive ? { opacity: [0.15, 0.4, 0.15] } : { opacity: 0.2 }}
              transition={{ duration: 1.5, repeat: Infinity }} />
            <motion.ellipse cx="130" cy="280" rx="22" ry="40" fill={legsColor} opacity={0.2}
              animate={isActive ? { opacity: [0.15, 0.4, 0.15] } : { opacity: 0.2 }}
              transition={{ duration: 1.5, repeat: Infinity }} />
          </>
        )}

        {/* 脚部 */}
        <ellipse cx="55" cy="325" rx="15" ry="6" fill="#64748B" />
        <ellipse cx="145" cy="325" rx="15" ry="6" fill="#64748B" />
      </svg>
    </div>
  );
}