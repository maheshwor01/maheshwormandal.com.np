import { forwardRef, useImperativeHandle, useState } from 'react'
import ScrollLink from './ScrollLink'

const ENJOY_ITEMS = [
  ['🤖', 'Artificial Intelligence & Machine Learning'],
  ['📊', 'Data Science & Data Analysis'],
  ['🐍', 'Python Development'],
  ['🧠', 'Deep Learning'],
  ['🌐', 'Web Development & Django'],
  ['🚀', 'Building Practical Projects'],
  ['📚', 'Continuous Learning'],
  ['💡', 'Solving Real-World Problems'],
]

const About = forwardRef(function About(_, ref) {
  const [expanded, setExpanded] = useState(false)

  useImperativeHandle(ref, () => ({
    expandReadMore: () => setExpanded(true),
  }))

  const toggleReadMore = () => setExpanded((value) => !value)

  return (
    <section id="about" className="section section-alt">
      <div className="wrap">
        <div className="eyebrow">// 01 about_me</div>
        <h2 className="title">
          Turning Data into <span className="accent">Intelligence</span>
        </h2>
        <div className="about-grid">
          <div className="about-copy">
            <p>
              I&apos;m <b>Maheshwor Mandal</b>, a BSc IT student and an aspiring <b>AI/ML Engineer</b> with a strong
              interest in <b>Artificial Intelligence, Machine Learning, Data Science,</b> and <b>Web Development</b>.
            </p>
            <p>
              I enjoy exploring how technology, data, and intelligent systems can be used to solve real-world
              problems. My learning journey focuses on building a strong foundation in{' '}
              <b>Python, Machine Learning, Deep Learning, Data Analysis,</b> and <b>Django</b>, while gaining practical
              experience through hands-on projects.
            </p>

            <div className={`about-more${expanded ? ' open' : ''}`} id="aboutMore">
              <div className="about-more-inner">
                <p>
                  I believe the best way to learn technology is by <b>building, experimenting, and solving real problems</b>.
                  Through my projects, I continuously challenge myself to learn new concepts, improve my programming and
                  problem-solving skills, and turn ideas into useful applications.
                </p>
                <p>
                  Alongside AI/ML and Data Science, I&apos;m also interested in web development, particularly building
                  functional and user-friendly applications with <b>Django</b>. I enjoy exploring how intelligent
                  solutions can be integrated into practical web applications.
                </p>
              </div>
            </div>
            <button
              className="read-more-btn"
              id="aboutReadMoreBtn"
              type="button"
              data-expanded={expanded ? 'true' : 'false'}
              aria-expanded={expanded}
              aria-controls="aboutMore"
              onClick={toggleReadMore}
            >
              {expanded ? 'Read Less ▴' : 'Read More ▾'}
            </button>

            <div className="about-block">
              <h3>My Goal</h3>
              <p style={{ marginBottom: 0 }}>
                My goal is to grow into a skilled AI/ML Engineer and contribute to meaningful technology projects.
                I&apos;m always looking for opportunities to learn, collaborate, solve challenging problems, and turn
                ideas into impactful solutions.
              </p>
            </div>

            <div className="about-block">
              <h3>What I Enjoy</h3>
              <ul className="enjoy-list">
                {ENJOY_ITEMS.map(([icon, label]) => (
                  <li key={label}>
                    <span className="ic">{icon}</span> {label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="process-line">
              <b>Learn</b> <span className="arrow">→</span> <b>Build</b> <span className="arrow">→</span>{' '}
              <b>Experiment</b> <span className="arrow">→</span> <b>Improve</b>
            </div>

            <div className="about-cta">
              <ScrollLink to="contact" className="btn btn-primary">
                Let&apos;s Talk
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </ScrollLink>
            </div>
          </div>

          <div className="info-stack">
            <div className="info-card">
              <span className="ic">🎓</span>
              <div>
                <small>EDUCATION</small>
                <span className="val">
                  BSc Information Technology
                  <span className="sub">Westcliff University</span>
                </span>
              </div>
            </div>
            <div className="info-card">
              <span className="ic">📍</span>
              <div>
                <small>LOCATION</small>
                <span className="val">New Baneshwor, Kathmandu, Nepal 🇳🇵</span>
              </div>
            </div>
            <div className="info-card">
              <span className="ic">🎯</span>
              <div>
                <small>GOAL</small>
                <span className="val">AI/ML Engineer or Data Scientist</span>
              </div>
            </div>
            <div className="info-card">
              <span className="ic">💬</span>
              <div>
                <small>LANGUAGES</small>
                <span className="val">Nepali · Hindi · English</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})

export default About
