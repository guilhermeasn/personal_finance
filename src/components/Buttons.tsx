import { Button, Container } from "react-bootstrap";
import { MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

export type ButtonProps = {
  onPreviousMonth?: () => void;
  onNextMonth?: () => void;
  onAdd?: () => void;
  onCategories?: () => void;
}

export default function Buttons({ onAdd, onCategories, onPreviousMonth, onNextMonth }: ButtonProps) {

  return (
    <Container>
      <div className="rounded m-2 d-flex justify-content-center">
        <Button variant="secondary" className="m-2" onClick={onPreviousMonth}><MdOutlineKeyboardDoubleArrowLeft size={26} className="mb-1" />Mês Anterior</Button>
        <Button variant="warning" className="m-2" onClick={onCategories}>Categorias</Button>
        <Button variant="danger" className="m-2" onClick={onAdd}>Nova Entrada</Button>
        <Button variant="secondary" className="m-2" onClick={onNextMonth}>Próximo Mês<MdOutlineKeyboardDoubleArrowRight size={26} className="mb-1" /></Button>
      </div>
    </Container>
  )

}