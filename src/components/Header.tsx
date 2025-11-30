import { Container, Navbar } from "react-bootstrap";
import { FaDatabase } from "react-icons/fa";

export default function Header() {
  return (
    <Navbar bg="dark" data-bs-theme="dark" as='header'>
      <Container>
        <Navbar.Brand href=".">
          Personal Finance
        </Navbar.Brand>
        <div className="ms-auto text-warning-emphasis">
          <FaDatabase size={24} className="clickable" />
        </div>
      </Container>
    </Navbar>
  )
}