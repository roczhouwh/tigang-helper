'use client';

import { useCallback } from 'react';
import { TrainingRecord } from '@/types';
import { getRecords, getTotalTrainingDays, getTotalTrainingMinutes, getAveragePostureScore, getStreak } from '@/lib/storage';

export function useTrainingHistory() {
  const records = typeof window !== 'undefined' ? getRecords() : [];
  const totalDays = typeof window !== 'undefined' ? getTotalTrainingDays() : 0;
  const totalMinutes = typeof window !== 'undefined' ? getTotalTrainingMinutes() : 0;
  const avgScore = typeof window !== 'undefined' ? getAveragePostureScore() : 0;
  const streak = typeof window !== 'undefined' ? getStreak() : 0;

  const getDatesWithRecords = useCallback((): Set<string> => {
    return new Set(records.map(r => r.date));
  }, [records]);

  const getRecordsByDate = useCallback((date: string): TrainingRecord[] => {
    return records.filter(r => r.date === date);
  }, [records]);

  return {
    records,
    totalDays,
    totalMinutes,
    avgScore,
    streak,
    getDatesWithRecords,
    getRecordsByDate,
  };
}