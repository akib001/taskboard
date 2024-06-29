import React from "react";
import { IColumn, ITask } from "../utils/types";
import { ColumnTypes } from "../utils/enums";
import TaskCard from "./TaskCard";
import { generateId } from "../utils/helpers";
import AddIcon from "../assets/AddIcon";
import DropIndicator from "./DropIndicator";

interface ColumnProps {
  column: IColumn;
  createOrEditTask: (task: ITask) => void;
  tasks: ITask[];
  onDeleteTask: (taskId: string) => void;
  onContextMenu: (event: React.MouseEvent, task: ITask) => void;
  moveTask: (taskId: string, targetColumnId: ColumnTypes, beforeIndex: number | null) => void;
}

const Column: React.FC<ColumnProps> = ({
  column,
  createOrEditTask,
  tasks,
  onDeleteTask,
  onContextMenu,
  moveTask,
}) => {
  const handleAddTask = () => {
    const newTask: ITask = {
      id: generateId(),
      title: "",
      description: "",
      columnId: column.id,
      dueDate: "",
    };
    createOrEditTask(newTask);
  };

  const handleDragStart = (e: React.DragEvent, task: ITask) => {
    e.dataTransfer.setData("taskId", task.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    highlightIndicator(e);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const taskId = e.dataTransfer.getData("taskId");
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const beforeIndex = element.dataset.before || "-1";

    moveTask(taskId, column.id, Number(beforeIndex));
  };

  const handleDragLeave = () => {
    clearHighlights();
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || getIndicators();

    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e: React.DragEvent) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);

    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (
    e: React.DragEvent,
    indicators: HTMLElement[]
  ) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const getIndicators = () => {
    return Array.from(
      document.querySelectorAll(
        `[data-column="${column.id}"]`
      ) as unknown as HTMLElement[]
    );
  };

  return (
    <div className="bg-columnBackgroundColor w-72 lg:w-[350px] h-[500px] lg:h-[550px] max-h-[600px] rounded-md flex flex-col">
      <div className="bg-mainBackgroundColor text-md h-[60px] rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between">
        <div className="flex gap-2">
          <div className="flex justify-center items-center bg-columnBackgroundColor px-2 py-1 text-sm rounded-full">
            {tasks.length}
          </div>
          {column.name}
        </div>
      </div>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDragEnd}
        onDragLeave={handleDragLeave}
        className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto"
      >
        {column.id === ColumnTypes.NEW && (
          <div
            onClick={handleAddTask}
            className="flex items-center gap-2 group cursor-pointer hover:text-rose-500"
          >
            <AddIcon className="transition-colors duration-200 ease-in-out flex-shrink-0 user-select-none text-xl fill-white rounded-full  group-hover:bg-rose-500" />
            <p>Add A Task</p>
          </div>
        )}

        {tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            createOrEditTask={createOrEditTask}
            onContextMenu={onContextMenu}
            onDelete={onDeleteTask}
            handleDragStart={handleDragStart}
            isNew={!task.title && !task.description && !task.dueDate}
            index={index}
          />
        ))}
        <DropIndicator beforeId={null} columnId={column.id} />
      </div>
    </div>
  );
};

export default Column;
