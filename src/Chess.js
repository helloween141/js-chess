import Board from './Board'
import AI from './players/AI'
import GameLog from './GameLog'
class Chess {
  constructor(stage) {
    this.stage = stage
    this.loop = null
    this.board = new Board()
    this.gameLog = new GameLog()
    this.humanColor = ''
    this.aiColor = ''
  }

  startGame() {
    if (this.board) {
      this.stage.destroyChildren()
      this.gameLog.clear()
      window.cancelAnimationFrame(this.loop)    
    }

    this.board.initialize()
    
    this.currentStepColor = 'white'

    this._rollColor()
    this.ai = new AI(this.aiColor)

    if (this.currentStepColor === this.aiColor) {
      this.aiStep()
    }
    
    this.render()
  }

  _rollColor() {
    if (Math.round(Math.random())) {
      this.humanColor = 'white'
      this.aiColor = 'black'
    } else {
      this.humanColor = 'black'
      this.aiColor = 'white'
    }
  }
 
  aiStep() {
    if (this.currentStepColor === this.aiColor) {
      const aiMove = this.ai.getMove(this.board.cells)
      this.board.selectedFigure = this.ai.selectedFigure

      this.board.makeMove(aiMove[0], aiMove[1])

      this.update(() => {
        window.cancelAnimationFrame(this.loop);
        this.currentStepColor = this.humanColor

        this.gameLog.addMoveInfo(this.aiColor, JSON.stringify(this.ai.selectedFigure.getPositionPoint()), aiMove.join(':'))
      })
    }
  }

  humanStep(cellX, cellY) {
    if (this.currentStepColor === this.humanColor) {
      const humanMove = this.board.selectSpot(cellX, cellY, this.humanColor)
      if (humanMove) {
        this.board.makeMove(humanMove[0], humanMove[1])

        this.update(() => {
          window.cancelAnimationFrame(this.loop);
          this.currentStepColor = this.aiColor

          this.gameLog.addMoveInfo(this.humanColor, '', humanMove.join(':'))

          this.aiStep()
        })
      }
    }
  }

  update(updateDone) {
    const self = this
  
    window.requestAnimFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60)
    };
    
    (function animLoop(){
      self.loop = requestAnimFrame(animLoop);
      self.board.update(result => {
        if (result) {
          updateDone()
        }
      })
      self.render()
    })(); 
  }

  render() {
    if (this.board) {
      this.board.render()
      this.stage.add(
        this.board.cellsLayer,
        this.board.figuresLayer,
        this.board.animLayer
      )
    }
  }
}

export default Chess
