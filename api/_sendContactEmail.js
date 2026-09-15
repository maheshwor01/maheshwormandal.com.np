// Shared logic for handling a contact-form submission and emailing it via Resend.
// This file is transport-agnostic: it takes a plain payload object and returns
// { statusCode, body }. Both api/contact.js (Vercel) and the Vite dev-server
// middleware (vite.config.js) call this same function, so there's exactly one
// place validation/sending logic lives, in dev and in production alike.
import { Resend } from 'resend'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const TO_ADDRESS = '345mandalmahesh@gmail.com'

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function sendContactEmail(payload) {
  const { name, email, subject, message, website } = payload || {}

  // Honeypot: real visitors never fill this hidden field, bots often do.
  if (website) {
    return { statusCode: 200, body: { success: true } }
  }

  const cleanName = typeof name === 'string' ? name.trim() : ''
  const cleanEmail = typeof email === 'string' ? email.trim() : ''
  const cleanSubject = typeof subject === 'string' ? subject.trim() : ''
  const cleanMessage = typeof message === 'string' ? message.trim() : ''

  const errors = {}
  if (!cleanName) errors.name = 'Name is required.'
  if (!cleanEmail) errors.email = 'Email is required.'
  else if (!EMAIL_RE.test(cleanEmail)) errors.email = 'Enter a valid email address.'
  if (!cleanMessage) errors.message = 'Message is required.'
  else if (cleanMessage.length < 10) errors.message = 'Message is too short.'

  if (Object.keys(errors).length > 0) {
    return {
      statusCode: 400,
      body: { success: false, error: 'Please fix the highlighted fields.', fieldErrors: errors },
    }
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set. Add it to .env for local dev, or your host\'s environment variables in production.')
    return { statusCode: 500, body: { success: false, error: 'Email service is not configured on the server.' } }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const finalSubject = cleanSubject || `Portfolio inquiry from ${cleanName}`

  try {
    const { data, error } = await resend.emails.send({
      // onboarding@resend.dev works out of the box with no domain setup and
      // can deliver to any recipient, including Gmail. Swap in a verified
      // sender address later if you connect your own domain in Resend.
      from: 'Portfolio Contact Form <onboarding@resend.dev>',
      to: [TO_ADDRESS],
      replyTo: cleanEmail,
      subject: finalSubject,
      text: `From: ${cleanName} <${cleanEmail}>\nSubject: ${finalSubject}\n\n${cleanMessage}`,
      html: `
        <div style="font-family: Arial, sans-serif; font-size: 15px; color: #1a1a1a;">
          <p><strong>Name:</strong> ${escapeHtml(cleanName)}</p>
          <p><strong>Email:</strong> ${escapeHtml(cleanEmail)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(finalSubject)}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${escapeHtml(cleanMessage)}</p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return {
        statusCode: 502,
        body: { success: false, error: 'The email service rejected the message. Please try again later.' },
      }
    }

    return { statusCode: 200, body: { success: true, id: data?.id } }
  } catch (err) {
    console.error('Unexpected error sending email:', err)
    return { statusCode: 500, body: { success: false, error: 'Unexpected server error. Please try again later.' } }
  }
}
