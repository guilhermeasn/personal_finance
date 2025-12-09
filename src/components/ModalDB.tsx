import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import type { DatabaseName } from "../assets/database.class";

export type ModalDBProps = {
  show: boolean;
  selectedDB: DatabaseName;
  onSearchEmptyDB: () => Promise<Record<DatabaseName, boolean>>;
  onHide: () => void;
  onChangeDB: (db: DatabaseName) => void;
  onDeleteDB: () => void;
  onExportDB: () => void;
  onImportDB: (db: Record<string, any>) => void;
}

export default function ModalDB({ selectedDB, onSearchEmptyDB, show, onHide, onChangeDB, onDeleteDB, onExportDB, onImportDB }: ModalDBProps) {

  const [emptyDB, setEmptyDB] = useState<Record<DatabaseName, boolean>>();
  useEffect(() => (show && onSearchEmptyDB().then(setEmptyDB), void (0)), [show]);

  const handleImportDB = () => {
    const file = document.createElement('input');
    file.type = 'file';
    file.accept = '.json';
    file.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (!target.files?.[0]) return;
      const file = target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const db = JSON.parse(e.target?.result as string);
          onImportDB(db);
        };
        reader.readAsText(file);
      }
    };
    file.click();
  };

  return (
    <Modal show={show} centered>
      <Modal.Header className="alert alert-warning border-bottom-0">
        <Modal.Title>Banco de Dados</Modal.Title>
      </Modal.Header>

      <Form onSubmit={e => { e.preventDefault(); onHide(); }}>

        <Modal.Body>
          <Form.FloatingLabel className="flex-fill" label="Banco de Dados">
            <Form.Select className="rounded-0" onChange={(e) => onChangeDB(e.target.value as DatabaseName)} value={selectedDB}>
              {emptyDB && Object.entries(emptyDB).map(([db, empty], index) => (
                <option key={index} value={db}>
                  {db} ({empty ? 'vazio' : 'ocupado'})
                </option>
              ))}
            </Form.Select>
          </Form.FloatingLabel>
          <div className="d-flex flex-column justify-content-center">
            <Button variant="outline-dark" className="mt-3" onClick={onExportDB} disabled={!emptyDB || emptyDB[selectedDB]}>Exportar Dados</Button>
            <Button variant="outline-dark" className="mt-3" onClick={handleImportDB} disabled={!emptyDB || !emptyDB[selectedDB]}>Importar Dados</Button>
            <Button variant="outline-danger" className="mt-3" onClick={onDeleteDB} disabled={!emptyDB || emptyDB[selectedDB]}>Excluir Dados</Button>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" type="submit">Concluir</Button>
        </Modal.Footer>

      </Form>

    </Modal>
  )
}