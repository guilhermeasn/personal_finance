import { Container, Navbar } from "react-bootstrap";

export default function Header() {
  return (
    <Navbar bg="dark" data-bs-theme="dark" as='header'>
      <Container>
        <Navbar.Brand href=".">
          Personal Finance
        </Navbar.Brand>
      </Container>
    </Navbar>
  )
}