import { useEffect } from "react";
import { Button, Container, FloatingLabel, Form } from "react-bootstrap";
import { MdAutorenew } from "react-icons/md";

const months = [
  "Janeiro", "Fevereiro", "Março",
  "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro",
  "Outubro", "Novembro", "Dezembro"
];

export type SelectionState = {
  month?: number;
  year?: number;
  category?: string;
}

export type SelectionProps = {
  categories?: string[];
  state: SelectionState;
  onChange?: (state: SelectionState) => void;
}

export default function Selection({ state, categories = [], onChange = () => { } }: SelectionProps) {

  const current: [number, number] = [new Date().getMonth(), new Date().getFullYear()];
  useEffect(() => onChange({ month: current[0], year: current[1], category: "" }), []);

  return (

    <Container>

      <div className="d-flex justify-content-between my-3">

        <FloatingLabel className="flex-fill" label="Categoria">
          <Form.Select className="rounded-end-0" onChange={(e) => onChange({ category: e.target.value })} value={state.category || ""}>
            <option value="">TODAS</option>
            <option value="__group__">AGRUPADAS</option>
            <option disabled>-----</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </Form.Select>
        </FloatingLabel>

        <FloatingLabel className="flex-fill" label="Mês">
          <Form.Select className="rounded-0" onChange={(e) => onChange({ month: Number(e.target.value) })} value={state.month || current[0]}>
            {months.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </Form.Select>
        </FloatingLabel>

        <FloatingLabel label="Ano">
          <Form.Select className="rounded-start-0" onChange={(e) => onChange({ year: Number(e.target.value) })} value={state.year || current[1]}>
            {Array.from({ length: 21 }, (_, index) => index + ((state.year || current[1]) - 10)).map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}
          </Form.Select>
        </FloatingLabel>

        <div className="d-flex align-items-center text-center mx-2">
          <Button className="text-warning-emphasis" variant="link" size="sm" onClick={() => {
            onChange({ month: current[0], year: current[1], category: "" });
          }}>
            <MdAutorenew size={32} />
          </Button>
        </div>

      </div>
    </Container>

  )

}