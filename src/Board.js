import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows=5, ncols=5, chanceLightStartsOn=0.5 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    let rowCount = 0;
    while (rowCount < nrows) {
      let lightRow = Array.from({length: ncols});
      lightRow = lightRow.map(cell => Math.random() > 0.5 ? true : false);
      initialBoard.push(lightRow);
      rowCount += 1;
    };
    return initialBoard;
  }

  function hasWon() {
    for (let row of board) {
      for (let cell of row) {
        if (!cell) {
          return false
        }
      }
    };
    return true
  }

  function flipCellsAround(coord) {
    console.log(board);
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it
        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      const newBoard = oldBoard.map(row => row.map(cell => cell));
      const cellsToFlip = [[y,x],[y-1,x],[y+1,x],[y,x-1],[y,x+1]];
      cellsToFlip.forEach(([y,x]) => flipCell(y,x,newBoard));
      return newBoard;
    });
  };

  let rowNum=-1;
  let columnNum=-1;
  
  const lightGrid = board.map(row => {
    rowNum += 1;
    columnNum = -1;
    return (
      <tr key={rowNum}>
        {
        row.map(cell => {
          columnNum += 1;
          const key = `${rowNum}-${columnNum}`;
          return <Cell key={key} flipCellsAroundMe={() => flipCellsAround(key)} isLit={cell} />
          })
        }
      </tr>
    )
    });

  return (
    <table>
      <tbody>
        {hasWon() ? <h1>You Win!</h1> : lightGrid}
      </tbody>
    </table>
  )
}

export default Board;
