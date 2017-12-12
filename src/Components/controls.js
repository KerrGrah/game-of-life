import React, {PureComponent} from 'react';

class Controls extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      class: 'no-action',
      divTop: 0,
      originalHeight: this.props.height
    }
  }

  handleSlider = (event) => {
    this.props.handleSlider(event.target.name, event.target.value)
  }

  getElemDistance(elem) {
    let location = 0;
    if (elem.offsetParent) {
      do {
        location += elem.offsetTop;
        elem = elem.offsetParent;
      } while (elem);
    }
    return location >= 0
      ? location
      : 0;
  };

  handleStart = (e) => {
    this.props.start();
    this.props.handleStartButton();
  }

  handleClick = (e) => {
    let elem = document.getElementById('controls-container');
    let divOffset = this.getElemDistance(elem) - 10
    this.setState((curr) => {
      return {class: "action", divTop: divOffset}
    })
  }

  handleMouseUp = (e) => {
    setTimeout(() => {this.setState({class: "no-action"}, () => {

    })}, 500)
  }
  
  render() {
    return (
      <div style={{
        top: this.state.divTop
      }} id={"controls-container"} className={this.state.class}>

        <div className="buttons-container">

          <button className={"btn btn-" + this.props.startBtn} onClick={this.handleStart}>{this.props.startBtn}</button>
          <button className="btn btn-random" onClick={this.props.build}>Random</button>
          {/*  <button className="btn" onClick={this.props.logState}>printState</button>*/}
          <button className="btn btn-clear" onClick={this.props.clear}>Clear</button>

          <div className="shapes-container">
            <small className="btn insert-msg">{this.props.insertMessage}</small>
            <button className="btn btn-glider" onClick={this.props.insertGlider}>Glider</button>
            <button className="btn btn-acorn" onClick={this.props.insertAcorn}>Acorn</button>
          </div>

        </div>

        <div className="slider-container" onMouseDown={this.handleClick} onMouseLeave={this.handleMouseUp} onMouseUp={this.handleMouseUp}>

          <div className="slider">
            <label>Width</label>
            <input type="range" min="6" max="180" value={this.props.width} name="width" onChange={this.handleSlider}/>
          </div>

          <div className="slider">
            <label>Height</label>{/*80*/}
            <input type="range" min="6" max="120" value={this.props.height} name="height" onChange={this.handleSlider}/>
          </div>

          <div className="slider">
            <label>Speed</label>
            <input type="range" min="500" max="1009" value={this.props.speed} name="speed" onChange={this.handleSlider}/>
          </div>

        </div>
      </div>
    )
  }
}

export default Controls;
