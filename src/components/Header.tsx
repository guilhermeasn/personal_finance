import { Container, Navbar } from "react-bootstrap";

export default function Header() {
  return (
    <Navbar bg="dark" data-bs-theme="dark" as='header'>
      <Container>
        <Navbar.Brand href="#home">Personal Finance</Navbar.Brand>
        {/* <Nav className="me-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#features">Features</Nav.Link>
          <Nav.Link href="#pricing">Pricing</Nav.Link>
        </Nav> */}
      </Container>
    </Navbar>
  )
}