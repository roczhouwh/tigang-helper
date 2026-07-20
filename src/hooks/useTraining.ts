'use client';

import { useState, useCallback, useRef } from 'react';
import { TrainingState, TrainingStatus, Course, PostureAnalysis, TrainingRecord } from '@/types';
import { saveRecord } from '@/lib/storage';
import { calculatePostureScore } from '@/lib/posture-analyzer';

export function useTraining(course: Course) {
  const [state, setState] = useState<TrainingState>({
    status: 'idle',
    currentActionIndex: 0,
    actionTimeLeft: course.actions[0]?.duration ?? 0,
    totalTimeLeft: course.totalDuration,
    isCameraOn: false,
    postureIssue: null,
    aiFeedback: null,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const postureIssuesRef = useRef<number>(0);
  const totalPostureChecksRef = useRef<number>(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    setState(s => ({ ...s, status: 'countdown' }));

    // 3秒倒计时
    let countdown = 3;
    timerRef.current = setInterval(() => {
      countdown--;
      if (countdown <= 0) {
        clearTimer();
        setState(s => ({ ...s, status: 'active' }));
        startTraining();
      }
    }, 1000);
  }, []);

  const startTraining = useCallback(() => {
    timerRef.current = setInterval(() => {
      setState(s => {
        if (s.status !== 'active') return s;

        const newTimeLeft = s.actionTimeLeft - 1;
        const newTotalLeft = s.totalTimeLeft - 1;

        if (newTotalLeft <= 0) {
          clearTimer();
          // 保存训练记录
          const score = totalPostureChecksRef.current > 0
            ? Math.round(100 - (postureIssuesRef.current / totalPostureChecksRef.current) * 100)
            : 100;
          const record: TrainingRecord = {
            date: new Date().toISOString().split('T')[0],
            courseId: course.id,
            courseName: course.name,
            duration: course.totalDuration,
            completed: true,
            postureScore: score,
          };
          saveRecord(record);
          return { ...s, status: 'completed', actionTimeLeft: 0, totalTimeLeft: 0 };
        }

        if (newTimeLeft <= 0) {
          const nextIdx = s.currentActionIndex + 1;
          if (nextIdx < course.actions.length) {
            return {
              ...s,
              currentActionIndex: nextIdx,
              actionTimeLeft: course.actions[nextIdx].duration,
              totalTimeLeft: newTotalLeft,
            };
          }
        }

        return { ...s, actionTimeLeft: newTimeLeft, totalTimeLeft: newTotalLeft };
      });
    }, 1000);
  }, [course]);

  const pause = useCallback(() => {
    clearTimer();
    setState(s => ({ ...s, status: 'paused' }));
  }, []);

  const resume = useCallback(() => {
    setState(s => ({ ...s, status: 'active' }));
    startTraining();
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setState({
      status: 'idle',
      currentActionIndex: 0,
      actionTimeLeft: course.actions[0]?.duration ?? 0,
      totalTimeLeft: course.totalDuration,
      isCameraOn: false,
      postureIssue: null,
      aiFeedback: null,
    });
  }, [course]);

  const toggleCamera = useCallback(() => {
    setState(s => ({ ...s, isCameraOn: !s.isCameraOn }));
  }, []);

  const updatePosture = useCallback((analysis: PostureAnalysis) => {
    totalPostureChecksRef.current++;
    if (analysis.issueType !== 'none') {
      postureIssuesRef.current++;
    }
    setState(s => ({ ...s, postureIssue: analysis }));
  }, []);

  const setAiFeedback = useCallback((feedback: string | null) => {
    setState(s => ({ ...s, aiFeedback: feedback }));
  }, []);

  const currentAction = course.actions[state.currentActionIndex];
  const progress = ((course.totalDuration - state.totalTimeLeft) / course.totalDuration) * 100;

  return {
    state,
    currentAction,
    progress,
    start,
    pause,
    resume,
    reset,
    toggleCamera,
    updatePosture,
    setAiFeedback,
  };
}