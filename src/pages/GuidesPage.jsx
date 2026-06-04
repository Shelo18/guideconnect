import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { Stars, RankBadge, Pill, Avatar, Spinner } from "../components/UI"

const RANK_ORDER = ["Elite","Expert","Trusted","Rising","Newcomer"]

export default function GuidesPage() {
  const nav = useNavigate()
  const [guides, setGuides] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterLang, setFilterLang] = useState("All")
  const [filterSpec, setFilterSpec] = useState("All")

  useEffect(() => {
    supabase
      .from("guides")
      .select("*, profiles(full_name, avatar_url)")
      .eq("status","approved")
      .order("rating", { ascending: false })
      .then(({ data }) => { setGuides(data||[]); setLoading(false) })
  }, [])

  const allLangs = ["All", ...new Set(guides.flatMap(g => g.languages||[]))]
  const allSpecs = ["All", ...new Set(guides.flatMap(g => g.specialties||[]))]

  const filtered = guides.filter(g => {
    const q = search.toLowerCase()
    const name = g.profiles?.full_name||""
    const ms = !search ||
      name.toLowerCase().includes(q) ||
      (g.regions||[]).some(r=>r.toLowerCase().includes(q)) ||
      (g.specialties||[]).some(s=>s.toLowerCase().includes(q))
    const ml = filterLang==="All" || (g.languages||[]).includes(filterLang)
    const msp = filterSpec==="All" || (g.specialties||[]).includes(filterSpec)
    return ms && ml && msp
  }).sort((a,b)=>RANK_ORDER.indexOf(a.rank)-RANK_ORDER.indexOf(b.rank))

  const sel = { padding:"7px 14px",borderRadius:99,border:"1.5px solid var(--rose)",background:"var(--ivory)",color:"var(--petal)",fontSize:12,outline:"none",letterSpacing:0.3 }

  return (
    <div style={{ minHeight:"100vh",background:"var(--blush)" }}>
      <div className="page-header">
        <button onClick={()=>nav("/")} style={{ background:"transparent",border:"none",color:"var(--petal)",fontSize:13,padding:0,marginBottom:"1rem" }}>← Home</button>
        <div style={{ fontSize:11,letterSpacing:3,color:"var(--petal)",textTransform:"uppercase",marginBottom:"0.5rem" }}>Discover</div>
        <h2 style={{ fontFamily:"var(--serif)",fontSize:28,fontWeight:600,color:"var(--wine)",marginBottom:"0.25rem" }}>Our Guides</h2>
        <p style={{ fontSize:13,color:"var(--muted)",marginBottom:"1.25rem",fontStyle:"italic" }}>Ranked by love from travellers like you</p>
        <input
          value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="✦  Search by name, region, or specialty…"
          style={{ width:"100%",padding:"12px 16px",borderRadius:99,border:"1.5px solid var(--rose)",background:"var(--ivory)",fontSize:13,outline:"none",color:"var(--text)" }}
        />
        <div style={{ display:"flex",gap:8,marginTop:"0.875rem",flexWrap:"wrap" }}>
          <select value={filterLang} onChange={e=>setFilterLang(e.target.value)} style={sel}>
            {allLangs.map(l=><option key={l}>{l==="All"?"All Languages":l}</option>)}
          </select>
          <select value={filterSpec} onChange={e=>setFilterSpec(e.target.value)} style={sel}>
            {allSpecs.map(s=><option key={s}>{s==="All"?"All Specialties":s}</option>)}
          </select>
        </div>
      </div>

      <div style={{ padding:"1.25rem 1rem" }}>
        {loading ? <Spinner/> : (
          <>
            <div style={{ fontSize:11,color:"var(--warm-gray)",letterSpacing:1,marginBottom:"1rem",textAlign:"center" }}>
              {filtered.length} GUIDE{filtered.length!==1?"S":""} FOUND
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
              {filtered.map((g,i)=>{
                const name = g.profiles?.full_name || "Guide"
                const initials = name.split(" ").map(n=>n[0]).join("").slice(0,2)
                return (
                  <div key={g.id} onClick={()=>nav(`/guides/${g.id}`)} style={{
                    background:"var(--ivory)",borderRadius:20,border:"1px solid var(--rose)",
                    padding:"1.25rem",cursor:"pointer",position:"relative",overflow:"hidden",
                    transition:"transform 0.22s ease, box-shadow 0.22s ease",
                  }}
                  onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="var(--shadow-lg)" }}
                  onMouseLeave={e=>{ e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none" }}
                  >
                    {i===0 && <div style={{ position:"absolute",top:12,right:12,fontSize:16 }}>👑</div>}
                    <div style={{ display:"flex",gap:12,alignItems:"flex-start" }}>
                      <Avatar initials={initials} index={i}/>
                      <div style={{ flex:1,minWidth:0 }}>
                        <div style={{ display:"flex",alignItems:"center",gap:7,flexWrap:"wrap",marginBottom:2 }}>
                          <span style={{ fontFamily:"var(--serif)",fontSize:17,fontWeight:600,color:"var(--wine)" }}>{name}</span>
                          <RankBadge rank={g.rank||"Newcomer"}/>
                          {g.status==="approved" && <span style={{ fontSize:10,color:"var(--sage)",fontWeight:500,letterSpacing:0.5 }}>✓ Verified</span>}
                        </div>
                        <div style={{ fontSize:12,color:"var(--muted)",marginBottom:6,fontStyle:"italic" }}>
                          {(g.regions||[]).slice(0,2).join("  ·  ")}
                        </div>
                        <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:8 }}>
                          <Stars rating={g.rating||0}/>
                          <span style={{ fontSize:12,color:"var(--warm-gray)" }}>
                            {g.rating||"—"} <span style={{ color:"var(--rose)" }}>({g.review_count||0} reviews)</span>
                          </span>
                        </div>
                        <div style={{ display:"flex",flexWrap:"wrap",gap:4 }}>
                          {(g.languages||[]).slice(0,2).map(l=><Pill key={l} label={l}/>)}
                          {(g.specialties||[]).slice(0,1).map(s=><Pill key={s} label={s} style={{ background:"#F5E8E8",color:"var(--deep-rose)" }}/>)}
                        </div>
                      </div>
                      <div style={{ textAlign:"right",flexShrink:0 }}>
                        <div style={{ fontFamily:"var(--serif)",fontSize:19,color:"var(--petal)",fontWeight:600 }}>₾{g.price_per_day||"—"}</div>
                        <div style={{ fontSize:10,color:"var(--warm-gray)",letterSpacing:0.5 }}>per day</div>
                      </div>
                    </div>
                  </div>
                )
              })}
              {filtered.length===0 && (
                <p style={{ textAlign:"center",color:"var(--muted)",fontStyle:"italic",padding:"3rem 0" }}>No guides found. Try adjusting your filters.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
