import type { JSX } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

type Props = {
  children: JSX.Element;
};

export const ProtectedRoute = ({ children }: Props) => {
  const {isAuthenticated, loading} = useAuth();
  
  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
