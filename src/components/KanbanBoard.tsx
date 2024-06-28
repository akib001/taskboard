import React, { useCallback, useState } from "react";
import { initialBoardState } from "../utils/constants";
import Column from "./Column";
import { IBoardState, ITask } from "../utils/types";
import { generateId } from "../utils/helpers";
import { ColumnTypes } from "../utils/enums";
import { ContextMenu } from "./ContextMenu";

const KanbanBoard: React.FC = () => {
  const [board, setBoard] = useState<IBoardState>(initialBoardState);
  const [contextMenu, setContextMenu] = useState<{
    task: ITask;
    position: { x: number; y: number };
  } | null>(null);

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

      // Create an updated task object
      const updatedTask = {
        ...task,
        columnId: targetColumn,
        // Clear dueDate if moving to IN_PROGRESS column
        dueDate: targetColumn === ColumnTypes.IN_PROGRESS ? "" : task.dueDate,
      };

      return {
        ...prevState,
        tasks: {
          ...prevState.tasks,
          [taskId]: updatedTask,
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

  const handleCreateOrEditTask = (task: ITask) => {
    if (task.id in board.tasks) {
      // Edit existing task
      setBoard((prevState) => ({
        ...prevState,
        tasks: {
          ...prevState.tasks,
          [task.id]: task,
        },
      }));
    } else {
      // Create new task
      const newTaskId = generateId();
      setBoard((prevState) => ({
        ...prevState,
        tasks: {
          ...prevState.tasks,
          [newTaskId]: { ...task, id: newTaskId },
        },
        columns: {
          ...prevState.columns,
          [task.columnId]: {
            ...prevState.columns[task.columnId],
            taskIds: [newTaskId, ...prevState.columns[task.columnId].taskIds],
          },
        },
      }));
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setBoard((prevState) => {
      const { [taskId]: deletedTask, ...remainingTasks } = prevState.tasks;
      const updatedColumns = { ...prevState.columns };
      updatedColumns[deletedTask.columnId].taskIds = updatedColumns[
        deletedTask.columnId
      ].taskIds.filter((id) => id !== taskId);

      return {
        ...prevState,
        tasks: remainingTasks,
        columns: updatedColumns,
      };
    });
  };

  return (
    <div className="flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px] bg-black">
      <div className="m-auto flex gap-4">
        {board.columnOrder.map((columnId) => (
          <Column
            key={columnId}
            column={board.columns[columnId]}
            tasks={board.columns[columnId].taskIds.map(
              (taskId) => board.tasks[taskId]
            )}
            createOrEditTask={handleCreateOrEditTask}
            onDeleteTask={handleDeleteTask}
            onContextMenu={handleContextMenu}
          />
        ))}
      </div>
      {contextMenu && (
        <ContextMenu
          task={contextMenu.task}
          position={contextMenu.position}
          onMove={moveTask}
          onClose={closeContextMenu}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
