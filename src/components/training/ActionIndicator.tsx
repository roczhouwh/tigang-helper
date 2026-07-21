'use client';

import { ActionType } from '@/types';

interface Props {
  type: ActionType;
  instruction: string;
}

function LightningIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function StairsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 19h16V5" />
      <path d="M5 19V5h16" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.5 6.5C12.5 2 17 2 21 6c0 0-4 1-5.5 5.5A7 7 0 0 1 11 20z" />
      <path d="M11 20v-8" />
    </svg>
  );
}

const actionConfig: Record<ActionType, { label: string; Icon: React.FC }> = {
  contract: { label: '快速收缩', Icon: LightningIcon },
  sustain: { label: '持续收缩', Icon: LockIcon },
  staircase: { label: '阶梯收缩', Icon: StairsIcon },
  rest: { label: '放松', Icon: LeafIcon },
};

export default function ActionIndicator({ type, instruction }: Props) {
  const config = actionConfig[type];

  return (
    <div className="text-center space-y-2">
      <div className="flex items-center justify-center gap-2">
        <span className="text-sage">
          <config.Icon />
        </span>
        <span className="text-sm font-semibold text-sage bg-sage-light px-3 py-1 rounded-full">
          {config.label}
        </span>
      </div>
      <p className="text-base text-slate-soft font-medium">{instruction}</p>
    </div>
  );
}