import { Button, Container } from "react-bootstrap";
import { MdList, MdOutlineAdd, MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

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

        <Button variant="secondary" className="m-2" onClick={onPreviousMonth}>
          <MdOutlineKeyboardDoubleArrowLeft size={26} className="mb-1" />
          <span className="d-none d-md-inline">Mês Anterior</span>
        </Button>

        <Button variant="warning" className="m-2" onClick={onCategories}>
          <MdList size={26} className="mb-1" />
          <span className="d-none d-md-inline">Categorias</span>
        </Button>

        <Button variant="danger" className="m-2" onClick={onAdd}>
          <MdOutlineAdd size={26} className="mb-1" />
          <span className="d-none d-md-inline">Nova Entrada</span>
        </Button>

        <Button variant="secondary" className="m-2" onClick={onNextMonth}>
          <MdOutlineKeyboardDoubleArrowRight size={26} className="mb-1" />
          <span className="d-none d-md-inline">Próximo Mês</span>
        </Button>
      </div>
    </Container>
  )

}