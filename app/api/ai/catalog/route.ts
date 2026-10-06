import { generateText } from 'ai'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { prompt } = await request.json()
  if (!prompt || typeof prompt !== 'string') return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
  const result = await generateText({ model: 'openai/gpt-4o-mini', system: 'You are the isklenses catalog assistant. Give concise, accurate merchandising suggestions for contact lens products. Never make medical claims.', prompt })
  return NextResponse.json({ text: result.text })
}
