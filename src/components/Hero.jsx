import ScrollLink from './ScrollLink'

const PROFILE_PHOTO =
  'https://res.cloudinary.com/dwcwej4nx/image/upload/v1778550270/profile/kn3mwt2x9guomkyi9vpz.jpg'

export default function Hero() {
  return (
    <section id="home" className="section hero">
      <div className="wrap">
        <div className="hero-grid">
          <div>
            <div className="kicker">Building Intelligent Solutions with AI &amp; Data</div>
            <div className="badge">Available for opportunities</div>
            <h1>
              <span className="lead-in">Hi, I&apos;m</span>
              Maheshwor
              <br />
              <span className="accent">Mandal</span>
            </h1>
            <div className="role-line">
              Aspiring AI/ML Engineer <span className="sep">|</span> Data Science Enthusiast
            </div>
            <p>
              I&apos;m a <b>BSc IT student</b> passionate about{' '}
              <b>Artificial Intelligence, Machine Learning, Data Science,</b> and <b>Python</b>. I build practical
              projects, explore intelligent technologies, and continuously turn what I learn into real-world
              applications.
            </p>
            <p>
              I&apos;m currently focused on <b>Machine Learning, Deep Learning, Data Analysis, Python,</b> and{' '}
              <b>Django</b>, while continuously improving my skills through hands-on projects.
            </p>
            <div className="now-line">
              <b>Currently:</b> Learning <span className="dot-sep">•</span> Building Projects{' '}
              <span className="dot-sep">•</span> Exploring AI/ML &amp; Web Development
            </div>

            <div className="btn-row">
              <ScrollLink to="projects" className="btn btn-primary">
                Explore My Work
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </ScrollLink>
              <a href="/resume.pdf" className="btn btn-ghost" download="Maheshwor_Mandal_Resume.pdf">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" />
                </svg>
                Download Resume
              </a>
              <a href="https://github.com/maheshwor01" className="btn btn-ghost" target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.5 0-.24-.01-1.05-.01-1.9-2.78.62-3.37-1.2-3.37-1.2-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.9-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .28.18.61.69.5C19.13 20.61 22 16.78 22 12.25 22 6.58 17.52 2 12 2z" />
                </svg>
                GitHub Profile
              </a>
            </div>

            <div className="stats">
              <div className="stat">
                <div className="num">5+</div>
                <div className="lbl">PROJECTS</div>
              </div>
              <div className="stat">
                <div className="num">5+</div>
                <div className="lbl">TECHNOLOGIES</div>
              </div>
              <div className="stat">
                <div className="num">3</div>
                <div className="lbl">FOCUS AREAS</div>
              </div>
              <div className="stat">
                <div className="num">∞</div>
                <div className="lbl">CURIOSITY</div>
              </div>
            </div>
          </div>

          <div className="portrait-wrap">
            <div className="portrait">
              <div className="portrait-inner">
                <img src={PROFILE_PHOTO} alt="Maheshwor Mandal" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
