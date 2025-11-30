import { useState } from "react";
import type { Input } from "./assets/types";
import Buttons from "./components/Buttons";
import Header from "./components/Header";
import Inputs from "./components/Inputs";
import ModalConfirm from "./components/ModalConfirm";
import ModalInput from "./components/ModalInput";
import Selection from "./components/Selection";

const data = [
  { day: 2, category: "asdfasd", description: "dasdfsfasdfasdfasd dfafdasff ads fsdaf ", value: 300, installment: null, done: true },
  { day: 15, category: "asdfasd", description: "dasdfsfasdfasdfasd dfafdasff ads fsdaf ", value: -100, installment: { id: "1", current: 1, total: 3 }, done: true },
  { day: 30, category: "asdfasd", description: "dasdfsfasdfasdfasd dfafdasff ads fsdaf ", value: -100, installment: null, done: false },
]

export default function App() {

  const categories = data.map(i => i.category).filter((value, index, self) => self.indexOf(value) === index);

  const [month, setMonth] = useState<number>();
  const [year, setYear] = useState<number>();
  const [category, setCategory] = useState<string>();
  const [modal, setModal] = useState<boolean | [number, Input]>(false);
  const [confirm, setConfirm] = useState<string | null | [string, () => void]>(null);

  return (

    <>

      <Header onChangeDataBase={() => console.log("backup")} />

      <main>

        <Selection
          month={month}
          year={year}
          category={category}
          onChangeMonth={setMonth}
          onChangeYear={setYear}
          onChangeCategory={setCategory}
          categories={categories}
        />

        <Inputs
          data={data}
          onEdit={i => setModal([i, data[i]])}
        />

        <Buttons
          onAdd={() => setModal(true)}
        />

        <ModalInput
          show={modal === true}
          categories={categories}
          onHide={() => setModal(false)}
          onSave={(input) => (console.log(input), null)}
        />

        <ModalConfirm
          show={confirm !== null}
          onHide={() => setConfirm(null)}
          message={Array.isArray(confirm) ? confirm[0] : confirm}
          onConfirm={Array.isArray(confirm) ? confirm[1] : undefined}
        />

      </main>

    </>

  )

}
