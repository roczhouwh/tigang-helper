'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { PostureAnalysis } from '@/types';

interface Props {
  analysis: PostureAnalysis | null;
  aiFeedback: string | null;
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
            className="bg-gold-light border border-gold/30 rounded-2xl p-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="text-sm font-medium text-slate-deep">{analysis!.message}</p>
                <p className="text-xs text-slate-400 mt-0.5">
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
              <span className="text-xl">✨</span>
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
              <span className="text-xl">🤖</span>
              <p className="text-sm text-slate-deep leading-relaxed">{aiFeedback}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}