import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import { Filmes } from "../pages/Filmes";
import { Salas } from "../pages/Salas";
import { Sessoes } from "../pages/Sessoes";


export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/filmes" element={<Filmes />} />
      <Route path="/salas" element={<Salas />} />
      <Route path="/sessoes" element={<Sessoes />} />
    </Routes>
  );
}