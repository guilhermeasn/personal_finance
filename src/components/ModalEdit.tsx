import { useEffect, useState } from "react";
import { Alert, Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { MdError } from "react-icons/md";
import type { Input } from "../assets/types";

export type ModalEditMode = 'C' | 'D' | [number, Input] | null;

export type ModalEditProps = {
  edit: [number, Input] | null;
  categories?: string[];
  onHide: () => void;
  onCopy: (input: Input) => void;
  onDelete: (index: number) => void;
  onSave: (input: Input, index: number) => string | null;
}

const inputDefault: Input = {
  day: new Date().getDate(), category: "", description: "",
  value: 0, installment: null, done: false
}

export default function ModalEdit({ edit, categories = [], onHide, onSave }: ModalEditProps) {

  const [input, setInput] = useState<Input>(inputDefault);
  const [error, setError] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState<boolean>(categories.length < 1);

  useEffect(() => setNewCategory(categories.length < 1), [categories]);
  useEffect(() => (setError(null), setInput(edit?.[1] || inputDefault)), [edit]);

  const save = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const error = onSave(input, edit?.[0] || 0);
    error ? setError(error) : onHide();
  }

  return (

    <Modal show={edit !== null} onHide={onHide} centered>

      <Modal.Header className="rounded-bottom-0 alert alert-warning" closeButton>
        <Modal.Title>
          Editar Entrada
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
            {newCategory ? (
              <Form.Control type="text" placeholder=" " value={input.category} onChange={(e) => setInput({ ...input, category: e.target.value })} />
            ) : (
              <Form.Select value={input.category} onChange={(e) => e.target.value === '__new__' ? (setNewCategory(true), setInput({ ...input, category: '' })) : setInput({ ...input, category: e.target.value })}>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
                <option value="" disabled>-----</option>
                <option value="__new__">Nova Categoria</option>
              </Form.Select>
            )}
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
          <Button variant="danger" onClick={onHide}>
            Excluir
          </Button>
          <Button variant="info" onClick={onHide}>
            Copiar
          </Button>
          <Button variant='warning' type="submit">
            Salvar
          </Button>
        </Modal.Footer>

      </Form>

    </Modal>

  )
}
