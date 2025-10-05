import { Outlet } from "react-router"
import { Footer } from "./components/partials/Footer"
import { Header } from "./components/partials/Header"
import "./stylesheets/reset.css"
import { Container } from "./components/partials/Container"

function App() {
  return ( 
    <div className="flex flex-col min-h-screen">
      <Container>
        <Header />
        <Outlet />
      </Container>
      <Footer />
    </div>
  )
}

export default App
