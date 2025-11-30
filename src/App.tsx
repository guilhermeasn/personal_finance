import { useState } from "react";
import Buttons from "./components/Buttons";
import Header from "./components/Header";
import Inputs from "./components/Inputs";
import Month from "./components/Month";

export default function App() {

  const [month, setMonth] = useState<[number, number]>();

  return (

    <>

      <Header />

      <main>

        <Month month={month} onChange={setMonth} />
        <Inputs />
        <Buttons />

      </main>

    </>

  )

}

