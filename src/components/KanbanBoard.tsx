import { useCallback, useState } from "react";
import { initialBoardState } from "../utils/constants";
import Column from "./Column";
import { IBoardState, ITask } from "../utils/types";
import AddEditModal from "./AddEditModal";
import { generateId } from "../utils/helpers";
import { ColumnTypes } from "../utils/enums";
import { ContextMenu } from "./ContextMenu";
import TaskCard from "./Task";

const KanbanBoard = () => {
  const [board, setBoard] = useState<IBoardState>(initialBoardState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ITask | undefined>(undefined);
  const [contextMenu, setContextMenu] = useState<{
    task: ITask;
    position: { x: number; y: number };
  } | null>(null);

  const closeModal = () => {
    setIsModalOpen(false);
    if (editingTask) {
      setEditingTask(undefined);
    }
  };

  const handleContextMenu = useCallback(
    (event: React.MouseEvent, task: ITask) => {
      setContextMenu({
        task,
        position: { x: event.clientX, y: event.clientY },
      });
    },
    []
  );

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const moveTask = useCallback((taskId: string, targetColumn: ColumnTypes) => {
    setBoard((prevState) => {
      const task = prevState.tasks[taskId];
      const sourceColumn = prevState.columns[task.columnId];
      const targetColumnObj = prevState.columns[targetColumn];

      return {
        ...prevState,
        tasks: {
          ...prevState.tasks,
          [taskId]: { ...task, columnId: targetColumn },
        },
        columns: {
          ...prevState.columns,
          [sourceColumn.id]: {
            ...sourceColumn,
            taskIds: sourceColumn.taskIds.filter((id) => id !== taskId),
          },
          [targetColumn]: {
            ...targetColumnObj,
            taskIds: [taskId, ...targetColumnObj.taskIds],
          },
        },
      };
    });
    closeContextMenu();
  }, []);

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
              taskIds: [...prevState.columns[newColumnId].taskIds, newTaskId],
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
          {board.columnOrder.map((columnId) => {
            const tasks = board.columns[columnId].taskIds;
            return (
              <Column
                key={columnId}
                column={board.columns[columnId]}
                createOrEditTask={handleCreateOrEditTask}
                taskCount={tasks.length}
              >
                {tasks
                  .map((taskId) => board.tasks[taskId])
                  .map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      createOrEditTask={handleCreateOrEditTask}
                      onContextMenu={handleContextMenu}
                    />
                  ))}
              </Column>
            );
          })}
        </div>
        {contextMenu && (
          <ContextMenu
            task={contextMenu.task}
            position={contextMenu.position}
            onMove={moveTask}
            onClose={closeContextMenu}
          />
        )}
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
