import { useState } from "react";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import type { Input } from "../assets/types";

export type ModalAddProps = {
  show: boolean;
  onHide: () => void;
  onSave: (input: Input) => string | null;
}

export default function ModalAdd({ show, onHide, onSave }: ModalAddProps) {

  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

  const [input, setInput] = useState<Input>({
    date: today,
    category: "",
    description: "",
    value: 0,
    installment: null,
    done: false
  });

  const save = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const error = onSave(input);
    if (error) {
      alert(error);
    } else {
      onHide();
    }
  }

  return (

    <Modal show={show} onHide={onHide} centered>

      <Modal.Header className="alert alert-primary rounded-bottom-0" closeButton>
        <Modal.Title>Adicionar</Modal.Title>
      </Modal.Header>

      <Form onSubmit={save}>

        <Modal.Body>

          <FloatingLabel className="my-2" label="Data">
            <Form.Control type="date" placeholder=" " value={new Date(input.date).toISOString().split("T")[0]} onChange={(e) => setInput({ ...input, date: new Date(e.target?.value || today).getTime() })} />
          </FloatingLabel>

          <FloatingLabel className="my-2" label="Categoria">
            <Form.Control type="text" placeholder=" " value={input.category} onChange={(e) => setInput({ ...input, category: e.target.value })} />
          </FloatingLabel>

          <FloatingLabel className="my-2" label="Descrição">
            <Form.Control type="text" placeholder=" " value={input.description} onChange={(e) => setInput({ ...input, description: e.target.value })} />
          </FloatingLabel>

          <FloatingLabel className="my-2" label="Valor">
            <Form.Control type="number" placeholder=" " value={input.value} onChange={(e) => setInput({ ...input, value: Number(e.target.value) })} />
          </FloatingLabel>

        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Fechar
          </Button>
          <Button variant="primary" type="submit">
            Salvar
          </Button>
        </Modal.Footer>

      </Form>

    </Modal>

  )
}
