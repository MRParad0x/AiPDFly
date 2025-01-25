import React from 'react'
import PDFViewer from '@/components/Client/PDFViewer'
import axiosInstance from '@/lib/axiosInstance'
import ShareHeader from '@/components/Client/ShareHeader'
import ShareComponent from '@/components/Client/ShareComponent'
import SharePassProtected from '@/components/Client/sharePassProtected'

type Props = {
  params: {
    shareId: string
  }
}

const SharePage = async ({ params: { shareId } }: Props) => {
  const response = await axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get-shared-chat`,
    { shareId }
  )

  const _shares = response.data

  let pdfName4Share = ''
  let pdfUrl4Share = ''
  let fileKey4Share = ''
  let createdAt4Share = ''
  let shareKey4Share = ''
  let password4Share = ''
  let chatId4Share = 0

  _shares.forEach(
    (share: {
      shares: { shareKey: any; password: any }
      chats: {
        id: any
        pdfName: any
        pdfUrl: any
        fileKey: any
        createdAt: any
      }
    }) => {
      const { shareKey, password } = share.shares
      const { pdfName, pdfUrl, fileKey, createdAt } = share.chats
      chatId4Share = share.chats.id
      shareKey4Share = shareKey
      password4Share = password
      pdfName4Share = pdfName
      pdfUrl4Share = pdfUrl
      fileKey4Share = fileKey
      createdAt4Share = createdAt
    }
  )

  return (
    <SharePassProtected password4Share={password4Share}>
      <div className='flex h-screen justify-center bg-gradient-to-r from-slate-50 via-teal-50 to-green-100'>
        <div className='m-6 flex w-3/5 flex-col gap-3 overflow-hidden'>
          {/* Header */}
          <div>
            <ShareHeader title={pdfName4Share} createdDate={createdAt4Share} />
          </div>

          {/* Main content */}
          <div className='flex flex-1 gap-3 overflow-hidden'>
            {/* PDF Viewer */}
            <div className='h-full w-1/2'>
              <PDFViewer pdf_url={pdfUrl4Share} />
            </div>
            {/* Chat Component */}
            <div className='h-full w-1/2'>
              <ShareComponent chatId={chatId4Share} />
            </div>
          </div>
        </div>
      </div>
    </SharePassProtected>
  )
}

export default SharePage
