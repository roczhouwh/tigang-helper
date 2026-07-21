'use client';

import { use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getCourseById } from '@/lib/courses';
import { useTraining } from '@/hooks/useTraining';
import { useVoice } from '@/hooks/useVoice';
import BreathCircle from '@/components/training/BreathCircle';
import PoseGuide from '@/components/training/PoseGuide';
import TrainingTimer from '@/components/training/TrainingTimer';
import ActionIndicator from '@/components/training/ActionIndicator';
import VoiceCoach from '@/components/training/VoiceCoach';
import CameraView from '@/components/posture/CameraView';
import PostureFeedback from '@/components/posture/PostureFeedback';
import { PostureAnalysis } from '@/types';

function ArrowLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 4L6 8L10 12" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10" />
      <polyline points="23 20 23 14 17 14" />
      <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-sage">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 7 7 7 9" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 17 7 17 9" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-sage">
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z" />
      <path d="M18 14l.7 2.3L21 17l-2.3.7L18 20l-.7-2.3L15 17l2.3-.7z" />
      <path d="M6 2l.5 1.5L8 4l-1.5.5L6 6l-.5-1.5L4 4l1.5-.5z" />
    </svg>
  );
}

export default function TrainPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const router = useRouter();
  const course = getCourseById(courseId);
  const { speak } = useVoice();
  const postureIssueTimer = useRef<NodeJS.Timeout | null>(null);
  const postureIssueCount = useRef(0);

  const {
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
  } = useTraining(course!);

  const handlePostureUpdate = (analysis: PostureAnalysis) => {
    updatePosture(analysis);

    if (analysis.issueType !== 'none' && analysis.severity > 0.5) {
      postureIssueCount.current++;
      if (postureIssueCount.current >= 5 && !postureIssueTimer.current) {
        postureIssueTimer.current = setTimeout(async () => {
          try {
            const res = await fetch('/api/posture-advice', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                issueType: analysis.issueType,
                severity: analysis.severity,
                message: analysis.message,
              }),
            });
            const data = await res.json();
            if (data.advice) {
              setAiFeedback(data.advice);
              speak(data.advice, 0.85);
            }
          } catch {
            // 忽略 API 错误
          }
          postureIssueTimer.current = null;
          postureIssueCount.current = 0;
        }, 3000);
      }
    } else {
      postureIssueCount.current = 0;
    }
  };

  if (!course) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-slate-soft text-lg">课程未找到</p>
          <button
            onClick={() => router.push('/')}
            className="text-sage hover:underline font-medium cursor-pointer"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const btnBase = "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all duration-150";
  const btnPrimary = `${btnBase} bg-sage text-white hover:brightness-110 shadow-md`;
  const btnSecondary = `${btnBase} neu-convex text-slate-soft hover:text-slate-deep`;
  const btnDanger = `${btnBase} bg-terracotta-light text-terracotta hover:bg-terracotta/10`;

  return (
    <div className="py-3 space-y-3">
      {/* ── 顶部导航栏 ── */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-1 text-slate-soft hover:text-slate-deep text-xs cursor-pointer transition-colors"
        >
          <ArrowLeftIcon />
          返回
        </button>
        <div className="text-center">
          <h2 className="text-sm font-semibold text-slate-deep" style={{ fontFamily: 'var(--font-heading)' }}>
            {course.name}
          </h2>
          <p className="text-xs text-slate-soft">
            {course.actionCount} 动作 · {Math.floor(course.totalDuration / 60)} 分钟
          </p>
        </div>
        <div className="w-10" />
      </div>

      {/* ── 控制面板（Neumorphic 卡片）── */}
      <div className="neu-card p-3 space-y-2.5">
        {/* 按钮行 */}
        <div className="flex justify-center gap-2">
          {state.status === 'idle' && (
            <button onClick={start} className={`${btnPrimary} px-8 py-2.5`}>
              <PlayIcon />
              开始训练
            </button>
          )}
          {state.status === 'active' && (
            <>
              <button onClick={pause} className={btnSecondary}>
                <PauseIcon />
                暂停
              </button>
              <button onClick={toggleCamera} className={state.isCameraOn ? btnDanger : btnSecondary}>
                <CameraIcon />
                {state.isCameraOn ? '关闭' : '姿势检测'}
              </button>
            </>
          )}
          {state.status === 'paused' && (
            <>
              <button onClick={resume} className={btnPrimary}>
                <PlayIcon />
                继续
              </button>
              <button onClick={reset} className={btnSecondary}>
                <RefreshIcon />
                重新开始
              </button>
            </>
          )}
          {state.status === 'completed' && (
            <>
              <button onClick={reset} className={btnPrimary}>
                <RefreshIcon />
                再来一次
              </button>
              <button onClick={() => router.push('/history')} className={btnSecondary}>
                查看记录
              </button>
            </>
          )}
        </div>

        {/* 进度条 */}
        {(state.status === 'active' || state.status === 'paused') && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-soft">
              <span>总进度</span>
              <span className="tabular-nums">
                {Math.floor(state.totalTimeLeft / 60)}:{String(state.totalTimeLeft % 60).padStart(2, '0')}
              </span>
            </div>
            <div className="h-1.5 bg-sage-light rounded-full overflow-hidden neu-concave">
              <div
                className="h-full bg-gradient-to-r from-sage to-[#0E7490] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── 中央训练区域 ── */}
      <div className="flex flex-col items-center space-y-3">
        {/* 倒计时 */}
        {state.status === 'countdown' && (
          <div className="text-center py-8">
            <p className="text-6xl font-bold text-sage animate-pulse" style={{ fontFamily: 'var(--font-heading)' }}>
              3
            </p>
            <p className="text-slate-soft mt-2 text-sm">准备开始...</p>
          </div>
        )}

        {/* 训练中 */}
        {(state.status === 'active' || state.status === 'paused') && currentAction && (
          <>
            <div className="flex items-center gap-2">
              <BreathCircle pattern={currentAction.breathPattern} isActive={state.status === 'active'} size={160} />
              <PoseGuide actionType={currentAction.type} isActive={state.status === 'active'} />
            </div>
            <ActionIndicator type={currentAction.type} instruction={currentAction.instruction} />
            <TrainingTimer
              totalTimeLeft={state.totalTimeLeft}
              actionTimeLeft={state.actionTimeLeft}
              progress={progress}
              totalDuration={course.totalDuration}
            />
            <VoiceCoach
              action={currentAction}
              actionIndex={state.currentActionIndex}
              isActive={state.status === 'active'}
            />
          </>
        )}

        {/* 完成 */}
        {state.status === 'completed' && (
          <div className="text-center space-y-3 py-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl neu-convex">
              <TrophyIcon />
            </div>
            <h3 className="text-xl font-bold text-slate-deep" style={{ fontFamily: 'var(--font-heading)' }}>
              训练完成！
            </h3>
            <p className="text-sm text-slate-soft">你做得很好，坚持就是胜利</p>
          </div>
        )}

        {/* 空闲 */}
        {state.status === 'idle' && (
          <div className="text-center space-y-4 py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl neu-convex">
              <SparklesIcon />
            </div>
            <p className="text-slate-soft">调整好坐姿，准备开始</p>
          </div>
        )}
      </div>

      {/* ── 底部：摄像头 + 姿势反馈 ── */}
      <CameraView isActive={state.isCameraOn} onPostureUpdate={handlePostureUpdate} />
      <PostureFeedback analysis={state.postureIssue} aiFeedback={state.aiFeedback} />
    </div>
  );
}