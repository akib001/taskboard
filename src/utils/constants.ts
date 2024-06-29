import { ColumnTypes } from "./enums";
import { IBoardState } from "./types";

export const defaultBoardState: IBoardState = {
  tasks: {
    "1": {
      id: "1",
      title: "Design user interface mockups",
      description: "Create wireframes and mockups for the new mobile app",
      dueDate: "2024-07-15T17:00",
      columnId: ColumnTypes.NEW,
    },
    "2": {
      id: "2",
      title: "Implement user authentication",
      description: "Set up secure login and registration system",
      dueDate: "2024-07-20T23:59",
      columnId: ColumnTypes.NEW,
    },
    "3": {
      id: "3",
      title: "Optimize database queries",
      description: "Improve performance of slow database operations",
      dueDate: "2024-07-25T12:00",
      columnId: ColumnTypes.NEW,
    },
    "4": {
      id: "4",
      title: "Write API documentation",
      description: "Document all endpoints and request/response formats",
      dueDate: "2024-07-30T17:00",
      columnId: ColumnTypes.NEW,
    },
    "5": {
      id: "5",
      title: "Implement file upload feature",
      description: "Add functionality for users to upload and manage files",
      dueDate: "2024-08-05T23:59",
      columnId: ColumnTypes.ON_GOING,
    },
    "6": {
      id: "6",
      title: "Conduct user testing",
      description: "Organize and run user testing sessions for new features",
      dueDate: "2024-08-10T17:00",
      columnId: ColumnTypes.ON_GOING,
    },
    "7": {
      id: "7",
      title: "Set up CI/CD pipeline",
      description: "Configure automated testing and deployment workflow",
      dueDate: "2024-08-15T23:59",
      columnId: ColumnTypes.ON_GOING,
    },
    "8": {
      id: "8",
      title: "Implement payment gateway",
      description: "Integrate secure payment processing system",
      dueDate: "2024-08-20T17:00",
      columnId: ColumnTypes.DONE,
    },
    "9": {
      id: "9",
      title: "Optimize app performance",
      description: "Identify and fix performance bottlenecks in the application",
      dueDate: "2024-08-25T23:59",
      columnId: ColumnTypes.DONE,
    },
    "10": {
      id: "10",
      title: "Create user onboarding flow",
      description: "Design and implement smooth onboarding experience for new users",
      dueDate: "2024-08-30T17:00",
      columnId: ColumnTypes.DONE,
    },
  },
  columns: {
    [ColumnTypes.NEW]: {
      id: ColumnTypes.NEW,
      name: "New",
      taskIds: ["1", "2", "3", "4"],
    },
    [ColumnTypes.ON_GOING]: {
      id: ColumnTypes.ON_GOING,
      name: "On Going",
      taskIds: ["5", "6", "7"],
    },
    [ColumnTypes.DONE]: { 
      id: ColumnTypes.DONE, 
      name: "Done", 
      taskIds: ["8", "9", "10"] 
    },
  },
  columnOrder: [ColumnTypes.NEW, ColumnTypes.ON_GOING, ColumnTypes.DONE],
};