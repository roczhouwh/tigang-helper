import { TrainingRecord } from '@/types';

const STORAGE_KEY = 'tigang-helper-records';

export function getRecords(): TrainingRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRecord(record: TrainingRecord): void {
  const records = getRecords();
  // 同一天同一课程，保留最新的
  const idx = records.findIndex(r => r.date === record.date && r.courseId === record.courseId);
  if (idx >= 0) {
    records[idx] = record;
  } else {
    records.push(record);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function getRecordsByMonth(year: number, month: number): TrainingRecord[] {
  return getRecords().filter(r => {
    const [y, m] = r.date.split('-').map(Number);
    return y === year && m === month;
  });
}

export function getTotalTrainingDays(): number {
  const dates = new Set(getRecords().map(r => r.date));
  return dates.size;
}

export function getTotalTrainingMinutes(): number {
  return Math.floor(getRecords().reduce((sum, r) => sum + r.duration, 0) / 60);
}

export function getAveragePostureScore(): number {
  const records = getRecords();
  if (records.length === 0) return 0;
  return Math.round(records.reduce((sum, r) => sum + r.postureScore, 0) / records.length);
}

export function getStreak(): number {
  const records = getRecords();
  if (records.length === 0) return 0;
  const dates = [...new Set(records.map(r => r.date))].sort().reverse();
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < dates.length; i++) {
    const expected = new Date(today);
    expected.setDate(expected.getDate() - i);
    const expectedStr = expected.toISOString().split('T')[0];
    if (dates[i] === expectedStr) {
      streak++;
    } else if (i === 0) {
      // 今天还没训练，检查昨天
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      if (dates[i] === yesterdayStr) {
        streak++;
        continue;
      }
      break;
    } else {
      break;
    }
  }
  return streak;
}