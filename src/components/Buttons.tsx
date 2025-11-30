import { Button, Container } from "react-bootstrap";

export type ButtonProps = {
  onDebit?: () => void;
  onCredit?: () => void;
}

export default function Buttons({ onDebit, onCredit }: ButtonProps) {

  return (
    <Container>
      <div className="rounded m-2 d-flex justify-content-center">
        <Button variant="danger" className="m-2 button-min-width" onClick={onDebit}>Débito</Button>
        <Button variant="primary" className="m-2 button-min-width" onClick={onCredit}>Crédito</Button>
      </div>
    </Container>
  )

}