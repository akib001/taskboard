import React, { useEffect, useRef, useState } from "react";
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
  const [menuPosition, setMenuPosition] = useState({ left: 0, top: 0 });

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

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const menuWidthForMobile = 176;

    if (isMobile) {
      setMenuPosition({
        left: Math.max(0, position.x - menuWidthForMobile) - 8,
        top: position.y + 5,
      });
    } else {
      setMenuPosition({
        left: position.x + 8,
        top: position.y + 8,
      });
    }
  }, [position]);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-columnBackgroundColor border border-gray-700 rounded-md shadow-lg"
      style={{
        left: `${menuPosition.left}px`,
        top: `${menuPosition.top}px`,
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
            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 transition-colors duration-150 ease-in-out"
          >
            Move to {defaultBoardStatate.columns[column].name}
          </button>
        ))}
      </div>
    </div>
  );
};
