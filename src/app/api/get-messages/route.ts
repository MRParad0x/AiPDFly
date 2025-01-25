import { db } from '@/lib/db'
import { messages } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export const POST = async (req: Request) => {
  const { chatId } = await req.json()
  try {
    const _messages = await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, chatId))
    return NextResponse.json(_messages, { status: 200 })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}
