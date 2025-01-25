import { S3 } from '@aws-sdk/client-s3'
import fs from 'fs'
import path from 'path'

export async function downloadFromS3(file_key: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const s3 = new S3({
        region: 'ap-southeast-1',
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!
        }
      })
      const params = {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: file_key
      }

      const obj = await s3.getObject(params)

      // Create directory
      const tmpDir = '/tmp'

      // Check if the directory exists, if not, create it
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir)
      }

      const file_name = path.join(
        tmpDir,
        `AiPDFly-${Date.now().toString()}.pdf`
      )
      if (obj.Body instanceof require('stream').Readable) {
        const file = fs.createWriteStream(file_name)
        file.on('open', function (fd) {
          // @ts-ignore
          obj.Body?.pipe(file).on('finish', () => {
            return resolve(file_name)
          })
        })
      }
    } catch (error) {
      console.error('S3-Server: ', error)
      reject(error)
      return null
    }
  })
}
