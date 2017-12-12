import React, {PureComponent} from 'react';
import Cell from './cell'

class Table extends PureComponent {


  /* handleClick = (key, e) => {
  //  console.log(key);
    this.props.changeOnClick(key);
  }*/
componentWillReceiveProps(nextProps) {

}
  render() {
    //  <div ref={id} id={id} key={id} className={"game-square color-" +this.props.gameState[i][j]} onMouseDown={this.props.changeOnClick.bind(this, id)}></div>

    let height = [];
    for (let i = 0; i < this.props.height; i++) {
      let width = [];
      for (let j = 0; j < this.props.width; j++) {
        let id = j + "-" + i;

        let prop = this.props.gameState[i][j]

        if (prop === 0 && this.props.oldState[i][j]) {
            prop = --this.props.oldState[i][j] || 0
          }

        width.push(
        //  <div ref={id} id={id} key={id} className={"game-square color-" + prop} onMouseDown={this.props.changeOnClick.bind(this, id)}></div>
          <Cell key={id} id={id} changeOnClick={this.props.changeOnClick} gameState={prop} />
      );
      };
      height[i] = width;
    };

    let i = 0;
    let high = height.map(y => {
      i++;
      return <div key={"row-"+i} id={"row-" + i}>{y}</div>
    })

  //  console.log(this.props.gameState);
    //console.log(this.props.oldState);
    return (
      <div className="App">
        <div className="game-container">{high}</div>
      </div>
    );
  }
}

export default Table;
