import React, { useEffect, useRef } from "react";
import { ColumnTypes } from "../utils/enums";
import { ITask } from "../utils/types";
import { defaultBoardStatate } from "../utils/constants";

interface ContextMenuProps {
  task: ITask;
  position: { x: number; y: number };
  onMove: (taskId: string, targetColumn: ColumnTypes) => void;
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  task,
  position,
  onMove,
  onClose,
}) => {
  const menuOptions = defaultBoardStatate.columnOrder.filter(
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

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-columnBackgroundColor border border-gray-700 rounded-md shadow-lg"
      style={{
        top: `${position.y + 8}px`,
        left: `${position.x + 8}px`,
      }}
    >
      <div>
        {menuOptions.map((column) => (
          <button
            key={column}
            onClick={() => {
              onMove(task.id, column);
              onClose();
            }}
            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 transition-colors duration-150 ease-in-out"
          >
            Move to {defaultBoardStatate.columns[column].name}
          </button>
        ))}
      </div>
    </div>
  );
};
