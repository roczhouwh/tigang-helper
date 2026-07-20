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

  const btnPrimary = "px-6 py-2.5 bg-sage text-white rounded-xl font-semibold hover:bg-[#4A7A49] shadow-sm transition-all";
  const btnSecondary = "px-6 py-2.5 bg-white text-slate-deep rounded-xl font-medium border border-slate-200 hover:bg-slate-50 transition-all";
  const btnDanger = "px-6 py-2.5 bg-terracotta-light text-terracotta rounded-xl font-medium hover:bg-terracotta/10 transition-all";

  return (
    <div className="py-4 space-y-6 min-h-[calc(100vh-3.5rem)] flex flex-col">
      {/* 返回 */}
      <button
        onClick={() => router.push('/')}
        className="text-slate-400 hover:text-slate-deep text-sm flex items-center gap-1 w-fit"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        返回选课
      </button>

      {/* 标题 */}
      <div className="text-center">
        <h2 className="text-lg font-semibold text-slate-deep">{course.name}</h2>
        <p className="text-sm text-slate-400 mt-1">
          {course.actionCount} 个动作 · {Math.floor(course.totalDuration / 60)} 分钟
        </p>
      </div>

      {/* 核心训练区域 */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        {/* 倒计时 */}
        {state.status === 'countdown' && (
          <div className="text-center py-12">
            <p className="text-8xl font-bold text-sage animate-pulse">3</p>
            <p className="text-slate-400 mt-6 text-lg">准备开始...</p>
          </div>
        )}

        {/* 训练中 */}
        {(state.status === 'active' || state.status === 'paused') && currentAction && (
          <div className="flex flex-col items-center space-y-8 w-full">
            <BreathCircle
              pattern={currentAction.breathPattern}
              isActive={state.status === 'active'}
            />
            <div className="flex items-center gap-4">
              <PoseGuide
                actionType={currentAction.type}
                isActive={state.status === 'active'}
              />
            </div>
            <ActionIndicator
              type={currentAction.type}
              instruction={currentAction.instruction}
            />
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
          </div>
        )}

        {/* 完成 */}
        {state.status === 'completed' && (
          <div className="text-center space-y-5">
            <div className="text-7xl">🎉</div>
            <h3 className="text-2xl font-bold text-slate-deep">训练完成！</h3>
            <p className="text-slate-soft">你做得很好，坚持就是胜利</p>
            <div className="flex gap-3 justify-center pt-2">
              <button onClick={reset} className={btnPrimary}>再来一次</button>
              <button onClick={() => router.push('/history')} className={btnSecondary}>查看记录</button>
            </div>
          </div>
        )}

        {/* 空闲 */}
        {state.status === 'idle' && (
          <div className="text-center space-y-8">
            <div className="text-7xl">🧘</div>
            <div>
              <p className="text-slate-soft text-lg mb-6">调整好坐姿，准备开始</p>
              <button onClick={start} className={`${btnPrimary} text-lg px-10 py-3.5`}>
                开始训练
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 控制按钮 */}
      <div className="pt-2">
        {state.status === 'active' && (
          <div className="flex justify-center gap-3">
            <button onClick={pause} className={btnSecondary}>暂停</button>
            <button onClick={toggleCamera} className={state.isCameraOn ? btnDanger : btnSecondary}>
              {state.isCameraOn ? '关闭摄像头' : '姿势检测'}
            </button>
          </div>
        )}
        {state.status === 'paused' && (
          <div className="flex justify-center gap-3">
            <button onClick={resume} className={btnPrimary}>继续训练</button>
            <button onClick={reset} className={btnSecondary}>重新开始</button>
          </div>
        )}
      </div>

      {/* 摄像头 + 姿势反馈 */}
      <CameraView isActive={state.isCameraOn} onPostureUpdate={handlePostureUpdate} />
      <PostureFeedback analysis={state.postureIssue} aiFeedback={state.aiFeedback} />
    </div>
  );
}