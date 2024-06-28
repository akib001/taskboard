import React, { useState, useRef, useEffect } from "react";
import { ITask } from "../utils/types";
import { ColumnTypes } from "../utils/enums";
import MenuIcon from "../assets/MenuIcon";
import { calculateTimeStatus } from "../utils/helpers";

interface TaskProps {
  task: ITask;
  createOrEditTask: (task: ITask) => void;
  onContextMenu: (event: React.MouseEvent, task: ITask) => void;
  onDelete: (taskId: string) => void;
  isNew?: boolean;
}

const TaskCard: React.FC<TaskProps> = ({
  task,
  createOrEditTask,
  onContextMenu,
  onDelete,
  isNew = false,
}) => {
  const [isEditing, setIsEditing] = useState(isNew);
  const cardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const dueDateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && isNew && titleRef.current) {
      titleRef.current.focus();
    }
  }, [isEditing, isNew]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        if (isNew && !task.title.trim()) {
          onDelete(task.id);
        }
        setIsEditing(false);
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isNew && !task.title.trim()) {
          onDelete(task.id);
        }
        setIsEditing(false);
      }
    };

    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isEditing, task, isNew, onDelete]);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    onContextMenu(event, task);
  };

  const handleFieldClick = (field: "title" | "description" | "dueDate") => {
    setIsEditing(true);
    setTimeout(() => {
      const ref = field === "title" ? titleRef : field === "description" ? descriptionRef : dueDateRef;
      ref.current?.focus();
      adjustTextareaHeight(titleRef.current);
      adjustTextareaHeight(descriptionRef.current);
      if (ref.current instanceof HTMLTextAreaElement) {
        ref.current.setSelectionRange(0, ref.current.value.length);
      }
    }, 0);
  };

  const getStatusWiseStyle = () => {
    switch (task.columnId) {
      case ColumnTypes.NEW: return "border-l-orange-500";
      case ColumnTypes.ON_GOING: return "border-l-blue-500";
      default: return "border-l-green-500";
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>, field: "title" | "description") => {
    createOrEditTask({ ...task, [field]: e.target.value });
    adjustTextareaHeight(e.target);
  };

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement | null) => {
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(Math.max(textarea.scrollHeight, textarea === titleRef.current ? 24 : 20), textarea === titleRef.current ? 178 : 208);
      textarea.style.height = `${newHeight}px`;
    }
  };

  const timeStatus = task.dueDate && task.columnId === ColumnTypes.ON_GOING
    ? calculateTimeStatus(task.dueDate)
    : null;

  const minDateTime = new Date().toISOString().slice(0, 16);

  const chipColorClass = timeStatus && {
    high: "bg-red-500",
    medium: "bg-yellow-500",
    low: "bg-green-500",
  }[timeStatus.urgency];

  return (
    <div
      ref={cardRef}
      onContextMenu={handleContextMenu}
      className={`bg-mainBackgroundColor group border-l-4 p-2.5 flex flex-col text-left rounded-xl hover:ring-2 hover:ring-rose-500 cursor-pointer relative task ${getStatusWiseStyle()}`}
    >
      <div className="absolute right-1 top-2 cursor-pointer text-xl hidden group-hover:block" onClick={handleContextMenu}>
        <MenuIcon />
      </div>

      {isEditing ? (
        <>
          <textarea
            ref={titleRef}
            value={task.title}
            onChange={(e) => handleTextChange(e, "title")}
            placeholder="Title"
            className="bg-transparent max-w-72 outline-none border-none resize-none"
          />
          <textarea
            ref={descriptionRef}
            value={task.description}
            placeholder="Description"
            onChange={(e) => handleTextChange(e, "description")}
            className="bg-transparent text-gray-400 max-w-72 text-sm outline-none border-none resize-none"
          />
          {task.columnId === ColumnTypes.ON_GOING && (
            <input
              ref={dueDateRef}
              type="datetime-local"
              value={task.dueDate}
              min={minDateTime}
              style={{ colorScheme: "dark" }}
              onChange={(e) => createOrEditTask({ ...task, dueDate: e.target.value })}
              className="bg-transparent text-sm mt-1 w-fit outline-none border-none"
            />
          )}
        </>
      ) : (
        <>
          <p onClick={() => handleFieldClick("title")} className="min-h-6 w-full max-w-72 overflow-hidden whitespace-pre-wrap text-ellipsis cursor-pointer select-none clamp-3">
            {task.title}
          </p>
          <p onClick={() => handleFieldClick("description")} className="min-h-5 w-full max-w-72 text-sm text-gray-400 mt-1 overflow-hidden whitespace-pre-wrap text-ellipsis cursor-pointer select-none clamp-3">
            {task.description}
          </p>
          {timeStatus && (
            <div className="flex items-center mt-2" onClick={() => handleFieldClick("dueDate")}>
              <span className={`text-xs font-semibold mr-2 px-2.5 py-0.5 rounded ${chipColorClass} text-white`}>
                {timeStatus.chipText}
              </span>
              <span className="text-sm text-gray-400">{timeStatus.text}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TaskCard;