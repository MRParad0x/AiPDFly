import { db } from '@/lib/db'
import { shares } from '@/lib/db/schema'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export const POST = async (req: Request) => {
  try {
    const { chatId, password, userId } = await req.json() // Retrieve password from request body
    const uniqueKey = uuidv4()

    // Update the chat record with the unique key and password
    await db.insert(shares).values({
      chatId,
      userId,
      shareKey: uniqueKey,
      password: password || null // Assuming password can be null as per your requirement
    })

    const { protocol, host } = new URL(req.url)
    const baseUrl = `${protocol}//${host}`

    return NextResponse.json({
      link: `${baseUrl}/share/${uniqueKey}`
    })
  } catch (error) {
    console.error('Error generating share link:', error)
    return NextResponse.json(
      { error: 'internal server error' },
      { status: 500 }
    )
  }
}
