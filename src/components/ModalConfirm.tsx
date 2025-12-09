import { Button, Modal } from "react-bootstrap";

export type ModalConfirmProps = {
  show: boolean;
  message: string | null;
  onHide: () => void;
  onConfirm?: () => void;
}

export default function ModalConfirm({
  show,
  message,
  onHide,
  onConfirm
}: ModalConfirmProps) {

  const isConfirm = !!onConfirm;

  return (

    <Modal className="bg-dark-transparent" show={show} onHide={onHide} centered>

      <Modal.Header className={`rounded-bottom-0 alert alert-${isConfirm ? 'danger' : 'warning'}`} closeButton>
        <Modal.Title>{isConfirm ? 'Confirmar' : 'Aviso'}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {message && <p>{message}</p>}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="dark" onClick={onHide}>
          {isConfirm ? 'Cancelar' : 'Ok'}
        </Button>
        {isConfirm && (
          <Button variant="danger" onClick={() => (onConfirm && onConfirm(), onHide())}>
            Confirmar
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
