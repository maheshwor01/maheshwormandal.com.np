// Vercel serverless function: POST /api/contact
// This runs on the server, never in the visitor's browser, so RESEND_API_KEY
// is never exposed to frontend code or bundled into the built site.
// All actual validation/sending logic lives in _sendContactEmail.js, shared
// with the local dev-server middleware in vite.config.js.
import { sendContactEmail } from './_sendContactEmail.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ success: false, error: 'Method not allowed.' })
  }

  const { statusCode, body } = await sendContactEmail(req.body)
  return res.status(statusCode).json(body)
}
