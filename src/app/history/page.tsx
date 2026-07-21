'use client';

import { useState, useEffect } from 'react';
import { useTrainingHistory } from '@/hooks/useTrainingHistory';
import CalendarHeatmap from '@/components/history/CalendarHeatmap';
import StatsCharts from '@/components/history/StatsCharts';

function CheckCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sage">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function InboxIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-soft">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}

export default function HistoryPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { records, totalDays, totalMinutes, avgScore, streak, getDatesWithRecords } =
    useTrainingHistory();

  if (!mounted) {
    return (
      <div className="py-8 space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-deep" style={{ fontFamily: 'var(--font-heading)' }}>训练记录</h1>
          <p className="text-sm text-slate-soft mt-1">每一次坚持都值得记录</p>
        </div>
        {/* 骨架屏 */}
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="neu-card p-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 mb-3" />
              <div className="h-8 w-16 bg-slate-100 rounded mb-1" />
              <div className="h-4 w-12 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
        <div className="neu-card p-5">
          <div className="h-5 w-24 bg-slate-100 rounded mb-4" />
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 35 }, (_, i) => (
              <div key={i} className="aspect-square rounded-lg bg-slate-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const datesWithRecords = getDatesWithRecords();

  return (
    <div className="py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-deep" style={{ fontFamily: 'var(--font-heading)' }}>
          训练记录
        </h1>
        <p className="text-sm text-slate-soft mt-1">每一次坚持都值得记录</p>
      </div>

      <StatsCharts
        totalDays={totalDays}
        totalMinutes={totalMinutes}
        avgScore={avgScore}
        streak={streak}
      />

      <CalendarHeatmap datesWithRecords={datesWithRecords} />

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-deep" style={{ fontFamily: 'var(--font-heading)' }}>
          最近训练
        </h3>
        {records.length === 0 ? (
          <div className="text-center py-16 neu-card rounded-2xl">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl neu-concave mb-3">
              <InboxIcon />
            </div>
            <p className="text-slate-soft font-medium">还没有训练记录</p>
            <p className="text-slate-soft text-sm mt-1">完成一次训练后会自动记录</p>
          </div>
        ) : (
          <div className="space-y-2">
            {[...records]
              .sort((a, b) => b.date.localeCompare(a.date))
              .slice(0, 20)
              .map((record, i) => (
                <div
                  key={`${record.date}-${record.courseId}-${i}`}
                  className="neu-card p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-slate-deep">{record.courseName}</p>
                    <p className="text-sm text-slate-soft mt-0.5">
                      {record.date} · {Math.floor(record.duration / 60)} 分钟
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium flex items-center gap-1 justify-end ${record.completed ? 'text-sage' : 'text-slate-soft'}`}>
                      {record.completed && <CheckCircleIcon />}
                      {record.completed ? '完成' : '未完成'}
                    </div>
                    <div className="text-xs text-slate-soft mt-0.5">
                      姿势分 {record.postureScore}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}