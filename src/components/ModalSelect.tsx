import { useEffect, useState } from "react";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import type { Category, MonthIndex } from "../assets/finance.type";

const months = [
  "Janeiro", "Fevereiro", "Março",
  "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro",
  "Outubro", "Novembro", "Dezembro"
];

export type SelectState = {
  month: MonthIndex;
  year: number;
  category: string;
}

type ModalSelectProps = {
  show: boolean;
  onHide: () => void;
  categories: Category[];
  onSave: (state: SelectState) => void;
}

export default function ModalSelect({ show, onHide, categories, onSave }: ModalSelectProps) {

  const [localState, setLocalState] = useState<SelectState>({
    month: new Date().getMonth() as MonthIndex,
    year: new Date().getFullYear(),
    category: ""
  });

  useEffect(() => {
    if (show) {
      const date = new Date();
      setLocalState({
        month: date.getMonth() as MonthIndex,
        year: date.getFullYear(),
        category: ""
      });
    }
  }, [show]);

  const handleSave = () => {
    onSave(localState);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="rounded-bottom-0 alert alert-dark">
        <Modal.Title>Filtrar</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <FloatingLabel className="mb-2" label="Categoria">
          <Form.Select
            value={localState.category}
            onChange={(e) => setLocalState({ ...localState, category: e.target.value })}
          >
            <option value="">TODAS</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Select>
        </FloatingLabel>

        <div className="d-flex gap-2">
          <FloatingLabel className="flex-fill" label="Mês">
            <Form.Select
              value={localState.month}
              onChange={(e) => setLocalState({ ...localState, month: Number(e.target.value) as MonthIndex })}
            >
              {months.map((month, index) => (
                <option key={index} value={index}>
                  {month}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>

          <FloatingLabel className="flex-fill" label="Ano">
            <Form.Select
              value={localState.year}
              onChange={(e) => setLocalState({ ...localState, year: Number(e.target.value) })}
            >
              {Array.from({ length: 21 }, (_, index) => index + (localState.year - 10)).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="dark" onClick={handleSave}>
          Aplicar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
