import { Button, Container, FloatingLabel, Form } from "react-bootstrap";
import { MdAutorenew } from "react-icons/md";
import type { Category, MonthIndex } from "../assets/finance.type";

const months = [
  "Janeiro", "Fevereiro", "Março",
  "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro",
  "Outubro", "Novembro", "Dezembro"
];

export type SelectionState = {
  month: MonthIndex;
  year: number;
  category: string;
}

export type SelectionProps = {
  categories?: Category[];
  state: SelectionState;
  onChange?: (state: SelectionState) => void;
  onReset?: () => void;
}

export default function Selection({ state, categories = [], onChange = () => { }, onReset = () => { } }: SelectionProps) {

  return (

    <Container>

      <div className="d-sm-flex justify-content-between my-3">

        <FloatingLabel className="flex-fill d-block" label="Categoria">
          <Form.Select className="rounded-end-0" onChange={(e) => onChange({ ...state, category: e.target.value })} value={state.category || ""}>
            <option value="">TODAS</option>
            <option value="__group__">AGRUPADAS</option>
            <option disabled>-----</option>
            {categories.map((category, index) => (
              <option key={index} value={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Select>
        </FloatingLabel>

        <div className="d-flex">

          <FloatingLabel className="flex-fill" label="Mês">
            <Form.Select className="rounded-0" onChange={(e) => onChange({ ...state, month: Number(e.target.value) as MonthIndex })} value={state.month}>
              {months.map((month, index) => (
                <option key={index} value={index}>
                  {month}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>

          <FloatingLabel label="Ano">
            <Form.Select className="rounded-start-0" onChange={(e) => onChange({ ...state, year: Number(e.target.value) })} value={state.year}>
              {Array.from({ length: 21 }, (_, index) => index + (state.year - 10)).map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>

          <div className="d-flex align-items-center text-center mx-2">
            <Button className="text-warning-emphasis" variant="link" size="sm" onClick={onReset}>
              <MdAutorenew size={32} />
            </Button>
          </div>
        </div>

      </div>
    </Container>

  )

}