import { db } from '@/lib/db'
import { chats } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export const POST = async (req: Request) => {
  try {
    const { chatId, newPdfName } = await req.json()

    // Update the pdfName for the chat record with the given chatId
    await db
      .update(chats)
      .set({ pdfName: newPdfName })
      .where(eq(chats.id, chatId))
      .execute()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error renaming pdfName:', error)
    return NextResponse.json(
      { error: 'internal server error' },
      { status: 500 }
    )
  }
}
