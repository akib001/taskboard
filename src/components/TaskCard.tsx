import React, { useState, useRef, useEffect } from "react";
import { ITask } from "../utils/types";
import { ColumnTypes } from "../utils/enums";
import MenuIcon from "../assets/MenuIcon";

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
  const titleRef = useRef<HTMLInputElement>(null);
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
  }, [isEditing, task, isNew]);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    onContextMenu(event, task);
  };

  const calculateTimeRemaining = (dueDate: Date): string => {
    const currentTime = new Date();
    const timeDiff = dueDate.getTime() - currentTime.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return `${daysRemaining} days`;
  };

  const handleFieldClick = (field: "title" | "description" | "dueDate") => {
    setIsEditing(true);
    setTimeout(() => {
      switch (field) {
        case "title":
          titleRef.current?.focus();
          if (titleRef.current)
            titleRef.current.setSelectionRange(
              0,
              titleRef.current.value.length
            );
          break;
        case "description":
          descriptionRef.current?.focus();
          if (descriptionRef.current)
            descriptionRef.current.setSelectionRange(
              0,
              descriptionRef.current.value.length
            );
          break;
        case "dueDate":
          dueDateRef.current?.focus();
          break;
      }
    }, 0);
  };

  const getStatusWiseStyle = () => {
    if (task.columnId === ColumnTypes.NEW) {
      return "border-l-orange-500";
    } else if (task.columnId === ColumnTypes.IN_PROGRESS) {
      return "border-l-blue-500";
    } else {
      return "border-l-green-500";
    }
  };

  return (
    <div
      ref={cardRef}
      onContextMenu={handleContextMenu}
      className={`bg-mainBackgroundColor group border-l-4 p-2.5 h-[100px] min-h-[100px] flex flex-col text-left rounded-xl hover:ring-2 hover:ring-offset hover:ring-rose-500 cursor-pointer relative task ${getStatusWiseStyle()}`}
    >
      <div
        className="absolute right-1 top-2 cursor-pointer text-xl hidden group-hover:block"
        onClick={handleContextMenu}
      >
        <MenuIcon />
      </div>

      {isEditing ? (
        <>
          <input
            ref={titleRef}
            value={task.title}
            onChange={(e) =>
              createOrEditTask({ ...task, title: e.target.value })
            }
            placeholder="Title"
            className="bg-transparent max-w-72"
          />
          <textarea
            ref={descriptionRef}
            value={task.description}
            placeholder="Description"
            onChange={(e) =>
              createOrEditTask({ ...task, description: e.target.value })
            }
            className="bg-transparent text-sm mt-1 max-w-72"
          />
          <input
            ref={dueDateRef}
            type="datetime-local"
            value={task.dueDate}
            style={{
              colorScheme: "dark",
            }}
            onChange={(e) =>
              createOrEditTask({ ...task, dueDate: e.target.value })
            }
            className="bg-transparent  text-sm mt-1 max-w-72"
          />
        </>
      ) : (
        <>
          <p
            onClick={() => handleFieldClick("title")}
            className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap"
          >
            {task.title}
          </p>
          <p
            onClick={() => handleFieldClick("description")}
            className="text-left text-sm mt-1"
          >
            {task.description}
          </p>
          {task.dueDate && (
            <p
              onClick={() => handleFieldClick("dueDate")}
              className="text-left text-sm mt-1"
            >
              Time Remaining: {calculateTimeRemaining(new Date(task.dueDate))}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default TaskCard;
