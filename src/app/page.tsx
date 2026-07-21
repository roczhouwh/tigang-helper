'use client';

import { useState } from 'react';
import Link from 'next/link';
import { courses, getCoursesByFilter } from '@/lib/courses';
import { Gender, Difficulty } from '@/types';

function SparklesIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-sage">
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z" />
      <path d="M18 14l.7 2.3L21 17l-2.3.7L18 20l-.7-2.3L15 17l2.3-.7z" />
      <path d="M6 2l.5 1.5L8 4l-1.5.5L6 6l-.5-1.5L4 4l1.5-.5z" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.5 5L12.5 10L7.5 15" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

export default function HomePage() {
  const [gender, setGender] = useState<Gender | undefined>();
  const [difficulty, setDifficulty] = useState<Difficulty | undefined>();

  const filtered = getCoursesByFilter(gender, difficulty);

  const difficultyLabel: Record<Difficulty, string> = {
    beginner: '入门',
    intermediate: '进阶',
    advanced: '高阶',
  };

  const difficultyColor: Record<Difficulty, string> = {
    beginner: 'bg-sage-light text-sage',
    intermediate: 'bg-[#FEF3C7] text-[#B45309]',
    advanced: 'bg-terracotta-light text-terracotta',
  };

  return (
    <div className="py-8 space-y-8">
      {/* Hero */}
      <div className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl neu-convex mb-2">
          <SparklesIcon />
        </div>
        <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          科学提肛训练
        </h1>
        <p className="text-slate-soft text-sm leading-relaxed max-w-xs mx-auto">
          科学分级课程，呼吸动画引导，AI 智能纠正姿势
        </p>
      </div>

      {/* 筛选 */}
      <div className="space-y-3">
        {/* 性别筛选 */}
        <div className="flex gap-2 justify-center">
          {([
            { value: undefined, label: '全部' },
            { value: 'male' as Gender, label: '男性' },
            { value: 'female' as Gender, label: '女性' },
          ]).map(({ value, label }) => {
            const active = gender === value;
            return (
              <button
                key={label}
                onClick={() => setGender(value)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer select-none
                  ${active
                    ? 'bg-sage text-white shadow-md'
                    : 'neu-convex text-slate-soft hover:text-slate-deep'
                  }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* 难度筛选 */}
        <div className="flex gap-2 justify-center">
          {(['beginner', 'intermediate', 'advanced'] as Difficulty[]).map(d => {
            const active = difficulty === d;
            return (
              <button
                key={d}
                onClick={() => setDifficulty(active ? undefined : d)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer select-none
                  ${active
                    ? 'bg-sage text-white shadow-md'
                    : 'neu-convex text-slate-soft hover:text-slate-deep'
                  }`}
              >
                {difficultyLabel[d]}
              </button>
            );
          })}
        </div>
      </div>

      {/* 课程卡片 */}
      <div className="space-y-3">
        {filtered.map(course => (
          <Link
            key={course.id}
            href={`/train/${course.id}`}
            className="group block neu-card p-5 cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <UserIcon className="text-slate-soft group-hover:text-sage transition-colors" />
                  <h3
                    className="font-semibold text-slate-deep group-hover:text-sage transition-colors truncate"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {course.name}
                  </h3>
                </div>
                <p className="text-sm text-slate-soft leading-relaxed line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${difficultyColor[course.difficulty]}`}>
                    {difficultyLabel[course.difficulty]}
                  </span>
                  <span className="text-xs text-slate-soft flex items-center gap-1">
                    <ClockIcon />
                    {Math.floor(course.totalDuration / 60)} 分钟
                  </span>
                  <span className="text-xs text-slate-soft flex items-center gap-1">
                    <ZapIcon />
                    {course.actionCount} 个动作
                  </span>
                </div>
              </div>
              <div className="text-slate-soft group-hover:text-sage transition-colors mt-1 flex-shrink-0">
                <ChevronRightIcon />
              </div>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 neu-concave rounded-2xl">
            <p className="text-slate-soft">没有匹配的课程</p>
          </div>
        )}
      </div>
    </div>
  );
}