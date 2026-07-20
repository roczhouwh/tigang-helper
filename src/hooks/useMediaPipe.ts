'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import { PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { Landmark } from '@/lib/posture-analyzer';

export function useMediaPipe() {
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [landmarks, setLandmarks] = useState<Landmark[] | null>(null);
  const animFrameRef = useRef<number>(0);
  const lastVideoTimeRef = useRef(-1);

  const initialize = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm'
      );
      poseLandmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numPoses: 1,
        minPoseDetectionConfidence: 0.5,
        minPosePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      setLoading(false);
    } catch (e) {
      setError('MediaPipe 初始化失败');
      setLoading(false);
    }
  }, []);

  const startDetection = useCallback((videoElement: HTMLVideoElement, onLandmarks?: (lms: Landmark[]) => void) => {
    if (!poseLandmarkerRef.current) return;

    const detect = () => {
      if (videoElement.readyState >= 2) {
        const now = performance.now();
        if (videoElement.currentTime !== lastVideoTimeRef.current) {
          lastVideoTimeRef.current = videoElement.currentTime;
          try {
            const result = poseLandmarkerRef.current!.detectForVideo(videoElement, now);
            if (result.landmarks && result.landmarks.length > 0) {
              const lms = result.landmarks[0] as Landmark[];
              setLandmarks(lms);
              onLandmarks?.(lms);
            }
          } catch {
            // 忽略检测错误
          }
        }
      }
      animFrameRef.current = requestAnimationFrame(detect);
    };

    detect();
  }, []);

  const stopDetection = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = 0;
    }
    setLandmarks(null);
  }, []);

  const drawLandmarks = useCallback((ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
    if (!landmarks || landmarks.length === 0) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // 绘制连接线
    const connections = [
      [11, 12], [11, 23], [12, 24], [23, 24], // 肩膀-髋部
      [11, 13], [13, 15], [12, 14], [14, 16], // 手臂
      [23, 25], [25, 27], [24, 26], [26, 28], // 腿部
      [0, 1], [0, 4], [1, 2], [2, 3], [4, 5], [5, 6], // 面部
      [9, 10], // 嘴
      [7, 8], // 耳朵
    ];

    ctx.strokeStyle = '#00E676';
    ctx.lineWidth = 2;
    connections.forEach(([i, j]) => {
      const a = landmarks[i];
      const b = landmarks[j];
      if (a && b && a.visibility > 0.5 && b.visibility > 0.5) {
        ctx.beginPath();
        ctx.moveTo(a.x * canvasWidth, a.y * canvasHeight);
        ctx.lineTo(b.x * canvasWidth, b.y * canvasHeight);
        ctx.stroke();
      }
    });

    // 绘制关键点
    landmarks.forEach((lm, i) => {
      if (lm.visibility > 0.5) {
        const x = lm.x * canvasWidth;
        const y = lm.y * canvasHeight;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#00E676';
        ctx.fill();
        ctx.strokeStyle = '#004D40';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });
  }, [landmarks]);

  useEffect(() => {
    initialize();
    return () => stopDetection();
  }, []);

  return { loading, error, landmarks, startDetection, stopDetection, drawLandmarks, initialize };
}