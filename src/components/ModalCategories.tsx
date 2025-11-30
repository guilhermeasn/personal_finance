import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

export type ModalCategoriesProps = {
  show: boolean;
  onHide: () => void;
  categories: string[];
  onSave: (categories: string[]) => void;
}

export default function ModalCategories({ show, onHide, categories, onSave }: ModalCategoriesProps) {

  // Initialize with categories + one empty slot
  const [localCategories, setLocalCategories] = useState<string[]>([]);

  useEffect(() => {
    if (show) {
      setLocalCategories([...categories, ""]);
    }
  }, [show, categories]);

  const handleChange = (index: number, value: string) => {
    const newCats = [...localCategories];
    newCats[index] = value;

    // If we are typing in the last input and it becomes non-empty, add a new empty one
    if (index === newCats.length - 1 && value.trim() !== "") {
      newCats.push("");
    }

    setLocalCategories(newCats);
  };

  const handleSave = () => {
    // Filter out empty strings
    const validCategories = localCategories.map(c => c.trim()).filter(c => c !== "");
    onSave(validCategories);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header className="alert alert-info rounded-bottom-0" closeButton>
        <Modal.Title>Categorias</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          {localCategories.map((cat, index) => (
            <Form.Group key={index} className="mb-2">
              <Form.Control
                type="text"
                value={cat}
                onChange={(e) => handleChange(index, e.target.value)}
                placeholder={index === localCategories.length - 1 ? "Nova categoria..." : ""}
              // autoFocus={index === localCategories.length - 1 && index > 0} // Optional: autofocus new inputs? Maybe annoying if typing.
              />
            </Form.Group>
          ))}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancelar</Button>
        <Button variant="primary" onClick={handleSave}>Salvar</Button>
      </Modal.Footer>

    </Modal>
  )
}
