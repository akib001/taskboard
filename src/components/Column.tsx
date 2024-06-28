import React from "react";
import { IColumn, ITask } from "../utils/types";
import { ColumnTypes } from "../utils/enums";
import TaskCard from "./TaskCard";
import { generateId } from "../utils/helpers";
import AddIcon from "../assets/AddIcon";

interface ColumnProps {
  column: IColumn;
  createOrEditTask: (task: ITask) => void;
  tasks: ITask[];
  onDeleteTask: (taskId: string) => void;
  onContextMenu: (event: React.MouseEvent, task: ITask) => void;
}

const Column: React.FC<ColumnProps> = ({
  column,
  createOrEditTask,
  tasks,
  onDeleteTask,
  onContextMenu,
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

  return (
    <div className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col">
      <div className="bg-mainBackgroundColor text-md h-[60px] rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between">
        <div className="flex gap-2">
          <div className="flex justify-center items-center bg-columnBackgroundColor px-2 py-1 text-sm rounded-full">
            {tasks.length}
          </div>
          {column.name}
        </div>
      </div>

      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        {column.id === ColumnTypes.NEW && (
          <div
            onClick={handleAddTask}
            className="flex items-center gap-2 group cursor-pointer hover:text-rose-500"
          >
            <AddIcon className="transition-colors duration-200 ease-in-out flex-shrink-0 user-select-none text-xl fill-white rounded-full  group-hover:bg-rose-500" />
            <p>Add A Task</p>
          </div>
        )}

        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            createOrEditTask={createOrEditTask}
            onContextMenu={onContextMenu}
            onDelete={onDeleteTask}
            isNew={!task.title && !task.description && !task.dueDate}
          />
        ))}
      </div>
    </div>
  );
};

export default Column;
