'use client';

import { ActionType } from '@/types';

interface Props {
  type: ActionType;
  instruction: string;
}

const actionConfig: Record<ActionType, { label: string; emoji: string }> = {
  contract: { label: '快速收缩', emoji: '⚡' },
  sustain: { label: '持续收缩', emoji: '🔒' },
  staircase: { label: '阶梯收缩', emoji: '🪜' },
  rest: { label: '放松', emoji: '🌿' },
};

export default function ActionIndicator({ type, instruction }: Props) {
  const config = actionConfig[type];

  return (
    <div className="text-center space-y-2">
      <div className="flex items-center justify-center gap-2">
        <span className="text-xl">{config.emoji}</span>
        <span className="text-sm font-semibold text-sage bg-sage-light px-3 py-1 rounded-full">
          {config.label}
        </span>
      </div>
      <p className="text-base text-slate-soft font-medium">{instruction}</p>
    </div>
  );
}