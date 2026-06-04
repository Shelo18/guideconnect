// ─── Shared UI atoms ──────────────────────────────────────────────────────

const AVATAR_BG   = ["#EDD5CC","#E8D0D8","#D5DCCC","#D0D8E8"]
const AVATAR_TEXT = ["#9E5555","#8A3E5A","#5A6E4A","#3E5A8A"]

export const RANK_STYLES = {
  Elite:    { bg:"#F9E8E8", text:"#7A2E2E", border:"#E4B0B0" },
  Expert:   { bg:"#F9EEE0", text:"#7A4E20", border:"#E4C898" },
  Trusted:  { bg:"#E8F0E8", text:"#2E5A2E", border:"#A8C8A8" },
  Rising:   { bg:"#E8EEF9", text:"#2E3E7A", border:"#A8B8E4" },
  Newcomer: { bg:"#F0EEF9", text:"#4E3E7A", border:"#C8B8E4" },
}

export function Stars({ rating, size = 13 }) {
  return (
    <span style={{ fontSize: size, letterSpacing: 2 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= Math.round(rating) ? "#C47E7E" : "#E8D0D0" }}>♥</span>
      ))}
    </span>
  )
}

export function Avatar({ initials, index, size = 48 }) {
  const i = (index || 0) % 4
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: AVATAR_BG[i], color: AVATAR_TEXT[i],
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--serif)", fontSize: size * 0.3, fontWeight: 400,
      flexShrink: 0, border: `1.5px solid ${AVATAR_TEXT[i]}33`, letterSpacing: 1,
    }}>
      {initials || "?"}
    </div>
  )
}

export function RankBadge({ rank }) {
  const s = RANK_STYLES[rank] || RANK_STYLES.Newcomer
  return (
    <span style={{
      fontSize: 10, padding: "2px 10px", borderRadius: 99,
      background: s.bg, color: s.text, border: `1px solid ${s.border}`,
      fontWeight: 500, letterSpacing: 0.8,
    }}>{(rank||"Newcomer").toUpperCase()}</span>
  )
}

export function Pill({ label, style = {} }) {
  return (
    <span style={{
      fontSize: 11, padding: "4px 12px", borderRadius: 99,
      background: "var(--rose)", color: "var(--wine)",
      border: "1px solid var(--dusty)44", letterSpacing: 0.3, ...style,
    }}>{label}</span>
  )
}

export function Divider() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, margin:"0.5rem 0" }}>
      <div style={{ flex:1, height:"0.5px", background:"var(--rose)" }}/>
      <span style={{ color:"var(--dusty)", fontSize:12 }}>✦</span>
      <div style={{ flex:1, height:"0.5px", background:"var(--rose)" }}/>
    </div>
  )
}

export function Spinner() {
  return <div className="spinner" />
}

export function BackBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{
      background:"transparent", border:"none", color:"var(--petal)",
      fontSize:13, padding:0, marginBottom:"1.25rem",
      display:"flex", alignItems:"center", gap:4,
    }}>← Back</button>
  )
}
