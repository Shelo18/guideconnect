import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { useAuthStore } from "../store/authStore"
import { RankBadge, Avatar, Spinner } from "../components/UI"

export default function AdminPage() {
  const nav = useNavigate()
  const { profile, loading: authLoading } = useAuthStore()
  const [guides, setGuides] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState("pending")

  useEffect(() => {
    if (!authLoading && profile?.role !== "admin") {
      nav("/")
      return
    }
    load()
  }, [authLoading, profile])

  const load = async () => {
    const { data } = await supabase
      .from("guides")
      .select("*, profiles(full_name, email, phone)")
      .order("created_at", { ascending: false })
    setGuides(data||[])
    setLoading(false)
  }

  const approve = async (id) => {
    await supabase.from("guides").update({ status:"approved" }).eq("id", id)
    setGuides(prev => prev.map(g => g.id===id ? {...g,status:"approved"} : g))
  }

  const reject = async (id) => {
    await supabase.from("guides").update({ status:"rejected" }).eq("id", id)
    setGuides(prev => prev.map(g => g.id===id ? {...g,status:"rejected"} : g))
  }

  const filtered = guides.filter(g => g.status === tab)

  if (authLoading || loading) return <Spinner/>

  return (
    <div style={{ minHeight:"100vh",background:"var(--blush)" }}>
      <div className="page-header">
        <h2 style={{ fontFamily:"var(--serif)",fontSize:26,color:"var(--wine)",fontWeight:600 }}>Admin Panel</h2>
        <p style={{ fontSize:12,color:"var(--muted)",marginTop:4,fontStyle:"italic" }}>Manage guide applications</p>
        <div style={{ display:"flex",gap:6,marginTop:"1rem",flexWrap:"wrap" }}>
          {["pending","approved","rejected"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{
              padding:"6px 16px",borderRadius:99,border:"1.5px solid var(--rose)",
              background: tab===t ? "var(--petal)" : "var(--ivory)",
              color: tab===t ? "var(--ivory)" : "var(--petal)",
              fontSize:12,letterSpacing:0.5,fontWeight:500,
            }}>
              {t.charAt(0).toUpperCase()+t.slice(1)} ({guides.filter(g=>g.status===t).length})
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding:"1.25rem",display:"flex",flexDirection:"column",gap:12 }}>
        {filtered.length===0 && <p style={{ textAlign:"center",color:"var(--muted)",fontStyle:"italic",padding:"3rem 0" }}>No {tab} guides.</p>}
        {filtered.map((g,i)=>{
          const name = g.profiles?.full_name||"Guide"
          const initials = name.split(" ").map(n=>n[0]).join("").slice(0,2)
          return (
            <div key={g.id} style={{ background:"var(--ivory)",borderRadius:20,border:"1px solid var(--rose)",padding:"1.25rem" }}>
              <div style={{ display:"flex",gap:12,alignItems:"flex-start" }}>
                <Avatar initials={initials} index={i}/>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:4 }}>
                    <span style={{ fontFamily:"var(--serif)",fontSize:16,fontWeight:600,color:"var(--wine)" }}>{name}</span>
                    <RankBadge rank={g.rank||"Newcomer"}/>
                    {g.paid && <span style={{ fontSize:10,color:"var(--sage)",fontWeight:500 }}>₾ Paid</span>}
                  </div>
                  <div style={{ fontSize:12,color:"var(--muted)",marginBottom:4 }}>{g.profiles?.email}</div>
                  <div style={{ fontSize:12,color:"var(--muted)",marginBottom:4 }}>{g.city} · {g.experience_years} yrs · ₾{g.price_per_day}/day</div>
                  {g.license_number && <div style={{ fontSize:11,color:"var(--warm-gray)" }}>License: {g.license_number}</div>}
                  {g.bio && <p style={{ fontSize:12,color:"var(--text)",marginTop:6,lineHeight:1.7,fontStyle:"italic" }}>"{g.bio.slice(0,120)}…"</p>}

                  <div style={{ marginTop:"0.75rem",display:"flex",flexWrap:"wrap",gap:6 }}>
                    {(g.languages||[]).map(l=><span key={l} style={{ fontSize:10,padding:"3px 10px",borderRadius:99,background:"#EDD5CC",color:"var(--wine)" }}>{l}</span>)}
                    {(g.specialties||[]).map(s=><span key={s} style={{ fontSize:10,padding:"3px 10px",borderRadius:99,background:"#F5E8E8",color:"var(--deep-rose)" }}>{s}</span>)}
                  </div>
                </div>
              </div>

              {tab==="pending" && (
                <div style={{ display:"flex",gap:8,marginTop:"1rem" }}>
                  <button onClick={()=>approve(g.id)} style={{
                    flex:1,padding:"10px",borderRadius:99,border:"none",
                    background:"var(--sage)",color:"white",fontSize:13,fontWeight:500,
                  }}>✓ Approve</button>
                  <button onClick={()=>reject(g.id)} style={{
                    flex:1,padding:"10px",borderRadius:99,border:"1.5px solid var(--dusty)",
                    background:"transparent",color:"var(--deep-rose)",fontSize:13,
                  }}>✗ Reject</button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
