// Cloudflare Pages Function: POST /api/contact
// This runs on Cloudflare's edge (never in the visitor's browser), so
// RESEND_API_KEY is never exposed to frontend code. Your Resend API key goes in
// an environment variable named RESEND_API_KEY in the Cloudflare dashboard.
import { sendContactEmail } from '../../api/_sendContactEmail.js'

export async function onRequest(context) {
  const { request, env } = context

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'Method not allowed.' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', Allow: 'POST' },
    })
  }

  let payload = {}
  try {
    payload = await request.json()
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'Invalid request body.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { statusCode, body } = await sendContactEmail(payload, env.RESEND_API_KEY)
  return new Response(JSON.stringify(body), {
    status: statusCode,
    headers: { 'Content-Type': 'application/json' },
  })
}