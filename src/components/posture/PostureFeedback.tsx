'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { PostureAnalysis } from '@/types';

interface Props {
  analysis: PostureAnalysis | null;
  aiFeedback: string | null;
}

function WarningIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#D97706]">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sage">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function BotIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3D5A80]">
      <rect x="3" y="7" width="18" height="14" rx="2" />
      <circle cx="9" cy="14" r="1.5" />
      <circle cx="15" cy="14" r="1.5" />
      <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
    </svg>
  );
}

export default function PostureFeedback({ analysis, aiFeedback }: Props) {
  const hasIssue = analysis && analysis.issueType !== 'none';

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {hasIssue && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-gold-light border border-gold/20 rounded-2xl p-4"
          >
            <div className="flex items-center gap-3">
              <WarningIcon />
              <div>
                <p className="text-sm font-medium text-slate-deep">{analysis!.message}</p>
                <p className="text-xs text-slate-soft mt-0.5">
                  严重程度 {Math.round(analysis!.severity * 100)}%
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {analysis && analysis.issueType === 'none' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-sage-light border border-sage/20 rounded-2xl p-4"
          >
            <div className="flex items-center gap-3">
              <CheckCircleIcon />
              <p className="text-sm font-medium text-sage">姿势良好，继续保持</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {aiFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-[#E8EFF8] border border-[#3D5A80]/20 rounded-2xl p-4"
          >
            <div className="flex items-start gap-3">
              <BotIcon />
              <p className="text-sm text-slate-deep leading-relaxed">{aiFeedback}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}