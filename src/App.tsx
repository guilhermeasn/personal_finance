import { useState } from "react";
import { useCategories, useMonth } from "./assets/data";
import type { Input } from "./assets/types";
import Buttons from "./components/Buttons";
import Header from "./components/Header";
import Inputs from "./components/Inputs";
import ModalCategories from "./components/ModalCategories";
import ModalConfirm from "./components/ModalConfirm";
import ModalInput from "./components/ModalInput";
import Selection from "./components/Selection";

export default function App() {

  const [month, setMonth] = useState<number>();
  const [year, setYear] = useState<number>();
  const [category, setCategory] = useState<string>();

  const [categories, setCategories] = useCategories();
  const [data, setData] = useMonth(month, year);

  const [modal, setModal] = useState<boolean | [number, Input]>(false);
  const [confirm, setConfirm] = useState<string | null | [string, () => void]>(null);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);

  return (

    <>

      <Header onChangeDataBase={() => { }} />

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
          onCategories={() => setShowCategoriesModal(true)}
        />

        <ModalInput
          show={modal === true}
          categories={categories}
          onHide={() => setModal(false)}
          onSave={(input) => (console.log(input), null)}
        />

        <ModalCategories
          show={showCategoriesModal}
          onHide={() => setShowCategoriesModal(false)}
          categories={categories}
          onSave={setCategories}
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
