import Board from './Board'
import AI from './players/AI'
import GameLog from './GameLog'
import Stage from './Stage'
import Human from './players/Human'
import Move from './Move'

class Chess {
  constructor() {
    this.stage = Stage.create('stage')
    this.board = new Board()
    this.gameLog = new GameLog()
    this.loop = null
    this.isUpdating = false
  }

  startGame(PlayerTypeOne = Human, PlayerTypeTwo = Human) {
    // Очистка
    if (this.board) {
      this._destroy()
    }
    // Инициализация игрового поля
    this.board.initialize()

    // Создание игроков
    const colors = this._rollColor()
    this.playerOne = new PlayerTypeOne('Игрок 1', colors.colorOne, this.board.getFiguresByColor(colors.colorOne))
    this.playerTwo = new PlayerTypeTwo('Игрок 2', colors.colorTwo, this.board.getFiguresByColor(colors.colorTwo))

    // Определение игрока, который ходит первым
    this.currentPlayer = this.playerOne.isCurrent ? this.playerOne : this.playerTwo

    // Если есть живой игрок, то создаем listener для stage
    if (this.playerOne.isHuman || this.playerTwo.isHuman) {
      let humanMoves = []
      this.stage.on('click', (e) => {    
        if (!this.isUpdating) {
          const mousePosition = this.stage.getPointerPosition()
      
          let cellX = Math.round(mousePosition.x / 70) - 1
          let cellY = Math.round(mousePosition.y / 70) - 1  

          const selectedCell = this.board.selectCell(cellX, cellY)

          // Ход
          if (humanMoves.length > 0 && (!selectedCell.getFigure() || selectedCell.getFigure().color !== this.currentPlayer.color)) {
            const movePos = this.currentPlayer.getMove(humanMoves, cellX, cellY)
            this.gameLoop(new Move(this.currentPlayer.selectedFigure, movePos.startPosPointer, movePos.endPosPointer))
            humanMoves = []
          }
          // Подсветка возможных ходов
          else if (selectedCell.getFigure() && selectedCell.getFigure().color === this.currentPlayer.color) {
            selectedCell.setSelect()    
            this.currentPlayer.selectedFigure = selectedCell.getFigure()    

            humanMoves = (selectedCell.getFigure().name === 'K')
                       ? selectedCell.getFigure().getMoves(this.board.cells, this._getOpponent().getAttackMoves(this.board.cells))
                       : selectedCell.getFigure().getMoves(this.board.cells)
                       
            humanMoves.forEach(move => this.board.cells[move[1]][move[0]].setHighlight())  
          }
          this.render()
        }
      
      }) 
    }

    if (!this.currentPlayer.isHuman) {
      const movePos = this.currentPlayer.getMove(this.board.cells)
      this.gameLoop(new Move(this.currentPlayer.selectedFigure, movePos.startPosPointer, movePos.endPosPointer))
    }

    this.render()
  }
 
  gameLoop(move = null) {
    if (move) {
      this.isUpdating = true

      this.update(move).then(() => {
        this.isUpdating = false
        
        window.cancelAnimationFrame(this.loop);

        // Запись хода в лог
        this.gameLog.addMoveInfo(this.currentPlayer.color, move)

        // Смена очереди после хода
        if (this.playerOne.isCurrent) {
          this.playerOne.isCurrent = false
          this.playerTwo.isCurrent = true
          this.currentPlayer = this.playerTwo
        } else {
          this.playerTwo.isCurrent = false
          this.playerOne.isCurrent = true
          this.currentPlayer = this.playerOne
        }

        // Вызов хода AI, если он существует
        if (!this.currentPlayer.isHuman) {
          const movePos = this.currentPlayer.getMove(this.board.cells)
          this.gameLoop(new Move(this.currentPlayer.selectedFigure, movePos.startPosPointer, movePos.endPosPointer))
        }

        move = null
      })
    }
  }

  update(move) {
    return new Promise(resolve => {
      const self = this
  
      window.requestAnimFrame = window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function(callback) {
        window.setTimeout(callback, 1000 / 60)
      };
      
      (function animLoop(){
        self.loop = requestAnimFrame(animLoop);
        self.board.updateMove(move).then(result => {
          resolve(result)
          self.render()
        })
        self.render()
      })(); 

    })
  }

  _getOpponent() {
    return this.playerOne.isCurrent ? this.playerTwo : this.playerOne
  }

  _rollColor() {
    if (Math.round(Math.random())) {
      return {
        colorOne: 'white',
        colorTwo: 'black'
      }
    } else {
      return {
        colorOne: 'black',
        colorTwo: 'white'
      }
    }
  }

  _destroy() {
    this.stage.destroyChildren()
    this.gameLog.clear()
    window.cancelAnimationFrame(this.loop)    
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
