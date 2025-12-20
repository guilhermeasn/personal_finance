import { useEffect, useState } from "react";
import { Database, type DatabaseName } from "./assets/database.class";
import { Finance } from "./assets/finance.class";
import type { Category, CreateInput, GroupData, Input, MonthData, MonthIndex, UpdateInput, UpdateMode } from "./assets/finance.type";
import Buttons from "./components/Buttons";
import Groups from "./components/Groups";
import Header from "./components/Header";
import Inputs from "./components/Inputs";
import ModalCategories from "./components/ModalCategories";
import ModalConfirm from "./components/ModalConfirm";
import ModalDB from "./components/ModalDB";
import ModalInput from "./components/ModalInput";
import ModalSelect, { type SelectState as SelectionState } from "./components/ModalSelect";

const months = [
  "Janeiro", "Fevereiro", "Março",
  "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro",
  "Outubro", "Novembro", "Dezembro"
];

const db = new Database();
const finance = new Finance(db);

function currentDate(): SelectionState {
  const date = new Date();
  return {
    month: date.getMonth() as MonthIndex,
    year: date.getFullYear(),
    category: ""
  }
}

export default function App() {

  const [dbConfig, setDbConfig] = useState<DatabaseName>(db.currentDB());
  useEffect(() => db.changeDB(dbConfig), [dbConfig]);

  const [data, setData] = useState<MonthData | null>(null);
  const [group, setGroup] = useState<GroupData | null>(null);
  const [selection, setSelection] = useState<SelectionState>(currentDate());

  const [categories, setCategories] = useState<Category[]>([]);

  const [dbModal, setDbModal] = useState(false);
  const [inputModal, setInputModal] = useState<boolean | Input>(false);
  const [confirmModal, setConfirmModal] = useState<string | null | [string, () => void]>(null);
  const [categoriesModal, setCategoriesModal] = useState(false);
  const [selectModal, setSelectModal] = useState(false);

  useEffect(() => {
    if (dbModal) return;
    if (selection.category) finance.getMonth(selection.month, selection.year, selection.category).then(setData);
    else finance.getGroup(selection.month, selection.year).then(setGroup);
  }, [selection, dbConfig, dbModal]);

  useEffect(() => (dbModal ? null : finance.getCategories().then(setCategories), void (0)), [dbConfig, dbModal]);

  const handleSave = async (input: CreateInput) => {
    if (input.category === "") return "Selecione uma categoria";
    if (input.description === "") return "Insira uma descrição";
    try {
      await finance.setInput(selection.month, selection.year, input);
      if (selection.category)
        await finance.getMonth(selection.month, selection.year, selection.category).then(setData);
      else
        await finance.getGroup(selection.month, selection.year).then(setGroup);
      return null;
    } catch (error) {
      return error instanceof Error ? error.message : "Erro inesperado";
    }
  }

  const handleEdit = async (id: string, mode: UpdateMode, input: UpdateInput) => {
    if (input.category === "") return "Selecione uma categoria";
    if (input.description === "") return "Insira uma descrição";
    try {
      await finance.updateInput(selection.month, selection.year, id, mode, input);
      if (selection.category)
        await finance.getMonth(selection.month, selection.year, selection.category).then(setData);
      else
        await finance.getGroup(selection.month, selection.year).then(setGroup);
      return null;
    } catch (error) {
      return error instanceof Error ? error.message : "Erro inesperado";
    }
  }

  const handleDelete = async (id: string, mode: UpdateMode) => {
    setConfirmModal([
      'Deseja realmente excluir a(s) entrada(s)?',
      async () => {
        try {
          await finance.removeInput(selection.month, selection.year, id, mode);
          if (selection.category)
            await finance.getMonth(selection.month, selection.year, selection.category).then(setData);
          else
            await finance.getGroup(selection.month, selection.year).then(setGroup);
          return null;
        } catch (error) {
          console.error(error instanceof Error ? error.message : "Erro inesperado");
        }
      }
    ]);
    return null;
  }

  return (

    <>

      <Header onChangeDataBase={() => setDbModal(true)} />

      <main className="my-3">

        {selection.category ? (
          <Inputs
            title={(categories.find(c => c.id === selection.category)?.name || 'Categoria Desconhecida') + ' - ' + months[selection.month] + ' / ' + selection.year}
            categories={categories}
            data={data}
            onEdit={setInputModal}
            onHeaderClick={() => setSelectModal(true)}
          />
        ) : (
          <Groups
            title={months[selection.month] + ' / ' + selection.year}
            data={group}
            onCategory={category => setSelection({ ...selection, category })}
            onHeaderClick={() => setSelectModal(true)}
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
          selectedDB={dbConfig}
          onSearchEmptyDB={db.emptyDB}
          onHide={() => setDbModal(false)}
          onChangeDB={db => setDbConfig(db)}
          onDeleteDB={() => setConfirmModal([`Deseja realmente excluir o banco de dados ${dbConfig}?`, () => db.truncateDB(dbConfig).then(() => setDbModal(false))])}
          onExportDB={() => db.exportDB().then((success) => success ? void (0) : setConfirmModal(`Banco de dados ${dbConfig} vazio!`))}
          onImportDB={(data) => db.importDB(data).then(r => (setConfirmModal(r ? 'Dados importados com sucesso!' : `Banco de dados ${dbConfig} não está vazio! Para importar dados, selecione um banco de dados vazio.`), setDbModal(false)))}
        />

        <ModalInput
          show={inputModal}
          categories={categories}
          onHide={() => setInputModal(false)}
          onDelete={handleDelete}
          onSave={handleSave}
          onEdit={handleEdit}
        />

        <ModalSelect
          show={selectModal}
          onHide={() => setSelectModal(false)}
          categories={categories}
          onSave={setSelection}
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
