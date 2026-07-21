'use client';

interface Props {
  totalDays: number;
  totalMinutes: number;
  avgScore: number;
  streak: number;
}

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sage">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3D5A80]">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-terracotta">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#D97706]">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

export default function StatsCharts({ totalDays, totalMinutes, avgScore, streak }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard
        label="累计训练"
        value={totalDays}
        unit="天"
        icon={<CalendarIcon />}
        color="text-sage"
        bg="bg-sage-light"
      />
      <StatCard
        label="训练时长"
        value={totalMinutes}
        unit="分钟"
        icon={<ClockIcon />}
        color="text-[#3D5A80]"
        bg="bg-[#E8EFF8]"
      />
      <StatCard
        label="平均姿势分"
        value={avgScore}
        unit="分"
        icon={<TargetIcon />}
        color="text-terracotta"
        bg="bg-terracotta-light"
      />
      <StatCard
        label="连续打卡"
        value={streak}
        unit="天"
        icon={<FlameIcon />}
        color="text-[#D97706]"
        bg="bg-gold-light"
      />
    </div>
  );
}

function StatCard({ label, value, unit, icon, color, bg }: {
  label: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}) {
  return (
    <div className="neu-card p-4">
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <div className="flex items-baseline gap-1 mb-1">
        <span className={`text-2xl font-bold ${color}`} style={{ fontFamily: 'var(--font-heading)' }}>
          {value}
        </span>
        <span className="text-sm text-slate-soft">{unit}</span>
      </div>
      <span className="text-xs text-slate-soft">{label}</span>
    </div>
  );
}