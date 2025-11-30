import { useState } from "react";
import Header from "./components/Header";
import Month from "./components/Month";

// localforage.keys().then(console.log);

export default function App() {

  const [month, setMonth] = useState<[number, number]>();

  return (

    <>

      <Header />

      <main>

        <Month month={month} onChange={setMonth} />


      </main>

    </>

  )

}

