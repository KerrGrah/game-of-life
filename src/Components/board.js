import React, {PureComponent} from 'react';
import Cell from './cell';

class Board extends PureComponent {

  makeCell = (cell, id) => {
    return <Cell key={id} id={id} changeOnClick={this.props.changeOnClick} cellState={cell}/>
  }

  board = () => {
    let Board = [];
    this.props.gameState.forEach((row, y, arry) => {
      let arrx = [];
      row.forEach((cell, x) => {
        let id = x + '/' + y;
        arrx[x] = this.makeCell(cell, id);
      })
      Board[y] = <div key={"row-" + y} id={"row-" + y}>{arrx}</div>
    })
    return Board;
  }

  render() {
    return (
      <div className="board-container">
        <div className="board">{this.board()}</div>
      </div>
    );
  }
}

export default Board;
