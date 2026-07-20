import { Course, Gender, Difficulty } from '@/types';

// 训练课程定义
// 男性适用：更侧重盆底肌前部力量（前列腺区域）
// 女性适用：更侧重盆底肌整体（产后修复、膀胱控制）

const createPhases = (
  type: 'contract' | 'sustain' | 'staircase' | 'rest',
  duration: number,
  instruction: string,
  breathPattern: 'inhale' | 'exhale' | 'hold',
  extras?: { steps?: number; stepDuration?: number }
) => ({ type, duration, instruction, breathPattern, ...extras });

export const courses: Course[] = [
  // ===== 男性课程 =====
  {
    id: 'male-beginner',
    name: '男性入门 · 唤醒盆底肌',
    description: '从零开始认识盆底肌，学习基础收缩与放松。适合初次接触提肛训练的男性。',
    gender: 'male',
    difficulty: 'beginner',
    totalDuration: 300, // 5分钟
    actionCount: 10,
    actions: [
      createPhases('rest', 10, '准备开始，自然呼吸，放松全身', 'inhale'),
      createPhases('contract', 5, '快速收缩，感受盆底肌向上提起', 'exhale'),
      createPhases('rest', 5, '完全放松，感受肌肉下落', 'inhale'),
      createPhases('contract', 5, '再次快速收缩，像憋尿一样收紧', 'exhale'),
      createPhases('rest', 5, '放松', 'inhale'),
      createPhases('sustain', 10, '持续收缩保持，默数10秒', 'hold'),
      createPhases('rest', 10, '充分放松，深呼吸', 'inhale'),
      createPhases('contract', 5, '快速收缩', 'exhale'),
      createPhases('rest', 5, '放松', 'inhale'),
      createPhases('rest', 10, '训练结束，深呼吸放松', 'inhale'),
    ],
  },
  {
    id: 'male-intermediate',
    name: '男性进阶 · 力量强化',
    description: '延长收缩时间，加入阶梯式训练，增强盆底肌耐力与控制力。',
    gender: 'male',
    difficulty: 'intermediate',
    totalDuration: 600, // 10分钟
    actionCount: 16,
    actions: [
      createPhases('rest', 10, '准备，调整坐姿，挺直腰背', 'inhale'),
      createPhases('contract', 5, '快速收缩', 'exhale'),
      createPhases('rest', 5, '放松', 'inhale'),
      createPhases('sustain', 15, '持续收缩，保持15秒', 'hold'),
      createPhases('rest', 10, '充分放松', 'inhale'),
      createPhases('staircase', 20, '阶梯收缩：逐级收紧，分4步', 'exhale', { steps: 4, stepDuration: 5 }),
      createPhases('rest', 10, '放松', 'inhale'),
      createPhases('contract', 5, '快速收缩', 'exhale'),
      createPhases('rest', 5, '放松', 'inhale'),
      createPhases('sustain', 20, '持续收缩保持20秒', 'hold'),
      createPhases('rest', 10, '深呼吸放松', 'inhale'),
      createPhases('contract', 5, '快速收缩', 'exhale'),
      createPhases('rest', 5, '放松', 'inhale'),
      createPhases('sustain', 15, '持续收缩，保持稳定', 'hold'),
      createPhases('rest', 10, '放松', 'inhale'),
      createPhases('rest', 10, '训练完成，做几次深呼吸', 'inhale'),
    ],
  },
  {
    id: 'male-advanced',
    name: '男性高阶 · 极限控制',
    description: '高强度训练，超长持续收缩与复杂阶梯组合，打造钢铁般的盆底肌。',
    gender: 'male',
    difficulty: 'advanced',
    totalDuration: 900, // 15分钟
    actionCount: 18,
    actions: [
      createPhases('rest', 10, '准备，调整呼吸节奏', 'inhale'),
      createPhases('contract', 3, '快速收缩', 'exhale'),
      createPhases('rest', 3, '放松', 'inhale'),
      createPhases('contract', 3, '快速收缩', 'exhale'),
      createPhases('rest', 3, '放松', 'inhale'),
      createPhases('sustain', 30, '持续收缩30秒，挑战极限', 'hold'),
      createPhases('rest', 15, '充分放松恢复', 'inhale'),
      createPhases('staircase', 30, '阶梯收缩：6步渐进', 'exhale', { steps: 6, stepDuration: 5 }),
      createPhases('rest', 15, '放松', 'inhale'),
      createPhases('sustain', 40, '超长持续收缩40秒', 'hold'),
      createPhases('rest', 15, '深呼吸恢复', 'inhale'),
      createPhases('contract', 3, '快速收缩', 'exhale'),
      createPhases('rest', 3, '放松', 'inhale'),
      createPhases('staircase', 30, '阶梯收缩：6步', 'exhale', { steps: 6, stepDuration: 5 }),
      createPhases('rest', 15, '放松', 'inhale'),
      createPhases('sustain', 30, '最后冲刺30秒', 'hold'),
      createPhases('rest', 15, '放松', 'inhale'),
      createPhases('rest', 10, '训练结束，你做到了！', 'inhale'),
    ],
  },
  // ===== 女性课程 =====
  {
    id: 'female-beginner',
    name: '女性入门 · 感知盆底',
    description: '温和引导，帮助找到盆底肌，建立正确的收缩感知。适合初学者。',
    gender: 'female',
    difficulty: 'beginner',
    totalDuration: 300,
    actionCount: 10,
    actions: [
      createPhases('rest', 10, '准备，找到舒服的坐姿，双手放在腹部', 'inhale'),
      createPhases('contract', 5, '轻轻收紧，像中断尿流的感觉', 'exhale'),
      createPhases('rest', 5, '完全放松', 'inhale'),
      createPhases('contract', 5, '再次轻柔收紧，保持腹部放松', 'exhale'),
      createPhases('rest', 5, '放松', 'inhale'),
      createPhases('sustain', 8, '保持收紧8秒，正常呼吸', 'hold'),
      createPhases('rest', 10, '深呼吸放松', 'inhale'),
      createPhases('contract', 5, '轻柔收紧', 'exhale'),
      createPhases('rest', 5, '放松', 'inhale'),
      createPhases('rest', 10, '训练结束，你做得很好！', 'inhale'),
    ],
  },
  {
    id: 'female-intermediate',
    name: '女性进阶 · 耐力提升',
    description: '增加收缩时长，加入阶梯训练，提升盆底肌耐力与核心稳定性。',
    gender: 'female',
    difficulty: 'intermediate',
    totalDuration: 600,
    actionCount: 16,
    actions: [
      createPhases('rest', 10, '准备，挺直背部，放松肩膀', 'inhale'),
      createPhases('contract', 5, '快速收紧', 'exhale'),
      createPhases('rest', 5, '放松', 'inhale'),
      createPhases('sustain', 12, '持续收紧12秒，配合自然呼吸', 'hold'),
      createPhases('rest', 10, '放松', 'inhale'),
      createPhases('staircase', 20, '阶梯式收紧：4步递增', 'exhale', { steps: 4, stepDuration: 5 }),
      createPhases('rest', 10, '放松', 'inhale'),
      createPhases('sustain', 15, '持续收紧15秒', 'hold'),
      createPhases('rest', 10, '放松', 'inhale'),
      createPhases('contract', 5, '快速收紧', 'exhale'),
      createPhases('rest', 5, '放松', 'inhale'),
      createPhases('sustain', 18, '持续收紧18秒', 'hold'),
      createPhases('rest', 10, '深呼吸', 'inhale'),
      createPhases('contract', 5, '快速收紧', 'exhale'),
      createPhases('rest', 5, '放松', 'inhale'),
      createPhases('rest', 10, '训练完成，深呼吸，感受身体的变化', 'inhale'),
    ],
  },
  {
    id: 'female-advanced',
    name: '女性高阶 · 核心掌控',
    description: '高强度盆底肌训练，结合核心呼吸，全方位提升盆底肌力量与控制力。',
    gender: 'female',
    difficulty: 'advanced',
    totalDuration: 900,
    actionCount: 18,
    actions: [
      createPhases('rest', 10, '准备，调整坐姿，找到中立位', 'inhale'),
      createPhases('contract', 3, '快速收紧', 'exhale'),
      createPhases('rest', 3, '放松', 'inhale'),
      createPhases('contract', 3, '快速收紧', 'exhale'),
      createPhases('rest', 3, '放松', 'inhale'),
      createPhases('sustain', 25, '持续收紧25秒', 'hold'),
      createPhases('rest', 15, '充分放松', 'inhale'),
      createPhases('staircase', 30, '阶梯收紧：6步渐进', 'exhale', { steps: 6, stepDuration: 5 }),
      createPhases('rest', 15, '放松', 'inhale'),
      createPhases('sustain', 35, '持续收紧35秒', 'hold'),
      createPhases('rest', 15, '深呼吸', 'inhale'),
      createPhases('contract', 3, '快速收紧', 'exhale'),
      createPhases('rest', 3, '放松', 'inhale'),
      createPhases('staircase', 30, '阶梯收紧：6步', 'exhale', { steps: 6, stepDuration: 5 }),
      createPhases('rest', 15, '放松', 'inhale'),
      createPhases('sustain', 30, '最后坚持30秒！', 'hold'),
      createPhases('rest', 15, '放松', 'inhale'),
      createPhases('rest', 10, '训练结束，为你骄傲！', 'inhale'),
    ],
  },
];

export function getCourseById(id: string): Course | undefined {
  return courses.find(c => c.id === id);
}

export function getCoursesByFilter(gender?: Gender, difficulty?: Difficulty): Course[] {
  return courses.filter(c => {
    if (gender && c.gender !== 'all' && c.gender !== gender) return false;
    if (difficulty && c.difficulty !== difficulty) return false;
    return true;
  });
}