import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ITask } from "@/interfaces/task.interface";

interface SortableItemProps {
  id: string;
  task: ITask;
}

export default function SortableItem({ id, task }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-gray-700 p-4 rounded-md shadow-md mb-2 cursor-move text-white"
    >
      <p className="text-lg font-medium">{task.title}</p>
      <p className="text-sm text-gray-400">{task.description}</p>
    </div>
  );
}
