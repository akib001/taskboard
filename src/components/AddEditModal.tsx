import React, { useState, useEffect } from "react";
import { ITask } from "../utils/types";
import { ColumnTypes } from "../utils/enums";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: ITask) => void;
  task?: ITask;
}

const initialTask: ITask = {
  id: "",
  title: "",
  description: "",
  columnId: ColumnTypes.NEW,
  dueDate: "",
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, task }) => {
  const [formData, setFormData] = useState<ITask>(task || initialTask);

  useEffect(() => {
    setFormData(task || initialTask);
  }, [task]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData(initialTask);
    onClose();
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const inputClasses = `
    mt-1 block w-full px-3 py-2 bg-[#0D1117] border border-slate-600 rounded-md text-sm shadow-sm
    text-white placeholder-slate-400
    focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500
    hover:border-slate-400
    invalid:border-pink-500 invalid:text-pink-600
    focus:invalid:border-pink-500 focus:invalid:ring-pink-500
  `;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl mx-auto my-6"
        onClick={handleModalClick}
      >
        <div className="relative flex flex-col w-full bg-[#161C22] border-0 rounded-lg shadow-lg outline-none focus:outline-none">
          <div className="flex items-start justify-between p-5 border-b border-gray-600 rounded-t">
            <h3 className="text-2xl font-semibold text-white">
              {task?.id ? "Edit Task" : "Create New Task"}
            </h3>
            <button
              className="p-1 ml-auto bg-transparent border-0 text-white opacity-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none hover:opacity-100"
              onClick={onClose}
            >
              <span className="bg-transparent text-white h-6 w-6 text-2xl block outline-none focus:outline-none">
                ×
              </span>
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="relative p-6 flex-auto">
              <label className="block mb-4">
                <span className="block text-sm font-medium text-white mb-1">
                  Title
                </span>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                />
              </label>
              <label className="block mb-4">
                <span className="block text-sm font-medium text-white mb-1">
                  Description
                </span>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={inputClasses}
                  rows={3}
                  required
                />
              </label>
              <label className="block mb-4">
                <span className="block text-sm font-medium text-white mb-1">
                  Due Date
                </span>
                <input
                  type="datetime-local"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className={`${inputClasses} cursor-pointer`}
                  required
                  style={{ colorScheme: "dark" }}
                />
              </label>
            </div>
            <div className="flex items-center justify-end p-6 border-t border-gray-600 rounded-b">
              <button
                className="text-white background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 hover:text-rose-500"
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="bg-rose-500 text-white active:bg-rose-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="submit"
              >
                Save Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;
