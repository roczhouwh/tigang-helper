'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useMediaPipe } from '@/hooks/useMediaPipe';
import { Landmark, analyzePosture, calculatePostureScore } from '@/lib/posture-analyzer';
import { PostureAnalysis } from '@/types';

interface Props {
  isActive: boolean;
  onPostureUpdate: (analysis: PostureAnalysis) => void;
}

export default function CameraView({ isActive, onPostureUpdate }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { loading, error, startDetection, stopDetection, drawLandmarks } = useMediaPipe();

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      // 用户拒绝摄像头权限
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    stopDetection();
  }, [stopDetection]);

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isActive, startCamera, stopCamera]);

  // 当视频开始播放后，启动姿势检测
  const handleVideoPlay = useCallback(() => {
    if (videoRef.current && isActive) {
      startDetection(videoRef.current, (lms: Landmark[]) => {
        const analysis = analyzePosture(lms);
        onPostureUpdate(analysis);
      });
    }
  }, [isActive, startDetection, onPostureUpdate]);

  // 绘制关键点
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const draw = () => {
      drawLandmarks(ctx, canvas.width, canvas.height);
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, [drawLandmarks]);

  if (!isActive) return null;

  return (
    <div className="relative rounded-2xl overflow-hidden bg-slate-900 shadow-lg">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-10">
          <div className="text-white text-center">
            <div className="animate-spin w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full mx-auto mb-2" />
            <p className="text-sm">加载姿势检测模型...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-10">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      <video
        ref={videoRef}
        className="w-full aspect-video object-cover"
        playsInline
        muted
        onPlay={handleVideoPlay}
      />
      <canvas
        ref={canvasRef}
        width={640}
        height={360}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}