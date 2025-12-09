import { Button, Form, Modal } from "react-bootstrap";

export type ModalDBProps = {
  selectedDB: string;
  dbs: string[];
  show: boolean;
  onHide: () => void;
  onChangeDB: (db: string) => void;
  onNewDB: () => void;
  onDeleteDB: () => void;
  onExportDB: () => void;
  onImportDB: (db: Record<string, any>) => void;
}

export default function ModalDB({ selectedDB, dbs, show, onHide, onChangeDB, onNewDB, onDeleteDB, onExportDB, onImportDB }: ModalDBProps) {

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
            <Form.Select className="rounded-0" onChange={(e) => onChangeDB(e.target.value)} value={selectedDB}>
              {dbs.map((db, index) => (
                <option key={index} value={db}>
                  {db}
                </option>
              ))}
            </Form.Select>
          </Form.FloatingLabel>
          <div className="d-flex flex-column justify-content-center">
            <Button variant="outline-success" onClick={onNewDB} className="mt-3">Novo Banco de Dados</Button>
            <Button variant="outline-dark" onClick={onExportDB} className="mt-3">Exportar Banco de Dados</Button>
            <Button variant="outline-dark" onClick={handleImportDB} className="mt-3">Importar Banco de Dados</Button>
            <Button variant="outline-danger" onClick={onDeleteDB} className="mt-3">Excluir Banco de Dados</Button>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" type="submit">Fechar</Button>
        </Modal.Footer>

      </Form>

    </Modal>
  )
}