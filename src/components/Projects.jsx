const PROJECTS = [
  {
    title: 'Student Performance Prediction',
    tag: 'ML',
    description:
      'An ML model that analyses study habits, attendance, and historical grades to predict at-risk students early — empowering educators with actionable insights before it\'s too late.',
    tech: ['Python', 'Scikit-learn', 'Pandas', 'Random Forest'],
    featured: false,
  },
  {
    title: 'Heart Disease Prediction',
    tag: 'ML',
    description:
      'A clinical classification model trained on real patient data — using age, cholesterol, ECG, and blood pressure features to predict cardiovascular risk with high accuracy.',
    tech: ['Python', 'Logistic Regression', 'NumPy', 'EDA'],
    featured: false,
  },
  {
    title: 'Threat Detection System',
    tag: 'Cybersecurity',
    description:
      'A cybersecurity ML system that monitors network traffic in real time, detecting anomalies, zero-day intrusions, and potential threats using behavioural pattern analysis.',
    tech: ['Python', 'ML', 'Cybersecurity', 'Networking'],
    featured: true,
  },
  {
    title: 'Weather App',
    tag: 'Web Dev',
    description:
      'A real-time weather dashboard consuming a live public API to display current conditions and forecasts through a clean, responsive interface.',
    tech: ['HTML', 'CSS', 'JavaScript', 'API'],
    featured: false,
  },
  {
    title: 'Personal Portfolio',
    tag: 'Web Dev',
    description:
      'This very portfolio — built from scratch with pure HTML, CSS, and JS. Features smooth scrolling, an in-page search, and a fully responsive layout.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    featured: false,
  },
  {
    title: 'Movie Recommendation System',
    tag: 'Data Science',
    description:
      'A content-based recommender that suggests similar movies using metadata and similarity scoring across a public movie dataset.',
    tech: ['Python', 'Pandas', 'Cosine Similarity'],
    featured: false,
  },
  {
    title: 'Sales Data Analysis Dashboard',
    tag: 'Data Analysis',
    description:
      'An exploratory analysis of retail sales data, surfacing trends and seasonality through cleaned data and clear visualizations.',
    tech: ['Python', 'Pandas', 'Matplotlib'],
    featured: false,
  },
]

function ProjectLinks() {
  return (
    <div className="project-links">
      <a href="#" onClick={(e) => e.preventDefault()}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
        </svg>
        Code
      </a>
      <a href="#" onClick={(e) => e.preventDefault()}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 3h7v7M21 3l-9 9M5 5h6v0H5v14h14v-6" />
        </svg>
        Details
      </a>
    </div>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="section section-alt">
      <div className="wrap">
        <div className="eyebrow">// 03 projects</div>
        <h2 className="title">
          Things I&apos;ve <span className="accent">Built</span>
        </h2>
        <p className="section-lead">
          A mix of machine learning experiments and applied data projects — each one built to learn something specific.
        </p>
        <div className="project-grid">
          {PROJECTS.map((project) => (
            <div key={project.title} className={`project-card${project.featured ? ' featured' : ''}`}>
              <div className="project-top">
                <h3>{project.title}</h3>
                <span className="project-tag">{project.tag}</span>
              </div>
              <p>{project.description}</p>
              <div className="project-tech">
                {project.tech.map((item) => (
                  <span key={item} className="tech-pill">
                    {item}
                  </span>
                ))}
              </div>
              <ProjectLinks />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
