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
import { Detail } from "../pages/detail/Detail.tsx";
import { MovieProvider } from "../context/movieContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const root = document.getElementById("root");

if (!root) throw new Error("Failed to find the root element");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <MovieProvider>
            <Suspense fallback={<div>Carregando...</div>}>
              <Routes>
                <Route path="/" element={<App />}>
                  <Route index element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  } />
                  <Route path="movie/:id" element={
                    <ProtectedRoute>
                      <Detail />
                    </ProtectedRoute>
                  } />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </MovieProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>,
);