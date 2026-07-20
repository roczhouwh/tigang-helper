'use client';

import { useEffect, useRef } from 'react';
import { useVoice } from '@/hooks/useVoice';
import { Action } from '@/types';

interface Props {
  action: Action | null;
  actionIndex: number;
  isActive: boolean;
}

export default function VoiceCoach({ action, actionIndex, isActive }: Props) {
  const { speak, stop } = useVoice();
  const prevActionRef = useRef<number>(-1);

  useEffect(() => {
    if (!isActive || !action) return;

    // 动作切换时播报
    if (actionIndex !== prevActionRef.current) {
      prevActionRef.current = actionIndex;
      stop();
      // 短暂延迟确保语音准备好
      setTimeout(() => {
        speak(action.instruction, 0.85);
      }, 300);
    }
  }, [actionIndex, isActive, action, speak, stop]);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return null; // 纯逻辑组件，无 UI
}