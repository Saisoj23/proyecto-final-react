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

function App() {
  const [Board, setBoard] = useState(useContext(BoardContext) as BoardType);

  const [columnCount, setColumnCount] = useState(
    Object.keys(Board.cols).length
  );

  let EditTaskContent = (task: string | number, newContent: string) => {
    if (task === newContent) return;

    if (Object.keys(Board.tasks).includes(newContent)) {
      let index = 1;
      while (Object.keys(Board.tasks).includes(newContent + `${index}`)) {
        index++;
        console.log(newContent + `${index}`);
      }
      newContent = newContent + `${index}`;
    }

    let newBoard: BoardType = { cols: {}, tasks: {} };
    newBoard.cols = Board.cols;
    for (const key in Board.tasks) {
      newBoard.tasks[key] = Board.tasks[key];
      if (key === task) {
        newBoard.tasks[newContent] = Board.tasks[key];
      }
    }
    delete newBoard.tasks[task];

    setBoard(newBoard);
  };

  let DeleteTask = (content: string | number) => {
    let newBoard: BoardType = { cols: {}, tasks: {} };
    newBoard.cols = Board.cols;
    newBoard.tasks = Board.tasks;

    delete newBoard.tasks[content];

    setBoard(newBoard);
  };

  let MoveTask = (content: string | number, backward: boolean = false) => {
    if (columnCount === 1) return;

    let newBoard: BoardType = { cols: {}, tasks: {} };
    newBoard.cols = Board.cols;
    newBoard.tasks = Board.tasks;

    let target = Board.tasks[content];
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

  let EditColumnName = (column: number | string, newName: string) => {
    if (Board.cols[column as number] === newName) return;

    if (Object.values(Board.cols).includes(newName)) {
      let index = 1;
      while (Object.values(Board.cols).includes(newName + `${index}`)) {
        index++;
        console.log(newName + `${index}`);
      }
      newName = newName + `${index}`;
    }

    let newBoard: BoardType = { cols: {}, tasks: {} };
    newBoard.cols = Board.cols;
    newBoard.tasks = Board.tasks;
    newBoard.cols[column as number] = newName;

    setBoard(newBoard);
  };

  let DeleteColumn = (column: number | string) => {
    if (columnCount === 1) {
      setBoard({ cols: { 0: "Column 1" }, tasks: {} });
      return;
    }

    let newBoard: BoardType = { cols: {}, tasks: {} };
    newBoard.cols = Board.cols;
    newBoard.tasks = Board.tasks;

    for (const key in Board.cols) {
      const index = parseInt(key);
      if (index >= (column as number) && index < columnCount - 1) {
        newBoard.cols[index] = newBoard.cols[index + 1];
      }
    }

    delete newBoard.cols[Object.keys(Board.cols).length - 1];

    for (const key in Board.tasks) {
      if (newBoard.tasks[key] === (column as number)) {
        delete newBoard.tasks[key];
      } else if (newBoard.tasks[key] >= (column as number)) {
        newBoard.tasks[key] -= 1;
      }
    }

    setBoard(newBoard);
    setColumnCount(Object.keys(Board.cols).length);
  };

  let MoveColumn = (column: number | string, backward: boolean = false) => {
    if (columnCount === 1) return;

    let newBoard: BoardType = { cols: {}, tasks: {} };
    newBoard.cols = Board.cols;
    newBoard.tasks = Board.tasks;

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

    [Board.cols[column as number], Board.cols[target]] = [
      Board.cols[target],
      Board.cols[column as number],
    ];

    setBoard(newBoard);
  };

  const groupButtonsColumnContextValue = useContext(
    GroupButtonsColumnContext
  ) as GroupButtonsType;
  groupButtonsColumnContextValue.editName = EditColumnName;
  groupButtonsColumnContextValue.delete = DeleteColumn;
  groupButtonsColumnContextValue.move = MoveColumn;

  const groupButtonsTaskContextValue = useContext(
    GroupButtonsTaskContext
  ) as GroupButtonsType;
  groupButtonsTaskContextValue.editName = EditTaskContent;
  groupButtonsTaskContextValue.delete = DeleteTask;
  groupButtonsTaskContextValue.move = MoveTask;

  let AddTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let newContent = event.currentTarget["add-task"].value;

    if (Object.keys(Board.tasks).includes(newContent)) {
      let index = 1;
      while (Object.keys(Board.tasks).includes(newContent + `${index}`)) {
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
    if (Object.values(Board.cols).includes(colName)) {
      let index = 1;
      while (Object.values(Board.cols).includes(`Column ${index}`)) {
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

    setColumnCount(Object.keys(Board.cols).length + 1);
  };

  return (
    <>
      <ConfirmationWindow
        hidden={true}
        content="¿Seguro que desea eliminar la columna?"
      />
      <Header />
      <TaskInput addTask={AddTask} />

      <main
        id="main-board"
        className="flex justify-center items-start flex-wrap gap-4 m-4"
      >
        {Object.keys(Board.cols)
          .map(Number)
          .map((column) => (
            <Column column={column} name={Board.cols[column]}>
              {Object.keys(Board.tasks).map((taskContent) => {
                if (Board.tasks[taskContent] === column) {
                  return <Task content={taskContent} column={column} />;
                }
                return null;
              })}
            </Column>
          ))}
        <AddColumnButton hidden={columnCount >= 6} addColumn={AddColumn} />
      </main>

      <ColorLoader />
    </>
  );
}

export default App;
