import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"
import { Divider, BackBtn } from "../components/UI"

export default function LoginPage() {
  const nav = useNavigate()
  const { signIn } = useAuthStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const inp = {
    width:"100%",padding:"12px 16px",borderRadius:14,
    border:"1.5px solid var(--rose)",background:"var(--ivory)",
    fontSize:14,outline:"none",color:"var(--text)",marginTop:5,
  }

  const handle = async () => {
    setLoading(true); setError("")
    try {
      await signIn({ email, password })
      nav("/")
    } catch(e) {
      setError(e.message||"Invalid credentials.")
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight:"100vh",background:"var(--blush)" }}>
      <div className="page-header">
        <BackBtn onClick={()=>nav("/")}/>
        <h2 style={{ fontFamily:"var(--serif)",fontSize:26,color:"var(--wine)",fontWeight:600 }}>Welcome back</h2>
        <p style={{ fontSize:12,color:"var(--muted)",marginTop:4,fontStyle:"italic" }}>Sign in to your GuideConnect account</p>
      </div>

      <div style={{ padding:"1.5rem",maxWidth:420,margin:"0 auto",display:"flex",flexDirection:"column",gap:"1rem" }}>
        <Divider/>

        <div>
          <label style={{ fontSize:11,color:"var(--muted)",letterSpacing:0.8,textTransform:"uppercase" }}>Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" style={inp}/>
        </div>
        <div>
          <label style={{ fontSize:11,color:"var(--muted)",letterSpacing:0.8,textTransform:"uppercase" }}>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" style={inp}
            onKeyDown={e=>e.key==="Enter"&&handle()}/>
        </div>

        {error && <p style={{ color:"#9E5555",fontSize:13 }}>{error}</p>}

        <button onClick={handle} disabled={loading} style={{
          background:"linear-gradient(135deg,var(--petal),var(--deep-rose))",
          border:"none",color:"var(--ivory)",padding:"13px",borderRadius:99,
          fontSize:14,fontWeight:500,letterSpacing:0.5,opacity:loading?0.7:1,
          boxShadow:"0 6px 20px #C47E7E44",marginTop:"0.5rem",
        }}>{loading?"Signing in…":"Sign In"}</button>

        <p style={{ textAlign:"center",fontSize:13,color:"var(--muted)" }}>
          No account?{" "}
          <span style={{ color:"var(--petal)",cursor:"pointer",textDecoration:"underline" }} onClick={()=>nav("/register")}>
            Register as a guide
          </span>
        </p>
      </div>
    </div>
  )
}
