import { ColumnTypes } from "./enums";

export type Id = string | number;

export interface ITask {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  columnId: ColumnTypes;
}

export interface IColumn {
id: ColumnTypes;
  name: string;
  taskIds: string[];
}

export interface IBoardState {
  tasks: { [id: string]: ITask };
  columns: { [K in ColumnTypes]: IColumn };
  columnOrder: ColumnTypes[];
}
