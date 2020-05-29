import Board from './Board'
import AI from './players/AI'
import GameLog from './GameLog'
import Player from './players/Player'
import Human from './players/Human'
import Stage from './Stage'

class Chess {
  constructor() {
    this.stage = Stage.create('stage')
    this.board = new Board()
    this.gameLog = new GameLog()
    this.loop = null
    this.isUpdating = false
  }

  startGame(typePlayerOne, typePlayerTwo) {
    // Очистка
    if (this.board) {
      this._destroy()
    }
    // Инициализация игрового поля
    this.board.initialize()

    // Создание игроков
    const colors = this._rollColor()
    this.playerOne = new Player(typePlayerOne, 'Компьютер 1', colors.colorOne)
    this.playerTwo = new Player(typePlayerTwo, 'Компьютер 2', colors.colorTwo)

    // Определение игрока, который ходит первым
    this.currentPlayer = this.playerOne.isCurrent ? this.playerOne : this.playerTwo

    // Если есть живой игрок, то создаем listener для stage
    if (this.playerOne.type instanceof Human || this.typePlayerTwo.type instanceof Human) {
      this.stage.on('click', (e) => {       
        if (this.currentPlayer.type instanceof Human && !this.isUpdating) {
          let mousePos = this.stage.getPointerPosition()
      
          let cellX = Math.round(mousePos.x / 70) - 1
          let cellY = Math.round(mousePos.y / 70) - 1  
          
          const figure = this.board.selectSpot(cellX, cellY, this.currentPlayer.color)
          if (figure) {
            const move = this.currentPlayer.type.getMove(this.board.cells, figure, cellX, cellY)
            this.gameLoop(move)
          }
          this.render()
        }
      }) 
    }

    if (this.currentPlayer.type instanceof AI) {
      this.gameLoop(this.currentPlayer.getMove(this.board.cells))
    }

    this.render()
  }
 
  gameLoop(move = null) {
    if (move) {
      this.board.selectedFigure = this.board.cells[move.startY][move.startX].figure
      this.isUpdating = true

      this.update(move, () => {
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
        if (this.currentPlayer.type instanceof AI) {
          this.gameLoop(this.currentPlayer.getMove(this.board.cells))
        }

      })
    }
  }

  update(move, updateDone) {
    const self = this
  
    window.requestAnimFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60)
    };
    
    (function animLoop(){
      self.loop = requestAnimFrame(animLoop);
      self.board.updateMove(move, result => {
        if (result) {
          updateDone()
        }
      })
      self.render()
    })(); 
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
