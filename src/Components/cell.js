import React, {PureComponent} from 'react';

class Cell extends PureComponent {

   handleClick = (key, e) => {
    this.props.changeOnClick(key);
  }

  render() {
    let id = this.props.id;

  return (
    <div key={id} className={"game-square color-" +this.props.cellState} onMouseDown={this.handleClick.bind(this, id)}></div>
  )
  }
}

export default Cell;
