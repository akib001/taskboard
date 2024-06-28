import { ITask } from "../utils/types";

interface TaskProps {
  task: ITask;
  createOrEditTask: (task: ITask | null) => void;
}

const TaskCard: React.FC<TaskProps> = ({ task, createOrEditTask }) => {
  return (
    <div className="bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative task">
      <p
        onClick={() => createOrEditTask(task)}
        className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap"
      >
        {task.title}
      </p>
    </div>
  );
};

export default TaskCard;
