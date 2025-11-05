import { useContext, useState } from "react";
import Header from "./Components/Header";
import TaskInput from "./Components/TaskInput";
import AddColumnButton from "./Components/AddColumnButton";
import Column from "./Components/Column";
import Task from "./Components/Task";
import ConfirmationWindow from "./Components/ConfirmationWindow";

import ColorLoader from "./Components/ColorLoader";

import { BoardContext } from "./ContextVariables/BoardContext";
import type { BoardType } from "./ContextVariables/BoardContext";

import {
  GroupButtonsColumnContext,
  GroupButtonsTaskContext,
} from "./ContextVariables/GroupButtonsContext";
import type { GroupButtonsType } from "./ContextVariables/GroupButtonsContext";

import EnabledUIContext from "./ContextVariables/EnabledUIContext";
import type { ConfirmationTargetInfo } from "./ContextVariables/ConfirmationTargetInfo";

function App() {
  const [board, setBoard] = useState(useContext(BoardContext) as BoardType);

  const [columnCount, setColumnCount] = useState(
    Object.keys(board.cols).length
  );

  const [confirmationContent, setConfirmationContent] = useState(
    {} as ConfirmationTargetInfo
  );
  const [enabledUI, setEnabledUI] = useState(true);

  const updateEnableUIValue = (newValue: boolean) => {
    setEnabledUI(newValue);
  };

  let EditTaskContentCallback = (task: string | number) => {
    setConfirmationContent({
      content: "Modify task",
      target: task as string,
      rename: true,
      confirmCallback: EditTaskContent,
    } as ConfirmationTargetInfo);
    setEnabledUI(false);
  };

  let EditTaskContent = (task: string | number, newContent: string) => {
    if (task === newContent) return;

    if (Object.keys(board.tasks).includes(newContent)) {
      let index = 1;
      while (Object.keys(board.tasks).includes(newContent + `${index}`)) {
        index++;
        console.log(newContent + `${index}`);
      }
      newContent = newContent + `${index}`;
    }

    let newBoard: BoardType = { cols: {}, tasks: {} };
    newBoard.cols = board.cols;
    for (const key in board.tasks) {
      newBoard.tasks[key] = board.tasks[key];
      if (key === task) {
        newBoard.tasks[newContent] = board.tasks[key];
      }
    }
    delete newBoard.tasks[task];

    setBoard(newBoard);
  };

  let DeleteTask = (content: string | number) => {
    let newBoard: BoardType = { cols: {}, tasks: {} };
    newBoard.cols = board.cols;
    newBoard.tasks = board.tasks;

    delete newBoard.tasks[content];

    setBoard(newBoard);
  };

  let MoveTask = (content: string | number, backward: boolean = false) => {
    if (columnCount === 1) return;

    let newBoard: BoardType = { cols: {}, tasks: {} };
    newBoard.cols = board.cols;
    newBoard.tasks = board.tasks;

    let target = board.tasks[content];
    if (backward) {
      target--;
      if (target < 0) target = columnCount - 1;
    } else {
      target++;
      if (target > columnCount - 1) target = 0;
    }

    delete newBoard.tasks[content];
    newBoard.tasks[content] = target;

    setBoard(newBoard);
  };

  let EditColumnNameCallback = (column: number | string) => {
    setConfirmationContent({
      content: "Change column name",
      target: column as number,
      rename: true,
      column: board.cols[column as number],
      confirmCallback: EditColumnName,
    } as ConfirmationTargetInfo);
    setEnabledUI(false);
  };

  let EditColumnName = (column: number | string, newName: string) => {
    if (board.cols[column as number] === newName) return;

    if (Object.values(board.cols).includes(newName)) {
      let index = 1;
      while (Object.values(board.cols).includes(newName + `${index}`)) {
        index++;
        console.log(newName + `${index}`);
      }
      newName = newName + `${index}`;
    }

    let newBoard: BoardType = { cols: {}, tasks: {} };
    newBoard.cols = board.cols;
    newBoard.tasks = board.tasks;
    newBoard.cols[column as number] = newName;

    setBoard(newBoard);
  };

  let DeleteColumnCallback = (column: number | string) => {
    setConfirmationContent({
      content: `Are you sure you want to delete the column ${
        board.cols[column as number]
      }?`,
      target: column as number,
      rename: false,
      confirmCallback: DeleteColumn,
    } as ConfirmationTargetInfo);
    setEnabledUI(false);
  };

  let DeleteColumn = (column: number | string) => {
    if (columnCount === 1) {
      setBoard({ cols: { 0: "Column 1" }, tasks: {} });
      return;
    }

    let newBoard: BoardType = { cols: {}, tasks: {} };
    newBoard.cols = board.cols;
    newBoard.tasks = board.tasks;

    for (const key in board.cols) {
      const index = parseInt(key);
      if (index >= (column as number) && index < columnCount - 1) {
        newBoard.cols[index] = newBoard.cols[index + 1];
      }
    }

    delete newBoard.cols[Object.keys(board.cols).length - 1];

    for (const key in board.tasks) {
      if (newBoard.tasks[key] === (column as number)) {
        delete newBoard.tasks[key];
      } else if (newBoard.tasks[key] >= (column as number)) {
        newBoard.tasks[key] -= 1;
      }
    }

    setBoard(newBoard);
    setColumnCount(Object.keys(board.cols).length);
  };

  let MoveColumn = (column: number | string, backward: boolean = false) => {
    if (columnCount === 1) return;

    let newBoard: BoardType = { cols: {}, tasks: {} };
    newBoard.cols = board.cols;
    newBoard.tasks = board.tasks;

    let target = column as number;
    if (backward) {
      target--;
      if (target < 0) target = columnCount - 1;
    } else {
      target++;
      if (target > columnCount - 1) target = 0;
    }

    for (const key in newBoard.tasks) {
      if (newBoard.tasks[key] == column) {
        newBoard.tasks[key] = target;
      } else if (newBoard.tasks[key] == target) {
        newBoard.tasks[key] = column as number;
      }
    }

    [board.cols[column as number], board.cols[target]] = [
      board.cols[target],
      board.cols[column as number],
    ];

    setBoard(newBoard);
  };

  const groupButtonsColumnContextValue = useContext(
    GroupButtonsColumnContext
  ) as GroupButtonsType;
  groupButtonsColumnContextValue.editName = EditColumnNameCallback;
  groupButtonsColumnContextValue.delete = DeleteColumnCallback;
  groupButtonsColumnContextValue.move = MoveColumn;

  const groupButtonsTaskContextValue = useContext(
    GroupButtonsTaskContext
  ) as GroupButtonsType;
  groupButtonsTaskContextValue.editName = EditTaskContentCallback;
  groupButtonsTaskContextValue.delete = DeleteTask;
  groupButtonsTaskContextValue.move = MoveTask;

  let AddTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let newContent = event.currentTarget["add-task"].value;

    if (Object.keys(board.tasks).includes(newContent)) {
      let index = 1;
      while (Object.keys(board.tasks).includes(newContent + `${index}`)) {
        index++;
        console.log(newContent + `${index}`);
      }
      newContent = newContent + `${index}`;
    }

    setBoard((prevBoard) => ({
      ...prevBoard,
      tasks: {
        ...prevBoard.tasks,
        [newContent]: 0,
      },
    }));
    event.currentTarget.reset();
  };

  let AddColumn = (event: React.MouseEvent<HTMLButtonElement>) => {
    let colName = `Column ${columnCount + 1}`;
    if (Object.values(board.cols).includes(colName)) {
      let index = 1;
      while (Object.values(board.cols).includes(`Column ${index}`)) {
        index++;
      }
      colName = `Column ${index}`;
    }

    setBoard((prevBoard) => ({
      ...prevBoard,
      cols: {
        ...prevBoard.cols,
        [columnCount]: colName,
      },
    }));

    setColumnCount(Object.keys(board.cols).length + 1);
  };

  return (
    <>
      <EnabledUIContext.Provider
        value={{ value: enabledUI, updateValue: updateEnableUIValue }}
      >
        <ConfirmationWindow hidden={enabledUI} content={confirmationContent} />

        <Header />
        <TaskInput addTask={AddTask} />

        <main
          id="main-board"
          className="flex justify-center items-start flex-wrap gap-4 m-4"
        >
          {Object.keys(board.cols)
            .map(Number)
            .map((column) => (
              <Column column={column} name={board.cols[column]}>
                {Object.keys(board.tasks).map((taskContent) => {
                  if (board.tasks[taskContent] === column) {
                    return <Task content={taskContent} column={column} />;
                  }
                  return null;
                })}
              </Column>
            ))}
          <AddColumnButton hidden={columnCount >= 6} addColumn={AddColumn} />
        </main>
      </EnabledUIContext.Provider>

      <ColorLoader />
    </>
  );
}

export default App;
