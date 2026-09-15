import ScrollLink from './ScrollLink'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <small>© 2026 Maheshwor Mandal. Built with curiosity and code.</small>
        <div className="footer-social">
          <a className="icon-btn" href="https://github.com/maheshwor01" target="_blank" rel="noopener" aria-label="GitHub">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.5 0-.24-.01-1.05-.01-1.9-2.78.62-3.37-1.2-3.37-1.2-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.9-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .28.18.61.69.5C19.13 20.61 22 16.78 22 12.25 22 6.58 17.52 2 12 2z" />
            </svg>
          </a>
          <a className="icon-btn" href="https://linkedin.com/in/maheshwor-mandal-93040a293" target="_blank" rel="noopener" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.94 5a2 2 0 11-4-.02 2 2 0 014 .02zM7 8.48H3V21h4V8.48zM13.5 8.48h-3.8V21h3.8v-6.4c0-3.57 4.6-3.86 4.6 0V21H22v-7.2c0-6.2-6.86-5.97-8.5-2.92V8.48z" />
            </svg>
          </a>
          <a className="icon-btn" href="mailto:345mandalmahesh@gmail.com" aria-label="Email">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16v16H4z" />
              <path d="M4 6l8 7 8-7" />
            </svg>
          </a>
        </div>
        <ScrollLink to="home" className="to-top">
          BACK TO TOP ↑
        </ScrollLink>
      </div>
    </footer>
  )
}
