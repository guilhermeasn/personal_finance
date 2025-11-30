import { Button, Container, FloatingLabel, Form } from "react-bootstrap";
import { MdAutorenew } from "react-icons/md";

const months = [
  "Janeiro", "Fevereiro", "Março",
  "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro",
  "Outubro", "Novembro", "Dezembro"
];

export type SelectionProps = {
  month?: number;
  year?: number;
  category?: string;
  categories?: string[];
  onChangeMonth?: (month: number) => void;
  onChangeYear?: (year: number) => void;
  onChangeCategory?: (category: string) => void;
}

export default function Selection({ month, year, category, categories = [], onChangeMonth = () => { }, onChangeYear = () => { }, onChangeCategory = () => { } }: SelectionProps) {

  const current: [number, number] = [new Date().getMonth(), new Date().getFullYear()];

  return (

    <Container>

      <div className="d-flex justify-content-between my-3">

        <FloatingLabel className="flex-fill" label="Categoria">
          <Form.Select className="rounded-end-0" onChange={(e) => onChangeCategory(e.target.value)} value={category || ""}>
            <option value="">TOTAL</option>
            <option value="" disabled>-----</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </Form.Select>
        </FloatingLabel>

        <FloatingLabel className="flex-fill" label="Mês">
          <Form.Select className="rounded-0" onChange={(e) => onChangeMonth(Number(e.target.value))} value={month || current[0]}>
            {months.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </Form.Select>
        </FloatingLabel>

        <FloatingLabel label="Ano">
          <Form.Select className="rounded-start-0" onChange={(e) => onChangeYear(Number(e.target.value))} value={year || current[1]}>
            {Array.from({ length: 21 }, (_, index) => index + ((year || current[1]) - 10)).map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}
          </Form.Select>
        </FloatingLabel>

        <div className="d-flex align-items-center text-center mx-2">
          <Button className="text-warning-emphasis" variant="link" size="sm" onClick={() => {
            onChangeMonth(current[0]);
            onChangeYear(current[1]);
            onChangeCategory("");
          }}>
            <MdAutorenew size={32} />
          </Button>
        </div>

      </div>
    </Container>

  )

}