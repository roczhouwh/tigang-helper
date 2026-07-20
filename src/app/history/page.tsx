'use client';

import { useState, useEffect } from 'react';
import { useTrainingHistory } from '@/hooks/useTrainingHistory';
import CalendarHeatmap from '@/components/history/CalendarHeatmap';
import StatsCharts from '@/components/history/StatsCharts';

export default function HistoryPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 始终在 early return 之前调用所有 hooks
  const { records, totalDays, totalMinutes, avgScore, streak, getDatesWithRecords } =
    useTrainingHistory();

  // 仅在客户端读取 localStorage，避免 hydration 不匹配
  if (!mounted) {
    return (
      <div className="py-8 space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-deep">训练记录</h1>
          <p className="text-sm text-slate-400 mt-1">每一次坚持都值得记录</p>
        </div>
        {/* 骨架屏 */}
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-slate-100 mb-3" />
              <div className="h-8 w-16 bg-slate-100 rounded mb-1" />
              <div className="h-4 w-12 bg-slate-50 rounded" />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <div className="h-5 w-24 bg-slate-100 rounded mb-4" />
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 35 }, (_, i) => (
              <div key={i} className="aspect-square rounded-lg bg-slate-50" />
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
        <h1 className="text-2xl font-bold text-slate-deep">训练记录</h1>
        <p className="text-sm text-slate-400 mt-1">每一次坚持都值得记录</p>
      </div>

      <StatsCharts
        totalDays={totalDays}
        totalMinutes={totalMinutes}
        avgScore={avgScore}
        streak={streak}
      />

      <CalendarHeatmap datesWithRecords={datesWithRecords} />

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-deep">最近训练</h3>
        {records.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <div className="text-5xl mb-3">📝</div>
            <p className="text-slate-400 font-medium">还没有训练记录</p>
            <p className="text-slate-400 text-sm mt-1">完成一次训练后会自动记录</p>
          </div>
        ) : (
          <div className="space-y-2">
            {[...records]
              .sort((a, b) => b.date.localeCompare(a.date))
              .slice(0, 20)
              .map((record, i) => (
                <div
                  key={`${record.date}-${record.courseId}-${i}`}
                  className="bg-white rounded-xl p-4 border border-slate-100 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-slate-deep">{record.courseName}</p>
                    <p className="text-sm text-slate-400 mt-0.5">
                      {record.date} · {Math.floor(record.duration / 60)} 分钟
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${record.completed ? 'text-sage' : 'text-slate-400'}`}>
                      {record.completed ? '✓ 完成' : '未完成'}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
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
