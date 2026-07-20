import { PoseLandmark, PostureAnalysis, PostureIssueType } from '@/types';

// MediaPipe Pose 返回的关键点坐标 (x, y, z, visibility)
export interface Landmark {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

// 计算两个关键点之间的角度（相对于垂直方向）
function angleBetween(p1: Landmark, p2: Landmark): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.atan2(dx, -dy) * (180 / Math.PI);
}

// 计算两点间距离
function distance(p1: Landmark, p2: Landmark): number {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}

// 肩膀倾斜角度
function getShoulderTilt(leftShoulder: Landmark, rightShoulder: Landmark): number {
  return angleBetween(leftShoulder, rightShoulder);
}

// 驼背检测：通过肩-髋-耳关系判断
function detectSlouch(
  leftShoulder: Landmark,
  rightShoulder: Landmark,
  leftHip: Landmark,
  rightHip: Landmark,
  leftEar: Landmark,
  rightEar: Landmark
): number {
  // 肩部中点
  const shoulderMidX = (leftShoulder.x + rightShoulder.x) / 2;
  const shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2;
  // 髋部中点
  const hipMidX = (leftHip.x + rightHip.x) / 2;
  const hipMidY = (leftHip.y + rightHip.y) / 2;
  // 耳部中点
  const earMidX = (leftEar.x + rightEar.x) / 2;
  const earMidY = (leftEar.y + rightEar.y) / 2;

  // 耳朵到肩部向量
  const earToShoulder = Math.atan2(shoulderMidX - earMidX, shoulderMidY - earMidY) * (180 / Math.PI);
  // 肩部到髋部向量
  const shoulderToHip = Math.atan2(hipMidX - shoulderMidX, hipMidY - shoulderMidY) * (180 / Math.PI);

  // 驼背：耳朵前倾 + 肩部前倾
  return Math.abs(earToShoulder) + Math.abs(shoulderToHip);
}

// 头前倾检测
function detectHeadForward(
  leftEar: Landmark,
  rightEar: Landmark,
  leftShoulder: Landmark,
  rightShoulder: Landmark
): number {
  const earMidX = (leftEar.x + rightEar.x) / 2;
  const shoulderMidX = (leftShoulder.x + rightShoulder.x) / 2;
  // 耳朵相对于肩膀的水平偏移
  return Math.abs(earMidX - shoulderMidX);
}

// 主分析函数
export function analyzePosture(landmarks: Landmark[]): PostureAnalysis {
  if (!landmarks || landmarks.length < 33) {
    return { issueType: 'none', severity: 0, angle: 0, message: '未检测到完整姿势' };
  }

  const leftShoulder = landmarks[PoseLandmark.LEFT_SHOULDER];
  const rightShoulder = landmarks[PoseLandmark.RIGHT_SHOULDER];
  const leftHip = landmarks[PoseLandmark.LEFT_HIP];
  const rightHip = landmarks[PoseLandmark.RIGHT_HIP];
  const leftEar = landmarks[PoseLandmark.LEFT_EAR];
  const rightEar = landmarks[PoseLandmark.RIGHT_EAR];

  // 检查关键点可见度
  const minVisibility = 0.5;
  const keyPoints = [leftShoulder, rightShoulder, leftHip, rightHip, leftEar, rightEar];
  if (keyPoints.some(p => p.visibility < minVisibility)) {
    return { issueType: 'none', severity: 0, angle: 0, message: '请确保全身在画面中' };
  }

  // 检测肩膀倾斜
  const shoulderTilt = getShoulderTilt(leftShoulder, rightShoulder);
  const tiltThreshold = 10; // 超过10度视为倾斜

  // 检测驼背
  const slouchAngle = detectSlouch(leftShoulder, rightShoulder, leftHip, rightHip, leftEar, rightEar);
  const slouchThreshold = 15;

  // 检测头前倾
  const headForward = detectHeadForward(leftEar, rightEar, leftShoulder, rightShoulder);
  const headForwardThreshold = 0.08; // 归一化坐标下

  // 检测耸肩（肩部 y 坐标比正常高）
  const shoulderHeightDiff = Math.abs(leftShoulder.y - rightShoulder.y);
  const shoulderRaiseThreshold = 0.03;

  // 判断最严重的问题
  const issues: { type: PostureIssueType; severity: number; message: string }[] = [];

  if (slouchAngle > slouchThreshold) {
    const severity = Math.min(1, (slouchAngle - slouchThreshold) / 20);
    issues.push({ type: 'slouch', severity, message: '检测到驼背，请挺直腰背' });
  }

  if (Math.abs(shoulderTilt) > tiltThreshold) {
    const severity = Math.min(1, (Math.abs(shoulderTilt) - tiltThreshold) / 15);
    issues.push({ type: 'body_tilt', severity, message: '身体歪斜，请调整坐姿' });
  }

  if (shoulderHeightDiff > shoulderRaiseThreshold) {
    const severity = Math.min(1, (shoulderHeightDiff - shoulderRaiseThreshold) / 0.05);
    issues.push({ type: 'shoulder_raise', severity, message: '肩膀不平，请放松双肩' });
  }

  if (headForward > headForwardThreshold) {
    const severity = Math.min(1, (headForward - headForwardThreshold) / 0.05);
    issues.push({ type: 'head_forward', severity, message: '头部前倾，请收下巴' });
  }

  if (issues.length === 0) {
    return { issueType: 'none', severity: 0, angle: 0, message: '姿势良好' };
  }

  // 返回最严重的问题
  issues.sort((a, b) => b.severity - a.severity);
  const worst = issues[0];
  return {
    issueType: worst.type,
    severity: worst.severity,
    angle: Math.round(slouchAngle),
    message: worst.message,
  };
}

// 计算姿势评分（0-100）
export function calculatePostureScore(analysis: PostureAnalysis): number {
  if (analysis.issueType === 'none') return 100;
  return Math.max(0, Math.round(100 - analysis.severity * 100));
}