// pages/api/events.ts
import { NextApiRequest, NextApiResponse } from 'next'

let clients: NextApiResponse[] = []

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  clients.push(res)

  req.on('close', () => {
    clients = clients.filter(client => client !== res)
  })
}

export function notifyClients(event: string) {
  clients.forEach(res => res.write(`data: ${event}\n\n`))
}

export default handler
