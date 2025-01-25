import { db } from '@/lib/db'
import { shares } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export const POST = async (req: Request) => {
  try {
    const { chatId } = await req.json()

    // Delete shares associated with the chatId
    await db.delete(shares).where(eq(shares.chatId, chatId)).execute()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting chat:', error)
    return NextResponse.json(
      { error: 'internal server error' },
      { status: 500 }
    )
  }
}
