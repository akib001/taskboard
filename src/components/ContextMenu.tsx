import React, { useEffect, useRef } from "react";
import { ColumnTypes } from "../utils/enums";
import { IBoardState, ITask } from "../utils/types";
import { defaultBoardState } from "../utils/constants";

interface ContextMenuProps {
  task: ITask;
  position: { x: number; y: number };
  moveTask: (taskId: string, targetColumnId: ColumnTypes, beforeIndex: number | null) => void;
  onDeleteTask: (taskId: string) => void;
  onClose: () => void;
  board: IBoardState;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  task,
  position,
  moveTask,
  onClose,
  onDeleteTask,
  board
}) => {
  const menuOptions = board.columnOrder.filter(
    (columnId) => columnId !== task.columnId
  );
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [onClose]);

  const buttonStyle =
    "w-full text-left px-4 py-2 text-sm  hover:bg-gray-700 focus:outline-none focus:bg-gray-700 transition-colors duration-150 ease-in-out";

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-columnBackgroundColor border border-gray-700 rounded-md shadow-lg"
      style={{
        left: `${position.x + 8}px`,
        top: `${position.y + 8}px`,
        maxWidth: "208px",
      }}
    >
      <div className="min-w-44 max-w-52">
        {menuOptions.map((columnId) => (
          <button
            key={columnId}
            onClick={() => {
              moveTask(task.id, columnId, null);
              onClose();
            }}
            className={`${buttonStyle} text-white`}
          >
            Move to {defaultBoardState.columns[columnId].name}
          </button>
        ))}
        <button
          onClick={() => {
            onDeleteTask(task.id);
            onClose();
          }}
          className={`${buttonStyle} text-red-500`}
        >
          Delete task
        </button>
      </div>
    </div>
  );
};
