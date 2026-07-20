'use client';

import { useState } from 'react';
import Link from 'next/link';
import { courses, getCoursesByFilter } from '@/lib/courses';
import { Gender, Difficulty } from '@/types';

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
    intermediate: 'bg-[#E8EFF8] text-[#3D5A80]',
    advanced: 'bg-terracotta-light text-terracotta',
  };

  const genderLabel: Record<string, string> = {
    male: '👨 男性',
    female: '👩 女性',
  };

  return (
    <div className="py-8 space-y-8">
      {/* Hero */}
      <div className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sage-light mb-2">
          <span className="text-3xl">🧘</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-deep tracking-tight">
          科学提肛训练
        </h1>
        <p className="text-slate-soft text-sm leading-relaxed max-w-xs mx-auto">
          科学分级课程，呼吸动画引导，AI 智能纠正姿势
        </p>
      </div>

      {/* 筛选 */}
      <div className="space-y-3">
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setGender(undefined)}
            className={`px-4 py-2 rounded-xl text-sm font-medium ${
              !gender
                ? 'bg-sage text-white shadow-sm'
                : 'bg-white text-slate-soft border border-slate-100'
            }`}
          >
            全部
          </button>
          {(['male', 'female'] as Gender[]).map(g => (
            <button
              key={g}
              onClick={() => setGender(g)}
              className={`px-4 py-2 rounded-xl text-sm font-medium ${
                gender === g
                  ? 'bg-sage text-white shadow-sm'
                  : 'bg-white text-slate-soft border border-slate-100'
              }`}
            >
              {genderLabel[g]}
            </button>
          ))}
        </div>

        <div className="flex gap-2 justify-center">
          {(['beginner', 'intermediate', 'advanced'] as Difficulty[]).map(d => (
            <button
              key={d}
              onClick={() => setDifficulty(difficulty === d ? undefined : d)}
              className={`px-4 py-2 rounded-xl text-sm font-medium ${
                difficulty === d
                  ? 'bg-sage text-white shadow-sm'
                  : 'bg-white text-slate-soft border border-slate-100'
              }`}
            >
              {difficultyLabel[d]}
            </button>
          ))}
        </div>
      </div>

      {/* 课程卡片 */}
      <div className="space-y-3">
        {filtered.map(course => (
          <Link
            key={course.id}
            href={`/train/${course.id}`}
            className="group block bg-white rounded-2xl p-5 border border-slate-100 hover:border-sage/30 hover:shadow-lg transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-sm">
                    {course.gender === 'male' ? '👨' : '👩'}
                  </span>
                  <h3 className="font-semibold text-slate-deep group-hover:text-sage transition-colors">
                    {course.name}
                  </h3>
                </div>
                <p className="text-sm text-slate-soft leading-relaxed">
                  {course.description}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${difficultyColor[course.difficulty]}`}>
                    {difficultyLabel[course.difficulty]}
                  </span>
                  <span className="text-xs text-slate-400">
                    {Math.floor(course.totalDuration / 60)} 分钟 · {course.actionCount} 个动作
                  </span>
                </div>
              </div>
              <div className="text-slate-300 group-hover:text-sage transition-colors mt-1">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">没有匹配的课程</p>
          </div>
        )}
      </div>
    </div>
  );
}