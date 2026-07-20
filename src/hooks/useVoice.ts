'use client';

import { useCallback, useRef } from 'react';

export function useVoice() {
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const speakingRef = useRef(false);

  const getVoice = useCallback((): SpeechSynthesisVoice | null => {
    if (typeof window === 'undefined') return null;
    synthRef.current = window.speechSynthesis;
    const voices = synthRef.current.getVoices();
    // 优先选择中文女声
    const zhVoice = voices.find(v => v.lang.startsWith('zh-CN') && v.name.includes('Female'))
      || voices.find(v => v.lang.startsWith('zh-CN'))
      || voices.find(v => v.lang.startsWith('zh'))
      || voices[0];
    return zhVoice || null;
  }, []);

  const speak = useCallback((text: string, rate: number = 0.9) => {
    if (typeof window === 'undefined') return;
    // 取消当前正在播放的语音
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getVoice();
    if (voice) utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.lang = 'zh-CN';
    speakingRef.current = true;
    utterance.onend = () => { speakingRef.current = false; };
    utterance.onerror = () => { speakingRef.current = false; };
    window.speechSynthesis.speak(utterance);
  }, [getVoice]);

  const stop = useCallback(() => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    speakingRef.current = false;
  }, []);

  const isSpeaking = () => speakingRef.current;

  return { speak, stop, isSpeaking };
}