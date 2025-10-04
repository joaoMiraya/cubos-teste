import { Outlet } from "react-router"
import { Footer } from "./components/partials/Footer"
import { Header } from "./components/partials/Header"
import "./stylesheets/reset.css"
import { Container } from "./components/partials/Container"

function App() {

  return (
    <>
      <Container>
        <Header />
          <Outlet />
        <Footer />
      </Container>
    </>
  )
}

export default App
