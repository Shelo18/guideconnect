import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { Stars, RankBadge, Avatar } from "../components/UI"

export default function HomePage() {
  const nav = useNavigate()
  const [topGuides, setTopGuides] = useState([])

  useEffect(() => {
    supabase
      .from("guides")
      .select("*, profiles(full_name)")
      .eq("status","approved")
      .order("rating", { ascending: false })
      .limit(3)
      .then(({ data }) => setTopGuides(data || []))
  }, [])

  return (
    <div style={{ minHeight:"100vh", background:"var(--ivory)", overflow:"hidden", position:"relative" }}>

      {/* Decorative blobs */}
      <div style={{ position:"absolute",top:-120,right:-100,width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,#EDD5CC88 0%,transparent 70%)",pointerEvents:"none" }}/>
      <div style={{ position:"absolute",bottom:-80,left:-80,width:320,height:320,borderRadius:"50%",background:"radial-gradient(circle,#E8D0D880 0%,transparent 70%)",pointerEvents:"none" }}/>

      {/* Nav */}
      <nav style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"1.5rem 2rem",position:"relative",zIndex:1 }}>
        <div style={{ fontFamily:"var(--serif)",fontSize:24,color:"var(--petal)",fontStyle:"italic",fontWeight:300,letterSpacing:1 }}>
          Guide<span style={{ color:"var(--deep-rose)",fontWeight:600 }}>Connect</span>
        </div>
        <div style={{ display:"flex",gap:8 }}>
          <button onClick={()=>nav("/register")} style={{
            background:"transparent", border:"1.5px solid var(--rose)",
            color:"var(--petal)", padding:"8px 18px", borderRadius:99, fontSize:12, letterSpacing:0.5, fontWeight:500,
          }}>Join as Guide</button>
          <button onClick={()=>nav("/guides")} style={{
            background:"var(--petal)", border:"none",
            color:"var(--ivory)", padding:"8px 20px", borderRadius:99, fontSize:12, letterSpacing:0.5, fontWeight:500,
          }}>Find a Guide ✦</button>
          <button onClick={()=>nav("/login")} style={{
            background:"transparent", border:"1.5px solid var(--dusty)",
            color:"var(--deep-rose)", padding:"8px 18px", borderRadius:99, fontSize:12, letterSpacing:0.5,
          }}>Sign In</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ display:"flex",flexDirection:"column",alignItems:"center",padding:"3rem 2rem 2rem",textAlign:"center",position:"relative",zIndex:1 }}>
        <div className="fade-up" style={{ fontSize:11,letterSpacing:4,color:"var(--dusty)",textTransform:"uppercase",marginBottom:"1.5rem" }}>
          Georgia's Finest Guides
        </div>

        <h1 className="fade-up-1" style={{
          fontFamily:"var(--serif)",fontWeight:300,fontStyle:"italic",
          fontSize:"clamp(2.4rem,6vw,4rem)",color:"var(--wine)",
          lineHeight:1.25,maxWidth:560,marginBottom:"1.5rem",
        }}>
          Every journey deserves<br/>
          <span style={{ fontWeight:600,fontStyle:"normal",color:"var(--petal)" }}>someone who truly knows the way</span>
        </h1>

        <p className="fade-up-2" style={{ fontSize:15,color:"var(--muted)",lineHeight:1.9,maxWidth:440,marginBottom:"2.5rem",fontWeight:300 }}>
          Handpicked, verified guides who bring Georgia's stories, flavours, and landscapes to life — just for you.
        </p>

        <div className="fade-up-3" style={{ display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center" }}>
          <button onClick={()=>nav("/guides")} style={{
            background:"var(--deep-rose)",border:"none",color:"var(--ivory)",
            padding:"14px 36px",borderRadius:99,fontSize:14,fontWeight:500,
            letterSpacing:0.5,boxShadow:"0 8px 24px #C47E7E44",
          }}>Explore Our Guides</button>
          <button onClick={()=>nav("/register")} style={{
            background:"transparent",border:"1.5px solid var(--dusty)",color:"var(--deep-rose)",
            padding:"14px 32px",borderRadius:99,fontSize:14,letterSpacing:0.5,
          }}>Become a Guide →</button>
        </div>

        {/* Stats */}
        <div style={{ display:"flex",gap:"3rem",marginTop:"3.5rem",flexWrap:"wrap",justifyContent:"center" }}>
          {[["120+","Verified Guides"],["4.8♥","Avg. Rating"],["3,400+","Happy Tourists"]].map(([val,lbl])=>(
            <div key={lbl} style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"var(--serif)",fontSize:28,fontWeight:600,color:"var(--petal)" }}>{val}</div>
              <div style={{ fontSize:11,color:"var(--warm-gray)",marginTop:3,letterSpacing:1 }}>{lbl}</div>
            </div>
          ))}
        </div>

        <div style={{ margin:"3rem 0 1rem",display:"flex",alignItems:"center",gap:12,width:"100%",maxWidth:400 }}>
          <div style={{ flex:1,height:"0.5px",background:"linear-gradient(to right,transparent,var(--rose))" }}/>
          <span style={{ color:"var(--dusty)",fontSize:18,letterSpacing:6 }}>✦ ✦ ✦</span>
          <div style={{ flex:1,height:"0.5px",background:"linear-gradient(to left,transparent,var(--rose))" }}/>
        </div>

        {/* Top guide cards */}
        {topGuides.length > 0 && (
          <>
            <p style={{ fontSize:12,color:"var(--warm-gray)",letterSpacing:2,textTransform:"uppercase",marginBottom:"1.5rem" }}>Top rated this season</p>
            <div style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap" }}>
              {topGuides.map((g,i)=>(
                <div key={g.id} onClick={()=>nav(`/guides/${g.id}`)} style={{
                  background:"var(--soft-white)",border:"1px solid var(--rose)",
                  borderRadius:20,padding:"1rem 1.25rem",cursor:"pointer",
                  display:"flex",flexDirection:"column",alignItems:"center",gap:6,
                  minWidth:120,transition:"transform 0.2s",
                }}
                onMouseEnter={e=>e.currentTarget.style.transform="translateY(-4px)"}
                onMouseLeave={e=>e.currentTarget.style.transform="none"}
                >
                  <Avatar initials={(g.profiles?.full_name||"??").split(" ").map(n=>n[0]).join("").slice(0,2)} index={i} size={44}/>
                  <div style={{ fontFamily:"var(--serif)",fontSize:13,color:"var(--text)",fontStyle:"italic" }}>
                    {(g.profiles?.full_name||"Guide").split(" ")[0]}
                  </div>
                  <Stars rating={g.rating||0} size={10}/>
                  <RankBadge rank={g.rank||"Newcomer"}/>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
