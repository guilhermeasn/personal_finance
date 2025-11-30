import { Container, Table } from "react-bootstrap";
import type { Month } from "../assets/types";

export type InputProps = {
  month?: Month;
}

export default function Inputs({ month }: InputProps) {

  return (
    <Container>
      <div className="rounded p-3 bg-white">
        <Table className="p-0 m-0" variant="white" responsive>
          <tbody>
            {month ? month.map((input, index) => (
              <tr key={index} className="border-white clickable">
                <td>{new Date(input.date).toLocaleDateString()}</td>
                <td>{input.category}</td>
                <td>{input.description}</td>
                <th>{input.value}</th>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="border-white text-center">
                  Nenhum dado encontrado
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </Container>
  )

}