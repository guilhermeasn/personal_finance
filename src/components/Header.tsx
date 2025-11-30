import { Container, Navbar } from "react-bootstrap";

export type HeaderProps = {
  onChangeDataBase: () => void;
}

export default function Header({ onChangeDataBase }: HeaderProps) {
  return (
    <Navbar bg="dark" data-bs-theme="dark" as='header'>
      <Container>
        <Navbar.Brand href=".">
          Personal Finance
        </Navbar.Brand>
        {/* <div className="ms-auto text-warning-emphasis">
          <FaDatabase size={24} className="clickable" onClick={onChangeDataBase} />
        </div> */}
      </Container>
    </Navbar>
  )
}