import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import '../stylesheets/index.css';
import App from '../App.tsx';
import { Suspense } from "react";
import { Login } from "../pages/Login.tsx";
import { Register } from "../pages/Register.tsx";
import { Home } from "../pages/home/Home.tsx";
import { NotFound } from "../pages/NotFound.tsx";
import { ProtectedRoute } from "./protectedRoute.tsx";
import { AuthProvider } from "../context/authContext.tsx";
import { ThemeProvider } from "../context/themeContext.tsx";

const root = document.getElementById("root");

if (!root) throw new Error("Failed to find the root element");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <AuthProvider>
       <ThemeProvider>
          <Suspense fallback={<div>Carregando...</div>}>
            <Routes>
              <Route path="*" element={<NotFound/>} />
              <Route path="/" element={<App />}>
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Routes>
          </Suspense>
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>,
);