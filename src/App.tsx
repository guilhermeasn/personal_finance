import { useEffect, useState } from "react";
import { Database } from "./assets/database.class";
import { Finance } from "./assets/finance.class";
import type { Category, GroupData, Input, MonthData, MonthIndex } from "./assets/finance.type";
import Buttons from "./components/Buttons";
import Groups from "./components/Groups";
import Header from "./components/Header";
import Inputs from "./components/Inputs";
import ModalCategories from "./components/ModalCategories";
import ModalConfirm from "./components/ModalConfirm";
import ModalDB from "./components/ModalDB";
import ModalInput from "./components/ModalInput";
import Selection, { type SelectionState } from "./components/Selection";

const db = new Database();
const finance = new Finance(db);

function currentDate(): SelectionState {
  return {
    month: new Date().getMonth() as MonthIndex,
    year: new Date().getFullYear(),
    category: ""
  }
}

export default function App() {

  const [dbConfig, setDbConfig] = useState<{ selected: string; dbs: string[] }>({
    selected: db.selected(),
    dbs: []
  });

  useEffect(() => {
    db.getDB().then(dbs => setDbConfig({ selected: db.selected(), dbs }));
  }, []);

  const [data, setData] = useState<MonthData | null>(null);
  const [group, setGroup] = useState<GroupData | null>(null);
  const [selection, setSelection] = useState<SelectionState>(currentDate());

  useEffect(() => {
    if (selection.category !== "__group__") finance.getMonth(selection.month, selection.year, selection.category).then(setData);
    else finance.getGroup(selection.month, selection.year).then(setGroup);
  }, [selection, dbConfig]);

  useEffect(() => { db.changeDB(dbConfig.selected) }, [dbConfig]);

  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => (finance.getCategories().then(setCategories), void (0)), [dbConfig]);

  const [dbModal, setDbModal] = useState(false);
  const [inputModal, setInputModal] = useState<boolean | Input>(false);
  const [confirmModal, setConfirmModal] = useState<string | null | [string, () => void]>(null);
  const [categoriesModal, setCategoriesModal] = useState(false);

  return (

    <>

      <Header onChangeDataBase={() => setDbModal(true)} />

      <main>

        <Selection
          state={selection}
          onChange={setSelection}
          onReset={() => setSelection(currentDate())}
          categories={categories}
        />

        {selection.category !== "__group__" ? (
          <Inputs
            categories={categories}
            data={data}
            onEdit={setInputModal}
          />
        ) : (
          <Groups
            data={group}
            onCategory={category => setSelection({ ...selection, category })}
          />
        )}

        <Buttons
          onAdd={() => setInputModal(true)}
          onCategories={() => setCategoriesModal(true)}
          onPreviousMonth={() => setSelection({ ...selection, ...Finance.previousMonth(selection.month, selection.year) })}
          onNextMonth={() => setSelection({ ...selection, ...Finance.nextMonth(selection.month, selection.year) })}
        />

        <ModalDB
          show={dbModal}
          selectedDB={dbConfig.selected}
          dbs={dbConfig.dbs}
          onHide={() => setDbModal(false)}
          onChangeDB={db => setDbConfig({ selected: db, dbs: dbConfig.dbs })}
          onNewDB={() => db.newDB().then((dbs) => setDbConfig({ selected: db.selected(), dbs }))}
          onDeleteDB={() => db.deleteDB(dbConfig.selected).then((dbs) => setDbConfig({ selected: db.selected(), dbs }))}
        />

        <ModalInput
          show={inputModal === true}
          categories={categories}
          onHide={() => setInputModal(false)}
          onSave={async (input) => {
            if (input.category === "") return "Selecione uma categoria";
            if (input.description === "") return "Insira uma descrição";
            try {
              await finance.setInput(selection.month, selection.year, input);
              await finance.getMonth(selection.month, selection.year).then(setData);
              return null;
            } catch (error) {
              return error instanceof Error ? error.message : "Erro inesperado";
            }
          }}
        />

        <ModalCategories
          show={categoriesModal}
          onHide={() => setCategoriesModal(false)}
          categories={categories}
          onSave={async c => (await finance.setCategories(c), setCategories(c))}
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
