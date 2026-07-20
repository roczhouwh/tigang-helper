'use client';

interface Props {
  totalDays: number;
  totalMinutes: number;
  avgScore: number;
  streak: number;
}

export default function StatsCharts({ totalDays, totalMinutes, avgScore, streak }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard
        label="累计训练"
        value={totalDays}
        unit="天"
        icon="📅"
        color="text-sage"
        bg="bg-sage-light"
      />
      <StatCard
        label="训练时长"
        value={totalMinutes}
        unit="分钟"
        icon="⏱️"
        color="text-[#3D5A80]"
        bg="bg-[#E8EFF8]"
      />
      <StatCard
        label="平均姿势分"
        value={avgScore}
        unit="分"
        icon="🎯"
        color="text-terracotta"
        bg="bg-terracotta-light"
      />
      <StatCard
        label="连续打卡"
        value={streak}
        unit="天"
        icon="🔥"
        color="text-[#E0A85C]"
        bg="bg-gold-light"
      />
    </div>
  );
}

function StatCard({ label, value, unit, icon, color, bg }: {
  label: string;
  value: number;
  unit: string;
  icon: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100">
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
        <span className="text-lg">{icon}</span>
      </div>
      <div className="flex items-baseline gap-1 mb-1">
        <span className={`text-2xl font-bold ${color}`}>
          {value}
        </span>
        <span className="text-sm text-slate-400">{unit}</span>
      </div>
      <span className="text-xs text-slate-400">{label}</span>
    </div>
  );
}