import { useEffect, useState } from "react";
import type { Input } from "./assets/types";
import Buttons from "./components/Buttons";
import Header from "./components/Header";
import Inputs from "./components/Inputs";
import ModalConfirm from "./components/ModalConfirm";
import ModalDataBase from "./components/ModalDataBase";
import ModalInput from "./components/ModalInput";
import Selection from "./components/Selection";

const defaultData: Input[] = [
  { day: 2, category: "Alimentação", description: "Mercado", value: 300, installment: null, done: true },
  { day: 15, category: "Transporte", description: "Uber", value: -100, installment: { id: "1", current: 1, total: 3 }, done: true },
  { day: 30, category: "Lazer", description: "Cinema", value: -100, installment: null, done: false },
]

export default function App() {

  const [databases, setDatabases] = useState<string[]>(() => {
    const stored = localStorage.getItem("databases");
    return stored ? JSON.parse(stored) : ["Default"];
  });

  const [currentDb, setCurrentDb] = useState<string>(() => {
    return localStorage.getItem("currentDb") || "Default";
  });

  const [data, setData] = useState<Input[]>(() => {
    const stored = localStorage.getItem(`db_${currentDb}`);
    return stored ? JSON.parse(stored) : (currentDb === "Default" ? defaultData : []);
  });

  const categories = data.map(i => i.category).filter((value, index, self) => self.indexOf(value) === index);

  const [month, setMonth] = useState<number>();
  const [year, setYear] = useState<number>();
  const [category, setCategory] = useState<string>();
  const [modal, setModal] = useState<boolean | [number, Input]>(false);
  const [confirm, setConfirm] = useState<string | null | [string, () => void]>(null);
  const [showDbModal, setShowDbModal] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem("databases", JSON.stringify(databases));
  }, [databases]);

  useEffect(() => {
    localStorage.setItem("currentDb", currentDb);
  }, [currentDb]);

  useEffect(() => {
    localStorage.setItem(`db_${currentDb}`, JSON.stringify(data));
  }, [data, currentDb]);

  // DB Handlers
  const handleCreateDb = (name: string) => {
    if (!databases.includes(name)) {
      setDatabases([...databases, name]);
      setCurrentDb(name);
      setData([]);
    }
  };

  const handleDeleteDb = (name: string) => {
    if (name !== "Default") {
      const newDbs = databases.filter(db => db !== name);
      setDatabases(newDbs);
      localStorage.removeItem(`db_${name}`);
      if (currentDb === name) {
        setCurrentDb("Default");
        const defaultDataStored = localStorage.getItem("db_Default");
        setData(defaultDataStored ? JSON.parse(defaultDataStored) : defaultData);
      }
    }
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = JSON.parse(e.target?.result as string);
        if (Array.isArray(content)) {
          const name = file.name.replace(".json", "");
          let finalName = name;
          let i = 1;
          while (databases.includes(finalName)) {
            finalName = `${name} (${i++})`;
          }
          setDatabases([...databases, finalName]);
          setCurrentDb(finalName);
          setData(content);
          localStorage.setItem(`db_${finalName}`, JSON.stringify(content));
        } else {
          setConfirm("Arquivo inválido!");
        }
      } catch (err) {
        setConfirm("Erro ao ler arquivo!");
      }
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `${currentDb}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleRenameCategory = (oldName: string, newName: string) => {
    setData(data.map(item => item.category === oldName ? { ...item, category: newName } : item));
  };

  // Data Handlers
  const handleSaveInput = (input: Input, index?: number) => {
    if (index !== undefined) {
      const newData = [...data];
      newData[index] = input;
      setData(newData);
    } else {
      setData([...data, input]);
    }
    return null; // Success
  };

  const handleDeleteInput = (index: number) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  }

  return (
    <>
      <Header onChangeDataBase={() => setShowDbModal(true)} />

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
          show={modal !== false}
          categories={categories}
          initialInput={Array.isArray(modal) ? modal[1] : undefined}
          onHide={() => setModal(false)}
          onSave={(input) => {
            if (Array.isArray(modal)) {
              return handleSaveInput(input, modal[0]);
            } else {
              return handleSaveInput(input);
            }
          }}
          onDelete={Array.isArray(modal) ? () => {
            setConfirm(["Tem certeza que deseja excluir esta entrada?", () => {
              handleDeleteInput(modal[0]);
              setModal(false);
            }]);
          } : undefined}
        />

        <ModalConfirm
          show={confirm !== null}
          onHide={() => setConfirm(null)}
          message={Array.isArray(confirm) ? confirm[0] : confirm}
          onConfirm={Array.isArray(confirm) ? confirm[1] : undefined}
        />

        <ModalDataBase
          show={showDbModal}
          onHide={() => setShowDbModal(false)}
          currentDb={currentDb}
          databases={databases}
          categories={categories}
          onChangeDb={setCurrentDb}
          onCreateDb={handleCreateDb}
          onDeleteDb={handleDeleteDb}
          onImport={handleImport}
          onExport={handleExport}
          onRenameCategory={handleRenameCategory}
        />

      </main>
    </>
  )
}
