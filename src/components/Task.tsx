import { ITask } from "../utils/types";

interface TaskProps {
  task: ITask;
  createOrEditTask: (task: ITask | null) => void;
  onContextMenu: (event: React.MouseEvent, task: ITask) => void;
}

const TaskCard: React.FC<TaskProps> = ({
  task,
  createOrEditTask,
  onContextMenu,
}) => {
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

  return (
    <div
      onContextMenu={handleContextMenu}
      className="bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] flex flex-col text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-pointer relative task"
    >
      <p
        onClick={() => createOrEditTask(task)}
        className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap"
      >
        {task.title}
      </p>
      <p className="text-left">{task.description}</p>
    
      {task.dueDate && (
        <p>Time Remaining: {calculateTimeRemaining(new Date(task.dueDate))}</p>
      )}
    </div>
  );
};

export default TaskCard;
