import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

const tonePrompts = {
  subtle: 'friendly, warm, and slightly playful. Use light humor and show genuine interest.',
  moderate: 'confident, playful, and charming. Include subtle compliments and witty responses.',
  bold: 'direct, flirty, and charismatic. Use clear compliments and show strong interest.',
  'very-bold': 'maximum rizz - smooth, confident, and boldly flirtatious. Pull out all the stops.',
}

export async function POST(request: NextRequest) {
  try {
    const { chatContext, tone } = await request.json()

    if (!chatContext || !tone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const toneDescription = tonePrompts[tone as keyof typeof tonePrompts] || tonePrompts.moderate

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `You are RizzGPT, an AI that helps people craft charismatic, flirty responses to chat messages.

Context of the conversation:
${chatContext}

Generate 4 different response options that are ${toneDescription}

Requirements:
- Each response should be natural and conversational
- Match the tone level requested (${tone})
- Be contextually appropriate to the conversation
- Keep responses concise (1-3 sentences max)
- Make them feel authentic, not robotic
- Vary the approach in each response

Return ONLY a JSON array with 4 responses in this exact format:
[
  {"id": 1, "text": "response text here", "tone": "${tone}"},
  {"id": 2, "text": "response text here", "tone": "${tone}"},
  {"id": 3, "text": "response text here", "tone": "${tone}"},
  {"id": 4, "text": "response text here", "tone": "${tone}"}
]

Do not include any other text, explanation, or markdown formatting.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text().trim()

    // Clean up the response - remove markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    // Parse the JSON response
    const responses = JSON.parse(text)

    return NextResponse.json({
      success: true,
      responses,
    })
  } catch (error) {
    console.error('Error generating responses:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate responses' },
      { status: 500 }
    )
  }
}
