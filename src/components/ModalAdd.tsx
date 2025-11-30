import { useEffect, useState } from "react";
import { Alert, Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { MdError } from "react-icons/md";
import type { Input } from "../assets/types";

export type ModalAddMode = 'C' | 'D' | [number, Input] | null;

export type ModalAddProps = {
  mode: ModalAddMode;
  categories?: string[];
  onHide: () => void;
  onSave: (input: Input, index?: number) => string | null;
}

const inputDefault: Input = {
  day: new Date().getDate(), category: "", description: "",
  value: 0, installment: null, done: false
}

export default function ModalAdd({ mode, categories = [], onHide, onSave }: ModalAddProps) {

  const [input, setInput] = useState<Input>(inputDefault);
  const [error, setError] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState<boolean>(categories.length < 1);

  useEffect(() => setNewCategory(categories.length < 1), [categories]);
  useEffect(() => setError(null), [mode]);

  useEffect(() => {
    setInput(
      (typeof mode === 'object' && Array.isArray(mode))
        ? mode[1]
        : inputDefault
    );
  }, [mode]);

  const save = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const error = onSave(input, (typeof mode === 'object' && Array.isArray(mode)) ? mode[0] : undefined);
    error ? setError(error) : onHide();
  }

  return (

    <Modal show={mode !== null} onHide={onHide} centered>

      <Modal.Header className={"rounded-bottom-0 alert alert-" + (mode === 'C' ? 'primary' : mode === 'D' ? 'danger' : (input.value < 0 ? 'danger' : 'primary'))} closeButton>
        <Modal.Title>
          {mode === 'C' ? 'Novo Crédito' : mode === 'D' ? 'Novo Débito' : `Editar ${input.value < 0 ? 'Débito' : 'Crédito'}`}
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
            <Form.Control type="number" placeholder=" " value={input.value < 0 ? input.value * -1 : input.value} onChange={(e) => setInput({ ...input, value: Number(e.target.value) })} />
          </FloatingLabel>

        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Fechar
          </Button>
          <Button variant={mode === 'C' ? 'primary' : mode === 'D' ? 'danger' : (input.value < 0 ? 'danger' : 'primary')} type="submit">
            Salvar
          </Button>
        </Modal.Footer>

      </Form>

    </Modal>

  )
}
