import { useState } from "react";
import { initialBoardState } from "../utils/constants";
import Column from "./Column";
import { IBoardState, ITask } from "../utils/types";
import AddEditModal from "./AddEditModal";
import { generateId } from "../utils/helpers";
import { ColumnTypes } from "../utils/enums";

const KanbanBoard = () => {
  const [board, setBoard] = useState<IBoardState>(initialBoardState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ITask | undefined>(undefined);

  const closeModal = () => {
    setIsModalOpen(false);
    if (editingTask) {
      setEditingTask(undefined);
    }
  };

  const handleSaveTask = (task: ITask) => {
    if (task.id) {
      const taskId = task.id;
      // Edit existing task
      setBoard((prevState) => ({
        ...prevState,
        tasks: {
          ...prevState.tasks,
          [taskId]: {
            ...prevState.tasks[taskId],
            ...task,
          },
        },
      }));
    } else {
      const newTaskId = generateId();
      const newColumnId = ColumnTypes.NEW;

      setBoard((prevState) => {
        return {
          ...prevState,
          tasks: {
            ...prevState.tasks,
            [newTaskId]: {
              ...task,
              id: newTaskId,
              columnId: newColumnId,
            },
          },
          columns: {
            ...prevState.columns,
            [newColumnId]: {
              ...prevState.columns[newColumnId],
              taskIds: [newTaskId, ...prevState.columns[newColumnId].taskIds],
            },
          },
        };
      });
    }
  };

  const handleCreateOrEditTask = (task: ITask | null) => {
    if (task) {
      setEditingTask(task);
    }
    setIsModalOpen(true);
  };

  return (
    <div
      className="
    m-auto
    flex
    min-h-screen
    w-full
    items-center
    overflow-x-auto
    overflow-y-hidden
    px-[40px]
"
    >
      <div className="m-auto flex gap-4">
        <div className="flex gap-4">
          {board.columnOrder.map((columnId) => (
            <Column
              key={columnId}
              column={board.columns[columnId]}
              tasks={board.columns[columnId].taskIds.map(
                (taskId) => board.tasks[taskId]
              )}
              createOrEditTask={handleCreateOrEditTask}
            />
          ))}
        </div>
        <AddEditModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSaveTask}
          task={editingTask}
        />
      </div>
    </div>
  );
};

export default KanbanBoard;
