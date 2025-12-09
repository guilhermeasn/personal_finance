import { Button, Form, Modal } from "react-bootstrap";

export type ModalDBProps = {
  selectedDB: string;
  dbs: string[];
  show: boolean;
  onHide: () => void;
  onChangeDB: (db: string) => void;
  onNewDB: () => void;
  onDeleteDB: () => void;
}

export default function ModalDB({ selectedDB, dbs, show, onHide, onChangeDB, onNewDB, onDeleteDB }: ModalDBProps) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header className="alert alert-warning border-bottom-0">
        <Modal.Title>Modal heading</Modal.Title>
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
            <Button variant="outline-dark" onClick={onNewDB} className="mt-3">Novo Banco de Dados</Button>
            <Button variant="outline-danger" onClick={onDeleteDB} className="mt-3">Excluir Banco de Dados</Button>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="success" type="submit">Fechar</Button>
        </Modal.Footer>

      </Form>

    </Modal>
  )
}