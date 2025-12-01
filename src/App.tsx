import { useState } from "react";
import { Database, type Input } from "./assets/database.class";
import Buttons from "./components/Buttons";
import Header from "./components/Header";
import Inputs from "./components/Inputs";
import ModalCategories from "./components/ModalCategories";
import ModalConfirm from "./components/ModalConfirm";
import ModalInput from "./components/ModalInput";
import Selection from "./components/Selection";

const db = new Database('personal_finance');

export default function App() {

  const [month, setMonth] = useState<number>();
  const [year, setYear] = useState<number>();
  const [category, setCategory] = useState<string>();

  const [inputModal, setInputModal] = useState<boolean | [number, Input]>(false);
  const [confirmModal, setConfirmModal] = useState<string | null | [string, () => void]>(null);
  const [categoriesModal, setCategoriesModal] = useState(false);

  return (

    <>

      <Header />

      <main>

        <Selection
          month={month}
          year={year}
          category={category}
          onChangeMonth={setMonth}
          onChangeYear={setYear}
          onChangeCategory={setCategory}
        // categories={categories}
        />

        <Inputs
        // data={data}
        // onEdit={i => setModal([i, data[i]])}
        />

        <Buttons
          onAdd={() => setInputModal(true)}
          onCategories={() => setCategoriesModal(true)}
        />

        <ModalInput
          show={inputModal === true}
          // categories={categories}
          onHide={() => setInputModal(false)}
          onSave={(input) => (console.log(input), null)}
        />

        <ModalCategories
          show={categoriesModal}
          onHide={() => setCategoriesModal(false)}
          categories={[]}
          onSave={() => { }}
        />

        <ModalConfirm
          show={confirmModal !== null}
          onHide={() => setConfirmModal(null)}
          message={Array.isArray(confirmModal) ? confirmModal[0] : confirmModal}
          onConfirm={Array.isArray(confirmModal) ? confirmModal[1] : undefined}
        />

      </main>

    </>

  )

}
