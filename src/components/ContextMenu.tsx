import React from "react";
import { ColumnTypes } from "../utils/enums";
import { ITask } from "../utils/types";
import { initialBoardState } from "../utils/constants";

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
  const menuOptions = initialBoardState.columnOrder.filter(
    (columnId) => columnId !== task.columnId
  );

  return (
    <div
      className="fixed z-50 bg-columnBackgroundColor border border-gray-700 rounded-md shadow-lg"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
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
            Move to {initialBoardState.columns[column].name}
          </button>
        ))}
      </div>
    </div>
  );
};
