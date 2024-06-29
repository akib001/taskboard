import React, { useCallback, useState } from "react";
import { defaultBoardState } from "../utils/constants";
import Column from "./Column";
import { IBoardState, ITask } from "../utils/types";
import { generateId } from "../utils/helpers";
import { ColumnTypes } from "../utils/enums";
import { ContextMenu } from "./ContextMenu";

const KanbanBoard: React.FC = () => {
  const [board, setBoard] = useState<IBoardState>(defaultBoardState);
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

  const moveTask = useCallback(
    (
      taskId: string,
      targetColumnId: ColumnTypes,
      beforeIndex: number | null = null
    ) => {
      setBoard((prevState) => {
        const task = prevState.tasks[taskId];
        const sourceColumnId = task.columnId;

        if (sourceColumnId === targetColumnId && beforeIndex == null) {
          // Task is already in the correct position, no changes needed
          return prevState;
        }

        const updatedTask = {
          ...task,
          columnId: targetColumnId,
          dueDate: targetColumnId === ColumnTypes.ON_GOING ? "" : task.dueDate,
        };

        const updateColumnTaskIds = (
          columnId: ColumnTypes,
          taskId: string,
          beforeIndex: number | null
        ) => {
          const filteredIds = prevState.columns[columnId].taskIds.filter(
            (id) => id !== taskId
          );
          if (beforeIndex == null) {
            return [taskId, ...filteredIds];
          }

          if (beforeIndex === -1) {
            return [...filteredIds, taskId];
          }
          return [
            ...filteredIds.slice(0, beforeIndex),
            taskId,
            ...filteredIds.slice(beforeIndex),
          ];
        };

        return {
          ...prevState,
          tasks: {
            ...prevState.tasks,
            [taskId]: updatedTask,
          },
          columns: {
            ...prevState.columns,
            [sourceColumnId]: {
              ...prevState.columns[sourceColumnId],
              taskIds: prevState.columns[sourceColumnId].taskIds.filter(
                (id) => id !== taskId
              ),
            },
            [targetColumnId]: {
              ...prevState.columns[targetColumnId],
              taskIds: updateColumnTaskIds(targetColumnId, taskId, beforeIndex),
            },
          },
        };
      });

      // beforeIndex is null when the task is moved by context menu
      if (beforeIndex === null) {
        closeContextMenu();
      }
    },
    [closeContextMenu]
  );

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
    <div className="flex min-h-dvh w-full items-center overflow-x-auto overflow-y-hidden px-10 bg-black">
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
            moveTask={moveTask}
          />
        ))}
      </div>
      {contextMenu && (
        <ContextMenu
          task={contextMenu.task}
          position={contextMenu.position}
          moveTask={moveTask}
          onClose={closeContextMenu}
          onDeleteTask={handleDeleteTask}
          board={board}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
