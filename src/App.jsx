import { useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useAuthStore } from "./store/authStore"
import HomePage from "./pages/HomePage"
import GuidesPage from "./pages/GuidesPage"
import GuideProfilePage from "./pages/GuideProfilePage"
import RegisterPage from "./pages/RegisterPage"
import LoginPage from "./pages/LoginPage"
import AdminPage from "./pages/AdminPage"
import SuccessPage from "./pages/SuccessPage"

export default function App() {
  const init = useAuthStore(s => s.init)
  useEffect(() => { init() }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                  element={<HomePage/>}/>
        <Route path="/guides"            element={<GuidesPage/>}/>
        <Route path="/guides/:id"        element={<GuideProfilePage/>}/>
        <Route path="/register"          element={<RegisterPage/>}/>
        <Route path="/register/success"  element={<SuccessPage/>}/>
        <Route path="/login"             element={<LoginPage/>}/>
        <Route path="/admin"             element={<AdminPage/>}/>
      </Routes>
    </BrowserRouter>
  )
}
