import { getPresetMask, useMask } from "mask-hooks";
import { useEffect, useState } from "react";
import { Alert, Button, FloatingLabel, Form, InputGroup, Modal } from "react-bootstrap";
import { MdError } from "react-icons/md";
import type { Category, CreateInput } from "../assets/finance.type";

export type ModalInputProps = {
  show: boolean;
  categories?: Category[];
  onHide: () => void;
  onSave: (input: CreateInput) => Promise<string | null>;
}

type CreateInputForm = {
  day: string;
  category: string;
  description: string;
  value: string;
  step_current: string;
  step_total: string;
  done: boolean;
}

export default function ModalInput({ show, categories = [], onHide, onSave }: ModalInputProps) {

  const dayMask = useMask({ masks: '[1-31]' });
  const valueMask = useMask(getPresetMask('CURRENCY_PTBR'));
  const stepMask = useMask({ masks: '###' });

  const dataDefault: CreateInputForm = {
    day: new Date().getDate().toString(), category: '', description: "",
    value: valueMask('0'), step_current: '1', step_total: '1', done: true
  }

  const [data, setData] = useState<CreateInputForm>(dataDefault);
  const [error, setError] = useState<string | null>(null);
  const [wait, setWait] = useState<boolean>(false);
  const [op, setOp] = useState<'+' | '-'>('+');

  useEffect(() => (setError(null), setData(dataDefault)), [show]);

  const handlerData = (change: Partial<CreateInputForm>) => {
    setData({ ...data, ...change });
  }

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setWait(true);
    const error = await onSave({
      day: parseInt(data.day),
      category: data.category,
      description: data.description,
      value: parseFloat(data.value.replace(',', '.').replace(/[^0-9.]/g, '')) * (op === '+' ? 1 : -1),
      step: [parseInt(data.step_current), parseInt(data.step_total)],
      done: data.done
    });
    error ? setError(error) : onHide();
    setWait(false);
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
            <Form.Control type="text" placeholder=" " value={data.day} onChange={(e) => handlerData({ day: dayMask(e.target.value) })} disabled={wait} />
          </FloatingLabel>

          <FloatingLabel className="my-2" label="Categoria">
            <Form.Select value={data.category} onChange={(e) => handlerData({ category: e.target.value })} disabled={wait}>
              {!categories || categories.length === 0 ? (
                <option value="" disabled>
                  Nenhuma categoria cadastrada ainda
                </option>
              ) : <>
                <option value="" disabled>Selecione uma categoria</option>
                {categories.map((category, index) => (
                  <option key={index} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </>
              }
            </Form.Select>
          </FloatingLabel>

          <FloatingLabel className="my-2" label="Descrição">
            <Form.Control type="text" placeholder=" " value={data.description} onChange={(e) => handlerData({ description: e.target.value })} disabled={wait} />
          </FloatingLabel>

          <FloatingLabel className="my-2" label="Tipo de Operação">
            <Form.Select value={op} onChange={(e) => setOp(e.target.value as ('+' | '-'))} disabled={wait}>
              <option value="-">Débito (-)</option>
              <option value="+">Crédito (+)</option>
            </Form.Select>
          </FloatingLabel>

          <FloatingLabel className="my-2" label="Valor">
            <Form.Control type="text" placeholder=" " value={data.value} onChange={(e) => handlerData({ value: valueMask(e.target.value) })} disabled={wait} />
          </FloatingLabel>

          <InputGroup>

            <FloatingLabel className="my-2" label="Parcela">
              <Form.Control type="text" placeholder=" " value={data.step_current} onChange={(e) => handlerData({ step_current: stepMask(e.target.value) })} disabled={wait} />
            </FloatingLabel>

            <FloatingLabel className="my-2" label="Total">
              <Form.Control type="text" placeholder=" " value={data.step_total} onChange={(e) => handlerData({ step_total: stepMask(e.target.value) })} disabled={wait} />
            </FloatingLabel>

          </InputGroup>


          <div className="d-flex justify-content-center">
            <Form.Check
              type="switch"
              label="Entrada Confirmada"
              checked={data.done}
              onChange={(e) => handlerData({ done: e.target.checked })}
              disabled={wait}
            />
          </div>

        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onHide} disabled={wait}>
            Cancelar
          </Button>
          <Button variant="dark" type="submit" disabled={wait}>
            Salvar
          </Button>
        </Modal.Footer>

      </Form>

    </Modal>

  )
}
