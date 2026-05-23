import { BrowserRouter } from "react-router-dom"
import { NavBar } from "./components/NavBar"
import { AppRoutes } from "./routes/AppRoutes"
import { AuthProvider } from "./auth/AuthContext"
import "./App.css"


function App() {

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <NavBar />
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
