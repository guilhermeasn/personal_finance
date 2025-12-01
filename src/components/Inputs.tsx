import { Container, Table } from "react-bootstrap";
import { MdOutlineCheckCircle } from "react-icons/md";
import type { Month } from "../assets/types";

export type InputProps = {
  data?: Month;
  onEdit?: (index: number) => void;
}

function tdClass(value: number, className?: string): string {
  return 'text-' + (value < 0 ? "danger" : (value > 0 ? "primary" : "secondary")) + (className ? " " + className : "");
}

export default function Inputs({ data, onEdit = () => { } }: InputProps) {

  const total: number | null = data ? data.reduce((total, input) => total + input.value, 0) : null;

  return (
    <Container>
      <div className="rounded p-3 bg-white">
        <Table className="p-0 m-0" variant="white" responsive>

          <tbody>

            {data && data.length > 0 ? data.map((input, index) => (

              <tr key={index} className="border-white clickable" onClick={() => onEdit(index)}>

                <td className={tdClass(input.value, "text-start d-flex")}>
                  <span className={"me-2 " + (input.done ? "" : " text-white")}>
                    <MdOutlineCheckCircle size={24} />
                  </span>
                  <span>
                    {input.day}
                  </span>
                </td>

                <td className={tdClass(input.value, "text-center")}>
                  {input.category}
                </td>

                <td className={tdClass(input.value, "text-center")}>
                  {input.description}
                </td>

                <td className={tdClass(input.value, "text-center")}>
                  {input.installment ? (
                    <>
                      {input.installment.current} de {input.installment.total}
                    </>
                  ) : 'Único'}
                </td>

                <th className={tdClass(input.value, "text-end")}>
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

          {total ? (
            <tfoot>
              <tr>
                <td colSpan={5} className="m-0 p-0">
                  &nbsp;
                </td>
              </tr>
              <tr>
                <th colSpan={4} className="border-white text-start text-dark h5">
                  Total
                </th>
                <th className={tdClass(total, "border-white text-end h5")}>
                  {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
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