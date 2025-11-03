import { createContext } from "react";

export let GroupButtonsColumnContext = createContext({
  editName: (column: number, newName: string) => {},
  delete: (column: number) => {},
  move: (column: number, backward: boolean = false) => {},
});

export let GroupButtonsTaskContext = createContext({
  editName: (task: string, newName: string) => {},
  delete: (task: string) => {},
  move: (task: string, backward: boolean = false) => {},
});

export interface GroupButtonsType {
  editName: (task: string | number, newName: string) => void;
  delete: (task: string | number) => void;
  move: (task: string | number, backward?: boolean) => void;
}
