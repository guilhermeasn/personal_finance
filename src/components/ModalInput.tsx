import { getPresetMask, useMask } from "mask-hooks";
import { useEffect, useState } from "react";
import { Alert, Button, FloatingLabel, Form, InputGroup, Modal } from "react-bootstrap";
import { MdError } from "react-icons/md";
import type { Category, CreateInput, Input, UpdateInput, UpdateMode } from "../assets/finance.type";

export type ModalInputProps = {
  show: boolean | Input;
  categories?: Category[];
  onHide: () => void;
  onSave: (input: CreateInput) => Promise<string | null>;
  onDelete: (id: string, mode: UpdateMode) => Promise<string | null>;
  onEdit: (id: string, mode: UpdateMode, input: UpdateInput) => Promise<string | null>;
}

type InputForm = {
  day: string;
  category: string;
  description: string;
  value: string;
  step_current: string;
  step_total: string;
  done: boolean;
}

export default function ModalInput({ show, categories = [], onHide, onSave, onDelete, onEdit }: ModalInputProps) {

  const edit: boolean = typeof show !== 'boolean';

  const dayMask = useMask({ masks: '[1-31]' });
  const valueMask = useMask(getPresetMask('CURRENCY_PTBR'));
  const stepMask = useMask({ masks: '###' });

  const dataDefault: InputForm = {
    day: new Date().getDate().toString(), category: '', description: "",
    value: valueMask('0'), step_current: '1', step_total: '1', done: true
  }

  const [data, setData] = useState<InputForm>(dataDefault);
  const [error, setError] = useState<string | null>(null);
  const [wait, setWait] = useState<boolean>(false);
  const [op, setOp] = useState<'+' | '-'>('+');
  const [mode, setMode] = useState<UpdateMode>('ONE');

  useEffect(() => (
    setError(null),
    setMode('ONE'),
    setData(typeof show === 'object' ? {
      day: show.day.toString(),
      category: show.category,
      description: show.description,
      value: valueMask(show.value.toFixed(2)),
      step_current: show.step[0].toString(),
      step_total: show.step[1].toString(),
      done: show.done
    } : dataDefault),
    setOp(typeof show === 'object' ? (show.value < 0 ? '-' : '+') : op)
  ), [show]);

  const handlerData = (change: Partial<InputForm>) => {
    setData({ ...data, ...change });
  }

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setWait(true);
    const input: CreateInput = {
      day: parseInt(data.day),
      category: data.category,
      description: data.description,
      value: parseFloat(data.value.replace(/[^0-9,]/g, '').replace(',', '.')) * (op === '+' ? 1 : -1),
      step: [parseInt(data.step_current), parseInt(data.step_total)],
      done: data.done
    };
    const error = typeof show === 'object' ? await onEdit(show.id, mode, input) : await onSave(input)
    error ? setError(error) : onHide();
    setWait(false);
  }

  const handleDelete = async () => {
    if (typeof show !== 'object') return;
    setWait(true);
    const error = await onDelete(show.id, mode);
    error ? setError(error) : onHide();
    setWait(false);
  }

  return (

    <Modal show={!!show} onHide={onHide} centered>

      <Modal.Header className={"rounded-bottom-0 alert alert-" + (edit ? 'warning' : 'dark')} closeButton>
        <Modal.Title>
          {edit ? 'Editar' : 'Nova'} Entrada
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
              <Form.Control type="text" placeholder=" " value={data.step_current} onChange={(e) => handlerData({ step_current: stepMask(e.target.value) })} disabled={wait || edit} />
            </FloatingLabel>

            <FloatingLabel className="my-2" label="Total">
              <Form.Control type="text" placeholder=" " value={data.step_total} onChange={(e) => handlerData({ step_total: stepMask(e.target.value) })} disabled={wait || edit} />
            </FloatingLabel>

          </InputGroup>

          {edit ? (
            <FloatingLabel className="my-2" label="Modificar">
              <Form.Select value={mode} onChange={(e) => setMode(e.target.value as UpdateMode)} disabled={wait || (typeof show === 'object' && show.step[0] === 1 && show.step[1] === 1)}>
                <option value="ONE">Apenas esta entrada</option>
                <option value="ALL">Todas as entradas</option>
                <option value="BACKWARD">Esta entrada e as anteriores</option>
                <option value="FORWARD">Esta entrada e as posteriores</option>
              </Form.Select>
            </FloatingLabel>
          ) : null}

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
          {typeof show === 'object' ? (
            <Button variant="outline-danger" onClick={handleDelete} disabled={wait}>
              Excluir
            </Button>
          ) : null}
          <Button variant={edit ? 'warning' : 'dark'} type="submit" disabled={wait}>
            Salvar
          </Button>
        </Modal.Footer>

      </Form>

    </Modal>

  )
}
