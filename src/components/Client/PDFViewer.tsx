'use client'

import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'

type Props = { pdf_url: string }

const PDFViewer = ({ pdf_url }: Props) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin()
  const theme = 'light'

  return (
    <div className='relative h-full w-full rounded-[2rem] bg-gray-900'>
      <Worker workerUrl='https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js'>
        <div className='h-full w-full overflow-hidden rounded-[2rem] border-[20px] border-gray-900'>
          <Viewer
            fileUrl={pdf_url}
            plugins={[defaultLayoutPluginInstance]}
            defaultScale={SpecialZoomLevel.PageFit}
            theme={theme}
          />
        </div>
      </Worker>
    </div>
  )
}

export default PDFViewer
