import { useNavigate } from "react-router-dom"

export default function SuccessPage() {
  const nav = useNavigate()
  return (
    <div style={{ minHeight:"100vh",background:"var(--blush)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2rem",textAlign:"center" }}>
      <div style={{ fontSize:48,marginBottom:"1.5rem" }}>🌸</div>
      <h1 style={{ fontFamily:"var(--serif)",fontSize:30,color:"var(--wine)",fontWeight:600,marginBottom:"0.75rem" }}>Application Submitted!</h1>
      <p style={{ fontSize:15,color:"var(--muted)",lineHeight:1.9,maxWidth:380,marginBottom:"2rem" }}>
        Our team will review your profile within 2–3 business days. You'll receive an email confirmation once approved.
      </p>
      <div style={{ fontSize:11,letterSpacing:3,color:"var(--dusty)",textTransform:"uppercase",marginBottom:"2rem" }}>✦ Thank you for joining GuideConnect ✦</div>
      <button onClick={()=>nav("/")} style={{
        background:"linear-gradient(135deg,var(--petal),var(--deep-rose))",
        border:"none",color:"var(--ivory)",padding:"13px 32px",borderRadius:99,fontSize:14,fontWeight:500,
        boxShadow:"0 6px 20px #C47E7E44",
      }}>Back to Home</button>
    </div>
  )
}
