import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import { Filmes } from "../pages/Filmes";
import { Salas } from "../pages/Salas";
import { Sessoes } from "../pages/Sessoes";
import { Login } from "../pages/Login";
import { RecoverPassword } from "../pages/RecoverPassword";
import { ProtectedRoute } from "../components/ProtectedRoute";


export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/recuperar-senha" element={<RecoverPassword />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/filmes" element={<Filmes />} />
        <Route path="/salas" element={<Salas />} />
        <Route path="/sessoes" element={<Sessoes />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}