import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { sendContactEmail } from './api/_sendContactEmail.js'

// Handles POST /api/contact during `npm run dev` by calling the exact same
// logic the production Vercel serverless function (api/contact.js) uses, so
// the contact form actually sends real email locally too, with no extra
// tooling (no Vercel CLI needed) required just to test it.
function contactApiDevPlugin() {
  return {
    name: 'contact-api-dev-middleware',
    configureServer(server) {
      // Load .env / .env.local into process.env so RESEND_API_KEY is available
      // here, mirroring how it would be set in Vercel's dashboard in production.
      const env = loadEnv('development', process.cwd(), '')
      Object.assign(process.env, env)

      server.middlewares.use('/api/contact', async (req, res, next) => {
        if (req.method !== 'POST') {
          if (req.method === 'OPTIONS') return next()
          res.statusCode = 405
          res.setHeader('Allow', 'POST')
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: false, error: 'Method not allowed.' }))
          return
        }

        let raw = ''
        req.on('data', (chunk) => {
          raw += chunk
        })
        req.on('end', async () => {
          let payload = {}
          try {
            payload = raw ? JSON.parse(raw) : {}
          } catch {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: false, error: 'Invalid request body.' }))
            return
          }

          const { statusCode, body } = await sendContactEmail(payload)
          res.statusCode = statusCode
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(body))
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), contactApiDevPlugin()],
  server: {
    port: 5173,
    strictPort: true,
  },
})
