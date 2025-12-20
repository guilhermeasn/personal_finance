import { Button, Container, Table } from "react-bootstrap";
import { MdOutlineCheckCircle, MdOutlineFilterAlt } from "react-icons/md";
import type { Category, Input, MonthData } from "../assets/finance.type";

export type InputProps = {
  title?: string;
  categories?: Category[];
  data?: MonthData | null;
  onEdit?: (input: Input) => void;
  onHeaderClick?: () => void;
}

export function tdClass(value: number, className?: string): string {
  return 'text-' + (value < 0 ? "debit" : (value > 0 ? "credit" : "secondary")) + (className ? " " + className : "");
}

export default function Inputs({ title = '', categories = [], data = null, onEdit = () => { }, onHeaderClick }: InputProps) {

  return (
    <Container>
      <div className="rounded p-3 bg-white">
        <Table className="p-0 m-0" variant="white" responsive>

          <thead>
            <tr>
              <th colSpan={5} className="text-secondary text-center small ">

                <div className="d-flex align-items-center justify-content-center gap-2">
                  <span>{title}</span>
                  <Button variant="link" onClick={onHeaderClick}>
                    <MdOutlineFilterAlt size={22} />
                  </Button>
                </div>

              </th>
            </tr>
          </thead>

          <tbody className="small">

            {data && data.inputs.length > 0 ? data.inputs.map((input, index) => (

              <tr key={index} className="border-white clickable" onClick={() => onEdit(input)}>

                <td className={tdClass(input.value, "text-start d-flex text-nowrap")}>
                  <span className={"me-2 " + (input.done ? "" : " text-white")}>
                    <MdOutlineCheckCircle size={24} />
                  </span>
                  <span>
                    {input.day}
                  </span>
                </td>

                <td className={tdClass(input.value, "text-center")}>
                  {categories.find((category) => category.id === input.category)?.name || '-----'}
                </td>

                <td className={tdClass(input.value, "text-center")}>
                  {input.description}
                </td>

                <td className={tdClass(input.value, "text-center text-nowrap")}>
                  {input.step[0] !== 1 || input.step[1] !== 1
                    ? input.step[0] + ' de ' + input.step[1]
                    : 'Único'
                  }
                </td>

                <th className={tdClass(input.value, "text-end text-nowrap")}>
                  {input.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </th>

              </tr>

            )) : (

              <tr>
                <td colSpan={5} className="border-white text-center">
                  Nenhum dado encontrado
                </td>
              </tr>

            )}

          </tbody>

          {data && data.total ? (
            <tfoot>

              <tr>
                <td colSpan={5} className="m-0 p-0">
                  &nbsp;
                </td>
              </tr>

              <tr>
                <td colSpan={4} className="border-white text-start text-dark">
                  Confirmados
                </td>
                <td className={tdClass(data.done, "border-white text-end")}>
                  {data.done.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </td>
              </tr>

              <tr>
                <th colSpan={4} className="border-white text-start text-dark h5">
                  Total
                </th>
                <th className={tdClass(data.total, "border-white text-end h5")}>
                  {data.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </th>
              </tr>

            </tfoot >
          ) : null
          }

        </Table >
      </div >
    </Container >
  )

}