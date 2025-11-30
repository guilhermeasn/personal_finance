import { useState } from "react";
import Buttons from "./components/Buttons";
import Header from "./components/Header";
import Inputs from "./components/Inputs";
import ModalAdd from "./components/ModalAdd";
import Month from "./components/Month";

export default function App() {

  const [month, setMonth] = useState<[number, number]>();
  const [showModalAdd, setShowModalAdd] = useState(false);

  return (

    <>

      <Header />

      <main>

        <Month month={month} onChange={setMonth} />
        <Inputs data={[
          { date: 123123123, category: "asdfasd", description: "dasdfsfasdfasdfasd dfafdasff ads fsdaf ", value: 300, installment: null, done: true },
          { date: 123123123, category: "asdfasd", description: "dasdfsfasdfasdfasd dfafdasff ads fsdaf ", value: -100, installment: null, done: true },
          { date: 123123123, category: "asdfasd", description: "dasdfsfasdfasdfasd dfafdasff ads fsdaf ", value: -100, installment: null, done: false },
        ]} />
        <Buttons onDebit={() => setShowModalAdd(true)} onCredit={() => setShowModalAdd(true)} />
        <ModalAdd show={showModalAdd} onHide={() => setShowModalAdd(false)} onSave={(input) => JSON.stringify(input)} />

      </main>

    </>

  )

}

