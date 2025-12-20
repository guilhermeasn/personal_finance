import { Container, Table } from "react-bootstrap";
import { MdOutlineFilterAlt } from "react-icons/md";
import type { GroupData } from "../assets/finance.type";
import { tdClass } from "./Inputs";

export type GroupsProps = {
  title?: string;
  data: GroupData | null;
  onCategory: (category: string) => void;
  onHeaderClick?: () => void;
}

export default function Groups({ title = '', data, onCategory, onHeaderClick }: GroupsProps) {

  return (
    <Container>
      <div className="rounded p-3 bg-white">
        <Table className="p-0 m-0" variant="white" responsive>

          <thead>
            <tr className="border-white">
              <th colSpan={3} className="text-center text-secondary small">
                {onHeaderClick ? (
                  <span className="clickable d-flex align-items-center justify-content-center gap-2" onClick={onHeaderClick}>
                    {title} <MdOutlineFilterAlt size={22} />
                  </span>
                ) : title}
              </th>
            </tr>
            <tr>
              <th className="text-start text-dark">Categoria</th>
              <th className="text-center text-dark">Confirmado</th>
              <th className="text-end text-dark">Total</th>
            </tr>
          </thead>

          <tbody>
            {(data && Object.entries(data).length > 0) ? Object.entries(data).map(([category, value]) => category !== '__total__' ? (
              <tr key={category} className="border-white clickable" onClick={() => onCategory(category)}>
                <td className="text-start text-dark">{value.name}</td>
                <td className={tdClass(value.done, "text-center")}>{value.done.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                <td className={tdClass(value.total, "text-end")}>{value.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
              </tr>
            ) : null) : (
              <tr key="no-data">
                <td colSpan={3} className="m-0 py-2 text-center">
                  Nenhum dado encontrado
                </td>
              </tr>
            )}
          </tbody>

          {data && data.__total__ && (

            <tfoot>

              <tr>
                <td colSpan={3} className="m-0 p-0"></td>
              </tr>

              <tr>
                <th className="border-white text-start text-dark h5">
                  Total
                </th>
                <th className={tdClass(data.__total__.done, "border-white text-center")}>
                  {data.__total__.done.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </th>

                <th className={tdClass(data.__total__.total, "border-white text-end")}>
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