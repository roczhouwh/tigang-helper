// 训练动作类型
export type ActionType = 'contract' | 'sustain' | 'staircase' | 'rest';

// 呼吸模式
export type BreathPattern = 'inhale' | 'exhale' | 'hold';

// 训练难度
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

// 目标性别
export type Gender = 'male' | 'female' | 'all';

// 训练动作
export interface Action {
  type: ActionType;
  duration: number; // 秒
  instruction: string;
  breathPattern: BreathPattern;
  // 阶梯收缩特有参数
  steps?: number;
  stepDuration?: number;
}

// 训练课程
export interface Course {
  id: string;
  name: string;
  description: string;
  gender: Gender;
  difficulty: Difficulty;
  totalDuration: number; // 秒
  actionCount: number;
  actions: Action[];
}

// 训练记录
export interface TrainingRecord {
  date: string; // YYYY-MM-DD
  courseId: string;
  courseName: string;
  duration: number; // 实际训练秒数
  completed: boolean;
  postureScore: number; // 0-100
}

// 姿势问题类型
export type PostureIssueType = 'slouch' | 'shoulder_raise' | 'body_tilt' | 'head_forward' | 'none';

// 姿势分析结果
export interface PostureAnalysis {
  issueType: PostureIssueType;
  severity: number; // 0-1
  angle: number; // 偏差角度
  message: string;
}

// MediaPipe Pose 关键点索引
export enum PoseLandmark {
  NOSE = 0,
  LEFT_EYE_INNER = 1,
  LEFT_EYE = 2,
  LEFT_EYE_OUTER = 3,
  RIGHT_EYE_INNER = 4,
  RIGHT_EYE = 5,
  RIGHT_EYE_OUTER = 6,
  LEFT_EAR = 7,
  RIGHT_EAR = 8,
  MOUTH_LEFT = 9,
  MOUTH_RIGHT = 10,
  LEFT_SHOULDER = 11,
  RIGHT_SHOULDER = 12,
  LEFT_ELBOW = 13,
  RIGHT_ELBOW = 14,
  LEFT_WRIST = 15,
  RIGHT_WRIST = 16,
  LEFT_PINKY = 17,
  RIGHT_PINKY = 18,
  LEFT_INDEX = 19,
  RIGHT_INDEX = 20,
  LEFT_THUMB = 21,
  RIGHT_THUMB = 22,
  LEFT_HIP = 23,
  RIGHT_HIP = 24,
  LEFT_KNEE = 25,
  RIGHT_KNEE = 26,
  LEFT_ANKLE = 27,
  RIGHT_ANKLE = 28,
  LEFT_HEEL = 29,
  RIGHT_HEEL = 30,
  LEFT_FOOT_INDEX = 31,
  RIGHT_FOOT_INDEX = 32,
}

// 训练状态
export type TrainingStatus = 'idle' | 'countdown' | 'active' | 'paused' | 'completed';

// 训练会话状态
export interface TrainingState {
  status: TrainingStatus;
  currentActionIndex: number;
  actionTimeLeft: number;
  totalTimeLeft: number;
  isCameraOn: boolean;
  postureIssue: PostureAnalysis | null;
  aiFeedback: string | null;
}