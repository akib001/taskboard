import { ColumnTypes } from "./enums";
import { IBoardState } from "./types";

export const defaultBoardStatate: IBoardState = {
  tasks: {
    "1": {
      id: "1",
      title: "Task 1",
      description: "Task 1 description",
      dueDate: "2022-12-31T23:59",
      columnId: ColumnTypes.NEW,
    },
    "2": {
      id: "2",
      title: "Task 2",
      description: "Task 2 description",
      dueDate: "2022-12-31T23:59",
      columnId: ColumnTypes.NEW,
    },
  },
  columns: {
    [ColumnTypes.NEW]: {
      id: ColumnTypes.NEW,
      name: "New",
      taskIds: ["1", "2"],
    },
    [ColumnTypes.ON_GOING]: {
      id: ColumnTypes.ON_GOING,
      name: "On Going",
      taskIds: [],
    },
    [ColumnTypes.DONE]: { id: ColumnTypes.DONE, name: "Done", taskIds: [] },
  },
  columnOrder: [ColumnTypes.NEW, ColumnTypes.ON_GOING, ColumnTypes.DONE],
};
