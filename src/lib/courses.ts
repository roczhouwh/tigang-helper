import { Course, Gender, Difficulty } from '@/types';

const createPhases = (
  type: 'contract' | 'sustain' | 'staircase' | 'rest',
  duration: number,
  instruction: string,
  breathPattern: 'inhale' | 'exhale' | 'hold',
  extras?: { steps?: number; stepDuration?: number }
) => ({ type, duration, instruction, breathPattern, ...extras });

// 从 actions 自动计算 totalDuration 和 actionCount，避免手写不匹配
function defineCourse(
  id: string,
  name: string,
  description: string,
  gender: Gender,
  difficulty: Difficulty,
  actions: ReturnType<typeof createPhases>[]
): Course {
  return {
    id,
    name,
    description,
    gender,
    difficulty,
    totalDuration: actions.reduce((sum, a) => sum + a.duration, 0),
    actionCount: actions.length,
    actions,
  };
}

export const courses: Course[] = [
  // ===== 男性课程 =====
  defineCourse('male-beginner', '男性入门 · 唤醒盆底肌',
    '从零开始认识盆底肌，学习基础收缩与放松。适合初次接触提肛训练的男性。',
    'male', 'beginner', [
    createPhases('rest', 5, '准备开始，自然呼吸，放松全身', 'inhale'),
    createPhases('contract', 5, '快速收缩，感受盆底肌向上提起', 'exhale'),
    createPhases('rest', 5, '完全放松，感受肌肉下落', 'inhale'),
    createPhases('contract', 5, '再次快速收缩，像憋尿一样收紧', 'exhale'),
    createPhases('rest', 5, '放松', 'inhale'),
    createPhases('sustain', 8, '持续收缩保持，默数8秒', 'hold'),
    createPhases('rest', 4, '呼气放松', 'exhale'),
    createPhases('rest', 4, '深吸气', 'inhale'),
    createPhases('contract', 5, '快速收缩', 'exhale'),
    createPhases('rest', 5, '放松', 'inhale'),
    createPhases('rest', 5, '训练结束，深呼吸放松', 'inhale'),
  ]),
  defineCourse('male-intermediate', '男性进阶 · 力量强化',
    '延长收缩时间，加入阶梯式训练，增强盆底肌耐力与控制力。',
    'male', 'intermediate', [
    createPhases('rest', 5, '准备，调整坐姿，挺直腰背', 'inhale'),
    createPhases('contract', 5, '快速收缩', 'exhale'),
    createPhases('rest', 5, '放松', 'inhale'),
    createPhases('sustain', 12, '持续收缩，保持12秒', 'hold'),
    createPhases('rest', 4, '呼气放松', 'exhale'),
    createPhases('rest', 4, '深吸气', 'inhale'),
    createPhases('staircase', 16, '阶梯收缩：逐级收紧，分4步', 'exhale', { steps: 4, stepDuration: 4 }),
    createPhases('rest', 8, '放松', 'inhale'),
    createPhases('contract', 5, '快速收缩', 'exhale'),
    createPhases('rest', 5, '放松', 'inhale'),
    createPhases('sustain', 15, '持续收缩保持15秒', 'hold'),
    createPhases('rest', 4, '呼气放松', 'exhale'),
    createPhases('rest', 4, '深吸气', 'inhale'),
    createPhases('contract', 5, '快速收缩', 'exhale'),
    createPhases('rest', 5, '放松', 'inhale'),
    createPhases('sustain', 12, '持续收缩，保持稳定', 'hold'),
    createPhases('rest', 8, '呼气放松，深呼吸', 'exhale'),
    createPhases('rest', 5, '训练完成，做几次深呼吸', 'inhale'),
  ]),
  defineCourse('male-advanced', '男性高阶 · 极限控制',
    '高强度训练，超长持续收缩与复杂阶梯组合，打造钢铁般的盆底肌。',
    'male', 'advanced', [
    createPhases('rest', 5, '准备，调整呼吸节奏', 'inhale'),
    createPhases('contract', 3, '快速收缩', 'exhale'),
    createPhases('rest', 3, '放松', 'inhale'),
    createPhases('contract', 3, '快速收缩', 'exhale'),
    createPhases('rest', 3, '放松', 'inhale'),
    createPhases('sustain', 20, '持续收缩20秒，保持稳定', 'hold'),
    createPhases('rest', 5, '呼气放松', 'exhale'),
    createPhases('rest', 5, '深吸气', 'inhale'),
    createPhases('staircase', 20, '阶梯收缩：4步渐进', 'exhale', { steps: 4, stepDuration: 5 }),
    createPhases('rest', 10, '放松', 'inhale'),
    createPhases('sustain', 25, '持续收缩25秒', 'hold'),
    createPhases('rest', 5, '呼气放松', 'exhale'),
    createPhases('rest', 5, '深吸气', 'inhale'),
    createPhases('contract', 3, '快速收缩', 'exhale'),
    createPhases('rest', 3, '放松', 'inhale'),
    createPhases('staircase', 20, '阶梯收缩：4步', 'exhale', { steps: 4, stepDuration: 5 }),
    createPhases('rest', 10, '放松', 'inhale'),
    createPhases('sustain', 20, '最后冲刺20秒', 'hold'),
    createPhases('rest', 10, '呼气放松', 'exhale'),
    createPhases('rest', 5, '训练结束，你做到了！', 'inhale'),
  ]),
  // ===== 女性课程 =====
  defineCourse('female-beginner', '女性入门 · 感知盆底',
    '温和引导，帮助找到盆底肌，建立正确的收缩感知。适合初学者。',
    'female', 'beginner', [
    createPhases('rest', 5, '准备，找到舒服的坐姿，双手放在腹部', 'inhale'),
    createPhases('contract', 5, '轻轻收紧，像中断尿流的感觉', 'exhale'),
    createPhases('rest', 5, '完全放松', 'inhale'),
    createPhases('contract', 5, '再次轻柔收紧，保持腹部放松', 'exhale'),
    createPhases('rest', 5, '放松', 'inhale'),
    createPhases('sustain', 6, '保持收紧6秒，正常呼吸', 'hold'),
    createPhases('rest', 4, '呼气放松', 'exhale'),
    createPhases('rest', 4, '深吸气', 'inhale'),
    createPhases('contract', 5, '轻柔收紧', 'exhale'),
    createPhases('rest', 5, '放松', 'inhale'),
    createPhases('rest', 5, '训练结束，你做得很好！', 'inhale'),
  ]),
  defineCourse('female-intermediate', '女性进阶 · 耐力提升',
    '增加收缩时长，加入阶梯训练，提升盆底肌耐力与核心稳定性。',
    'female', 'intermediate', [
    createPhases('rest', 5, '准备，挺直背部，放松肩膀', 'inhale'),
    createPhases('contract', 5, '快速收紧', 'exhale'),
    createPhases('rest', 5, '放松', 'inhale'),
    createPhases('sustain', 10, '持续收紧10秒，配合自然呼吸', 'hold'),
    createPhases('rest', 4, '呼气放松', 'exhale'),
    createPhases('rest', 4, '深吸气', 'inhale'),
    createPhases('staircase', 16, '阶梯式收紧：4步递增', 'exhale', { steps: 4, stepDuration: 4 }),
    createPhases('rest', 8, '放松', 'inhale'),
    createPhases('sustain', 12, '持续收紧12秒', 'hold'),
    createPhases('rest', 4, '呼气放松', 'exhale'),
    createPhases('rest', 4, '深吸气', 'inhale'),
    createPhases('contract', 5, '快速收紧', 'exhale'),
    createPhases('rest', 5, '放松', 'inhale'),
    createPhases('sustain', 15, '持续收紧15秒', 'hold'),
    createPhases('rest', 4, '呼气放松', 'exhale'),
    createPhases('rest', 4, '深吸气', 'inhale'),
    createPhases('contract', 5, '快速收紧', 'exhale'),
    createPhases('rest', 5, '放松', 'inhale'),
    createPhases('rest', 5, '训练完成，深呼吸，感受身体的变化', 'inhale'),
  ]),
  defineCourse('female-advanced', '女性高阶 · 核心掌控',
    '高强度盆底肌训练，结合核心呼吸，全方位提升盆底肌力量与控制力。',
    'female', 'advanced', [
    createPhases('rest', 5, '准备，调整坐姿，找到中立位', 'inhale'),
    createPhases('contract', 3, '快速收紧', 'exhale'),
    createPhases('rest', 3, '放松', 'inhale'),
    createPhases('contract', 3, '快速收紧', 'exhale'),
    createPhases('rest', 3, '放松', 'inhale'),
    createPhases('sustain', 18, '持续收紧18秒', 'hold'),
    createPhases('rest', 5, '呼气放松', 'exhale'),
    createPhases('rest', 5, '深吸气', 'inhale'),
    createPhases('staircase', 20, '阶梯收紧：4步渐进', 'exhale', { steps: 4, stepDuration: 5 }),
    createPhases('rest', 10, '放松', 'inhale'),
    createPhases('sustain', 20, '持续收紧20秒', 'hold'),
    createPhases('rest', 5, '呼气放松', 'exhale'),
    createPhases('rest', 5, '深吸气', 'inhale'),
    createPhases('contract', 3, '快速收紧', 'exhale'),
    createPhases('rest', 3, '放松', 'inhale'),
    createPhases('staircase', 20, '阶梯收紧：4步', 'exhale', { steps: 4, stepDuration: 5 }),
    createPhases('rest', 10, '放松', 'inhale'),
    createPhases('sustain', 18, '最后坚持18秒！', 'hold'),
    createPhases('rest', 10, '呼气放松', 'exhale'),
    createPhases('rest', 5, '训练结束，为你骄傲！', 'inhale'),
  ]),
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