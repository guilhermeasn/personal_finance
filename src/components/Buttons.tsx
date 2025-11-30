import { Button, Container } from "react-bootstrap";

export default function Buttons() {

  return (
    <Container>
      <div className="rounded m-2 d-flex justify-content-center">
        <Button variant="danger" className="m-2 button-min-width">Débito</Button>
        <Button variant="primary" className="m-2 button-min-width">Crédito</Button>
      </div>
    </Container>
  )

}