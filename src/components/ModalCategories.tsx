import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import { MdDragIndicator } from "react-icons/md";
import type { Category } from "../assets/finance.type";

export type ModalCategoriesProps = {
  show: boolean;
  onHide: () => void;
  categories: Category[];
  onSave: (categories: Category[]) => void;
}

// Sortable Item Component
function SortableItem({
  category,
  onChange,
  originalName,
}: {
  category: Category;
  onChange: (val: string) => void;
  originalName?: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : "auto",
    position: "relative" as const,
  };

  return (
    <Form.Group ref={setNodeRef} style={style} className="mb-2">
      <InputGroup>
        <InputGroup.Text
          {...attributes}
          {...listeners}
          style={{ cursor: "grab", touchAction: "none" }}
          className="bg-transparent"
        >
          <MdDragIndicator size={20} className="text-secondary" />
        </InputGroup.Text>

        <Form.Control
          type="text"
          value={category.name}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Nome da categoria"
          isInvalid={!!originalName && category.name.trim() === ""}
          autoFocus
        />
        <Form.Control.Feedback type="invalid">A categoria <strong>{originalName || category.name}</strong> será excluída</Form.Control.Feedback>
      </InputGroup>
    </Form.Group>
  );
}

export default function ModalCategories({ show, onHide, categories, onSave }: ModalCategoriesProps) {
  const [localCategories, setLocalCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (show) setLocalCategories([...categories]);
  }, [show, categories]);

  const handleChange = (index: number, value: string) => {
    const newCats = [...localCategories];
    const currentId = newCats[index].id;
    newCats[index] = { ...newCats[index], id: currentId, name: value.trimStart(), position: index + 1 };
    setLocalCategories(newCats);
  };

  const handleAddCategory = () => {
    setLocalCategories([
      ...localCategories,
      { id: crypto.randomUUID(), name: "", position: localCategories.length + 1 }
    ]);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor), // Explicit touch sensor for mobile
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && over) {
      setLocalCategories((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = () => {
    const validCategories = localCategories.filter(cat => cat.name.trim() !== "");
    // Update positions based on final order
    const orderedCategories = validCategories.map((cat, index) => ({
      ...cat,
      position: index + 1
    }));
    onSave(orderedCategories);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header className="alert alert-info rounded-bottom-0" closeButton>
        <Modal.Title>Categorias</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {localCategories.length === 0 && (
          <div className="alert alert-secondary text-center">
            Nenhuma categoria cadastrada
          </div>
        )}
        <Form onSubmit={e => (e.preventDefault(), handleAddCategory())}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={localCategories.map(c => c.id)}
              strategy={verticalListSortingStrategy}
            >
              {localCategories.map((cat, index) => {
                const originalCategory = categories.find((c) => c.id === cat.id);
                return (
                  <SortableItem
                    key={cat.id} // Must be stable ID
                    category={cat}
                    onChange={(val) => handleChange(index, val)}
                    originalName={originalCategory?.name}
                  />
                );
              })}
            </SortableContext>
          </DndContext>

          <div className="d-grid mt-3">
            <Button variant="warning" type="submit">
              Adicionar Categoria
            </Button>
          </div>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancelar</Button>
        <Button variant="primary" onClick={handleSave}>Salvar</Button>
      </Modal.Footer>

    </Modal>
  )
}
