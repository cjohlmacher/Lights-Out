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
      lightRow = lightRow.map(cell => true);
      initialBoard.push(lightRow);
      rowCount += 1;
    };
    initialBoard = randomizeLights(initialBoard);
    return initialBoard;
  };

  /**  Given a board configuration, return a board with flips around cell at coord 'Y-X' **/
  function flipCellsOfBoard(preboard,coord) {
    const [y, x] = coord.split("-").map(Number);
    
    const flipCell = (y, x, boardCopy) => {
      // if this coord is actually on board, flip it
      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        boardCopy[y][x] = !boardCopy[y][x];
      }
    };

    const newBoard = preboard.map(row => row.map(cell => cell));
    const cellsToFlip = [[y,x],[y-1,x],[y+1,x],[y,x-1],[y,x+1]];
    cellsToFlip.forEach(([y,x]) => flipCell(y,x,newBoard));
    return newBoard;
  }

  /** Randomize lit/unlit lights **/
  function randomizeLights(initialBoard) {
    const targetLit = chanceLightStartsOn*nrows*ncols;
    let litCount = nrows*ncols;
    while (litCount  > targetLit) {
      const [randomY, randomX] = [Math.floor(Math.random()*nrows), Math.floor(Math.random()*ncols)];
      initialBoard = flipCellsOfBoard(initialBoard,`${randomY}-${randomX}`);
      litCount = 0;
      for (let row of initialBoard) {
        for (let cell of row) {
          if (cell) {
            litCount += 1
          }
        }
      };
    };
    return initialBoard
  };

  /** Determine if board is won */
  function hasWon() {
    for (let row of board) {
      for (let cell of row) {
        if (!cell) {
          return false
        }
      }
    };
    return true
  };

  /** Set board in state based on flipping cells around coord 'Y-X' **/
  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      return flipCellsOfBoard(oldBoard,coord);
    });
  };

  let rowNum=-1;
  let columnNum=-1;
  
  /**  Create light grid HTML elements **/
  const lightGrid = (
    <table>
      <tbody>
        {board.map(row => {
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
        })}
      </tbody>
    </table>
  );

  return (
    <>
      {hasWon() ? <h1>You Win!</h1> : lightGrid}
    </>
  )
}

export default Board;
