import { useState } from "react";
import { Button, FloatingLabel, Form, Modal, Tab, Tabs } from "react-bootstrap";

export type ModalDataBaseProps = {
  show: boolean;
  onHide: () => void;
  currentDb: string;
  databases: string[];
  categories: string[];
  onChangeDb: (name: string) => void;
  onCreateDb: (name: string) => void;
  onDeleteDb: (name: string) => void;
  onImport: (file: File) => void;
  onExport: () => void;
  onRenameCategory: (oldName: string, newName: string) => void;
}

export default function ModalDataBase({
  show,
  onHide,
  currentDb,
  databases,
  categories,
  onChangeDb,
  onCreateDb,
  onDeleteDb,
  onImport,
  onExport,
  onRenameCategory
}: ModalDataBaseProps) {

  const [newDbName, setNewDbName] = useState("");
  const [tab, setTab] = useState("manage");

  const handleCreate = () => {
    if (newDbName) {
      onCreateDb(newDbName);
      setNewDbName("");
    }
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImport(e.target.files[0]);
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Gerenciar Dados</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs activeKey={tab} onSelect={(k) => setTab(k || "manage")} className="mb-3">
          <Tab eventKey="manage" title="Gerenciar">
            <FloatingLabel label="Banco de Dados Atual" className="mb-3">
              <Form.Select value={currentDb} onChange={(e) => onChangeDb(e.target.value)}>
                {databases.map(db => <option key={db} value={db}>{db}</option>)}
              </Form.Select>
            </FloatingLabel>

            <div className="d-flex gap-2 mb-3">
              <FloatingLabel label="Novo Banco de Dados" className="flex-grow-1">
                <Form.Control
                  type="text"
                  placeholder="Nome"
                  value={newDbName}
                  onChange={(e) => setNewDbName(e.target.value)}
                />
              </FloatingLabel>
              <Button variant="success" onClick={handleCreate} disabled={!newDbName}>Criar</Button>
            </div>

            <div className="d-grid gap-2">
              <Button variant="outline-primary" onClick={onExport}>Exportar Atual (JSON)</Button>
              <div className="d-flex gap-2">
                <Form.Control type="file" onChange={handleImport} accept=".json" style={{ display: 'none' }} id="import-file" />
                <Button variant="outline-secondary" className="w-100" as="label" htmlFor="import-file">Importar (JSON)</Button>
              </div>
              {currentDb !== 'Default' && (
                <Button variant="outline-danger" onClick={() => onDeleteDb(currentDb)}>Deletar Atual</Button>
              )}
            </div>
          </Tab>
          <Tab eventKey="categories" title="Categorias">
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {categories.map(cat => (
                <FloatingLabel key={cat} label={`Renomear "${cat}"`} className="mb-2">
                  <Form.Control
                    type="text"
                    defaultValue={cat}
                    onBlur={(e) => {
                      if (e.target.value !== cat && e.target.value.trim() !== "") {
                        onRenameCategory(cat, e.target.value);
                      }
                    }}
                  />
                </FloatingLabel>
              ))}
            </div>
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
}
