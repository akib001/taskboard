import React from "react";
import TaskCard from "./Task";
import { IColumn, ITask } from "../utils/types";

interface ColumnProps {
  tasks: ITask[];
  column: IColumn;
  createOrEditTask: (task: ITask | null) => void;
}

const Column: React.FC<ColumnProps> = ({ tasks, column, createOrEditTask }) => {
  return (
    <div
      className="
bg-columnBackgroundColor
w-[350px]
h-[500px]
max-h-[500px]
rounded-md
flex
flex-col
"
    >
      <div
        className="
  bg-mainBackgroundColor
  text-md
  h-[60px]
  cursor-grab
  rounded-md
  rounded-b-none
  p-3
  font-bold
  border-columnBackgroundColor
  border-4
  flex
  items-center
  justify-between
  "
      >
        <div className="flex gap-2">
          <div
            className="
    flex
    justify-center
    items-center
    bg-columnBackgroundColor
    px-2
    py-1
    text-sm
    rounded-full
    "
          >
            {tasks.length}
          </div>
          {column.name}
        </div>
      </div>

      {/* Column task container */}
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            createOrEditTask={createOrEditTask}
          />
        ))}
      </div>
      {/* Column footer */}
      <button
        className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black"
        onClick={() => {
          createOrEditTask(null);
        }}
      >
        {/* <PlusIcon /> */}
        Add task
      </button>
    </div>
  );
};

export default Column;
