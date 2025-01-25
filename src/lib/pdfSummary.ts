// api/generate-pdf-summary.ts
import { NextResponse } from 'next/server'
import { Configuration, OpenAIApi } from 'openai-edge'
import { db } from '@/lib/db'
import { chats, messages as _messages } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { loadS3IntoPinecone } from '@/lib/pinecone'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config)

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { chatId, fileKey } = await req.json()
    const chat = await db.select().from(chats).where(eq(chats.id, chatId))
    if (chat.length !== 1) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 })
    }

    const pdfContent = await loadS3IntoPinecone(fileKey)
    if (!pdfContent) {
      return NextResponse.json(
        { error: 'Failed to load PDF content' },
        { status: 500 }
      )
    }

    const textContent = pdfContent.map(doc => doc.pageContent).join('\n')
    const summary = await generateSummary(textContent)

    await db.insert(_messages).values({
      chatId,
      content: summary,
      role: 'system'
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

async function generateSummary(text: string) {
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'Please summarize the following text in a few sentences.'
      },
      {
        role: 'user',
        content: text
      }
    ]
  })
  const result = await response.json()
  return result.choices[0].message.content
}
