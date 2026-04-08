// app/api/image/route.ts
import sharp from 'sharp'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return new Response('Missing file', { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const input = Buffer.from(arrayBuffer)

  const output = await sharp(input)
    .resize({ width: 1200, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toBuffer()

  return new Response(new Uint8Array(output), {
    headers: {
      'Content-Type': 'image/png',
    },
  })
}