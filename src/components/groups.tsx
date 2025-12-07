import { Container, Table } from "react-bootstrap";
import type { GroupData } from "../assets/finance.type";
import { tdClass } from "./Inputs";

export type GroupsProps = {
  data: GroupData | null;
  onCategory: (category: string) => void;
}

export default function Groups({ data, onCategory }: GroupsProps) {

  return (
    <Container>
      <div className="rounded p-3 bg-warning-table">
        <Table className="p-0 m-0" variant="warning" responsive>

          <thead>
            <tr>
              <th className="text-start text-dark">Categoria</th>
              <th className="text-center text-dark">Confirmado</th>
              <th className="text-end text-dark">Total</th>
            </tr>
          </thead>

          <tbody>
            {data && Object.entries(data).map(([category, value]) => category !== '__total__' && (
              <tr key={category} className="border-warning-table clickable">
                <td className="text-start text-dark" onClick={() => onCategory(category)}>{value.name}</td>
                <td className={tdClass(value.done, "text-center")}>{value.done.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                <td className={tdClass(value.total, "text-end")}>{value.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
              </tr>
            ))}
          </tbody>

          {data && data.__total__ && (

            <tfoot>

              <tr>
                <td colSpan={3} className="m-0 p-0"></td>
              </tr>

              <tr>
                <th className="border-warning-table text-start text-dark h5">
                  Total
                </th>
                <th className={tdClass(data.__total__.done, "border-warning-table text-center")}>
                  {data.__total__.done.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </th>

                <th className={tdClass(data.__total__.total, "border-warning-table text-end")}>
                  {data.__total__.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </th>
              </tr>

            </tfoot>

          )}

        </Table>
      </div>
    </Container>
  )

}