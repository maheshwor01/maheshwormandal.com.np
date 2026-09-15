import { forwardRef, useImperativeHandle, useState } from 'react'

const TABS = [
  { id: 'frontend', icon: '🌐', label: 'Frontend' },
  { id: 'backend', icon: '🐍', label: 'Backend' },
  { id: 'database', icon: '🗄️', label: 'Database' },
  { id: 'tools', icon: '🛠️', label: 'Tools' },
  { id: 'data', icon: '📊', label: 'Data' },
  { id: 'security', icon: '🛡️', label: 'Security' },
]

const TAB_CONTENT = {
  frontend: [
    ['🌐', 'HTML & CSS', 'Markup & Styling'],
    ['⚡', 'JavaScript', 'Interactivity'],
    ['⚛️', 'React', 'UI Library'],
    ['🎨', 'Tailwind CSS', 'Utility-First CSS'],
    ['🅱️', 'Bootstrap', 'CSS Framework'],
  ],
  backend: [
    ['🐍', 'Python', 'Core Language'],
    ['🎯', 'Django', 'Web Framework'],
    ['🟢', 'Node.js', 'Runtime'],
    ['⚙️', 'C++', 'Core Language'],
    ['☕', 'Java', 'Core Language'],
  ],
  database: [
    ['🐬', 'MySQL', 'Relational DB'],
    ['🐘', 'PostgreSQL', 'Relational DB'],
    ['🍃', 'MongoDB', 'NoSQL DB'],
    ['💾', 'SQLite', 'Lightweight DB'],
    ['🔥', 'Firebase', 'Cloud DB'],
  ],
  tools: [
    ['🐧', 'Linux', 'OS & CLI'],
    ['🔀', 'Git & GitHub', 'Version Control'],
    ['📓', 'Jupyter', 'Notebooks'],
    ['☁️', 'Google Colab', 'Cloud ML'],
    ['🧩', 'VS Code', 'Editor'],
    ['💠', 'IntelliJ IDEA', 'Java IDE'],
    ['🐍', 'PyScripter', 'Python IDE'],
    ['📊', 'Tableau', 'Data Viz'],
  ],
  data: [
    ['🐍', 'Python', 'Core Language'],
    ['🔥', 'PyTorch', 'Deep Learning'],
    ['🧠', 'TensorFlow', 'Deep Learning'],
    ['🔬', 'scikit-learn', 'Machine Learning'],
    ['🔢', 'NumPy', 'Numerical Computing'],
    ['🐼', 'Pandas', 'Data Handling'],
    ['📈', 'Matplotlib', 'Data Visualization', true],
    ['🤗', 'Hugging Face', 'NLP Models', true],
    ['✳️', 'Anthropic', 'Claude API', true],
  ],
  security: [
    ['🌐', 'OSI Model', 'Networking Fundamentals'],
    ['🔌', 'TCP/IP', 'Networking Fundamentals'],
    ['🔢', 'IP Addressing', 'Networking Fundamentals'],
    ['🔒', 'Network Security', 'Basic Concepts'],
    ['🐧', 'Linux', 'Security Tool'],
    ['📡', 'Nmap', 'Network Scanning'],
    ['🦈', 'Wireshark', 'Packet Analysis'],
    ['📦', 'tcpdump', 'Packet Capture'],
  ],
}

const Skills = forwardRef(function Skills(_, ref) {
  const [activeTab, setActiveTab] = useState('frontend')
  const [dataExpanded, setDataExpanded] = useState(false)

  const activateTab = (id) => setActiveTab(id)

  useImperativeHandle(ref, () => ({
    activateTab,
    expandDataShowMore: () => setDataExpanded(true),
  }))

  const toggleDataShowMore = () => setDataExpanded((value) => !value)

  return (
    <section id="skills" className="section">
      <div className="wrap">
        <div className="eyebrow">// 02 skills</div>
        <h2 className="title">
          My Tech <span className="accent">Stack</span>
        </h2>
        <p className="section-lead">
          Grouped by where each tool actually shows up in my work — frontend, backend, databases, tooling, and data.
        </p>

        <div className="tabs-nav" id="tabsNav" role="tablist">
          {TABS.map(({ id, icon, label }) => (
            <button
              key={id}
              className={`tab-btn${activeTab === id ? ' active' : ''}`}
              data-tab={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => activateTab(id)}
            >
              <span className="tico">{icon}</span> {label}
            </button>
          ))}
        </div>

        {TABS.map(({ id }) => (
          <div key={id} className={`tab-panel${activeTab === id ? ' active' : ''}`} id={`tab-${id}`}>
            <div className="icon-grid">
              {TAB_CONTENT[id].map(([glyph, name, sub, hiddenExtra]) => (
                <div
                  key={name}
                  className={`icon-card${hiddenExtra ? ' hidden-extra' : ''}${hiddenExtra && dataExpanded ? ' show' : ''}`}
                >
                  <span className="glyph">{glyph}</span>
                  <span className="name">{name}</span>
                  <span className="sub">{sub}</span>
                </div>
              ))}
            </div>
            {id === 'data' && (
              <div className="show-more-wrap">
                <button
                  className="show-more-btn"
                  type="button"
                  data-expanded={dataExpanded ? 'true' : 'false'}
                  onClick={toggleDataShowMore}
                >
                  {dataExpanded ? 'Show Less ▴' : 'Show More ▾'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
})

export default Skills
