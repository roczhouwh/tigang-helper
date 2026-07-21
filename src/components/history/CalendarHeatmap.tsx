'use client';

import { useMemo, useState, useEffect } from 'react';

interface Props {
  datesWithRecords: Set<string>;
}

export default function CalendarHeatmap({ datesWithRecords }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const today = useMemo(() => new Date(), [mounted]);
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const days = useMemo(() => {
    const result: { date: number; trained: boolean; isToday: boolean }[] = [];
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const todayDate = today.getDate();

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      result.push({
        date: d,
        trained: datesWithRecords.has(dateStr),
        isToday: d === todayDate,
      });
    }
    return result;
  }, [datesWithRecords, currentYear, currentMonth, today]);

  const monthLabel = `${currentYear}年${currentMonth + 1}月`;

  // SSR 骨架
  if (!mounted) {
    return (
      <div className="neu-card p-5">
        <h3 className="text-base font-semibold text-slate-deep mb-4" style={{ fontFamily: 'var(--font-heading)' }}>加载中...</h3>
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: 35 }, (_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="neu-card p-5">
      <h3 className="text-base font-semibold text-slate-deep mb-4" style={{ fontFamily: 'var(--font-heading)' }}>{monthLabel}</h3>
      <div className="grid grid-cols-7 gap-1.5">
        {['一', '二', '三', '四', '五', '六', '日'].map(d => (
          <div key={d} className="text-center text-xs text-slate-soft font-medium py-1">
            {d}
          </div>
        ))}
        {(() => {
          const firstDay = new Date(currentYear, currentMonth, 1).getDay();
          const blanks = firstDay === 0 ? 6 : firstDay - 1;
          return Array.from({ length: blanks }, (_, i) => (
            <div key={`blank-${i}`} />
          ));
        })()}
        {days.map(({ date, trained, isToday }) => (
          <div
            key={date}
            className={`
              aspect-square rounded-lg flex items-center justify-center text-xs font-medium
              transition-all cursor-default
              ${trained
                ? 'bg-sage text-white shadow-sm'
                : 'bg-slate-100 text-slate-400'
              }
              ${isToday ? 'ring-2 ring-sage ring-offset-2' : ''}
            `}
            title={`${date}日${trained ? ' ✓ 已训练' : ''}`}
          >
            {date}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-4 text-xs text-slate-soft">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-sage rounded" />
          <span>已打卡</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-slate-100 rounded" />
          <span>未打卡</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded ring-2 ring-sage" />
          <span>今天</span>
        </div>
      </div>
    </div>
  );
}