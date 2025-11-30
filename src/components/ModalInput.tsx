import { useEffect, useState } from "react";
import { Alert, Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { MdError } from "react-icons/md";
import type { Input } from "../assets/types";

export type ModalInputProps = {
  show: boolean;
  categories?: string[];
  initialInput?: Input;
  onHide: () => void;
  onSave: (input: Input) => string | null;
  onDelete?: () => void;
}

const inputDefault: Input = {
  day: new Date().getDate(), category: "", description: "",
  value: 0, installment: null, done: false
}

export default function ModalInput({ show, categories = [], initialInput, onHide, onSave, onDelete }: ModalInputProps) {

  const [input, setInput] = useState<Input>(inputDefault);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    if (show && initialInput) {
      setInput(initialInput);
    } else {
      setInput(inputDefault);
    }
  }, [show, initialInput]);

  const save = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const error = onSave(input);
    error ? setError(error) : onHide();
  }

  return (

    <Modal show={show} onHide={onHide} centered>

      <Modal.Header className={`rounded-bottom-0 alert alert-${initialInput ? 'warning' : 'dark'}`} closeButton>
        <Modal.Title>
          {initialInput ? 'Editar Entrada' : 'Nova Entrada'}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={save}>

        <Modal.Body>

          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              <Alert.Heading><MdError className="me-2 mb-1" />Erro</Alert.Heading>
              <p>{error}</p>
            </Alert>
          )}

          <FloatingLabel className="my-2" label="Data">
            <Form.Control type="number" placeholder=" " value={input.day} onChange={(e) => setInput({ ...input, day: Number(e.target.value) })} />
          </FloatingLabel>

          <FloatingLabel className="my-2" label="Categoria">
            <Form.Select value={input.category} onChange={(e) => setInput({ ...input, category: e.target.value })}>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>

          <FloatingLabel className="my-2" label="Descrição">
            <Form.Control type="text" placeholder=" " value={input.description} onChange={(e) => setInput({ ...input, description: e.target.value })} />
          </FloatingLabel>

          <FloatingLabel className="my-2" label="Valor">
            <Form.Control type="number" placeholder=" " value={input.value} onChange={(e) => setInput({ ...input, value: Number(e.target.value) })} />
          </FloatingLabel>

        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onHide}>
            Cancelar
          </Button>
          {onDelete && (
            <Button variant="danger" onClick={onDelete}>
              Excluir
            </Button>
          )}
          <Button variant={initialInput ? 'warning' : 'dark'} type="submit">
            Salvar
          </Button>
        </Modal.Footer>

      </Form>

    </Modal>

  )
}
