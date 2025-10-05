import { Outlet } from "react-router"
import { Footer } from "./components/partials/Footer"
import { Header } from "./components/partials/Header"
import "./stylesheets/reset.css"
import { Container } from "./components/partials/Container"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

function App() {

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen">
        <Container>
          <Header />
          <Outlet />
        </Container>
        <Footer />
      </div>
    </QueryClientProvider>

  )
}

export default App
