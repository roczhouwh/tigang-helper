'use client';

import { motion } from 'framer-motion';

interface Props {
  totalTimeLeft: number;
  actionTimeLeft: number;
  progress: number;
  totalDuration: number;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function TrainingTimer({ totalTimeLeft, actionTimeLeft, progress, totalDuration }: Props) {
  return (
    <div className="w-full space-y-4">
      {/* 当前动作倒计时 */}
      <div className="flex items-center justify-center">
        <motion.div
          className="text-4xl font-bold text-slate-deep tracking-tight tabular-nums"
          key={actionTimeLeft}
          initial={{ scale: 1.08, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          {formatTime(actionTimeLeft)}
        </motion.div>
      </div>
    </div>
  );
}