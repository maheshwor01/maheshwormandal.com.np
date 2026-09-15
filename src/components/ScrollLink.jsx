export default function ScrollLink({ to, children, className, onNavigate, ...props }) {
  const activate = (e) => {
    e.preventDefault()
    if (!to) return
    const target = document.getElementById(to)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      onNavigate?.()
    }
  }

  return (
    <a
      role="link"
      tabIndex={0}
      className={className}
      style={{ cursor: to ? 'pointer' : undefined }}
      onClick={activate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') activate(e)
      }}
      {...props}
    >
      {children}
    </a>
  )
}
