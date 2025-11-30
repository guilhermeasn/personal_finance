import { useState } from "react";
import Buttons from "./components/Buttons";
import Header from "./components/Header";
import Inputs from "./components/Inputs";
import ModalAdd, { type ModalAddMode } from "./components/ModalAdd";
import Month from "./components/Month";

const data = [
  { date: 123123123, category: "asdfasd", description: "dasdfsfasdfasdfasd dfafdasff ads fsdaf ", value: 300, installment: null, done: true },
  { date: 123123123, category: "asdfasd", description: "dasdfsfasdfasdfasd dfafdasff ads fsdaf ", value: -100, installment: { id: "1", current: 1, total: 3 }, done: true },
  { date: 123123123, category: "asdfasd", description: "dasdfsfasdfasdfasd dfafdasff ads fsdaf ", value: -100, installment: null, done: false },
]

export default function App() {

  const [month, setMonth] = useState<[number, number]>();
  const [modal, setModal] = useState<ModalAddMode>(null);

  return (

    <>

      <Header />

      <main>

        <Month month={month} onChange={setMonth} />
        <Inputs data={data} onEdit={i => setModal([i, data[i]])} />
        <Buttons onDebit={() => setModal('D')} onCredit={() => setModal('C')} />
        <ModalAdd mode={modal} onHide={() => setModal(null)} onSave={(input) => JSON.stringify(input)} />

      </main>

    </>

  )

}

