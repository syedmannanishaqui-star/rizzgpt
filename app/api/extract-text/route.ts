import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'No image provided' },
        { status: 400 }
      )
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')

    // Use Gemini Vision to extract text
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `Extract all the text from this chat screenshot. 
    Return ONLY the conversation text, preserving the order and structure.
    Format it as: "Person A: message" on each line.
    Do not add any commentary or explanation.`

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: image.type,
          data: base64Image,
        },
      },
    ])

    const response = await result.response
    const text = response.text()

    return NextResponse.json({
      success: true,
      text: text.trim(),
    })
  } catch (error) {
    console.error('Error extracting text:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to extract text from image' },
      { status: 500 }
    )
  }
}
