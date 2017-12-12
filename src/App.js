import React, {Component} from 'react';
import './App.css';
import Table from './Components/board';
import Controls from './Components/controls'


class App extends Component {
  constructor() {
    super();

    this.state = {
      width: 140,
      height: 70,
      speed: 800, // is subtracted from 1010
      gameState: [],
      liveCells: [],
      oldLiveCells: [],
      generation: 0,
      running: false,
      startBtn: 'Start',
      insertMessage: "insert a shape!"
    }
  }

  componentWillMount() {
    let density = Math.floor(Math.random() * 47) + 50
    this.startingBoard(true, density);
    setTimeout(() => {
      this.title()
    }, 500);
  }

  startingBoard = (title, density) => {
    let width = this.state.width;
    let height = this.state.height;
    let gameState = [];
    let liveCells = [];
    if (!density) {
      density = 60
    }
    for (let i = 0; i < height; i++) {
      let row = [];
      for (let j = 0; j < width; j++) {
        let x = 0;
        // initial live cells but exclude some cells for title if board is over a minimum size
        if (width < 50 || height < 50 || title !== true || (i < height / 2 - 10 || i > height / 2 + 5) || (j < width / 2 - 25 || j > width / 2 + 25)) {
          if (Math.random() * 100 > density) {
            x = 3;
            liveCells.push([j, i])
          }
        }
        row.push(x)
      }
      gameState.push(row)
    }
    this.setState(() => {
      return {gameState: gameState, liveCells: liveCells}
    })
  }

  freshBoard = (width = this.state.width, height = this.state.height) => {
    let freshBoard = new Array(height).fill([])
    freshBoard.forEach((y, i, arr) => {
      arr[i] = new Array(width).fill(0);
    })
    return freshBoard;
  }

  //for every live cell get neighbours and sort them
  neighbourCount = (XY, map) => {
    if ((XY[0] < 0 || XY[0] > this.state.width) || XY[1] < 0)
      return;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (i === 0 && j === 0) {
          continue;
        }
        //sort neighbours into a map and count occurrences
        let pos = [
          XY[0] + j,
          XY[1] + i
        ];
        //TODO avoid conversion of key to string here and from string in giveLife()
        let key = pos[0] + "/" + pos[1];
        if (!map.has(key)) {
          map.set(key, 1);
        } else {
          map.set(key, map.get(key) + 1);
        }
      }
    }
  }

  giveLife = (map) => {
    let liveCells = [];
    map.forEach((sum, pos) => {
      let [x,
        y] = pos.split('/');
      x = +x;
      y = +y;
      if (this.liveOrNot(sum, y, x) === 3) {
        liveCells.push([x, y])
      }
    })
    return liveCells
  }

  liveOrNot = (sum, y, x) => {
    if (x < 0 || y < 0 || x > this.state.width - 1 || y > this.state.height - 1)
      return false;
    if (sum === 3) {
      return 3;
    } else if (sum === 2) {
      for (let i = 0; i < this.state.liveCells.length; i++) {

        //TODO not very enthusiatic about this way to check if currently alive ...
        if (this.state.liveCells[i][0] === x && this.state.liveCells[i][1] === y) {
          return 3;
        }
      }
    }
  }

  updateBoard = (newState = this.freshBoard(), oldLiveCells = this.state.oldLiveCells, liveCells = this.state.liveCells) => {
    oldLiveCells.forEach((cell) => {
      if (newState[cell[1]]) {
        newState[cell[1]][cell[0]] = 2
      };
    })
    liveCells.forEach((cell) => {
      if (newState[cell[1]]) {
        newState[cell[1]][cell[0]] = 3
      };
    })
    return newState;
  }

  start = () => {
    this.setState((currentState) => {
      let running = !currentState.running;
      return {running: running}
    }, () => {

      let thisObj = this;
      let loop = function() {
        if (!thisObj.state.running)
          return;
        let neighbColl = new Map();
        let liveCells = thisObj.state.liveCells;
        //get map of each neighbour and its live neighbour count
        let oldLiveCells = [...liveCells]
        liveCells.forEach((cell) => {
          thisObj.neighbourCount(cell, neighbColl)
        })
        liveCells = thisObj.giveLife(neighbColl);
        neighbColl.clear()

        let newState = thisObj.updateBoard(thisObj.freshBoard(), oldLiveCells, liveCells)
        let speed = 0;

        thisObj.setState((currentState) => {
        speed = currentState.speed;
          return {
            gameState: newState,
            oldLiveCells: oldLiveCells,
            liveCells: liveCells,
            generation: ++currentState.generation
          }
        }, () => {
          if (thisObj.state.running) {
            return window.setTimeout(loop, 1010 - speed)
          }
        })
      }
      loop()
    })
  }

  handleBoardClick = (key) => {
    let [posX,
      posY] = key.split('/');
      // check if shape selected
    if (!this.userInsertShape) {
      this.switchState(+ posX, + posY);
    } else {
      let pos = [ + posX, + posY
      ]
      this.insertShape(pos, this.state.shape);
      return;
    }
  }

  switchState = (x, y) => {
    //  shallow-copy is ok here
    let liveCells = [...this.state.liveCells]
    // add to live cells
    if (this.state.gameState[y][x] === 0) {
      liveCells.push([x, y])

    } else {
      // remove from live cells
      for (let i = 0; i < liveCells.length; i++) {
        if (liveCells[i][0] === x && liveCells[i][1] === y) {
          liveCells.splice(i, 1);
          break;
        }
      }
    }
    this.setState(() => {
      return {
        gameState: this.updateBoard(undefined, undefined, liveCells),
        liveCells: liveCells
      }
    })
  }

  insertGlider = () => {
    this.userInsertShape = true;
    this.setState({
      shape: [
        [
          0, -1
        ],
        [
          1, 0
        ],
        [
          1, 1
        ],
        [
          0, 1
        ],
        [-1, 1]
      ],
      insertMessage: "Now click on the board!"
    })
  }

  insertAcorn = () => {
    this.userInsertShape = true;
    this.setState({
      shape: [
        [
          0, 0
        ],
        [
          1, 0
        ],
        [
          1, 2
        ],
        [
          3, 1
        ],
        [
          4, 0
        ],
        [
          5, 0
        ],
        [6, 0]
      ],
      insertMessage: "Now click on the board!"
    })
  }

  clear = () => {
    this.setState((currentState, props) => {
      return {gameState: this.freshBoard(), liveCells: [], oldLiveCells: [], generation: 0}
    })
  }

/*  printState() {
    console.log(this.state.gameState);
    //  console.log(this.state.liveCells);
    //  console.log(this.state.speed);
  }*/

  insertShape = (pos, shape) => {
    this.userInsertShape = false;
    this.setState((currentState) => {
      let liveCells = [...this.state.liveCells]
      shape.forEach((XY) => {
        if (currentState.gameState[XY[0] + pos[1]]) {
          liveCells.push([
            XY[1] + pos[0],
            XY[0] + pos[1]
          ])
        }
      })
      return {
        gameState: this.updateBoard(undefined, undefined, liveCells),
        liveCells: liveCells,
        insertMessage: "insert a shape!",
        shape: []
      }
    })
  }

  title = () => {
    if (this.state.width < 50 || this.state.height < 50)
      return;
    let [xCen,
      yCen] = [
      Math.round(this.state.width / 2),
      Math.round(this.state.height / 2)
    ];
    let l =  [[-1,-8],[-2,-8],[-3,-8],[-4,-8],[-5, -8],[0,-8],[0, -7],[0, -6], [0, -5]]
    let i = [[-5,-3], [-4,-3], [-3,-3], [-2,-3], [-1,-3], [0,-3]];
    let f = [[-5,-1], [-4,-1], [-3,-1], [-2,-1], [-1,-1], [0,-1], [-5,0],  [-5,1],  [-5,2],  [-3,0],  [-3,1]];
    let e = [[-5,4], [-4,4], [-3,4], [-2,4], [-1,4], [0,4], [-5,5],  [-5,6],  [-5,7],  [-3,5],  [-3,6], [0,5], [0, 6], [0, 7]];

    let shape = l.concat(i).concat(f).concat(e)
    this.insertShape([
      xCen, yCen
    ], shape);
  }

  handleSlider = (name, value) => {
    // update state from one of the three sliders
    let stateObj = () => {
      let newState = {};
      newState[name] = +value;
      return newState;
    }
    this.setState(() => {
      return stateObj()
    }, () => {
      if (!this.state.running && name !== "speed") {
        // then rebuild initial board
        let density = Math.floor(Math.random() * 47) + 50
        this.startingBoard(true, density);
        setTimeout(() => {
          this.title();
        }, 700);
      }
    })
  }
  startBtn = () => {
    this.setState((current) => {
      let btn = current.startBtn === 'Start'
        ? 'Stop'
        : 'Start';
      return {startBtn: btn}
    })
  }
  generation() {
    return (
      <div className='generation-container'>
        <h3>Generation:&nbsp;<span className="generation-count">{this.state.generation}</span></h3>
      </div>
    )
  }

  render() {
    return (
      <div className="App">
        <div className='header-container'>
          {this.generation()}
          <div className='title-container'>
            <h2>Conway's Game of Life</h2>
          </div>
        </div>
        <Table oldLiveCells={this.state.oldLiveCells} liveCells={this.state.liveCells} width={this.state.width} height={this.state.height} gameState={this.state.gameState} changeOnClick={this.handleBoardClick} />
          <Controls start={this.start} build={this.startingBoard} /*logState={this.printState}*/ clear={this.clear} speed ={this.state.speed} height={this.state.height} width={this.state.width} handleSlider={this.handleSlider} startBtn={this.state.startBtn} handleStartButton={this.startBtn} insertGlider={this.insertGlider} insertAcorn={this.insertAcorn} insertMessage={this.state.insertMessage} / >
            <div id="signature" className="signature">
              <p>by&nbsp;
                <a href="mailto:grey.ham.acre@gmail.com">Graham A. Kerr</a>
              </p>
            </div>
          </div>
)}
}
export default App;
