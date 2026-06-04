import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { Divider, BackBtn } from "../components/UI"

const STEPS = ["Account","Profile","Payment","Review"]

export default function RegisterPage() {
  const nav = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [paid, setPaid] = useState(false)

  const [form, setForm] = useState({
    // account
    fullName:"", email:"", password:"", phone:"",
    // profile
    city:"", regions:"", languages:"", specialties:"",
    experience:"", pricePerDay:"", licenseNumber:"",
    certificates:"", bio:"",
  })

  const set = (k,v) => setForm(prev=>({...prev,[k]:v}))

  const inp = {
    width:"100%",padding:"12px 16px",borderRadius:14,
    border:"1.5px solid var(--rose)",background:"var(--ivory)",
    fontSize:14,outline:"none",color:"var(--text)",
  }
  const lbl = { fontSize:11,color:"var(--muted)",display:"block",marginBottom:5,letterSpacing:0.8,textTransform:"uppercase" }

  const submit = async () => {
    setLoading(true); setError("")
    try {
      // 1. Sign up user
      const { data, error: signupErr } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      })
      if (signupErr) throw signupErr

      const uid = data.user.id

      // 2. Create profile row
      await supabase.from("profiles").insert({
        id: uid, email: form.email,
        full_name: form.fullName, phone: form.phone, role: "guide",
      })

      // 3. Create guide row (pending)
      await supabase.from("guides").insert({
        user_id: uid,
        city: form.city,
        regions: form.regions.split(",").map(s=>s.trim()).filter(Boolean),
        languages: form.languages.split(",").map(s=>s.trim()).filter(Boolean),
        specialties: form.specialties.split(",").map(s=>s.trim()).filter(Boolean),
        experience_years: parseInt(form.experience)||0,
        price_per_day: parseFloat(form.pricePerDay)||0,
        license_number: form.licenseNumber,
        certificates: form.certificates.split(",").map(s=>s.trim()).filter(Boolean),
        bio: form.bio,
        paid: paid,
        status: "pending",
        rank: "Newcomer",
      })

      nav("/register/success")
    } catch(e) {
      setError(e.message||"Something went wrong.")
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight:"100vh",background:"var(--blush)" }}>
      <div className="page-header">
        <BackBtn onClick={()=>nav("/")}/>
        <h2 style={{ fontFamily:"var(--serif)",fontSize:26,color:"var(--wine)",fontWeight:600 }}>Join as a Guide</h2>
        <p style={{ fontSize:12,color:"var(--muted)",marginTop:4,fontStyle:"italic" }}>One-time fee · Lifetime listing · Zero commission</p>

        {/* Progress bar */}
        <div style={{ display:"flex",gap:6,marginTop:"1.5rem" }}>
          {STEPS.map((s,i)=>(
            <div key={s} style={{ flex:1 }}>
              <div style={{ height:3,borderRadius:99,background:i+1<=step?"var(--petal)":"var(--rose)",marginBottom:4,transition:"background 0.3s" }}/>
              <div style={{ fontSize:9,color:i+1<=step?"var(--petal)":"var(--warm-gray)",textAlign:"center",letterSpacing:1,textTransform:"uppercase" }}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:"1.5rem" }}>

        {step===1 && (
          <div style={{ display:"flex",flexDirection:"column",gap:"1rem" }}>
            <h3 style={{ fontFamily:"var(--serif)",fontSize:20,color:"var(--wine)" }}>Create your account</h3>
            <Divider/>
            {[
              ["Full name","fullName","text","Nino Kapanadze"],
              ["Email address","email","email","guide@example.com"],
              ["Password","password","password","At least 8 characters"],
              ["Phone number","phone","tel","+995 5XX XXX XXX"],
            ].map(([label,key,type,ph])=>(
              <div key={key}>
                <label style={lbl}>{label}</label>
                <input type={type} placeholder={ph} value={form[key]} onChange={e=>set(key,e.target.value)} style={inp}/>
              </div>
            ))}
          </div>
        )}

        {step===2 && (
          <div style={{ display:"flex",flexDirection:"column",gap:"1rem" }}>
            <h3 style={{ fontFamily:"var(--serif)",fontSize:20,color:"var(--wine)" }}>Your guide profile</h3>
            <Divider/>
            {[
              ["City","city","text","e.g. Tbilisi"],
              ["Regions (comma-separated)","regions","text","e.g. Tbilisi, Kakheti, Mtskheta"],
              ["Languages (comma-separated)","languages","text","e.g. English, French, Georgian"],
              ["Specialties (comma-separated)","specialties","text","e.g. Wine Tours, History, Hiking"],
              ["Years of experience","experience","number","e.g. 8"],
              ["Your daily rate (₾)","pricePerDay","number","e.g. 120"],
              ["License number","licenseNumber","text","e.g. GE-2018-0123"],
              ["Certificates (comma-separated)","certificates","text","e.g. First Aid, Sommelier Level 2"],
            ].map(([label,key,type,ph])=>(
              <div key={key}>
                <label style={lbl}>{label}</label>
                <input type={type} placeholder={ph} value={form[key]} onChange={e=>set(key,e.target.value)} style={inp}/>
              </div>
            ))}
            <div>
              <label style={lbl}>Your story</label>
              <textarea rows={4} placeholder="Tell tourists about yourself and why you love guiding…" value={form.bio} onChange={e=>set("bio",e.target.value)} style={{ ...inp,resize:"vertical" }}/>
            </div>
          </div>
        )}

        {step===3 && (
          <div style={{ display:"flex",flexDirection:"column",gap:"1rem" }}>
            <h3 style={{ fontFamily:"var(--serif)",fontSize:20,color:"var(--wine)" }}>One-time registration</h3>
            <Divider/>
            <div style={{ background:"var(--ivory)",borderRadius:20,border:"1px solid var(--rose)",padding:"2rem",textAlign:"center" }}>
              <div style={{ fontSize:10,letterSpacing:3,color:"var(--dusty)",textTransform:"uppercase",marginBottom:"0.5rem" }}>Registration Fee</div>
              <div style={{ fontFamily:"var(--serif)",fontSize:52,color:"var(--petal)",fontWeight:600,lineHeight:1 }}>₾50</div>
              <div style={{ fontSize:13,color:"var(--muted)",marginTop:6,fontStyle:"italic" }}>Paid once · Valid forever</div>
            </div>
            {[
              "Lifetime listing on GuideConnect",
              "Verified badge after document review",
              "Appear in all tourist searches",
              "Zero commission on bookings",
              "Rank rises automatically with reviews",
            ].map(b=>(
              <div key={b} style={{ display:"flex",gap:10,alignItems:"center",padding:"4px 0" }}>
                <span style={{ color:"var(--petal)",fontSize:14,flexShrink:0 }}>♥</span>
                <span style={{ fontSize:14,color:"var(--text)" }}>{b}</span>
              </div>
            ))}
            <button onClick={()=>setPaid(true)} style={{
              background: paid ? "var(--sage)" : "linear-gradient(135deg,var(--petal),var(--deep-rose))",
              border:"none",color:"var(--ivory)",padding:15,borderRadius:99,
              fontSize:14,fontWeight:500,letterSpacing:0.5,marginTop:"0.5rem",
            }}>
              {paid ? "✓ Payment Confirmed" : "✦ Pay ₾50 — Secure Checkout"}
            </button>
          </div>
        )}

        {step===4 && (
          <div style={{ display:"flex",flexDirection:"column",gap:"1rem" }}>
            <h3 style={{ fontFamily:"var(--serif)",fontSize:20,color:"var(--wine)" }}>Review & submit</h3>
            <Divider/>
            <div style={{ background:"var(--ivory)",borderRadius:20,border:"1px solid var(--rose)",padding:"1.25rem" }}>
              {[
                ["Name",form.fullName||"—"],
                ["Email",form.email||"—"],
                ["City",form.city||"—"],
                ["Experience",form.experience?form.experience+" years":"—"],
                ["Languages",form.languages||"—"],
                ["Daily rate","₾"+(form.pricePerDay||"—")],
                ["Payment",paid?"✓ Paid ₾50":"⚠ Not paid yet"],
              ].map(([k,v])=>(
                <div key={k} style={{ display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"0.5px solid var(--rose)",fontSize:14 }}>
                  <span style={{ color:"var(--muted)",fontSize:12,letterSpacing:0.5 }}>{k}</span>
                  <span style={{ color:"var(--text)" }}>{v}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize:12,color:"var(--muted)",lineHeight:1.8,fontStyle:"italic",textAlign:"center" }}>
              Our team reviews your profile within 2–3 business days.<br/>You'll receive an email once approved. 🌸
            </p>
            {error && <p style={{ color:"#9E5555",fontSize:13,textAlign:"center" }}>{error}</p>}
            <button onClick={submit} disabled={loading} style={{
              background:"linear-gradient(135deg,var(--petal),var(--deep-rose))",
              border:"none",color:"var(--ivory)",padding:15,borderRadius:99,
              fontSize:14,fontWeight:500,letterSpacing:0.5,opacity:loading?0.7:1,
            }}>{loading?"Submitting…":"✦ Submit My Application"}</button>
          </div>
        )}

        {/* Nav buttons */}
        <div style={{ display:"flex",gap:8,marginTop:"1.5rem" }}>
          {step>1 && (
            <button onClick={()=>setStep(s=>s-1)} style={{
              flex:1,padding:12,borderRadius:99,border:"1.5px solid var(--rose)",
              background:"transparent",fontSize:13,color:"var(--petal)",
            }}>← Back</button>
          )}
          {step<4 && (
            <button onClick={()=>setStep(s=>s+1)} style={{
              flex:2,padding:12,borderRadius:99,border:"none",
              background:"var(--deep-rose)",color:"var(--ivory)",fontSize:13,fontWeight:500,letterSpacing:0.5,
            }}>Continue →</button>
          )}
        </div>
      </div>
    </div>
  )
}
