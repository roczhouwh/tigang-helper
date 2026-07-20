# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

**提肛助手 (tigang-helper)** — 科学盆底肌训练 Web 应用。

## 技术栈

- Next.js 16 + TypeScript + Tailwind CSS 4
- Framer Motion（动画）
- @mediapipe/tasks-vision（姿势检测）
- OpenAI SDK → DeepSeek V4（AI 姿势纠正）
- Web Speech API（语音播报）
- localStorage（训练记录）

## 常用命令

```bash
npm run dev      # 开发服务器
npm run build    # 生产构建
npm run lint     # 代码检查
```

## 项目结构

```
src/
├── app/
│   ├── page.tsx                    # 首页：课程选择
│   ├── train/[courseId]/page.tsx   # 训练页：核心训练界面
│   ├── history/page.tsx            # 历史记录 + 统计
│   └── api/posture-advice/route.ts # DeepSeek API 代理
├── components/
│   ├── training/                   # 训练组件（呼吸圈、姿势示范、计时器等）
│   ├── posture/                    # 姿势检测组件（摄像头、反馈）
│   ├── history/                    # 历史组件（日历热力图、统计卡片）
│   └── ui/                        # 通用 UI（导航栏）
├── hooks/                          # 自定义 hooks
│   ├── useTraining.ts              # 训练状态机
│   ├── useMediaPipe.ts             # MediaPipe Pose 集成
│   ├── useVoice.ts                 # 语音播报
│   └── useTrainingHistory.ts       # localStorage 读写
├── lib/
│   ├── courses.ts                  # 6 门分级课程定义
│   ├── posture-analyzer.ts         # 姿势分析算法
│   └── storage.ts                  # localStorage 工具
└── types/index.ts                  # 全局类型
```

## 环境变量

在 `.env.local` 中配置：
```
DEEPSEEK_API_KEY=sk-your-key-here
```

## 设计系统

- 背景：奶油色 `#FDF6F0`
- 主色：鼠尾草绿 `#5B8C5A`
- 强调：暖陶土 `#E07A5F`
- 文字：深蓝灰 `#2D3A4A`
- 辅助：金色 `#F2CC8F`