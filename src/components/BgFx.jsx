export default function BgFx() {
  return (
    <div className="bg-fx" aria-hidden="true">
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        <g stroke="var(--orange)" strokeOpacity="0.15">
          <line x1="120" y1="90" x2="260" y2="180" />
          <line x1="1400" y1="120" x2="1290" y2="230" />
          <line x1="1480" y1="520" x2="1360" y2="470" />
        </g>
        <g stroke="var(--purple)" strokeOpacity="0.12">
          <line x1="950" y1="300" x2="1080" y2="380" />
          <line x1="80" y1="600" x2="200" y2="560" />
        </g>
        <g fill="var(--orange)" fillOpacity="0.5">
          <circle cx="120" cy="90" r="3" />
          <circle cx="260" cy="180" r="2" />
          <circle cx="1400" cy="120" r="2.5" />
          <circle cx="1290" cy="230" r="3" />
          <circle cx="1480" cy="520" r="2" />
          <circle cx="1360" cy="470" r="2.5" />
          <circle cx="60" cy="360" r="2" />
          <circle cx="740" cy="60" r="2" />
          <circle cx="1550" cy="700" r="2.5" />
          <circle cx="400" cy="820" r="2" />
        </g>
        <g fill="var(--purple)" fillOpacity="0.4">
          <circle cx="950" cy="300" r="2.5" />
          <circle cx="1080" cy="380" r="2" />
          <circle cx="80" cy="600" r="2.5" />
          <circle cx="200" cy="560" r="2" />
          <circle cx="900" cy="780" r="2" />
          <circle cx="1200" cy="150" r="2" />
        </g>
      </svg>
    </div>
  )
}
