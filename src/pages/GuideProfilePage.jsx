import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { Stars, RankBadge, Avatar, Spinner, BackBtn } from "../components/UI"
import { useAuthStore } from "../store/authStore"

export default function GuideProfilePage() {
  const { id } = useParams()
  const nav = useNavigate()
  const { user, profile } = useAuthStore()
  const [guide, setGuide] = useState(null)
  const [guideProfile, setGuideProfile] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState("about")

  // Review form
  const [myStars, setMyStars] = useState(5)
  const [myText, setMyText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [reviewError, setReviewError] = useState("")
  const [reviewSuccess, setReviewSuccess] = useState(false)

  useEffect(() => {
    Promise.all([
      supabase.from("guides").select("*, profiles(full_name, email, avatar_url)").eq("id",id).single(),
      supabase.from("reviews").select("*, profiles(full_name)").eq("guide_id",id).order("created_at",{ascending:false}),
    ]).then(([{ data: g }, { data: r }]) => {
      setGuide(g)
      setGuideProfile(g?.profiles)
      setReviews(r||[])
      setLoading(false)
    })
  }, [id])

  const submitReview = async () => {
    if (!user) { nav("/login"); return }
    if (profile?.role !== "tourist") { setReviewError("Only tourists can leave reviews."); return }
    setSubmitting(true); setReviewError("")
    const { error } = await supabase.from("reviews").upsert({
      guide_id: id,
      tourist_id: user.id,
      stars: myStars,
      body: myText,
    })
    setSubmitting(false)
    if (error) { setReviewError(error.message) }
    else {
      setReviewSuccess(true)
      const { data: r } = await supabase.from("reviews").select("*, profiles(full_name)").eq("guide_id",id).order("created_at",{ascending:false})
      setReviews(r||[])
    }
  }

  if (loading) return <div style={{ paddingTop:"4rem" }}><Spinner/></div>
  if (!guide)  return <p style={{ padding:"2rem",textAlign:"center",color:"var(--muted)" }}>Guide not found.</p>

  const name = guideProfile?.full_name || "Guide"
  const initials = name.split(" ").map(n=>n[0]).join("").slice(0,2)

  return (
    <div style={{ minHeight:"100vh",background:"var(--blush)" }}>
      {/* Header */}
      <div className="page-header">
        <BackBtn onClick={()=>nav("/guides")}/>
        <div style={{ display:"flex",gap:"1rem",alignItems:"flex-start",marginBottom:"1.25rem" }}>
          <Avatar initials={initials} index={0} size={72}/>
          <div style={{ flex:1 }}>
            <h1 style={{ fontFamily:"var(--serif)",fontSize:24,fontWeight:600,color:"var(--wine)",lineHeight:1.2,marginBottom:2 }}>{name}</h1>
            <p style={{ fontSize:12,color:"var(--muted)",fontStyle:"italic",marginBottom:8 }}>
              {guide.city} · {guide.experience_years} years of guiding
            </p>
            <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
              <RankBadge rank={guide.rank||"Newcomer"}/>
              {guide.status==="approved" && <span style={{ fontSize:10,color:"var(--sage)",fontWeight:500,letterSpacing:0.5 }}>✓ Verified Guide</span>}
            </div>
          </div>
          <div style={{ textAlign:"right",flexShrink:0 }}>
            <div style={{ display:"flex",alignItems:"baseline",gap:3 }}>
              <span style={{ fontFamily:"var(--serif)",fontSize:30,color:"var(--petal)",fontWeight:600 }}>{guide.rating||"—"}</span>
              <span style={{ color:"var(--dusty)",fontSize:16 }}>♥</span>
            </div>
            <div style={{ fontSize:11,color:"var(--warm-gray)" }}>{guide.review_count||0} reviews</div>
          </div>
        </div>

        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8 }}>
          {[
            [(guide.languages||[]).length,"Languages"],
            [(guide.experience_years||0)+" yrs","Experience"],
            ["₾"+(guide.price_per_day||"—"),"Per day"],
          ].map(([v,l])=>(
            <div key={l} style={{ background:"#ffffff55",borderRadius:14,padding:"0.75rem",textAlign:"center",border:"1px solid var(--rose)44" }}>
              <div style={{ fontFamily:"var(--serif)",fontSize:18,color:"var(--deep-rose)",fontWeight:600 }}>{v}</div>
              <div style={{ fontSize:10,color:"var(--muted)",marginTop:2,letterSpacing:0.5 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex",background:"var(--ivory)",borderBottom:"1px solid var(--rose)" }}>
        {["about","reviews"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{
            flex:1,padding:"0.875rem",background:"transparent",border:"none",
            borderBottom: tab===t ? "2px solid var(--petal)" : "2px solid transparent",
            color: tab===t ? "var(--petal)" : "var(--warm-gray)",
            fontSize:12,fontWeight:500,textTransform:"uppercase",letterSpacing:1.5,
          }}>{t}</button>
        ))}
      </div>

      <div style={{ padding:"1.25rem" }}>
        {tab==="about" && (
          <div style={{ display:"flex",flexDirection:"column",gap:"1rem" }}>
            <Card label="About">
              <p style={{ fontSize:14,lineHeight:1.9,color:"var(--text)",fontStyle:"italic",fontFamily:"var(--serif)",fontWeight:300 }}>{guide.bio||"No bio yet."}</p>
            </Card>

            <Card label="Languages">
              <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                {(guide.languages||[]).map(l=>(
                  <span key={l} style={{ padding:"6px 16px",borderRadius:99,fontSize:13,background:"#EDD5CC",color:"var(--wine)",border:"1px solid var(--dusty)44" }}>{l}</span>
                ))}
              </div>
            </Card>

            <Card label="Specialties">
              <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                {(guide.specialties||[]).map(s=>(
                  <span key={s} style={{ padding:"6px 16px",borderRadius:99,fontSize:13,background:"#F5E8E8",color:"var(--deep-rose)",border:"1px solid var(--petal)44" }}>{s}</span>
                ))}
              </div>
            </Card>

            <Card label="Regions">
              <p style={{ fontSize:14,color:"var(--text)",lineHeight:2 }}>
                {(guide.regions||[]).map((r,i,arr)=>(
                  <span key={r}>{r}{i<arr.length-1&&<span style={{ color:"var(--dusty)",margin:"0 6px" }}>✦</span>}</span>
                ))}
              </p>
            </Card>

            {(guide.certificates||[]).length>0 && (
              <Card label="Certificates">
                {guide.certificates.map(cert=>(
                  <div key={cert} style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"0.5px solid var(--rose)" }}>
                    <span style={{ color:"var(--sage)",fontSize:14 }}>✓</span>
                    <span style={{ fontSize:13,color:"var(--text)" }}>{cert}</span>
                  </div>
                ))}
              </Card>
            )}

            <button style={{
              background:"linear-gradient(135deg,var(--petal),var(--deep-rose))",
              border:"none",color:"var(--ivory)",padding:"15px",borderRadius:99,fontSize:14,fontWeight:500,
              letterSpacing:0.5,boxShadow:"0 8px 24px #C47E7E44",
            }}
              onClick={()=>alert(`Contact ${name} at: ${guideProfile?.email||"N/A"}`)}
            >
              ✦ Book {name.split(" ")[0]}
            </button>
          </div>
        )}

        {tab==="reviews" && (
          <div style={{ display:"flex",flexDirection:"column",gap:"0.875rem" }}>
            {/* Rating summary */}
            <div style={{ background:"var(--ivory)",borderRadius:20,border:"1px solid var(--rose)",padding:"1.5rem",display:"flex",alignItems:"center",gap:"2rem" }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"var(--serif)",fontSize:42,color:"var(--petal)",fontWeight:600,lineHeight:1 }}>{guide.rating||"—"}</div>
                <Stars rating={guide.rating||0} size={16}/>
                <div style={{ fontSize:12,color:"var(--warm-gray)",marginTop:4 }}>{guide.review_count||0} reviews</div>
              </div>
              <div style={{ flex:1 }}>
                {[5,4,3,2,1].map(n=>{
                  const cnt = reviews.filter(r=>r.stars===n).length
                  const pct = reviews.length ? Math.round(cnt/reviews.length*100) : 0
                  return (
                    <div key={n} style={{ display:"flex",alignItems:"center",gap:6,marginBottom:5 }}>
                      <span style={{ fontSize:11,color:"var(--muted)",width:6 }}>{n}</span>
                      <div style={{ flex:1,height:5,borderRadius:99,background:"var(--rose)" }}>
                        <div style={{ width:`${pct}%`,height:"100%",borderRadius:99,background:"var(--petal)" }}/>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Leave a review */}
            {user && profile?.role==="tourist" && !reviewSuccess && (
              <div style={{ background:"var(--ivory)",borderRadius:20,border:"1px solid var(--rose)",padding:"1.25rem" }}>
                <div style={{ fontSize:10,letterSpacing:3,color:"var(--dusty)",textTransform:"uppercase",marginBottom:"0.75rem" }}>Leave a Review</div>
                <div style={{ display:"flex",gap:8,marginBottom:"0.75rem",fontSize:24 }}>
                  {[1,2,3,4,5].map(n=>(
                    <span key={n} style={{ cursor:"pointer",color:n<=myStars?"#C47E7E":"#E8D0D0" }} onClick={()=>setMyStars(n)}>♥</span>
                  ))}
                </div>
                <textarea
                  value={myText} onChange={e=>setMyText(e.target.value)}
                  placeholder="Share your experience…"
                  rows={3}
                  style={{ width:"100%",padding:"10px 14px",borderRadius:14,border:"1.5px solid var(--rose)",background:"var(--blush)",fontSize:13,outline:"none",color:"var(--text)",resize:"vertical" }}
                />
                {reviewError && <p style={{ color:"#9E5555",fontSize:12,marginTop:6 }}>{reviewError}</p>}
                <button onClick={submitReview} disabled={submitting} style={{
                  marginTop:"0.75rem",background:"var(--deep-rose)",border:"none",color:"var(--ivory)",
                  padding:"10px 24px",borderRadius:99,fontSize:13,fontWeight:500,opacity:submitting?0.7:1,
                }}>{submitting?"Submitting…":"Submit Review"}</button>
              </div>
            )}
            {reviewSuccess && (
              <p style={{ textAlign:"center",color:"var(--sage)",fontStyle:"italic",fontSize:13 }}>✓ Review submitted — thank you!</p>
            )}
            {!user && (
              <p style={{ textAlign:"center",color:"var(--muted)",fontSize:13,fontStyle:"italic" }}>
                <span style={{ cursor:"pointer",color:"var(--petal)",textDecoration:"underline" }} onClick={()=>nav("/login")}>Sign in</span> to leave a review.
              </p>
            )}

            {/* Review list */}
            {reviews.map((r,i)=>(
              <div key={r.id||i} style={{ background:"var(--ivory)",borderRadius:20,border:"1px solid var(--rose)",padding:"1.25rem" }}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
                  <div>
                    <span style={{ fontWeight:500,fontSize:14 }}>{r.profiles?.full_name||"Tourist"}</span>
                    <div style={{ marginTop:3 }}><Stars rating={r.stars}/></div>
                  </div>
                  <span style={{ fontSize:11,color:"var(--warm-gray)",fontStyle:"italic" }}>
                    {new Date(r.created_at).toLocaleDateString("en-GB",{month:"long",year:"numeric"})}
                  </span>
                </div>
                <p style={{ fontSize:13,lineHeight:1.8,color:"var(--muted)",fontFamily:"var(--serif)",fontStyle:"italic",fontWeight:300 }}>"{r.body}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Card({ label, children }) {
  return (
    <div style={{ background:"var(--ivory)",borderRadius:20,border:"1px solid var(--rose)",padding:"1.25rem" }}>
      <div style={{ fontSize:10,letterSpacing:3,color:"var(--dusty)",textTransform:"uppercase",marginBottom:"0.75rem" }}>{label}</div>
      {children}
    </div>
  )
}
