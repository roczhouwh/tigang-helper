'use client';

import { useTrainingHistory } from '@/hooks/useTrainingHistory';
import CalendarHeatmap from '@/components/history/CalendarHeatmap';
import StatsCharts from '@/components/history/StatsCharts';

export default function HistoryPage() {
  const { records, totalDays, totalMinutes, avgScore, streak, getDatesWithRecords } =
    useTrainingHistory();

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