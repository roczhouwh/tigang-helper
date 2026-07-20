import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
  try {
    const { issueType, severity, message } = await request.json();

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ advice: null, error: 'API key not configured' }, { status: 500 });
    }

    const openai = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey,
    });

    const prompt = `你是一个专业的体态纠正教练。用户正在进行盆底肌训练（提肛/凯格尔运动），当前检测到姿势问题：${message}（问题类型：${issueType}，严重程度：${Math.round(severity * 100)}%）。

请用简短的一句话（不超过40个字）给出具体的纠正建议。语气温和、鼓励，使用中文。只输出建议本身，不要加任何前缀。`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'deepseek-v4-pro',
      max_tokens: 100,
      temperature: 0.7,
      stream: false,
    });

    const advice = completion.choices[0]?.message?.content?.trim() || null;

    return NextResponse.json({ advice });
  } catch (error) {
    console.error('DeepSeek API error:', error);
    return NextResponse.json(
      { advice: null, error: 'Failed to get advice' },
      { status: 500 }
    );
  }
}