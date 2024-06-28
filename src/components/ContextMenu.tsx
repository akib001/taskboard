import React, { useEffect, useRef } from "react";
import { ColumnTypes } from "../utils/enums";
import { ITask } from "../utils/types";
import { defaultBoardState } from "../utils/constants";

interface ContextMenuProps {
  task: ITask;
  position: { x: number; y: number };
  onMove: (taskId: string, targetColumn: ColumnTypes) => void;
  onDeleteTask: (taskId: string) => void;
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  task,
  position,
  onMove,
  onClose,
  onDeleteTask,
}) => {
  const menuOptions = defaultBoardState.columnOrder.filter(
    (columnId) => columnId !== task.columnId
  );
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
      <div className="max-w-44 lg:max-w-52">
        {menuOptions.map((column) => (
          <button
            key={column}
            onClick={() => {
              onMove(task.id, column);
              onClose();
            }}
            className={`${buttonStyle} text-white`}
          >
            Move to {defaultBoardState.columns[column].name}
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
