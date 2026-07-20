# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

**提肛助手 (tigang-helper)** — 科学盆底肌训练 Web 应用。面向男女性用户，提供分级盆底肌（凯格尔/提肛）训练课程，结合呼吸动画、姿势检测、AI 纠正和语音播报。

- **仓库**: https://github.com/roczhouwh/tigang-helper
- **本地路径**: `F:/claudeapp/demo/tigang-helper`

## 技术栈

- Next.js 16 + TypeScript + Tailwind CSS 4
- Framer Motion（动画）
- @mediapipe/tasks-vision（姿势检测）
- OpenAI SDK → DeepSeek V4（AI 姿势纠正）
- Web Speech API（语音播报）
- localStorage（训练记录）

## 常用命令

```bash
npm run dev      # 开发服务器 → http://localhost:3000
npm run build    # 生产构建（改完代码后建议跑一次确认不报错）
npm run lint     # 代码检查
```

## 项目结构

```
src/
├── app/
│   ├── page.tsx                    # 首页：课程选择 + 性别/难度筛选
│   ├── train/[courseId]/page.tsx   # 训练页：核心训练界面
│   ├── history/page.tsx            # 历史记录 + 统计 + 日历热力图
│   └── api/posture-advice/route.ts # DeepSeek API 代理（POST）
├── components/
│   ├── training/                   # BreathCircle / PoseGuide / ActionIndicator / TrainingTimer / VoiceCoach
│   ├── posture/                    # CameraView（MediaPipe） / PostureFeedback
│   ├── history/                    # CalendarHeatmap / StatsCharts
│   └── ui/                        # Navbar
├── hooks/                          # useTraining（状态机）/ useMediaPipe / useVoice / useTrainingHistory
├── lib/
│   ├── courses.ts                  # 6 门分级课程定义（defineCourse 工厂函数）
│   ├── posture-analyzer.ts         # 姿势分析算法（驼背/歪斜/耸肩/头前倾）
│   └── storage.ts                  # localStorage 读写 + 统计
└── types/index.ts                  # 全部 TypeScript 类型
```

## 训练状态机

```
idle → countdown(3s) → active ⇄ paused → completed
                           ↓
                    all actions done → completed
```

- `useTraining.ts` 管理全部状态流转
- 动作耗尽时会自动完成训练（安全兜底，不会出现计时器负数）
- 训练完成后自动保存记录到 localStorage

## 课程定义规则

**必须使用 `defineCourse()` 工厂函数**，不要直接写 Course 对象。`totalDuration` 和 `actionCount` 由函数从 actions 数组自动计算，手写会导致不匹配。

```typescript
// ✅ 正确
defineCourse('male-beginner', '男性入门 · 唤醒盆底肌', '描述...', 'male', 'beginner', [
  createPhases('rest', 5, '准备开始', 'inhale'),
  createPhases('contract', 5, '快速收缩', 'exhale'),
  // ...
])

// ❌ 错误 — totalDuration 是手写的，容易与 actions 总和不一致
{ id: '...', totalDuration: 300, actions: [...] }
```

添加新课程：在 `courses.ts` 中新增一个 `defineCourse()` 调用即可，会自动出现在首页。

## 设计系统

| Token | 值 | 用途 |
|-------|-----|------|
| `--color-cream` | `#FDF6F0` | 页面背景 |
| `--color-sage` | `#5B8C5A` | 主色（按钮/高亮） |
| `--color-sage-light` | `#E8F0E6` | 浅绿背景 |
| `--color-terracotta` | `#E07A5F` | 强调色（高阶标签） |
| `--color-slate-deep` | `#2D3A4A` | 主文字 |
| `--color-slate-soft` | `#64748B` | 次要文字 |
| `--color-gold` | `#F2CC8F` | 辅助金色 |
| `--color-gold-light` | `#FEF7ED` | 浅金背景 |

所有颜色通过 Tailwind token 引用：`bg-cream` `text-sage` `bg-sage-light` 等。不要硬编码色值。

## 环境变量

`.env.local`（已 gitignore）：
```
DEEPSEEK_API_KEY=sk-your-key-here
```

API key 未配置时，姿势检测/语音播报/训练记录仍可正常工作，仅 AI 纠正功能不可用。

## 迭代注意事项

- **改完代码 → 跑 `npm run build`** 确认 TypeScript 编译通过再提交
- **训练页布局**：紧凑型设计，按钮在顶部白色卡片内，进度条紧随按钮，呼吸圈 160px
- **计时器**：大号 `text-4xl`，移除了底部进度条（已在顶部）
- **页面宽度**：`max-w-lg`，移动端优先
- **MediaPipe**：模型从 CDN 加载，首次使用需等待下载，CameraView 组件处理了 loading/error 状态
- **localStorage key**：`tigang-helper-records`，数据格式见 `types/index.ts` 的 `TrainingRecord`

## 已知待办

- [ ] 填入真实 DEEPSEEK_API_KEY
- [ ] 训练中动作循环（目前跑完所有动作就结束）
- [ ] 自定义训练时长
- [ ] 训练提醒通知
