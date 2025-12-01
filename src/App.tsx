import { useState } from "react";
import { Database, type Input } from "./assets/database.class";
import Buttons from "./components/Buttons";
import Header from "./components/Header";
import Inputs from "./components/Inputs";
import ModalCategories from "./components/ModalCategories";
import ModalConfirm from "./components/ModalConfirm";
import ModalInput from "./components/ModalInput";
import Selection, { type SelectionState } from "./components/Selection";

const db = new Database('personal_finance');

export default function App() {

  const [selection, setSelection] = useState<SelectionState>({});

  const [inputModal, setInputModal] = useState<boolean | [number, Input]>(false);
  const [confirmModal, setConfirmModal] = useState<string | null | [string, () => void]>(null);
  const [categoriesModal, setCategoriesModal] = useState(false);

  return (

    <>

      <Header />

      <main>

        <Selection
          state={selection}
          onChange={setSelection}
          categories={[]}
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
