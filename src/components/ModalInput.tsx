import { getPresetMask, useMask } from "mask-hooks";
import { useEffect, useState } from "react";
import { Alert, Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { MdError } from "react-icons/md";
import type { Input } from "../assets/types";

export type ModalInputProps = {
  show: boolean;
  categories?: string[];
  onHide: () => void;
  onSave: (input: Input) => string | null;
}

export default function ModalInput({ show, categories = [], onHide, onSave }: ModalInputProps) {

  const dayMask = useMask({ masks: '[1-31]' });
  const valueMask = useMask(getPresetMask('CURRENCY_PTBR'));
  const reccurenceMask = useMask({ masks: '###' });

  const dataDefault = {
    day: dayMask(new Date().getDate()), category: '', description: "",
    value: valueMask('0'), reccurence: reccurenceMask('1'), done: true
  }

  const [data, setData] = useState(dataDefault);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => (setError(null), setData(dataDefault)), [show]);

  const save = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // const error = onSave(input);
    error ? setError(error) : onHide();
  }

  return (

    <Modal show={show} onHide={onHide} centered>

      <Modal.Header className="rounded-bottom-0 alert alert-dark" closeButton>
        <Modal.Title>
          Nova Entrada
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

          <FloatingLabel className="my-2" label="Dia">
            <Form.Control type="text" placeholder=" " value={data.day} onChange={(e) => setData({ ...data, day: dayMask(e.target.value) })} />
          </FloatingLabel>

          <FloatingLabel className="my-2" label="Categoria">
            <Form.Select value={data.category} onChange={(e) => setData({ ...data, category: e.target.value })}>
              {!categories || categories.length === 0 ? (
                <option value="" disabled>
                  Nenhuma categoria cadastrada ainda
                </option>
              ) : (
                categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))
              )}
            </Form.Select>
          </FloatingLabel>

          <FloatingLabel className="my-2" label="Descrição">
            <Form.Control type="text" placeholder=" " value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} />
          </FloatingLabel>

          <FloatingLabel className="my-2" label="Tipo de Operação">
            <Form.Select>
              <option value="-">Débito (-)</option>
              <option value="+">Crédito (+)</option>
            </Form.Select>
          </FloatingLabel>

          <FloatingLabel className="my-2" label="Valor">
            <Form.Control type="text" placeholder=" " value={data.value} onChange={(e) => setData({ ...data, value: valueMask(e.target.value) })} />
          </FloatingLabel>

          <FloatingLabel className="my-2" label="Recorrência">
            <Form.Control type="text" placeholder=" " value={data.reccurence} onChange={(e) => setData({ ...data, reccurence: reccurenceMask(e.target.value) })} />
          </FloatingLabel>

          <div className="d-flex justify-content-center">
            <Form.Check
              type="switch"
              label="Entrada Confirmada"
              checked={data.done}
              onChange={(e) => setData({ ...data, done: e.target.checked })}
            />
          </div>

        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button variant="dark" type="submit">
            Salvar
          </Button>
        </Modal.Footer>

      </Form>

    </Modal>

  )
}
