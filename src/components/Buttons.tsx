import { Button, Container } from "react-bootstrap";

export type ButtonProps = {
  onPaste?: () => void;
  onAdd?: () => void;
}

export default function Buttons({ onPaste, onAdd }: ButtonProps) {

  return (
    <Container>
      <div className="rounded m-2 d-flex justify-content-center">
        <Button variant="warning" className="m-2" onClick={onPaste} disabled={!onPaste}>Colar</Button>
        <Button variant="dark" className="m-2" onClick={onAdd}>Nova Entrada</Button>
      </div>
    </Container>
  )

}