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
            className="text-sage hover:underline font-medium"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const btnSm = "px-3 py-1.5 text-xs rounded-lg font-medium transition-all";
  const btnPrimary = `${btnSm} bg-sage text-white hover:bg-[#4A7A49] shadow-sm`;
  const btnSecondary = `${btnSm} bg-white text-slate-deep border border-slate-200 hover:bg-slate-50`;
  const btnDanger = `${btnSm} bg-terracotta-light text-terracotta hover:bg-terracotta/10`;

  return (
    <div className="py-3 space-y-3">
      {/* ── 顶部：返回 + 课程名 + 动作信息 ── */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/')}
          className="text-slate-400 hover:text-slate-deep text-xs flex items-center gap-1"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          返回
        </button>
        <div className="text-center">
          <h2 className="text-sm font-semibold text-slate-deep">{course.name}</h2>
          <p className="text-xs text-slate-400">
            {course.actionCount} 动作 · {Math.floor(course.totalDuration / 60)} 分钟
          </p>
        </div>
        <div className="w-10" /> {/* spacer for centering */}
      </div>

      {/* ── 控制按钮 + 进度条（顶部区域）── */}
      <div className="bg-white rounded-xl p-3 border border-slate-100 space-y-2.5">
        {/* 按钮行 */}
        <div className="flex justify-center gap-2">
          {state.status === 'idle' && (
            <button onClick={start} className="px-8 py-2 bg-sage text-white rounded-xl font-semibold hover:bg-[#4A7A49] shadow-sm text-sm">
              开始训练
            </button>
          )}
          {state.status === 'active' && (
            <>
              <button onClick={pause} className={btnSecondary}>⏸ 暂停</button>
              <button onClick={toggleCamera} className={state.isCameraOn ? btnDanger : btnSecondary}>
                {state.isCameraOn ? '📷 关闭' : '📷 姿势检测'}
              </button>
            </>
          )}
          {state.status === 'paused' && (
            <>
              <button onClick={resume} className={btnPrimary}>▶ 继续</button>
              <button onClick={reset} className={btnSecondary}>↺ 重新开始</button>
            </>
          )}
          {state.status === 'completed' && (
            <>
              <button onClick={reset} className={btnPrimary}>再来一次</button>
              <button onClick={() => router.push('/history')} className={btnSecondary}>查看记录</button>
            </>
          )}
        </div>

        {/* 进度条 */}
        {(state.status === 'active' || state.status === 'paused') && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-400">
              <span>总进度</span>
              <span className="tabular-nums">{Math.floor(state.totalTimeLeft / 60)}:{String(state.totalTimeLeft % 60).padStart(2, '0')}</span>
            </div>
            <div className="h-1.5 bg-sage-light rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sage to-[#3D6B4F] rounded-full transition-all duration-300"
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
          <div className="text-center py-6">
            <p className="text-6xl font-bold text-sage animate-pulse">3</p>
            <p className="text-slate-400 mt-2 text-sm">准备开始...</p>
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
          <div className="text-center space-y-2 py-4">
            <div className="text-5xl">🎉</div>
            <h3 className="text-xl font-bold text-slate-deep">训练完成！</h3>
            <p className="text-sm text-slate-soft">你做得很好，坚持就是胜利</p>
          </div>
        )}

        {/* 空闲 */}
        {state.status === 'idle' && (
          <div className="text-center space-y-4 py-6">
            <div className="text-5xl">🧘</div>
            <p className="text-slate-soft">调整好坐姿，准备开始</p>
          </div>
        )}
      </div>

      {/* ── 底部：摄像头 + 姿势反馈（紧凑）── */}
      <CameraView isActive={state.isCameraOn} onPostureUpdate={handlePostureUpdate} />
      <PostureFeedback analysis={state.postureIssue} aiFeedback={state.aiFeedback} />
    </div>
  );
}
