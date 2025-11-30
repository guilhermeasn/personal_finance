import { Button, Container, FloatingLabel, Form } from "react-bootstrap";
import { MdAutorenew } from "react-icons/md";

const months = [
  "Janeiro", "Fevereiro", "Março",
  "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro",
  "Outubro", "Novembro", "Dezembro"
];

export type MonthProps = {
  month?: [number, number];
  onChange?: (value: [number, number]) => void;
}

export default function Month({ month, onChange = () => { } }: MonthProps) {

  const current: [number, number] = [new Date().getMonth(), new Date().getFullYear()];

  return (

    <Container>

      <div className="d-flex justify-content-between my-3">

        <FloatingLabel className="flex-fill" label="Mês">
          <Form.Select className="rounded-end-0" onChange={(e) => onChange([Number(e.target.value), month?.[1] || current[1]])} value={month?.[0] || current[0]}>
            {months.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </Form.Select>
        </FloatingLabel>

        <FloatingLabel label="Ano">
          <Form.Select className="rounded-start-0" onChange={(e) => onChange([month?.[0] || current[0], Number(e.target.value)])} value={month?.[1] || current[1]}>
            {Array.from({ length: 21 }, (_, index) => index + ((month?.[1] || current[1]) - 10)).map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}
          </Form.Select>
        </FloatingLabel>

        <div className="d-flex align-items-center text-center text-primary mx-2">
          <Button variant="link" size="sm" onClick={() => onChange(current)}>
            <MdAutorenew size={20} />
          </Button>
        </div>


      </div>
    </Container>

  )

}